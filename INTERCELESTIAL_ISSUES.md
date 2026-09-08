# Intercelestial — Detection Methods

How intercelestial.com detects ad blockers and auto-click scripts.

The bundle is regenerated on every fetch and all
identifier names rotate per build — function names below are from the captured bundle / the
deobfuscated v8.0.14-pahe reference.

**Flow:** probes run in the browser → loader sends a signed event (`POST /{prefix}/api/v1/event`) reporting `triggered[]` + `detected` → server only mints an `att` token when the event is clean → the final form POST (`hw=`) must carry that token plus click-behavior fields → otherwise the [decision matrix](#decision-matrix) condemns the rid and the server serves the block page.

## Required headers (Sec-Fetch-*) — read this first

The unlock POSTs are validated against browser **navigation headers**, and
`Sec-Fetch-User: ?1` is added by the browser **only on real user-activated navigations**.
Every programmatic submit (`form.submit()`, `location.href`, `el.click()`) ships **without** it.
The **Tap step rejects requests without it** ("Please turn off the auto-click script", 1327 b).

The userscript only **clicks** — the unlock POSTs are the page's own native form submits, which
already carry `Sec-Fetch-Mode: navigate`, `Sec-Fetch-Dest: document` and
`Sec-Fetch-Site: same-origin`. The only missing header is `Sec-Fetch-User: ?1` (browser only
adds it on real user activation — synthetic clicks don't). Userscript managers **cannot** patch
request headers. However, `GM_xmlhttpRequest` (issued from the extension context) **can** make
requests carrying these headers — but the script does **not** do that at the moment. So a
**header-injection extension** scoped to `intercelestial.com` is required for the chain to pass.
Accepted set:

```http
Sec-Fetch-User: ?1
```

### Suggested extensions

**Chrome**

| Extension | Link |
|---|---|
| Requestly | <https://chromewebstore.google.com/detail/requestly-open-source-htt/mdnleldcmiljblolnjhpnblkcekpdkpa> |
| Simple Modify Header | <https://chromewebstore.google.com/detail/simple-modify-headers/gjgiipmpldkpbdfjkgofildhapegmmic> |

**Firefox**

| Extension | Link |
|---|---|
| Header Editor | <https://addons.mozilla.org/firefox/addon/header-editor/> |
| Simple Modify Header | <https://addons.mozilla.org/firefox/addon/simple-modify-header/> |
| Requestly | <https://requestly.com/> |

**Rule to configure** (any of them):

- URL filter: `^https?://intercelestial\.com/`
- Modify **request** headers, action **set**:
  - `Sec-Fetch-User: ?1` ← the only one strictly needed
  - `Sec-Fetch-Mode: navigate` / `Sec-Fetch-Dest: document` / `Sec-Fetch-Site: same-origin`
    (optional — the browser already sends these on native submits; setting them makes the rule
    independent of how the POST is triggered)

Keep the rule scoped to `intercelestial.com` — never global.

See [sec-fetch-headers](#sec-fetch-headers) for the per-step enforcement evidence.

## Detection methods

### Anti-tamper (userscript / automation)

| Method | Detects | Code |
|---|---|---|
| [byp_timers](#byp_timers) | patched `setTimeout`/`setInterval` | [code](#byp_timers) |
| [byp_shadow](#byp_shadow) | patched `attachShadow` | [code](#byp_shadow) |
| [byp_submit](#byp_submit) | patched `HTMLFormElement.prototype.submit` | [code](#byp_submit) |
| [byp_img / byp_onclick / byp_href](#byp-canaries) | stubbed/removed bait attributes | [code](#byp-canaries) |
| [byp_vis](#byp-vis) | spoofed `document.hidden` | [code](#byp-vis) |
| [byp_mark](#byp-mark) | `saynotoads` global | [code](#byp-mark) |
| [byp_purge](#byp-purge) | ad-canary elements removed | [code](#byp-purge) |
| [byp_hide](#byp-hide) | elements hidden via CSS | [code](#byp-hide) |
| [byp_pop](#byp-pop) | popup killer active | [code](#byp-pop) |
| [byp_click](#byp-click) | synthetic click (`isTrusted: false`) | [code](#byp-click) |
| [honeypot](#honeypot) | clicks on trap elements | [code](#honeypot) |
| [ll_ct](#ll-ct) | final click not trusted | [code](#ll-ct) |
| [ll_dt](#ll-dt) | no real pointerdown before click | [code](#ll-dt) |
| [ll_pop](#ll-pop) | `window.open` < 5 s before submit | [code](#ll-pop) |
| [timeline](#timeline) | impossible stage timings | [code](#timeline) |
| [fingerprint](#fingerprint) | `webdriver`, `navigator.brave` | [code](#fingerprint) |

### Adblock

| Method | Detects | Code |
|---|---|---|
| [bait elements](#bait-elements) | cosmetic filters hiding ad-class divs | [code](#bait-elements) |
| [dns probes](#dns-probes) | DNS-level ad blocking | [code](#dns-probes) |
| [network canaries](#network-canaries) | request-blocking extensions | [code](#network-canaries) |
| [shadow modal](#shadow-modal) | CSS-hidden overlay + patched attachShadow | [code](#shadow-modal) |

### Verdict

| Method | Detects | Code |
|---|---|---|
| [decision matrix](#decision-matrix) | combines signals into `detected` | [code](#decision-matrix) |
| [att token](#att-token) | no clean event → no token → block | [code](#att-token) |
| [sec-fetch-headers](#sec-fetch-headers) | missing `Sec-Fetch-User: ?1` on the Tap step | [code](#sec-fetch-headers) |

---

## byp_timers

Checks that `setTimeout`/`setInterval` are still native, and that timers do not fire early
(a userscript speeding up countdowns fires them early).

```js
// native check (deob L1236-1244)
String(window.setTimeout).indexOf('[native code]') === -1   // → byp_timers
String(window.setInterval).indexOf('[native code]') === -1  // → byp_timers
// plus a timing probe: a timer scheduled for N ms must not fire before N
```

## byp_shadow

Checks that `Element.prototype.attachShadow` is native. The modal builder defeats this check
from the other side by stealing the native function from a fresh iframe — see
[shadow modal](#shadow-modal).

```js
// live bundle, function so()
function so() {
  try {
    if (!Element.prototype.attachShadow) return false;
    return String(Element.prototype.attachShadow).indexOf('[native code]') === -1; // true = tampered
  } catch (e) { return false; }
}
```

Collected into the event by `su()`:

```js
// live bundle, function su()
function su() {
  var flags = [];
  try { if (sc()) flags.push('byp_timers'); } catch (e) {}
  try { if (so()) flags.push('byp_shadow'); } catch (e) {}
  // ... byp_submit, byp_img, byp_onclick, byp_href, byp_vis, byp_mark, byp_purge, byp_hide, byp_pop
  return flags;
}
```

## byp_submit

Checks `HTMLFormElement.prototype.submit` is native, and that no form carries an own `submit`
property (deob L1356-1376).

```js
String(HTMLFormElement.prototype.submit).indexOf('[native code]') === -1   // → byp_submit
// or: Object.getOwnPropertyDescriptor(form, 'submit') !== undefined on any form
```

## byp-canaries

A canary image, span and anchor are planted and re-checked after ~120 ms (`x5()`, deob
L1431-1447): a stubbed `src`, or removed `onclick`/`href` attributes, mean a filter/limpador
is active.

```js
var img = document.createElement('img');
img.src = 'data:image/svg+xml,...';                 // must survive
var a = document.createElement('a');
a.href = 'https://a.invalid///b';                   // canary link (table s1989 "invalid///")
a.setAttribute('onclick', 'return true');           // attribute must survive
setTimeout(function () {
  if (!img.isConnected || img.src.indexOf('data:') !== 0) flag('byp_img');
  if (!a.hasAttribute('onclick')) flag('byp_onclick');
  if (!a.hasAttribute('href')) flag('byp_href');
}, 120);
```

## byp-vis

An own property on `document.hidden`/`document.visibilityState` means the getter was hooked
(deob L1278-1284).

```js
Object.getOwnPropertyDescriptor(document, 'hidden') !== undefined   // → byp_vis
```

## byp-mark

A `saynotoads` global or DOM marker (deob L1285-1296).

```js
window.saynotoads !== undefined || document.querySelector('.saynotoads') !== null  // → byp_mark
```

## byp-purge

A pair of canaries — one empty, one with content. If only the empty one disappears, an ad
cleaner is removing elements (deob L1345-1354).

```js
// empty div + filled div, same ad-ish container; after 120 ms:
if (!empty.isConnected && filled.isConnected) flag('byp_purge');
```

## byp-hide

A colored test div is planted; if computed style turns black / transparent on 2+ properties,
a CSS hider is active (deob L1622-1630).

```js
var cs = getComputedStyle(testDiv);
(cs.backgroundColor === 'rgb(0, 0, 0)' || cs.opacity === '0') // on 2+ props → byp_hide
```

## byp-pop

A fixed, maximum-z-index div is planted; if it disappears, a popup killer is active
(deob L1656-1662).

```js
el.style.cssText = 'position:fixed;z-index:2147483647;...';
setTimeout(function () { if (!el.isConnected) flag('byp_pop'); }, ...);
```

## byp-click

A capture listener on `document` marks the first `click` with `isTrusted === false` on a
button/submit element (deob L1503-1553). Counts up to 4 to re-evaluate canaries.

```js
document.addEventListener('click', function (e) {
  var t = e.target;
  if (t.tagName === 'BUTTON' || t.type === 'submit') {
    if (e.isTrusted === false) nw = true;   // synthetic click seen
  }
}, true);
```

## honeypot

Trap forms/buttons a human never reaches; clicking them is a direct flag.

```html
<!-- live gate HTML -->
<form id="bot_trap" action="/?ll_action=bot_ban" method="POST"></form>
```

Also `.verify`, `.skipcontent`, `.postnext` (off-screen buttons).

## ll-ct

The final button handler records whether the click was trusted. Synthetic click → `0`
(live gate inline script).

```js
btn.addEventListener('click', (e) => {
  if (window.LLSent) { return; } window.LLSent = true;
  LLct = (e && e.isTrusted) ? '1' : '0';   // ← the field the server reads
  timeline['final'] = Date.now();
  document.getElementById('timeline_input').value = JSON.stringify(timeline);
  setTimeout(function () { LLFill(); xxc.submit(); }, 150);
});
```

## ll-dt

Milliseconds since the last **trusted** pointerdown. A human clicks 180–300 ms after pressing;
a value from an old/unpaired pointerdown is impossible.

```js
['pointerdown', 'touchstart', 'mousedown'].forEach(function (t) {
  document.addEventListener(t, function (e) { if (e.isTrusted) { LLpd = Date.now(); } }, true);
});
// at submit time (live gate, function LLFill):
f('ll_dt', LLpd ? String(now - LLpd) : '');
```

## ll-pop

The gate wraps `window.open` and records popup time; a popup opened < 5 s before submit
sets the flag.

```js
// gate inline
window.open = function(){ LLpop = Date.now(); /* ... */ };
// LLFill:
f('ll_pop', (LLpop && now - LLpop < 5000) ? '1' : '0');
```

## timeline

Stage timestamps `{1_1, 1_2, 2_1, final}` in ms: `1_1` at page render, `1_2`/`2_1` in stage
handlers, `final` at submit. Zero gaps or future timestamps are flags.

```js
timeline['1_1'] = Date.now();          // render
timeline['1_2'] = Date.now();          // stage-1 click handler
timeline['final'] = Date.now();        // final click handler
document.getElementById('timeline_input').value = JSON.stringify(timeline);
```

## fingerprint

Environment fingerprint probes feed the event; `brave` alone does not condemn (needs ≥2 dns
signals too).

```js
navigator.webdriver !== undefined            // automation (table s1623)
navigator.brave && (await navigator.brave.isBrave())   // brave flag (s1698)
```

## bait-elements

Invisible 1 px divs with ad classes (generic + a random class per deploy) are planted and must
survive ~120 ms (deob L1560-1700).

```js
var bait = document.createElement('div');
bait.className = 'adsbox banner-ad ads-banner sponsor-ad ad-container ad-contain(css_ads) ...';
// + random per-deploy class: 'promo-702aecea79...' (bait_random)
document.body.appendChild(bait);
setTimeout(function () { if (hidden(bait)) flag('bait_public'); }, 120);
```

## dns-probes

Real fetches to ad-network hosts with a short timeout; network error = DNS-level blocking.
Live bundle, functions `s0`/`s1`:

```js
function s0() {   // fetch probe URL, resolve true/false, ~2 s timeout
  return new Promise(function (resolve) {
    var done = false;
    setTimeout(function(){ if (!done){ done = true; resolve(false); } }, 2000);
    fetch(PROBE_URL, { mode: 'no-cors', cache: 'no-store', credentials: 'omit' })
      .then(function(){ done || (done = true, resolve(true)); },
            function(){ done || (done = true, resolve(false)); });
  });
}
// s1(url): same with fallback via s0(); dz(url) = network-error classifier
// hosts (table): pagead2.googlesyndication, doubleclick, googletagmanager, amazon-adsystem, googleads
```

## network-canaries

Same-origin canary assets under `/<prefix>/r/` (js/css/gif) must load within ~3.5 s
(`self_ads_js`, `image_banner`, `css_ads`); `trip_ads`/`trip_pagead`/`trip_adframe` are
network tripwires; `size_gpt_dc`/`size_gpt_gts` flag anomalous GPT script sizes.

## shadow-modal

The block modal is mounted inside a **closed** shadow root, and the `attachShadow` used is
stolen from a fresh iframe — so patches on the main realm are ignored. The modal also probes
its own visibility.

```js
// live bundle, function N3(): harvest pristine attachShadow from a throwaway iframe
function N3() {
  if (db !== undefined) return db; db = null;
  var f = document.createElement('iframe');            // about:blank, no src
  f.setAttribute('aria-hidden', 'true'); f.setAttribute('tabindex', '-1');
  f.style.cssText = 'display:none;...';
  document.documentElement.appendChild(f);
  var w = f.contentWindow;                             // virgin realm
  if (typeof w.Element.prototype.attachShadow === 'function')
    db = w.Element.prototype.attachShadow;             // ← pristine fn is from the iframe
  f.remove();                                          // same task: append → read → remove
  return db;
}

// live bundle, function N6(): mount host + closed shadow
var host = document.createElement('div');
host.setAttribute('data-' + SCOPE + '-h', '1');        // only handle in the light DOM
document.documentElement.appendChild(host);            // host hangs off <html>, not <body>
var root = N3().call(host, { mode: 'closed' });        // stolen native fn, closed shadow
root.appendChild(el);
```

Anti-CSS-hide probe after mount:

```js
document.documentElement.style.overflow = 'hidden';
var r = el.getBoundingClientRect();
state.overlayShown = !(r.width === 0 || r.height === 0);   // CSS-hidden overlay → overlayHidden flag + telemetry
```

## decision-matrix

Signals are grouped (content baits, dns, trip, size, byp) and the matrix (`xz()`, deob
L1822-1902) decides `detected`:

| Path | Condition |
|---|---|
| A | ≥1 content bait **and** ≥2 signals total |
| B | `brave` **and** ≥2 `dns_*` |
| C | ≥2 `dns_*` |
| D | ≥2 `trip_*` |
| E | ≥2 `size_gpt_*` |
| F | ≥2 `byp_*` **and** ≥1 of {timers, hide, img, onclick, href, mark} |

A single isolated `byp_*` signal does not condemn anything.

## att-token

The event POST (`triggered[]` + `detected`) is signed with `x-aabc-ts`/`x-aabc-sid`/
`x-aabc-sig` (HMAC-SHA256 over `ts + "." + body` with a session secret). The server mints the
`att` token **only when the event says `detected:false`**:

```json
{"ok":true,"att":"v1.<expiry_ms>.<rand>.<hmac>"}    // clean → 120 bytes, ~120 s validity
{"ok":true}                                          // detected → 11 bytes, no token
```

The loader parks the token until it sees a **trusted** gesture
(`pointerdown|mousedown|touchstart|keydown|click` with `isTrusted` via the native descriptor),
then writes `window.LLAtt` and fills `input[name="ll_att"]` at submit time. The final `hw` POST
is accepted only with a valid unexpired `ll_att` plus plausible `ll_ct`/`ll_dt`/`timeline`.
Block pages: "Ad blocker or auto-click script detected" (847 b) and
"Please turn off the auto-click script" (1327 b).

## sec-fetch-headers

Server-side check (no client code): the unlock POSTs must look like browser navigations.
The browser adds `Sec-Fetch-User: ?1` only to user-activated navigations; the Tap step
enforces it, other steps currently tolerate its absence:

| Request | `sec-fetch-user` | Response | Verdict |
|---|---|---|---|
| Tap POST (`hw=`, empty timeline) | absent | 1327 b "Please turn off the auto-click script" | **rejected** |
| hw POST (`ll_ct=1&ll_att=…`) | `?1` (injected via extension) | 712 b Tap page | accepted |
| hw POST (older capture) | absent | 712–986 b | accepted — not enforced on this step |

Header set to ensure on every unlock POST (the extension rule above):

```js
headers: {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Content-Type": "application/x-www-form-urlencoded",
  "Origin": "https://intercelestial.com",
  "Referer": "https://intercelestial.com/",
  "Sec-Fetch-Dest": "document",      // navigation to a document
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",   // must match the form origin
  "Sec-Fetch-User": "?1",            // user-activation marker — the enforced one
}
```

What each header tells the server:

- `Sec-Fetch-Mode: navigate` + `Sec-Fetch-Dest: document` — "this POST is a page navigation,
  not a background request" (the gate submits are full navigations).
- `Sec-Fetch-Site: same-origin` — the form posts to its own origin.
- `Sec-Fetch-User: ?1` — "a user gesture started this navigation". The browser computes it from
  real activation; a header-injection extension (or `GM_xmlhttpRequest`) is the only way a
  programmatic submit can carry it.
- `Origin`/`Referer` pinned to `https://intercelestial.com/` (the loader's own fetches use
  `credentials: "omit"` and never carry these — they are page-realm and untouched).

The page's JS has no API to read the request headers of its own navigations, so the injected
`?1` is invisible to the loader's DOM probes — only the server compares these values.

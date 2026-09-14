# Intercelestial — Detection Methods & Header Setup

***From v8.0.18-pahe.***

## How make the page skip "Tap Continue to go on" page

![Intercelestial — How make the page skip "Tap Continue to go on" page](https://github.com/user-attachments/assets/99f00c4c-ea91-47ca-8ca2-f1f033ee3ec5)

The page is retorned when the backend server don't receive `"Sec-Fetch-User": "?1"` header, but the browser only sends when user interact with the page or using API/extensions to modify the request headers.

### 1. Install a header-injection extension

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

### 2. Add the rule

- Domain: `intercelestial.com`
- Modify **request** headers, action **set**:
  - `Sec-Fetch-User: ?1` ← the only one strictly needed
  - `Sec-Fetch-Mode: navigate` / `Sec-Fetch-Dest: document` / `Sec-Fetch-Site: same-origin`
    (optional — the browser already sends these on native submits; setting them makes the rule
    independent of how the POST is triggered)

**Keep the rule scoped to `intercelestial.com` — never global.** `Sec-Fetch-User: ?1` asserts
"a user gesture started this navigation"; forging it for all origins lies about user activation
to every site you visit, and can break hosts that use these headers for their own heuristics.

### 3. Verify

- **Without any header injection (default):** the gate ends on the "Tap Continue to go on"
  page; one real tap completes it. Expected behavior — nothing to fix.
- **With the injection (extension):** the gate redirects straight to the
  destination — no Tap page, no extra click.
- Either path, a "Please turn off the auto-click script" response means a purely
  programmatic submit reached the server (missing `?1` **and** implausible behavior fields).
  Per-step observations: [sec-fetch-headers](#sec-fetch-headers).

## Detection methods reference

> One entry per signal: **Detects** → mechanism **code** (verbatim from captures) → **Verdict**.
> Useful observability: after load, `window.__tlm` mirrors the run — `probes[]` records
> `{id, status, mode, ms}` with `mode` strings like `bait-neutered`, `weight-stub`, `csp-sup`,
> `timeout-sup`, `perf-confirmed`; adding `#aabc_debug` to the URL prints the engine's own
> decision trace (read-only; `#aabc_force` *forces* `detected:true` — testing only). The engine
> self-disables on any host that is not `intercelestial.com` (origin guard), and the
> `navigator.brave`/UA bot-gate is covered under [engine probes](#engine-probes).

### Engine probes

Each probe resolves to 0/1 named signals in `triggered[]`:

| # | Signal(s) | Vector | Decides on | Timeout |
|---|---|---|---|---|
| 1 | `bait_public` | off-screen `<div>` with 7 generic ad classes (`adsbox banner-ad ads-banner sponsor-ad ad-container ad-contain(css_ads) …`) | `setTimeout 80 ms` → `getComputedStyle` + `offsetParent\|offsetHeight\|display\|visibility` ⇒ hidden = blocked; page hidden ⇒ suppress | 80 ms |
| 2 | `bait_random` | same, per-delivery classes (e.g. `promo-c5bcb49063…` — the random token **embeds the boot XOR key**) | idem | 80 ms |
| 3 | `self_ads_js` | `<script async src=/{dir}/{r}/afe6a7ed/e47cda4e.js?_=ts>` | onload/onerror + marker `window["__ab_e47cda4e"]`: loaded **without** marker & small ⇒ `bait-neutered` (something ate the stub's global); real >1000 B answer ⇒ `fp_env`; onerror ⇒ CSP/control re-check; timeout ⇒ suppressed | 3500 ms |
| 4–6 | `trip_ads`, `trip_pagead`, `trip_adframe` | `<script>` to `/{r}/ads…\|pagead…\|adframe…` | idem — same-origin tripwires, invisible to uBlock default lists, so they catch hosts-file/DNS blockers and neutralizers | 3500 ms |
| 7 | `image_banner` | `new Image()` → `/{r}/2d8d55a7/fdf6dc18.gif?_=ts` | onerror, **or onload with `naturalWidth===0`** ⇒ `onload-empty` (1×1 stub swap), or Resource-Timing `blocked` | 3500 ms |
| 8 | `css_ads` | `<link rel=stylesheet>` → `/{r}/29425904/fed465b3.css` | onload/onerror; node removed after | 3500 ms |
| 9–13 | `dns_pagead2`, `dns_doubleclick`, `dns_googletag`, `dns_amazon_ads`, `dns_googleads` | `fetch` (no-cors, no-store, omit) + AbortController, 3 s each, to 5 live ad-network URLs ([list](#dns-probes)) | promise **reject** → CSP veto → control alive? → retry classifier ⇒ blocked; **resolve** but the response object exposes own `type/status/url/body` ⇒ `stub` (server-side replacement, easylist-style) | 3000 ms |
| 14–15 | `size_gpt_dc`, `size_gpt_gts` | `fetch` + `.blob()` drain of the two real gpt.js, then Resource Timing | `transferSize+encodedBodySize` in 0…20 000 ⇒ `weight-stub` (response stub, not block); ≥20 000 ⇒ clean; `responseEnd>0 ∧ transferSize==0` ⇒ blocked | 6000 ms |
| 16 | `brave` | `navigator.brave.isBrave()` | resolves true; else `userAgentData.brands` / `/Brave\//` UA fallback | 700 ms |
| 17 | 12 × `byp_*` | [tamper table](#byp-signals) | | 120/500/1500 ms |
| 18 | env flags | `ctl_net` (control fetch `gstatic generate_204`, 2500 ms), `csp_env`, `fp_env`, `size_slow`, `net_slow` | **veto layer** — consulted before *any* block attribution; excluded from the quorum; timeouts never fire a trigger (set `net_slow` instead) | — |

**Bot gate (runs before anything):** `navigator.webdriver === true` or a UA matching
`bot|crawl|spider|headlesschrome|puppeteer|playwright|gptbot|claudebot|…` ⇒ engine exits
**silently** (`stage:"bot-skip"`): no overlay, no event, no att. So `webdriver` never appears in
`triggered[]` — detection targets tool-assisted humans, not bots. (The old "help overlay" copy
mentioning Tampermonkey is UI text, not a probe.)

**Early tamper event:** a click on any `BUTTON`/`INPUT[submit]` with `isTrusted === false` — or
`visibilitychange`, or `beforeunload` — sends a tamper event (`reason:"click"|"vis"|"unload"`)
**immediately**, before the probe round finishes, built from the early `byp_*` set. The check
reads `isTrusted` through the **native getter descriptor**, so a userscript wrapper hiding it is
itself caught. This is why auto-clicking the gate's own button can condemn the session at t≈0.
`visibilitychange`/`pageshow{persisted}` also re-run the whole cycle (each cycle sends its own
signed event; skipped when the last verdict was path F).

### byp-signals

Anti-tamper checks collected into `triggered[]` (v8.0.14 collector: `su()`):

| Signal | Detects | Root check |
|---|---|---|
| `byp_timers` | patched timer APIs / accelerated countdowns | `String(setTimeout/setInterval)` lacks `[native code]`; drift probe: `setTimeout(…,500)` firing after **<150 ms** |
| `byp_shadow` | patched `Element.prototype.attachShadow` | `String(fn)` non-native |
| `byp_img` | filter rewriting canary src | planted 1×1 `data:` `<img>` src rewritten to another `data:image/svg+xml` |
| `byp_onclick` | attribute stripper | planted `<span onclick=…>` lost its attribute |
| `byp_href` | attribute stripper | planted `<a href="https://a.invalid///b">` lost `href` |
| `byp_vis` | spoofed visibility | own descriptor on `document.hidden`/`visibilityState` ⇒ getter hooked |
| `byp_mark` | adblock marker | `window.saynotoads` or `.saynotoads` in DOM |
| `byp_click` | synthetic clicks | capture listener marks `isTrusted === false` on button/submit (v8.0.14 re-evaluated canaries up to 4 clicks) |
| `byp_hide` | cosmetic CSS hiding | colored test div turns black/transparent on ≥2 computed props |
| `byp_pop` | popup killers | planted `position:fixed; z-index:2147483647` div removed |
| `byp_purge` | element purgers | canary **pair** (empty div vs div-with-child): only the empty one removed |
| `byp_submit` | patched form submit | `HTMLFormElement.prototype.submit` non-native **or** own `submit` descriptor on any live `<form>` |

v8.0.14 per-method code snippets are preserved in [appendix A](#appendix-collapsed-evidence).

### honeypot

**Detects** — clicks on trap forms/buttons a human never reaches; clicking them is a direct flag.

```html
<!-- live gate HTML -->
<form id="bot_trap" action="/?ll_action=bot_ban" method="POST"></form>
```

Also `.verify`, `.skipcontent`, `.postnext` (off-screen buttons).

**Verdict** — direct flag (no matrix quorum needed).

### ll-ct

**Detects** — final click not trusted (synthetic → `0`).

```js
btn.addEventListener('click', (e) => {
  if (window.LLSent) { return; } window.LLSent = true;
  LLct = (e && e.isTrusted) ? '1' : '0';   // ← the field the server reads
  timeline['final'] = Date.now();
  document.getElementById('timeline_input').value = JSON.stringify(timeline);
  setTimeout(function () { LLFill(); xxc.submit(); }, 150);
});
```

**Verdict** — behavior field on the final `hw` POST; implausible `ll_ct` → rejection even with a
valid token ([att-token](#att-token)).

### ll-dt

**Detects** — no real pointerdown before the click. Milliseconds since the last **trusted**
pointerdown; a human clicks 180–300 ms after pressing — an old/unpaired value is impossible.

```js
['pointerdown', 'touchstart', 'mousedown'].forEach(function (t) {
  document.addEventListener(t, function (e) { if (e.isTrusted) { LLpd = Date.now(); } }, true);
});
// at submit time (live gate, function LLFill):
f('ll_dt', LLpd ? String(now - LLpd) : '');
```

**Verdict** — behavior field; implausible `ll_dt` → rejection.

### ll-pop

**Detects** — popup manipulation: the gate wraps `window.open`; a popup opened < 5 s before
submit sets the flag.

```js
// gate inline
window.open = function(){ LLpop = Date.now(); /* ... */ };
// LLFill:
f('ll_pop', (LLpop && now - LLpop < 5000) ? '1' : '0');
```

**Verdict** — behavior field on the final `hw` POST.

### timeline

**Detects** — impossible stage timings: `{1_1, 1_2, 2_1, final}` in ms (`1_1` render,
`1_2`/`2_1` stage handlers, `final` at submit). Zero gaps or future timestamps are flags.

```js
timeline['1_1'] = Date.now();          // render
timeline['1_2'] = Date.now();          // stage-1 click handler
timeline['final'] = Date.now();        // final click handler
document.getElementById('timeline_input').value = JSON.stringify(timeline);
```

**Verdict** — behavior field; implausible timeline → rejection.

### dns-probes

**Detects** — request-level ad blocking by `fetch`-ing five **real ad-network URLs** (3 s each):
`pagead2.googlesyndication.com/pagead/show_ads.js` → `dns_pagead2`,
`securepubads.g.doubleclick.net/tag/js/gpt.js` → `dns_doubleclick`,
`www.googletagservices.com/tag/js/gpt.js` → `dns_googletag`,
`s.amazon-adsystem.com/aax2/apstag.js` → `dns_amazon_ads`,
`www.googleadservices.com/pagead/conversion_async.js` → `dns_googleads`.

```js
// v8.0.18 decision chain per host:
fetch(url, { mode: "no-cors", cache: "no-store", credentials: "omit", signal })
  .then(resp => isStub(resp) ? TRIGGER("stub")      // response has own type/status/url/body
                              : clean(),             // props → server replaced it (easylist stub)
        () => after(60ms, () => {
          if (cspMap[url]) { pn = true; return; }    // failure is a browser CSP/content-settings
          netCheck().then(dead => …)                 // block → csp_env, trigger SUPPRESSED
        }));                                          // else retry ⇒ blocked ⇒ TRIGGER
// any timeout → never counts as a block; sets net_slow
```

The `securitypolicyviolation` listener (per-origin `blockedURI` map) is a **false-positive
filter**: it *suppresses* triggers attributed to browser content settings (Brave Shields, Edge
strict…), never *creates* one. A `dns_*` trigger requires: fetch physically failed **and** URL
not in the CSP map **and** the `generate_204` network control ([engine probes](#engine-probes),
row 18) is alive.

**Verdict** — `dns_*` → [matrix paths B and C](#decision-matrix). Fired exactly this way in the
2026-09-13 not-pass session (`ERR_BLOCKED_BY_CLIENT` ×5 → path C).

### network-canaries

**Detects** — request-blocking of engine-owned assets. Same-origin canaries under
`/{dir}/{r-group}/…` (vendor `antiadblockcore.com/r/…` literals rewritten same-origin at boot)
must load — full per-probe mechanism in the [engine table](#engine-probes) rows 3–8 and 14–15.
Design notes: the endpoint/dir tokens are **per-chunk** (regenerated on every new chunk), so
they change whenever the chunk URL changes, but they stay stable across all page-views *of the
same chunk* — e.g. capture `d3a4c7d6ed` reused the same event/r-group hashes across page-views;
uBlock never sees these names in default lists, which is why the canaries load even under
uBlock; and the `bait_random` class embeds the per-delivery XOR key, so userscripts can't
precompute it.

### shadow-modal

**Detects** — CSS-hidden overlay + patched `attachShadow`. The block modal mounts inside a
**closed** shadow root using an `attachShadow` **stolen from a fresh iframe** — so main-realm
patches are ignored — and probes its own visibility:

```js
// v8.0.14 'live bundle': harvest pristine attachShadow from a throwaway iframe
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

// mount host + closed shadow
var host = document.createElement('div');
host.setAttribute('data-' + SCOPE + '-h', '1');        // only handle in the light DOM
document.documentElement.appendChild(host);            // host hangs off <html>, not <body>
var root = N3().call(host, { mode: 'closed' });        // stolen native fn, closed shadow
root.appendChild(el);

// anti-CSS-hide probe after mount:
document.documentElement.style.overflow = 'hidden';
var r = el.getBoundingClientRect();
state.overlayShown = !(r.width === 0 || r.height === 0); // hidden ⇒ overlayHidden flag + telemetry
```

Note: `byp_shadow` checks the *main-realm* `attachShadow`; the modal builder defeats that check
from the other side by using the iframe-stolen copy.

**Verdict** — `overlayHidden` is reported as telemetry alongside [byp_shadow](#byp-signals).

### decision-matrix

**Role** — combines signals into `detected` (paths A–F; groups: content baits, dns, trip, size,
byp):

| Path | Condition |
|---|---|
| A | ≥1 content bait **and** ≥2 signals total |
| B | `brave` **and** ≥2 `dns_*` |
| C | ≥2 `dns_*` |
| D | ≥2 `trip_*` |
| E | ≥2 `size_gpt_*` |
| F | ≥2 `byp_*` **and** ≥1 of {timers, hide, img, onclick, href, mark} |

A single isolated `byp_*` signal does not condemn anything. v8.0.18 refinements: environment
flags (`brave`, `ctl_net`, `csp_env`, `fp_env`, `size_slow`, `net_slow`) are **excluded** from
path A's total-count quorum; when `fp_env` is present the strong-bait and trip sets are skipped
entirely. The 2026-09-13 not-pass run condemned via **path C** (5 × `dns_*`, no `fp_env`).

### att-token

**Role** — the clean-event gate. The event POST is signed
`x-aabc-sig = HMAC-SHA256(secret, x-aabc-ts + "." + body)` with the per-delivery secret bound to
`x-aabc-sid`; the server maps sid → secret and mints `att` **only** over the exact signed bytes
when the event claims clean:

```json
{"ok":true,"att":"v1.<expiry_ms>.<rand>.<hmac>"}    // clean → 120 bytes, ~120 s validity
{"ok":true}                                          // detected OR bad sig → 11 bytes, no token
```

Event schema: `{ siteId, v, origin, triggered[], detected, cycle, retry, ua(200 chars), eid,
ets }` plus server-stamped `rid` (`window.LLPayload`, persisted in sessionStorage `aabc_llp`)
and `nonce` (`window.LLNonce`); `retry` marks a reload within 120 s of a "rt" stamp; an
**`attonly`** variant (`detected:false, attonly:true, rid, nonce, …`) is sent when the session is
already clean and only a fresh token is needed. A `pr` field is included **only if the page
defines a `probeDigest` global** (canary) — never define that global. Sessions refresh shortly
before the secret stamp expires (HMAC over the literal `"{}"`); a `401` stops refreshing forever.

The loader parks the token until it sees a **trusted** gesture
(`pointerdown|mousedown|touchstart|keydown|click` with `isTrusted` via the native descriptor),
then writes `window.LLAtt` and fills `input[name="ll_att"]` at submit time. The final `hw` POST
is accepted only with a valid unexpired `ll_att` plus plausible `ll_ct`/`ll_dt`/`timeline`.

### sec-fetch-headers

**Role** — server-side check (no client code): the unlock POSTs must look like browser
navigations. `sec-fetch-user` picks the **path**, not the verdict: with `?1` → direct redirect;
without it → the intermediate "Tap Continue to go on" page, whose real user-click supplies the
header. The per-step captures below show the observed responses — the **rejected** row is the
case where the POST was purely programmatic end-to-end (no `?1` *and* empty/implausible
timeline):

| Request | `sec-fetch-user` | Response | Verdict |
|---|---|---|---|
| Tap POST (`hw=`, empty timeline) | absent | 1327 b "Please turn off the auto-click script" | **rejected** |
| hw POST (`ll_ct=1&ll_att=…`) | `?1` (injected via extension) | 712 b Tap page | accepted |
| hw POST (older capture) | absent | 712–986 b | accepted — not enforced on this step |

Header set to ensure on every unlock POST (the extension rule in [How to pass the
gate](#how-to-pass-the-gate)):

```js
headers: {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Content-Type": "application/x-www-form-urlencoded",
  "Origin": "https://intercelestial.com",
  "Referer": "https://intercelestial.com/",
  "Sec-Fetch-Dest": "document",      // navigation to a document
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",   // must match the form origin
  "Sec-Fetch-User": "?1",            // user-activation marker — the path-changer
}
```

- `Sec-Fetch-Mode`/`Dest` — "page navigation, not a background request"; `Site: same-origin` —
  the form posts to its own origin; `Origin`/`Referer` pinned to the host (the loader's own
  fetches use `credentials: "omit"` and never carry these).
- `Sec-Fetch-User: ?1` is computed by the browser from real activation — a header-injection
  extension (or `GM_xmlhttpRequest`) is the only way a programmatic submit can carry it; when
  it is absent the server falls back to the Tap page instead of rejecting outright.

## Appendix (collapsed evidence)

<details>
<summary><b>A. v8.0.14-pahe per-method code snippets</b> (historical; superseded by the v8.0.18
tables above but kept as evidence — <code>deob L####</code> belongs to the v8.0.14 reference)</summary>

```js
// byp_timers — deob L1236-1244
String(window.setTimeout).indexOf('[native code]') === -1   // → byp_timers
String(window.setInterval).indexOf('[native code]') === -1  // → byp_timers
// plus a timing probe: a timer scheduled for N ms must not fire before N

// byp_shadow — deob L1246-1253 (function so())
function so() {
  try {
    if (!Element.prototype.attachShadow) return false;
    return String(Element.prototype.attachShadow).indexOf('[native code]') === -1; // true = tampered
  } catch (e) { return false; }
}

// collector — deob L1298-1344 (function su())
function su() {
  var flags = [];
  try { if (sc()) flags.push('byp_timers'); } catch (e) {}
  try { if (so()) flags.push('byp_shadow'); } catch (e) {}
  // ... byp_submit, byp_img, byp_onclick, byp_href, byp_vis, byp_mark, byp_purge, byp_hide, byp_pop
  return flags;
}

// byp_submit — deob L1356-1376
String(HTMLFormElement.prototype.submit).indexOf('[native code]') === -1   // → byp_submit
// or: Object.getOwnPropertyDescriptor(form, 'submit') !== undefined on any form

// byp_img / byp_onclick / byp_href — canaries, re-check ~120 ms (x5(), deob L1431-1447)
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

// byp_vis — deob L1278-1284
Object.getOwnPropertyDescriptor(document, 'hidden') !== undefined   // → byp_vis

// byp-mark — deob L1285-1296
window.saynotoads !== undefined || document.querySelector('.saynotoads') !== null  // → byp_mark

// byp_purge — deob L1345-1354 (empty div + filled div; only the empty one removed ⇒ flag)
if (!empty.isConnected && filled.isConnected) flag('byp_purge');

// byp-hide — deob L1622-1630 (colored test div)
var cs = getComputedStyle(testDiv);
(cs.backgroundColor === 'rgb(0, 0, 0)' || cs.opacity === '0') // on 2+ props → byp_hide

// byp-pop — deob L1656-1662 (max-z-index test div killed)
el.style.cssText = 'position:fixed;z-index:2147483647;...';
setTimeout(function () { if (!el.isConnected) flag('byp_pop'); }, ...);

// byp-click — deob L1503-1553 (counts up to 4 to re-evaluate canaries)
document.addEventListener('click', function (e) {
  var t = e.target;
  if (t.tagName === 'BUTTON' || t.type === 'submit') {
    if (e.isTrusted === false) nw = true;   // synthetic click seen
  }
}, true);

// bait elements — deob L1560-1700 (1 px invisible divs, + per-deploy random class)
var bait = document.createElement('div');
bait.className = 'adsbox banner-ad ads-banner sponsor-ad ad-container ad-contain(css_ads) ...';
// + random per-deploy class: 'promo-702aecea79...' (bait_random)
document.body.appendChild(bait);
setTimeout(function () { if (hidden(bait)) flag('bait_public'); }, 120);

// dns probe classifier — v8.0.14 (functions s0/dz; superseded by the v8.0.18 chain in dns-probes)
function s0() {   // fetch probe URL, resolve true/false, ~2 s timeout
  return new Promise(function (resolve) {
    var done = false;
    setTimeout(function(){ if (!done){ done = true; resolve(false); } }, 2000);
    fetch(PROBE_URL, { mode: 'no-cors', cache: 'no-store', credentials: 'omit' })
      .then(function(){ done || (done = true, resolve(true)); },
            function(){ done || (done = true, resolve(false)); });
  });
}
```

</details>

<details>
<summary><b>B. Local forensic artifacts</b> (NOT in the repository — regenerate locally if
needed)</summary>

The line references in appendix A/C belong to local analysis artifacts that are **not
versioned**: `debug/` is gitignored (HAR captures incl. `intercelestial.com-not-pass.har`,
`linegee.net-passing.har`, deobfuscated chunks under `debug/webcrack/aabc_deobfuscated_*.js`,
decoded pools under `debug/*_annotated.js`), and the analysis toolkit
(`scripts/analyze-har.mjs`, `decode-chunk.mjs`, `verify-sig.mjs`, `inspect-engine.mjs`,
`diff-hars.mjs`, plus `scripts/README.md`) is untracked. Human-readable deobfuscation needs
Node 22 (webcrack's isolated-vm prebuild): `npx -y webcrack <raw_chunk.js> -o <out>/`. Treat all
`Xx L####`-style names as capture-local; re-derive per HAR.

</details>

<details>
<summary><b>C. att-refusal proof (2026-09-13 captures) & open experiment</b></summary>

HMAC recomputation (`verify-sig` over each event vs every secret in the same HAR):

| HAR event | body claims | sig vs HMAC(chunk secret, ts+"."+sent bytes) | server answer |
|---|---|---|---|
| linegee pass, entry 61 (1st load) | clean | **MATCH** vs secret `cff98…` from *that load's* chunk | `att` minted |
| linegee pass, entry 157 (2nd load) | clean | **MATCH** vs *different* secret `b881…` from the re-delivered chunk | `att` minted |
| intercelestial not-pass, entry 67 | clean *(post-signing rewrite)* | **MISMATCH** under every candidate secret | `{"ok":true}` — no att |

Conclusion: the att gate is **signature integrity + clean claim**, not a behavioral oracle. A
valid sig over `detected:true` also gets no token (honest-dirty rule from the v2/v4 era). Open
question: whether the server holds any additional oracle. Test for it: **encoder swap** —
intercept the engine's `TextEncoder.prototype.encode` at signing time and swap the dirty string
to a clean one *before* the HMAC, so signed bytes == sent bytes; if the server then mints `att`
with uBlock ON, sig integrity was the only gate. (Implemented since in the `intercelestial`
handler of `src/script.user.js` v0.0.13 as a `justPatch` on `TextEncoder.prototype.encode`;
final live verdict pending a fresh capture.)

</details>

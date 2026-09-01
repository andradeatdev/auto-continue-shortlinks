# Planned Clause Kinds

> **Status**: not part of the current vocabulary — defined ahead so the grammar is stable. None of these are implemented yet; the implemented kinds live in [RULES.md](RULES.md).

**`property`** (waitable) — waits for a value on the page global scope:

```js
{ when: "property", name: "window.downloadURL", value: "nonEmpty" }
```

- `name` — a dotted path walked from `window` (leading `window.` optional); used as a `matches` clause (or a step's `check` on a global), matching the element restraint vocabulary (`"nonEmpty"`, `"absent"`/`"present"`, literals, `RegExp`, `{ not: R }`).

**`title`** (waitable) — tests `document.title`:

```js
{ when: "title", value: { contains: "Download" } }
```

- `value` — a string restraint.

**`storage`** (waitable) — reads `localStorage`/`sessionStorage`:

```js
{ when: "storage", area: "local", key: "pahe.done", value: "true" }
```

- `area` — `"local"` (default) or `"session"`.
- `key` — required.
- `value` — a string restraint (exact, `RegExp`, `{ prefix }`, `{ suffix }`, `{ contains }`, `{ not }`). Storage changes don't mutate the DOM, so this clause resolves through the same polling that drives the other waitable kinds.

**`url`** (static) — tests the full `location.href` (scheme + host + path + search + hash) when the `path` clause alone cannot reach the state (e.g. everything lives in query params):

```js
{ when: "url", value: { contains: "sid=abc" } }
```

- `value` — a string restraint.

**`query`** (static) — matches a single search parameter by name:

```js
{ when: "query", name: "continue", value: "nonEmpty" }
```

- `name` — required, the parameter key.
- `value` — a string restraint over the parameter's value.

**`text`** (waitable) — matches `document.body.innerText` by substring (last-resort signal when the DOM gives no hook):

```js
{ when: "text", value: { contains: "not a robot" } }
```

- `value` — a string restraint; resolves via polling (text changes don't fire mutations).

**`visibility`** (waitable) — matches `document.visibilityState` (`"visible"` / `"hidden"`), e.g. act only once the user is back on the tab after solving a captcha:

```js
{ when: "visibility", value: "visible" }
```

- `value` — string equality only.

**`cookie`** (waitable) — reads `document.cookie` by name (session-level flags the page sets without touching the DOM):

```js
{ when: "cookie", name: "rate", value: { prefix: "limit_" } }
```

- `name` — required.
- `value` — a string restraint; resolves via polling.

**`request`** (waitable) — matches a **network request** made by the page, by intercepting `window.fetch`/`XMLHttpRequest` and comparing the last request against a restraint on its URL (optionally on the response text):

```js
{ when: "request", url: { match: "/api/next" }, response: { contains: "download" } }
```

- `url` — a string restraint over the request URL.
- `response` — optional, a string restraint over the response body text.
- The interception is a monkey-patch installed once per page; the clause resolves via polling against the snapshot of the last request/response. Highest maintenance cost of the planned kinds.

**`event`** (waitable) — two forms:

```js
{ when: "event", name: "download-ready" }                 // a composed CustomEvent (bubbles: true, composed: true) dispatched by a page/web-component as its completion signal
{ when: "event", type: "click", inside: ".cf-turnstile" } // a user event whose composedPath() crossed the shadow boundary inside the `inside` host
```

- `name` — matches a named CustomEvent; `type` + `inside` — matches once a real event of that type was observed with a `composedPath()` that entered the `inside` subtree across a shadow boundary. Engine: a capture listener on `document` sets a flag; the clause resolves via polling against the snapshot.

**`focus`** (waitable) — a micro-signal (e.g. "the user is inside the captcha widget"):

```js
{ when: "focus", selector: ".cf-turnstile", shadow: true }
```

- Matches when `document.activeElement` lives inside the `selector` subtree (with `shadow: true`, descending into open shadow roots); resolved via polling.

**`defined`** (waitable) — gates on custom-element upgrade *before* searching inside the shadow (before upgrade there is no shadow root to look through):

```js
{ when: "defined", tag: "dl-card" }
```

- Matches when `customElements.get(tag)` returns a definition.

**`media`** (waitable) — a media-query gate for responsive layouts:

```js
{ when: "media", value: "(max-width: 767px)" }
```

- `value` — required, a string media query; matches when it currently applies.

**`scroll`** (waitable) — a container reached its end (infinite-scroll lists):

```js
{ when: "scroll", selector: "#list", to: "bottom" }
```

- `selector` — required; matches when `scrollTop + clientHeight` ≈ `scrollHeight`.

**`clipboard`** (waitable) — clipboard contains a value, resolved after a real "Copy" prompt:

```js
{ when: "clipboard", value: { contains: "http" } }
```

- `value` — a string restraint; `navigator.clipboard.readText()` needs permission/a user gesture, so this only resolves after the user interacts — fits hosts that release the link only through copy.

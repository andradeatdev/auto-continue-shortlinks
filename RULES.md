# Pahe - Rules Reference

> **Reference note**: this document is the live grammar specification. It describes the rule grammar: rule-level `matches` (a condition), the `check` format (readers + restraints), clause kinds (`path`, `element`, `ready-state`, `query`, combinators), steps as `{ do, ...verbOptions }`, patches (`set-property`, `tune-timer`), and the shared Transform system. All action, verb, and patch names use **kebab-case**.

Every supported host has a table entry in `script.user.js`:

```js
"hostname.tld": {
	patches: [ /* optional page interventions, applied before rules */ ],
	rules: [ /* rules evaluated in order; the first whose conditions all hold wins */ ]
}
```

Rules are declarative data — no JavaScript control flow. A rule *matches* when its `matches` condition holds, then its `steps` run in order (imperative verbs).

---

## Rule

```js
{
	matches: [ /* clause* , optional */ ], // the page state that must hold (AND).
	steps:   [ /* { do, ...verbOptions }, in order */ ]
}
```

- `matches` — a condition (below). **Default when omitted or `[]`: an empty condition, so the rule matches immediately**, in rule order.
- `matches` includes **URL clauses** (`path`) and **page-state clauses** (`element`, `ready-state`). All clauses are re-evaluated on every poll (see [path clause](#path-clause) for how SPA URL changes are handled).
- Rules are evaluated in order; the **first** one whose `matches` holds decides; later rules never run.

---

## Condition

A condition is a **list of clauses, all of which must hold (AND)**. It lives in one place — a rule's `matches`:

- `matches` — the engine re-checks **all** clauses together every **250 ms** for up to **120 s** before giving up. Steps themselves carry no condition; an element-targeting step's `selector`/`check`/`timeout` acts as its own auto-wait (see Steps).

Clause kinds are either **static** (resolved synchronously, never waited on) or **waitable** (the engine polls / observes for up to the timeout); `path` is both — it resolves synchronously within each check and is re-checked every poll (see [path clause](#path-clause)). Currently implemented: `path`, `element`, `ready-state`, `query`, `not`, `all`, `any` (see their sections below). Additional planned kinds (`url`, `property`, `title`, `storage`, `text`, `visibility`, `cookie`, `request`, `event`, `focus`, `defined`, `media`, `scroll`, `clipboard`) are not part of the current vocabulary — see [PLANNED.md](PLANNED.md) for full definitions.

### query clause

Tests a single search parameter by name. The value is extracted via `new URLSearchParams(location.search)` and evaluated against the full restraint vocabulary, including `RegExp`, literals, `"nonEmpty"`, `{ contains }`, `{ prefix }`, `{ not }`, `{ any }`, etc.

```js
// param exists (any value, including empty)
{ when: "query", name: "sid" }

// param exists and is non-empty
{ when: "query", name: "sid", value: "nonEmpty" }

// param matches a regex
{ when: "query", name: "sid", value: /^sess_[a-z]+$/ }

// param value contains a substring
{ when: "query", name: "page", value: { contains: "download" } }

// param does NOT exist (combined with not)
{ when: "not", clause: { when: "query", name: "ddx" } }
```

- `name` — required, the parameter key (case-sensitive).
- `value` — optional. **Default when omitted: the parameter must exist** (any value, including empty string).
- `value` accepts any restraint: string literal, RegExp, `"nonEmpty"`/`"absent"`/`"present"`, `{ contains }`, `{ prefix }`, `{ suffix }`, `{ not }`, `{ any }`, `{ min, max }`.
- When the parameter is absent, `value` is `null` — so restraints like `"absent"` match only when the param is missing, and `"nonEmpty"` / `RegExp` fail as expected.

### path clause

A path clause tests the URL path:

```js
{ when: "path", value: /^\/download\// }
```

- Compares against `location.pathname` — **raw, case-sensitive** (percent-encoded as-is), always starting with `/`.
- `value` — optional. **Default when omitted: any path**.
- Only a **plain string** (exact equality) or a **RegExp** are accepted as `value`:

  | `value`     | Matches when                          |
  | ----------- | ------------------------------------- |
  | (omitted)   | any path                              |
  | `"/go"`     | `pathname === "/go"` (exact equality) |
  | `/\.html$/` | `RegExp.test(pathname)`               |

  Any other `value` type (object, number, boolean, `"nonEmpty"`, etc.) is **rejected at runtime**: the clause logs an error and never matches.
- A path clause is evaluated **synchronously at each check**, but the match loop re-checks it on every poll: a false `path` skips the rule *in that iteration*, and an SPA URL change is picked up on a later poll within the 120 s window.

### element clause

An element clause finds an element by `selector` and describes what must be true of it through `check`:

```js
{ when: "element", selector: "#dl", check: { property: "disabled", value: false } }
```

- `selector` — required, a CSS selector.
- `check` — optional. Either a single **check entry**, or a list of them. When it is a list, **all entries must hold on the same node** (AND on the same element).

  **Default when omitted: no element-state check — any element matching `selector` satisfies the clause.**
- `shadow` — 🕓 planned, **not yet implemented**. **`shadow: true`** deep-pierces **open** shadow roots: the search walks `document` and, for every node whose `shadowRoot` is readable, descends and keeps matching (covers widgets whose real button lives inside their own shadow root, e.g. Turnstile's checkbox):

  ```js
  { when: "element", selector: ".cf-turnstile [type='checkbox']", shadow: true,
    check: { attribute: "aria-checked", value: "true" } }
  ```

  Closed roots (`shadowRoot === null`) are not reachable declaratively. The engine's wait loop is **250 ms polling** (no `MutationObserver`), so a deep shadow wait would settle on the same poll cycle once implemented.

  > **Shadow tips (zero feature):** many components (Stencil/Lit) reflect state on the **host element** in light DOM — match it directly (`dl-card` with `property: "href"`) and avoid piercing entirely. A native `x-w::part(btn)` selector (and `:host`) crosses an **open** shadow root when the component exports *parts*.

> **Selector tips (zero feature):** CSS pseudo-classes already work in an element clause's `selector` — `input:invalid`, `:checked`, `:disabled` — so gated forms need no new feature: `{ when: "element", selector: "input:invalid", ... }`. `:has()` covers "element whose child/ancestor exists" without whole-clause negation: `{ when: "element", selector: "#row:has(svg.busy)", ... }`.

#### Check entry

A check entry reads a value from the element through exactly one **reader** and applies a **restraint**:

```js
{ <reader>: "<name>", value: <restraint> }
```

`value` is **required** — a check entry without `value` is logged as an error and the check returns false (never matches). Omitting `value` is not treated as "any value".

**Readers** (extensible via a registry; adding one does not change validation):

| reader      | reads                                       | notes                                                          |
| ----------- | ------------------------------------------- | -------------------------------------------------------------- |
| `attribute` | `node.getAttribute(name)`                   | raw string, `null` when absent; the default reader for legacy syntax |
| `property`  | `node[name]`                                | string/number/boolean, `undefined` when not set (ex.: `value`, `disabled`, `valueAsNumber`, `href`) |
| `style`     | `getComputedStyle(node)[name]`              | computed CSS value (ex.: `display`, `visibility`)              |
| `classList` | `node.classList.contains(name)`             | boolean                                                        |

**Restraints** (`value` on a check entry — element values):

| `value`            | Matches when                                                    |
| ------------------ | --------------------------------------------------------------- |
| `"nonEmpty"`       | defined and with content: string `trim() !== ""`, number `!== 0`, boolean `true`, list with length > 0 |
| `"absent"`         | value is `null` or `undefined` (ex.: a property not set yet)    |
| `"present"`        | value is defined (`!== null && !== undefined`)                  |
| `null`             | alias of `"absent"` (keeps the legacy meaning: attribute absent, e.g. button not `disabled`) |
| `true` / `false`   | strict equality (ex.: `property: "disabled", value: false`)     |
| `number`           | strict equality (ex.: `property: "valueAsNumber", value: 0`)    |
| `string`           | strict equality                                                 |
| `/RegExp/`         | `RegExp.test(String(value))`; absent value never matches        |
| `{ not: R }`       | R **does not** match, where R is any other restraint (ex.: `style: "display", value: { not: "none" }`) |
| `{ min: x, max: y }` | numeric range: `value >= min && value <= max`; either side optional |
| `{ contains: "..." }` | `String(value).includes(substring)`                      |
| `{ prefix: "..." }` | `String(value).startsWith(str)`                          |
| `{ suffix: "..." }` | `String(value).endsWith(str)`                            |
| `{ any: [R, ...] }` | one of the list entries matches (OR); non-empty array of restraint forms |

**Multi-reader on the same element** — use a `check` list:

```js
{ when: "element", selector: "#dl", check: [
	{ property: "disabled", value: false },
	{ style: "display", value: { not: "none" } },
	{ classList: "is-ready", value: true }
] }
```

- The example above matches when the element with id `dl` is **not disabled**, **has a style display other than `none`**, and **has the class `is-ready`**.

### ready-state clause

```js
{ when: "ready-state", value: "interactive" }
```

- Holds when `document.readyState === value`. `value` is a string equality only.

### not / all / any clauses (logical combinators)

Combinator clauses nest other clauses and combine their results. They are evaluated synchronously on each poll and dispatch to their inner clauses through the same engine, so a combinator's waitability is inherited from its inner clauses via the normal 250 ms polling loop.

**`not`** negates a single nested clause:

```js
{ when: "not", clause: { when: "element", selector: ".loading" } }
```

- `clause` — required, a single clause object whose result is negated.
- **Invalid `clause`** (missing or unknown `when`) is logged and treated as *not matching* (never throws).

> **Footgun:** `not` of a waitable clause is true the moment the inner clause is false — so `{ when: "not", clause: { when: "element", selector: ".loading" } }` matches **immediately at `document-start`** while the element hasn't appeared yet. That is the right semantics for "element must not be present"; it is *not* "wait until it disappears". A stateful "was-present-now-gone" variant is not part of the vocabulary.

**`all`** holds when **every** inner clause holds (AND):

```js
{ when: "all", clauses: [
    { when: "element", selector: ".step-a" },
    { when: "ready-state", value: "interactive" },
] }
```

**`any`** holds when **at least one** inner clause holds (OR):

```js
{ when: "any", clauses: [
    { when: "element", selector: ".captcha" },
    { when: "element", selector: "#loading" },
] }
```

- `clauses` — required, a non-empty array of clause objects. An empty/missing `clauses` is logged and treated as *not matching*.

**Nesting (full boolean algebra):**

```js
// NOT(A AND B)
{ when: "not", clause: { when: "all", clauses: [
    { when: "element", selector: ".a" },
    { when: "element", selector: ".b" },
] } }

// NOT(A OR B) — "none of these exist"
{ when: "not", clause: { when: "any", clauses: [
    { when: "element", selector: ".captcha" },
    { when: "element", selector: "#loading" },
] } }

// A AND (NOT B) — via matches' implicit AND plus a not clause
matches: [
    { when: "element", selector: ".a" },
    { when: "not", clause: { when: "element", selector: ".b" } },
]
```

Double negation (`not` of a `not`) is supported.

## Steps (`do`)

A step is a single imperative verb with its own options:

```js
{ do: "<verb>", ...verbOptions }
```

- `do` — the imperative verb (required). There are **no condition-wait steps**: the only wait step is a fixed-duration `sleep` (see Verbs). Any condition that must hold before acting lives in the rule's `matches`, not in a step. Mid-flow waits (a gate that only applies after a later click) are expressed as **separate rules**, each with its own condition in `matches` (rules are evaluated in order per [Rule](#rule)).
- `...verbOptions` — verb-specific options, including the element target (`selector` + `check`) for element-targeting verbs.

An element-targeting verb specifies its target through **`selector`** on the step, optionally narrowed by **`check`** (the same check unit as clauses). This is the step's own auto-wait: the engine waits for an element matching `selector` (and `check`) up to `timeout`, then runs the verb:

```js
{ do: "click", selector: "button#continue", check: { property: "disabled", value: false }, timeout: 30_000 }
```

If `selector` is omitted, the verb targets `ctx.lastElement` (the element left by the previous step).

### Step failure & aborting a rule

Steps run in order; the shared `ctx` tracks two things: `lastElement` and `aborted`.

- **A throwing step aborts the rule.** Each step is wrapped in its own try/catch: if a step throws (e.g. its element target times out or its handler fails), the error is **logged** and `ctx.aborted` is set by the per-step catch, so the remaining steps in that rule are skipped.
- **`ctx.aborted` is set by `redirect` and by step failures.** `redirect` sets it on a **successful navigation** (after setting `window.location.href`) and on a **critical failure** (no valid URL, an invalid/empty reader, or more than one reader). The per-step catch sets it too when a step throws.
- **Once `ctx.aborted` is true**, the engine warns and **skips all remaining steps** in that rule — stopping further work against a page that has navigated away or otherwise became unusable.

### Verbs (`do`)

| Verb                 | Purpose                                          | Options                                                                  |
| -------------------- | ------------------------------------------------ | ------------------------------------------------------------------------ |
| `click`              | Click an element                                 | `selector`, `check`, `timeout`, `once`, `times`, `delay`                 |
| `sleep`              | Wait a fixed time (clock-safe)                   | `ms` (default 1000)                                                      |
| `remove-element`     | Remove an element from the DOM                   | `selector`, `check`, `timeout`                                           |
| `remove-element-property` | Delete a JS property from the element        | `selector`, `check`, `timeout`, `name`                                   |
| `set-element-property` | Assign a JS property on the element           | `selector`, `check`, `timeout`, `name`, `value`, `transform`             |
| `set-attribute`      | Set several attributes on an element             | `selector`, `check`, `timeout`, `attributes: { name: value, ... }`       |
| `scroll-into-view`   | Scroll an element into view                      | `selector`, `check`, `timeout`                                           |
| `redirect`           | Navigate to an element's URL                     | `selector`, `check`, `timeout`, `transform`, and exactly one reader: `property` (default `"href"`), `attribute`, `style`, or `classList` |

`click`, `remove-element`, `remove-element-property`, `set-element-property`, `set-attribute`, `scroll-into-view`, and `redirect` target an element; omit `selector` to act on `ctx.lastElement`. See the Defaults table below for the `click` options (`once`, `times`, `delay`).

`remove-element-property` performs `delete node[name]` on the target element, e.g. clearing a page-set JS flag that isn't an attribute:

```js
{ do: "remove-element-property", selector: "#busy", name: "isLoading" }
```

`set-element-property` assigns a JS property on the target element — `node[name] = value`. `value` may be a string, number, or boolean. It pairs with `remove-element-property` just as `set-attribute` pairs with `remove-element`:

```js
{ do: "set-element-property", selector: "#dl", name: "href", value: "/final" }
{ do: "set-element-property", selector: "#toggle", name: "checked", value: true }
```

> **`set-attribute` vs `set-element-property`:** `set-attribute` writes **DOM attributes** and takes a **map** `attributes: { name: value, ... }` so it can set several at once (e.g. `download`, `target`); values are coerced to strings via `setAttribute(name, String(value))`. `set-element-property` writes a **single JS property** via a lone `name`/`value` pair (e.g. `checked`, `valueAsNumber`, or an object reference). Use `set-attribute` to change HTML attributes in a batch; use `set-element-property` when the target is a JS property rather than an attribute, or when you need a non-string value or a transformed/derived assignment.

When `value` is omitted and `transform` is present, the **current** `node[name]` is read, transformed, and written back — a relative/derived assignment that doesn't need to know the current value (see [Transform](#transform)):

```js
{ do: "set-element-property", selector: "#score", name: "value",
  transform: [{ op: "multiplier", by: 2 }] }   // node.value = node.value × 2
```

`redirect` reads the URL from the target element's **property** (default `"href"`). Optionally you can specify a different reader (`property`, `attribute`, `style`, `classList`) to read the URL from:

```js
{ do: "redirect", selector: ".generate-link[target='_blank']",
  check: { property: "href", value: "nonEmpty" } } // don't navigate while the URL is still empty
```

To read from the raw DOM attribute instead of the resolved property:
```js
{ do: "redirect", selector: "a.link", attribute: "href" }
```

Any reader works — including `property: "textContent"` when the URL lives in the element's text rather than an attribute. Combine it with `transform` to morph the raw value into the final URL before navigating (see [Transform](#transform)):

```js
{ do: "redirect", selector: "#final-link", property: "textContent",
  transform: [
    { op: "trim" },
    { op: "extract", pattern: /https?:\/\/\S+/, group: 0 },
  ],
}
```

### Defaults (when an option is omitted)

| Verb              | Option            | Default            |
| ----------------- | ----------------- | ------------------ |
| _element wait_    | `timeout`         | `10_000` ms        |
| `click`           | `times`           | `1`                |
|                   | `delay`           | `500` ms           |
|                   | `once`            | `false`            |
| `sleep`           | `ms`              | `1000`             |
| `redirect`        | `property`        | `"href"`           |
| `redirect`        | `transform`       | `none` (identity)  |
| `set-element-property` | `transform` | `none` (identity)  |

No default: `set-attribute`'s `attributes`, `set-element-property`'s `name` (its `value` is optional only when `transform` is present), and `remove-element-property`'s `name` — without them the verb logs a warning and does nothing.

**`click`'s `once: true`** repeats the click at most once per path/session: it is tracked in `sessionStorage` under the key `once:${hostname}:${pathname}:${selector}`, so it resets when you navigate to a different path, persists across reloads on the *same* path within the session, and only applies when a `selector` is given (a `once` click targetting `ctx.lastElement` has no key and is not de-duplicated). `times` (default 1) repeats the click that many times, waiting again before each repeat.

### Captcha tokens

A captcha solution is written into a hidden field (`cf-turnstile-response`, `data-hcaptcha-response`). To click *after* the user solves it, gate the **rule** on the token being non-empty — `matches` holds only once the token is ready, so the step won't fire prematurely:

```js
{
	matches: [
		{ when: "element", selector: "[name='cf-turnstile-response']",
		  check: { attribute: "value", value: "nonEmpty" } }
	],
	steps: [
		{ do: "click", selector: "button#continue" }
	]
}
```

### only on a specific path

```js
{
	matches: [
		{ when: "path", value: /^\/download\// }
	],
	steps: [
		{ do: "click", selector: "button#start" }
	]
}
```

### click on a button that must be enabled

```js
{
	do: "click",
	selector: "#downloadbtn",
	check: { property: "disabled", value: false },
	once: true,
	timeout: 120_000
}
```

### click to act on the previous step's element

```js
steps: [
	{ do: "click", selector: "a#startButton" },
	{ do: "redirect" }   // navigate via ctx.lastElement (the anchor just clicked)
]
```

### mid-flow wait (split into separate rules)

```js
rules: [
	{
		matches: [ { when: "element", selector: ".step-a", check: { property: "disabled", value: false } } ],
		steps:  [ { do: "click", selector: ".step-a" } ]
	},
	{
		matches: [ { when: "element", selector: ".step-b", check: { property: "disabled", value: false } } ],
		steps:  [ { do: "click", selector: ".step-b" } ]
	}
]
```

> **Legacy compatibility (planned, not yet implemented)**: shipped steps historically used `{ type: "actionName", ...flatOptions }` with camelCase names. The grammar reserves the mapping `type` → `do` and these kebab-case renames: `setConstant` → `set-element-property`, `accelerateTimer` → `tune-timer`, `removeElement` → `remove-element`, `setAttributes` → `set-attribute`, `scrollIntoView` → `scroll-into-view`. All verb options (`selector`, `check`, `timeout`, `once`, `times`, `delay`, `ms`, `attributes`, `attribute`) are unchanged. The now-defunct wait actions (`waitElement`, `waitReadyState`, `waitVariable`) move to `matches` clauses. **The current engine only reads `do`** — rules must use the `do` grammar today.

---

## Patches

Patches are page-level interventions applied **before** rules run.

### set-property

Defines a read-only property via `Object.defineProperty` so the pinned value is returned on every read, while page attempts to overwrite it are silently discarded:

```js
{ do: "set-property", chain: "window.count", value: 0 }
```

The property is installed with a **getter** that returns the configured `value` and a **no-op setter** (so `obj.x = something` is silently ignored). The property remains `configurable: true, enumerable: true` — it can be redefined later if needed but is not writable.

`chain` accepts a leading `window.`; each segment is a path walked from `window`.

No default: `set-property` requires both `chain` and `value`.

### tune-timer

Shortens `setTimeout`/`setInterval` delays, and optionally virtualizes `Date` using the shared Transform system:

```js
{
	do: "tune-timer",
	match:     { delay: 1000, callback: "functionName" }, // what to affect
	transform: [{ op: "multiplier", by: 0.05 }],          // delay × 0.05 (see Transform)
	patchDate: true                                      // virtualize Date inside matched callbacks
}
```

- `match.delay` — an **exact numeric value**. If omitted, matches **any** delay.
- `match.callback` — a **string** (substring of the function source) or a **RegExp**. If omitted, matches **any** callback.
- `transform` — the detected timer delay is transformed by `matchTransform(delay, transform)` (see [Transform](#transform)). `{ op: "multiplier", by: 0.05 }` shortens a delay to 5% of its original (delay × 0.05 = delay / 20).
- `patchDate` — **default `false`.** When `true`, also virtualizes `Date` (`new Date()`, `Date()`, `Date.now()`) inside matched timer callbacks, accelerating time-based checks alongside the timer. When omitted or `false`, `Date` is left untouched.

> **Legacy form not supported:** the legacy `transform: { factor, patchDate }` object form is **not recognized** — the engine only reads `transform` as a Transform array (or raw function) and `patchDate` as a sibling option. If the legacy form is passed, `matchTransform` sees a plain object (not an array, not a function), attempts to iterate it as ops, and effectively no-ops. Use `transform: [{ op: "multiplier", by: 1/factor }]`.

> Note: hosts with server-side timer validation (tpi.li, oii.la, pahe.plus) must **not** use this patch — the timer must run for its full duration.

### Extension: `addPatch` / `addAction`

The patch and action registries are extensible. `addPatch(name, handler)` registers a page-level patch handler and `addAction(name, handler)` registers a step verb handler, both keyed by their `do` name:

```js
addAction("my-verb", async (step, ctx) => {
	// step  = the { do, ...options } object
	// ctx   = the shared context (ctx.lastElement, ctx.aborted)
});
```

A handler runs in the same step lifecycle: it may `await`, read `step` options, use `resolveTarget` (auto-wait on `selector`/`check`/`timeout`), and set `ctx.lastElement`. A patch handler receives `(patch, ctx)` and applies before any rule runs. Registering a name under an already-known `do` overwrites that entry.

---

## Transform

A **transform** takes a raw value (read from an element, a timer, or a property) and applies one or more named **ops** to produce a new value. It is the value-morphing counterpart to `restraints` (which *match* values) and is dispatched through `matchTransform`, following the same registry pattern as `matchWhen` / `matchCheck` / `matchRestraint`.

Transforms are **optional** — a step or patch that supports `transform` behaves exactly as before when it is omitted.

### Format

`transform` accepts **one op object**, an **array of op objects applied left to right** (a chain — each op receives the previous op's output), or a **raw JavaScript function** `(value) => newValue` that is called directly:

```js
// single op
transform: { op: "trim" }

// chain
transform: [
    { op: "trim" },
    { op: "extract", pattern: /https?:\/\/\S+/, group: 0 },
]

// raw function
transform: (value) => value.replace(/^https?:\/\//, "magnet:") 
```

Each op is `{ op: "<name>", ...config }` — the `op` name is the key into the `transforms` registry and the remaining props are that op's config. **An unknown op is logged and skipped** (the chain continues with the previous value) — it never throws, matching the "invalid input logs and no-ops" convention.

### Ops

| op           | Config                                | Transforms                                              | Example |
| ------------ | ------------------------------------- | ------------------------------------------------------- | ------- |
| `trim`       | —                                     | `String(value).trim()`                                  | `{ op: "trim" }` |
| `extract`    | `pattern` (string or RegExp), `group` (default `0`) | string → literal substring (1st occurrence); RegExp → match[group] (0 = whole match); `""` when no match | `{ op: "extract", pattern: /https?:\/\/\S+/ }` |
| `replace`    | `from` (string or RegExp), `to`       | string → replaces all occurrences; RegExp → first match unless the regex has the `g` flag | `{ op: "replace", from: "http", to: "https" }` |
| `base64-decode` | —                                     | `atob(String(value))` — decodes base64; returns the original on failure | `{ op: "base64-decode" }` |
| `prefix`     | `with` (string)                       | prepend a string                                        | `{ op: "prefix", with: "magnet:?xt=urn:btih:" }` |
| `suffix`     | `with` (string)                       | append a string                                         | `{ op: "suffix", with: "?dl=1" }` |
| `multiplier` | `by` (number)                         | `value * by` (numeric values only)                      | `{ op: "multiplier", by: 0.05 }` |


### Consumers

`transform` is read wherever a raw value is about to be *used*:

- **`redirect`** — transforms the URL read from the target element before navigating (see the example under [`redirect`](#verbs-do)).
- **`set-element-property`** — when `value` is omitted, reads the current `node[name]`, transforms it, and writes it back (see [`set-element-property`](#verbs-do)).
- **`tune-timer`** — transforms the matched timer's delay (see [`tune-timer`](#tune-timer)).
- **`LINEGEE` rule** — the `redirect` extracts the argument of `atob(...)` from `script.textContent` and decodes it with `base64-decode` to get the final URL.

---

## Worked example

A complete host entry combining a patch, a captcha-gated rule with a multi-reader wait, and a `redirect` with `transform`:

```js
"example.com": {
	patches: [
		{
			do: "set-property",
			chain: "window.buttonCount",
			value: 0
		}
	],

	rules: [
		{
			matches: [
				{
					when: "element",
					selector: "[name='cf-turnstile-response']",
					check: { attribute: "value", value: "nonEmpty" }
				}
			],

			steps: [
				{ do: "click", selector: "button#continue" },
				{
					do: "click",
					selector: "#downloadbtn",
					check: [
						{ property: "disabled", value: false },
						{ style: "display", value: { not: "none" } }
					],
					timeout: 30_000
				}
			]
		},
		{
			matches: [
				{ when: "element", selector: "#final-link" }
			],

			steps: [
				{
					do: "redirect",
					selector: "#final-link",
					property: "textContent",
					transform: [
						{ op: "trim" },
						{ op: "extract", pattern: /https?:\/\/\S+/, group: 0 }
					]
				}
			]
		}
	]
}
```

### set-attribute worked example

Set several attributes on an element in a single step via `attributes: { name: value, ... }`. Each entry becomes a `setAttribute(name, String(value))` call:

```js
steps: [
	{
		do: "set-attribute",
		selector: "a.download",
		attributes: {
			"download": "file.zip",     // forces download instead of navigation
			"target": "_blank",
			"data-state": "ready"
		}
	}
]
```

Values are coerced to strings. See the `set-element-property` section for `set-attribute` vs `set-element-property` guidance.

---

## Behavior summary

- All timers are **clock-safe** (immune to page-level `setTimeout` tampering).
- An **unknown patch** in a host's `patches` list fails fast at startup: `main()` throws `Unknown patch '...'` before any rule runs.
- An **unknown step verb**, an **invalid `matches` condition**, an **invalid `check` entry**, or an **invalid combinator input** (missing `clause` / empty `clauses`) is each logged and handled gracefully — the step is skipped and execution continues (verbs), or the clause/check reports false and the rule does not match (conditions). See the respective sections for details.
- On a host with **no `domainRules` entry**, `main()` logs an error (`No domain rules found for host: ...`) and returns early — the script does nothing on that host.
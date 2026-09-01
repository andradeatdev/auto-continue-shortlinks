# Pahe - Rules Reference

> **Roadmap note**: this document describes the agreed rule grammar: rule-level `matches` (a condition), the `check` format (readers + restraints), the `path` clause (string or RegExp), `ready-state` via `value`, and steps as `{ do, ...verbOptions }`, with **kebab-case** action/verb/patch names.

Every supported host has a table entry in `script.user.js`:

```js
"hostname.tld": {
	patches: [ /* optional page interventions, applied before rules */ ],
	rules: [ /* rules evaluated in order; the first whose conditions all hold wins */ ]
}
```

Rules are declarative data — no JavaScript control flow. A rule *matches* when its `matches` condition holds, then its `steps` run in order (imperative verbs). Each element-targeting step waits for its own target through `selector`/`check`.

---

## Rule

```js
{
	matches: [ /* clause* , optional */ ], // the page state that must hold (AND).
	steps:   [ /* { do, ...verbOptions }, in order */ ]
}
```

- `matches` — a condition (below). **Default when omitted or `[]`: an empty condition, so the rule matches immediately**, in rule order.
- `matches` includes **URL clauses** (`path`) and **page-state clauses** (`element`, `ready-state`). All clauses are re-evaluated on every poll; a `path` clause compares the *current* `location.pathname` each time, so SPA URL changes are picked up within the match window.
- Rules are evaluated in order; the **first** one whose `matches` holds decides; later rules never run.

---

## Condition

A condition is a **list of clauses, all of which must hold (AND)**. It lives in one place — a rule's `matches`:

- `matches` — the engine re-checks **all** clauses together every **250 ms** for up to **120 s** before giving up. A `path` clause is never settled: the URL can change on SPA navigation, so each poll compares it against the current `location.pathname` (a false `path` skips the rule in that iteration only). Steps themselves carry no condition; an element-targeting step's `selector`/`check`/`timeout` acts as its own auto-wait (see Steps).

Clause kinds are either **static** (resolved synchronously, never waited on) or **waitable** (the engine polls / observes for up to the timeout). `path` is both: it resolves synchronously *within each check*, and the polling loop re-checks it every poll so an SPA URL change still matches:

| kind          | static | waitable |
| ------------- | ------ | -------- |
| `path`        | ✅ today   | ✅ today (re-checked on each poll — SPA URLs) |
| `ready-state` | —      | ✅ today |
| `element`     | —      | ✅ today |
| `url`         | 🕓 planned | —      |
| `query`       | 🕓 planned | —      |
| `property`    | —      | 🕓 planned |
| `title`       | —      | 🕓 planned |
| `storage`     | —      | 🕓 planned |
| `text`        | —      | 🕓 planned |
| `visibility`  | —      | 🕓 planned |
| `cookie`      | —      | 🕓 planned |
| `request`     | —      | 🕓 planned |
| `event`       | —      | 🕓 planned |
| `focus`       | —      | 🕓 planned |
| `defined`     | —      | 🕓 planned |
| `media`       | —      | 🕓 planned |
| `scroll`      | —      | 🕓 planned |
| `clipboard`   | —      | 🕓 planned |

### Planned clause kinds

Not part of the current vocabulary — defined ahead so the grammar is stable.

Full definitions: see [PLANNED.md](PLANNED.md) — `property`, `title`, `storage`, `url`, `query`, `text`, `visibility`, `cookie`, `request`, `event`, `focus`, `defined`, `media`, `scroll`, `clipboard`.

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
- `shadow` — optional, planned. **`shadow: true`** deep-pierces **open** shadow roots: the search walks `document` and, for every node whose `shadowRoot` is readable, descends and keeps matching (covers widgets whose real button lives inside their own shadow root, e.g. Turnstile's checkbox):

  ```js
  { when: "element", selector: ".cf-turnstile [type='checkbox']", shadow: true,
    check: { attribute: "aria-checked", value: "true" } }
  ```

  Closed roots (`shadowRoot === null`) are not reachable declaratively. Mutations inside shadow roots do **not** fire the document `MutationObserver`, so deep waits settle via the **250 ms poll** instead of instantly.

  > **Shadow tips (zero feature):** many components (Stencil/Lit) reflect state on the **host element** in light DOM — match it directly (`dl-card` with `property: "href"`) and avoid piercing entirely. A native `x-w::part(btn)` selector (and `:host`) crosses an **open** shadow root when the component exports *parts*. Planned engine optimization: attach the observer to each open shadow root as well.

> **Selector tips (zero feature):** CSS pseudo-classes already work in an element clause's `selector` — `input:invalid`, `:checked`, `:disabled` — so gated forms need no new feature: `{ when: "element", selector: "input:invalid", ... }`. `:has()` covers "element whose child/ancestor exists" without whole-clause negation: `{ when: "element", selector: "#row:has(svg.busy)", ... }`.

#### Check entry

A check entry reads a value from the element through exactly one **reader** and applies a **restraint**:

```js
{ <reader>: "<name>", value: <restraint> }
```

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

> Legacy note: the flat form `{ when: "element", selector, attribute, value }` is **not supported by the current engine** — use the explicit `check: [{ attribute, value }]` form instead.

### ready-state clause

```js
{ when: "ready-state", value: "interactive" }
```

- Holds when `document.readyState === value`. `value` is a string equality only.

## Steps (`do`)

A step is a single imperative verb with its own options:

```js
{ do: "<verb>", ...verbOptions }
```

- `do` — the imperative verb (required). There are **no condition-wait steps**: the only wait step is a fixed-duration `sleep` (see Verbs). Any condition that must hold before acting lives in the rule's `matches`, not in a step. Mid-flow waits (a gate that only applies after a later click) are expressed as **separate rules** — the first whose `matches` holds wins, so a sequence of gates becomes a sequence of rules.
- `...verbOptions` — verb-specific options, including the element target (`selector` + `check`) for element-targeting verbs.

An element-targeting verb specifies its target through **`selector`** on the step, optionally narrowed by **`check`** (the same check unit as clauses). This is the step's own auto-wait: the engine waits for an element matching `selector` (and `check`) up to `timeout`, then runs the verb:

```js
{ do: "click", selector: "button#continue", check: { property: "disabled", value: false }, timeout: 30_000 }
```

If `selector` is omitted, the verb targets `ctx.lastElement` (the element left by the previous step).

### Verbs (`do`)

| Verb                 | Purpose                                          | Options                                                                  |
| -------------------- | ------------------------------------------------ | ------------------------------------------------------------------------ |
| `click`              | Click an element                                 | `selector`, `check`, `timeout`, `once`, `times`, `delay`                 |
| `sleep`              | Wait a fixed time (clock-safe)                   | `ms` (default 1000)                                                      |
| `remove-element`     | Remove an element from the DOM                   | `selector`, `check`, `timeout`                                           |
| `remove-element-property` | Delete a JS property from the element        | `selector`, `check`, `timeout`, `name`                                   |
| `set-element-property` | Assign a JS property on the element           | `selector`, `check`, `timeout`, `name`, `value`                          |
| `set-attribute`      | Set several attributes on an element             | `selector`, `check`, `timeout`, `attributes: { name: value, ... }`       |
| `scroll-into-view`   | Scroll an element into view                      | `selector`, `check`, `timeout`                                           |
| `redirect`           | Navigate to an element's URL                     | `selector`, `check`, `timeout`, `property` (default `"href"`)            |

`click`, `remove-element`, `remove-element-property`, `set-element-property`, `set-attribute`, `scroll-into-view`, and `redirect` target an element; omit `selector` to act on `ctx.lastElement`. `click`'s `once`/`times`/`delay` behavior is unchanged:

- `once: true` — click only on the first visit (tracked per host + path + selector in `sessionStorage`).
- `times` (default 1), `delay` (default 500 ms) — repeat the click; waits again before each repeat.

`remove-element-property` performs `delete node[name]` on the target element, e.g. clearing a page-set JS flag that isn't an attribute:

```js
{ do: "remove-element-property", selector: "#busy", name: "isLoading" }
```

`set-element-property` assigns a JS property on the target element — `node[name] = value`. `value` may be a string, number, or boolean. It pairs with `remove-element-property` just as `set-attribute` pairs with `remove-element`:

```js
{ do: "set-element-property", selector: "#dl", name: "href", value: "/final" }
{ do: "set-element-property", selector: "#toggle", name: "checked", value: true }
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

### Defaults (when an option is omitted)

| Verb              | Option            | Default            |
| ----------------- | ----------------- | ------------------ |
| _element wait_    | `timeout`         | `10_000` ms        |
| `click`           | `times`           | `1`                |
|                   | `delay`           | `500` ms           |
|                   | `once`            | `false`            |
| `sleep`           | `ms`              | `1000`             |
| `redirect`        | `property`        | `"href"`           |

No default: `set-attribute`'s `attributes`, `set-element-property`'s `name` + `value`, and `remove-element-property`'s `name` — without them the verb logs a warning and does nothing.

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

Freezes a global property so the page can't overwrite it:

```js
{ do: "set-property", chain: "window.count", value: 0 }
```

`chain` accepts a leading `window.`; each segment is a path walked from `window`.

No default: `set-property` requires both `chain` and `value`.

### tune-timer

Shortens `setTimeout`/`setInterval` delays, and optionally virtualizes `Date`:

```js
{
	do: "tune-timer",
	match:     { delay: 1000, callback: "functionName" }, // what to affect
	transform: { factor: 20, patchDate: false }           // timeout / factor (+ optional Date virtualization)
}
```

- `match.delay` — an **exact numeric value**. If omitted, matches **any** delay.
- `match.callback` — a **string** (substring of the function source) or a **RegExp**. If omitted, matches **any** callback.
- `transform.factor` — **default `20`.** The timer delay is divided by this factor (`timeout / factor`).
- `transform.patchDate` — **default `false`.** When `true`, also virtualizes `Date` (`new Date()`, `Date()`, `Date.now()`) inside matched timer callbacks, accelerating time-based checks alongside the timer. When omitted or `false`, `Date` is left untouched.

> Note: hosts with server-side timer validation (tpi.li, oii.la, pahe.plus) must **not** use this patch — the timer must run for its full duration.

---

## Worked example

A complete host entry combining a patch, a captcha-gated rule, and an enabled-button click with a multi-reader wait:

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
		}
	]
}
```

---

## Behavior summary

- Rules are evaluated in order; the **first** one that holds wins (a rule with an empty `matches` wins immediately).
- **`path`** is re-checked on **every poll** (never settled — the URL can change on SPA navigation); a false `path` skips the rule in that iteration. The engine polls all `matches` clauses for up to **120 s**.
- Steps are **imperative verbs** — there are no condition-wait steps (the only wait step is a fixed `sleep`). Any condition that must hold before acting goes in `matches`; mid-flow gates are split into separate rules.
- An element-targeting step auto-waits on its own `selector`/`check` up to the step's `timeout` (default **10 s**).
- A `check` list is AND over the **same node**; separate clauses are AND over the page state.
- All timers are clock-safe (immune to page-level `setTimeout` tampering).
- An **unknown patch** in a host's `patches` list fails fast at startup: `main()` throws `Unknown patch '...'` before any rule runs.
- An **unknown step verb**, an **invalid `matches` condition** or an **invalid `check` entry** never throws: each is logged and treated as *not matching* — the step is skipped and execution continues (verbs), or the clause/check reports false and the rule does not match.
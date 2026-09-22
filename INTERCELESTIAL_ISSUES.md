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
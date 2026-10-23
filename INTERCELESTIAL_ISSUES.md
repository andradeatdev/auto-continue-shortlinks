**English** • [Português (BR)](INTERCELESTIAL_ISSUES.pt-BR.md)

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

## Waterfox returns "Ad blocker or auto-click script detected"

If you're using Waterfox with built-in adblocker, you may see the following error:

> Ad blocker or auto-click script detected

The site makes a bait request to its backend to check whether the page can load an ad
resource. The script patches the page's request API so it can re-issue that request when an
extension blocks it, and the backend then sees an ad-enabled load.

Waterfox's built-in ad blocker also filters requests issued by extensions and userscripts —
not only the ones made by the page itself. So the re-issued request is blocked as well, the
backend never sees the bait answered, and the page returns the detection error above even
with this script installed.

### Fix: allow only the site's bait requests

Add this exception filter to the Waterfox built-in ad blocker:

@@||intercelestial.com^$1p,xhr

`@@` is an exception (allow) rule, `||intercelestial.com^` scopes it to this domain, `$1p` to
first-party requests and `$xhr` to XHR/`fetch`. Regular ads stay blocked, only the bait
probe is let through.

#### Is it only Waterfox?

Open the same shortlink in another browser (Firefox, Brave, etc...) with the same userscript
manager installed:

- **Detection also appears there** → the site changed its detection code, not a Waterfox
  problem. Open an issue with the shortlink URL and the exact message.
- **Detection appears only in Waterfox** → the browser's built-in ad blocker is filtering the
  requests. Apply the exception filter above (or disable the built-in ad blocker for
  `intercelestial.com`) and reload.
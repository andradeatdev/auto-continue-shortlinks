# intercelestial.com Issues

**English** · [Português (BR)](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/docs/INTERCELESTIAL_ISSUES.pt-BR.md)

Host-specific problems and fixes for intercelestial.com. For general problems, see [TROUBLESHOOTING.md](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/docs/TROUBLESHOOTING.md).

## Table of Contents

- [Skipping the "Tap Continue to go on" page](#skipping-the-tap-continue-to-go-on-page)
  - [1. Install a header-injection extension](#1-install-a-header-injection-extension)
  - [2. Add the rule](#2-add-the-rule)
  - [3. Verify](#3-verify)
- [Waterfox: "Ad blocker or auto-click script detected"](#waterfox-ad-blocker-or-auto-click-script-detected)
  - [Why it happens](#why-it-happens)
  - [Fix: allow only the site's bait requests](#fix-allow-only-the-sites-bait-requests)
  - [Is it only Waterfox?](#is-it-only-waterfox)

## Skipping the "Tap Continue to go on" page

![Intercelestial — skipping the "Tap Continue to go on" page](https://github.com/user-attachments/assets/99f00c4c-ea91-47ca-8ca2-f1f033ee3ec5)

The page is returned when the backend server doesn't receive the `Sec-Fetch-User: ?1` header. The browser only sends it when the user interacts with the page, or when an API or extension modifies the request headers.

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
  - `Sec-Fetch-User: ?1` — the only one strictly needed.
  - `Sec-Fetch-Mode: navigate`, `Sec-Fetch-Dest: document` and `Sec-Fetch-Site: same-origin` — optional. The browser already sends these on native submits; setting them makes the rule independent of how the POST is triggered.

> [!WARNING]
> **Keep the rule scoped to `intercelestial.com`. Never make it global.**
> `Sec-Fetch-User: ?1` asserts that a user gesture started the navigation. Forging it for all origins misrepresents user activation to every site you visit, and can break hosts that use these headers for their own heuristics.

### 3. Verify

- **Without any header injection (default):** the gate ends on the "Tap Continue to go on" page, and one real tap completes it. This is the expected behavior and there is nothing to fix.
- **With the injection (extension):** the gate redirects straight to the destination, with no Tap page and no extra click.
- **Either way**, a "Please turn off the auto-click script" response means a purely programmatic submit reached the server (missing `?1` **and** implausible behavior fields).

## Waterfox: "Ad blocker or auto-click script detected"

If you use Waterfox with its built-in ad blocker, you may see this error:

> Ad blocker or auto-click script detected

### Why it happens

The site makes a bait request to its backend to check whether the page can load an ad resource. The script patches the page's request API so it can re-issue that request when an extension blocks it, and the backend then sees an ad-enabled load.

Waterfox's built-in ad blocker also filters requests issued by extensions and userscripts, not only the ones made by the page itself. So the re-issued request is blocked as well, the backend never sees the bait answered, and the page returns the detection error even with this script installed.

### Fix: allow only the site's bait requests

Add this exception filter to the Waterfox built-in ad blocker:

```
@@||intercelestial.com^$1p,xhr
```

How the filter is built:

- `@@` makes it an exception (allow) rule.
- `||intercelestial.com^` scopes it to this domain.
- `$1p` limits it to first-party requests.
- `xhr` limits it to XHR/`fetch` requests.

Regular ads stay blocked: only the bait probe is let through.

### Is it only Waterfox?

Open the same shortlink in another browser (Firefox, Brave, etc.) with the same userscript manager installed:

- **Detection also appears there:** the site changed its detection code, so it is not a Waterfox problem. Open an issue with the shortlink URL and the exact message.
- **Detection appears only in Waterfox:** the browser's built-in ad blocker is filtering the requests. Apply the exception filter above (or disable the built-in ad blocker for `intercelestial.com`) and reload.
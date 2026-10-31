# Pahe - Auto Continue Links

**English** · [Português (BR)](README.pt-BR.md)

[![Install on Greasy Fork](https://img.shields.io/badge/Install-Greasy_Fork-670000?style=flat-square)](https://greasyfork.org/scripts/593212)
[![Greasy Fork version](https://img.shields.io/greasyfork/v/593212?style=flat-square&label=version)](https://greasyfork.org/scripts/593212)
[![Greasy Fork installs](https://img.shields.io/greasyfork/dt/593212?style=flat-square&label=installs)](https://greasyfork.org/scripts/593212)
[![Greasy Fork rating](https://img.shields.io/greasyfork/rating-count/593212?style=flat-square&label=rating)](https://greasyfork.org/scripts/593212)
[![License](https://img.shields.io/github/license/andradeatdev/auto-continue-shortlinks?style=flat-square&logo=gnu)](LICENSE)
[![Supported hosts](https://img.shields.io/badge/hosts-78%20supported-2EA44F?style=flat-square)](HOSTS.md)

## Table of Contents
 
- [Pahe - Auto Continue Links](#pahe---auto-continue-links)
- [Supported Hosts](#supported-hosts)
- [Bypass Cache](#bypass-cache)
- [Timer Acceleration](#timer-acceleration)
- [Privacy](#privacy)
- [Script Menu](#script-menu)
- [Limitations](#limitations)
- [Troubleshooting](#troubleshooting)
- [Report an Issue / Request a New Host](#report-an-issue--request-a-new-host)
- [License](#license)
---
 
This userscript automates shortlinks on pahe.ink and other sites that use the same hosts. It works with [Violentmonkey](https://violentmonkey.github.io/) and Tampermonkey, and more hosts will be added over time.
 
## Supported Hosts
 
See [HOSTS.md](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/docs/HOSTS.md) for the full list of supported hosts.
 
## Bypass Cache
 
The script uses a Cloudflare Worker (`https://shortlinks.zencore.fun`) as a shared cache. When a shortlink has already been bypassed by another user, you go straight to the final URL.
 
- **Reading:** when you open a supported shortlink (`tpi.li`, `oii.la`, `intercelestial.com`, `pahe.plus`), the script asks the Worker whether the final destination is already known. If it is, the script navigates straight there and skips the timer.
- **Writing:** when your navigation reaches a final file host (`send.now`, `mega.nz`, ...), the script sends the shortlink you visited and the destination you reached to the Worker, so later visits to the same shortlink go directly to the destination.
## Timer Acceleration
 
Where possible, the script speeds up the wait timer on shortlink pages.
 
Some hosts validate the timer on the server side. On those sites the timer **cannot be accelerated**: the script can still automate other steps (clicks, removing unnecessary elements), but the timer has to run for its full duration. Hosts marked with `tuner-timer` in [HOSTS.md](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/docs/HOSTS.md) are the ones where this applies.
 
## Privacy
 
The only data shared with the Worker (see [Bypass Cache](#bypass-cache)) is:
 
- The shortlink URL you are visiting.
- The destination URL your navigation reached.
No other data is sent. To opt out, turn off **Use cache** in the [script menu](#script-menu), either globally or for a single domain.
 
## Script Menu
 
If your userscript manager supports menu commands, the following options are available:
 
| Command | What it does | Default |
|---|---|---|
| **Use cache** | Toggles the [bypass cache](#bypass-cache). Has a per-domain override (`This domain`). | On |
| **Use continue** | Toggles the continue/click automation on links. Has a per-domain override (`This domain`). | On |
| **Use patcher** | Toggles the patcher fix/speedup. Has a per-domain override (`This domain`). | On |
| **▶ Report URL issue** | Opens the GitHub **site broken** report form in a new tab. | – |
| **▶ Support a new shortlink/host** | Opens the GitHub **site request** form in a new tab. | – |
 
The three toggles show their state with an icon: **✔** active, **✘** off, **–** disabled globally. Clicking a toggle changes it and reloads the current page. The two **▶** commands only open a form: they have no state and don't reload the page.
 
## Limitations
 
- This script **does not solve CAPTCHAs**. It only automates clicks, removes unnecessary elements and performs other simple actions. **You still need to solve the CAPTCHA manually.** See [CAPTCHAS.md](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/docs/CAPTCHAS.md), including how to use the hCaptcha accessibility cookie.
- Some sites validate the timer on the server and **can't be accelerated** (see [Timer Acceleration](#timer-acceleration)).
- pahe.ink sometimes adds new domains, so the script may not work on very new sites. You can try adding them manually or wait for the next update.
- Using an ad blocker such as uBlock Origin or AdGuard is recommended.

## Troubleshooting
 
Common problems and their fixes (script not doing anything, CAPTCHAs, timers, the cache and host-specific issues such as intercelestial.com) are in [TROUBLESHOOTING.md](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/docs/TROUBLESHOOTING.md).

## Report an Issue / Request a New Host
 
- **A site stopped working:** use the **Report URL issue** command in the script menu, or open the [Site stopped working](https://github.com/andradeatdev/auto-continue-shortlinks/issues/new?template=site-broken.yml) form.
- **A new site should be supported:** open a [Support a new site](https://github.com/andradeatdev/auto-continue-shortlinks/issues/new?template=site-request.yml) issue.

## License
 
**GPL-3.0** — © 2024-2026 hdyzen (andradeatdev). If you copy, modify or redistribute this script, you must keep the copyright notice and the source code under GPL-3.0. See [LICENSE](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/LICENSE).

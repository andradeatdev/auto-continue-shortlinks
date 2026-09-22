# Pahe - Auto Continue Links

**English** · [Português (BR)](README.pt-BR.md)

[![Install on Greasy Fork](https://img.shields.io/badge/Install-Greasy_Fork-670000?flat-square)](https://greasyfork.org/scripts/593212)
[![License](https://img.shields.io/github/license/andradeatdev/auto-continue-shortlinks?flat-square&logo=gnu)](LICENSE)
[![Greasy Fork version](https://img.shields.io/greasyfork/v/593212?style=flat-square&label=version)](https://greasyfork.org/scripts/593212)
[![Greasy Fork installs](https://img.shields.io/greasyfork/dt/593212?style=flat-square&label=installs)](https://greasyfork.org/scripts/593212)
[![Greasy Fork rating](https://img.shields.io/greasyfork/rating-count/593212?style=flat-square&label=rating)](https://greasyfork.org/scripts/593212)
[![Userscript managers](https://img.shields.io/badge/managers-Violentmonkey%20%7C%20Tampermonkey-00485B?style=flat-square)](https://violentmonkey.github.io/)
[![Supported hosts](https://img.shields.io/badge/hosts-49%20supported-2EA44F?style=flat-square)](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/HOSTS.md)

This script automates shortlinks on pahe.ink and other sites that use the same hosts. More hosts will be added over time.

#### Instant Bypass Cache

The script uses a Cloudflare Worker (`https://shortlinks.fdyzen.workers.dev`) as a shared cache to make bypasses go straight to the final URL when the shortlink was already bypassed by other users:

- When you open a supported shortlink (`tpi.li`, `oii.la`, `intercelestial.com`, `pahe.plus`), the script asks the Worker whether the final destination for that shortlink is already known. If so, it navigates straight there, skipping the timer/wait.
- When your navigation reaches a final file host (`send.now`, `mega.nz`, ...), the script sends the visited shortlink URL and the reached destination URL to the Worker so other users' visits to the same shortlink go directly to the destination.

For this to work, the following data is shared with the Worker:

- The shortlink URL you are visiting.
- The destination URL your navigation reached.

This data is stored in Cloudflare KV, used only to serve the saved destination back on future visits (yours and other users'), and is **not** shared with third parties. The feature can be disabled by editing `CONFIG.WORKER_URL` (set it to empty) in the script.

#### Supported Hosts

See [HOSTS.md](HOSTS.md) for the full list of supported hosts.

#### Timer Acceleration

Some hosts perform server-side timer validation. For these sites, the timer **cannot be accelerated** by the script — see [HOSTS.md](HOSTS.md) for details.

The script can still automate other parts of the process on these sites, but the timer must run for its required duration.

#### Notes

> Intercelestial.com actively updates its detection code. I recommend finding other ways to find the movie/series you’re looking for, since I can only fix it when I have time.

- **I recommend using an ad blocker, such as uBlock Origin or Adguard.**
- This script **does not** solve **CAPTCHAs**. It only automates clicks, removes unnecessary elements, and performs other simple actions when possible. **You still need to solve the CAPTCHA manually**.
- Somes sites **can't be timer accelerated**, the timer validation is done on the server side, to see what sites have `tuner-timer`, see [HOSTS.md](HOSTS.md).
- Pahe.ink add news domains sometimes, so the script may not work on some new sites, you can try to **add them manually or wait for the next update**.
- Interestial.com return invalid session if you open multiple tabs, **this issue is not related to this script**.

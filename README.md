# Pahe - Auto Continue Links

This script automates shortlinks on pahe.ink and other sites that use the same hosts. More hosts will be added over time.

The goal is to make the script rule-based, so anyone with some knowledge of JavaScript, HTML, and CSS can create their own rules and share them with others.

#### Instant Bypass Cache

The script uses a Cloudflare Worker (`https://shortlinks.fdyzen.workers.dev`) as a shared cache to make bypasses go straight to the final URL when the shortlink was already bypassed by other users:

- When you open a supported shortlink (`tpi.li`, `oii.la`), the script asks the Worker whether the final destination for that shortlink is already known. If so, it navigates straight there, skipping the timer/wait.
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

> Intercelestial.com actively updates its detection code. One of the detection validates `Sec-Fetch-*`
> headers — which the browser only sets on requests triggered by **real user activation** — so
> the script alone is **not enough** to make it work there: a header-injection extension is
> required. See [INTERCELESTIAL_ISSUES.md](INTERCELESTIAL_ISSUES.md) for the full breakdown and
> setup instructions.

- **I recommend using an ad blocker, such as uBlock Origin or Adguard.**
- This script **does not** solve **CAPTCHAs**. It only automates clicks, removes unnecessary elements, and performs other simple actions when possible. **You still need to solve the CAPTCHA manually**.
- Somes sites **can't be timer accelerated**, the timer validation is done on the server side, to see what sites have `tuner-timer`, see [HOSTS.md](HOSTS.md).
- Pahe.ink add news domains sometimes, so the script may not work on some new sites, you can try to **add them manually or wait for the next update**.
- Interestial.com return invalid session if you open multiple tabs, **this issue is not related to this script**.

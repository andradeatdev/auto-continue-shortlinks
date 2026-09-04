# Pahe - Auto Continue Links

This script automates shortlinks on pahe.ink and other sites that use the same hosts. More hosts will be added over time.

The goal is to make the script rule-based, so anyone with some knowledge of JavaScript, HTML, and CSS can create their own rules and share them with others.

#### Supported Hosts

See [HOSTS.md](HOSTS.md) for the full list of supported hosts.

#### Timer Acceleration

Some hosts perform server-side timer validation. For these sites, the timer **cannot be accelerated** by the script — see [HOSTS.md](HOSTS.md) for details.

The script can still automate other parts of the process on these sites, but the timer must run for its required duration.

#### Notes

- **I recommend using an ad blocker, such as uBlock Origin or Adguard.**
- This script **does not** solve **CAPTCHAs**. It only automates clicks, removes unnecessary elements, and performs other simple actions when possible. **You still need to solve the CAPTCHA manually**.
- Intercelestial.com updated to check if user is using a autoclicker, for now exists a workaround to bypass the detection, but it's can change in the future, be aware.
- Somes sites **can't be timer accelerated**, the timer validation is done on the server side, to see what sites have `tuner-timer`, see [HOSTS.md](HOSTS.md).
- Pahe.ink add news domains sometimes, so the script may not work on some new sites, you can try to **add them manually or wait for the next update**.
- Interestial.com return invalid session if you open multiple tabs, **this issue is not related to this script**.

### Pahe - Auto Continue Links

This script automates shortlinks on pahe.ink and other sites that use the same hosts. Only a few hosts are supported for now, but more will be added over time.

The goal is to make the script rule-based, so anyone with some knowledge of JavaScript, HTML, and CSS can create their own rules and share them with others.

#### Supported Hosts

The following hosts are currently supported:

- tpi.li
- oii.la
- ssdhostting.com
- selfhostt.com
- intercelestial.com
- pahe.plus
- ouo.io
- ouo.press

#### Timer Acceleration

Some hosts perform server-side timer validation. For these sites, the timer **cannot be accelerated** by the script:

- tpi.li
- oii.la
- pahe.plus

The script can still automate other parts of the process on these sites, but the timer must run for its required duration.

#### Important

This script **does not** solve CAPTCHAs. It only automates clicks, removes unnecessary elements, and performs other simple actions when possible. You still need to solve the CAPTCHA manually.

**I recommend using an ad blocker, such as uBlock Origin or Adguard.**

#### Contributing

1. If you create a new rule and would like to share it, use open a **Pull Request** on **Comments** tab on GreasyFork..
2. If you implement a useful new `action` for handling pages, feel free to share it in a **Pull Request** on **Comments** tab on GreasyFork.
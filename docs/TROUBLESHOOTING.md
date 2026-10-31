# Troubleshooting

**English** · [Português (BR)](TROUBLESHOOTING.pt-BR.md)

## Table of Contents

- [The script does nothing on a page](#the-script-does-nothing-on-a-page)
- [A CAPTCHA appears](#a-captcha-appears)
- [The timer is not accelerated](#the-timer-is-not-accelerated)
- [A new pahe.ink domain doesn't work](#a-new-paheink-domain-doesnt-work)
- [The cache sends me to a wrong or broken destination](#the-cache-sends-me-to-a-wrong-or-broken-destination)
- [intercelestial.com](#intercelestialcom)
- [Still not working?](#still-not-working)

## The script does nothing on a page

1. Make sure the script is enabled in your userscript manager ([Violentmonkey](https://violentmonkey.github.io/) or Tampermonkey).
2. Open the script menu and check that **Use continue** and **Use patcher** are active (✔), both globally and for **This domain**. See the [script menu](README.md#script-menu).
3. Check that the host is in the [supported hosts](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/docs/HOSTS.md) list.
4. If you use an ad blocker or privacy extension, try disabling it for that page to see if it interferes.

## A CAPTCHA appears

The script **does not solve CAPTCHAs**: you need to solve them manually. For hCaptcha, you can reduce how often this happens with the accessibility cookie. See [CAPTCHAS.md](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/docs/CAPTCHAS.md).

## The timer is not accelerated

Some hosts validate the timer on the server, so it **cannot be accelerated**. The script still automates the other steps, but the timer has to run for its full duration. Hosts marked with `tuner-timer` in [HOSTS.md](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/docs/HOSTS.md) are the ones where this applies.

## A new pahe.ink domain doesn't work

pahe.ink sometimes adds new domains, so the script may not work on very new sites. You can try adding the domain manually in your userscript manager, or wait for the next update. If the host isn't supported yet, [request it](README.md#report-an-issue--request-a-new-host).

## The cache sends me to a wrong or broken destination

To check whether the cache is the cause, turn off **Use cache** in the script menu (globally or for **This domain**) and try the shortlink again. If it works without the cache, please [report the shortlink](README.md#report-an-issue--request-a-new-host).

## intercelestial.com

- intercelestial.com actively updates its detection code, so fixes may take some time. If possible, look for other ways to find the movie or series you want.
- Known problems, such as the "Tap Continue to go on" page and the Waterfox "Ad blocker or auto-click script detected" warning, are documented in [INTERCELESTIAL_ISSUES.md](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/docs/INTERCELESTIAL_ISSUES.md).
- intercelestial.com returns **"invalid session"** if you open multiple tabs. This is **not related to this script**: keep only one tab open for the shortlink.

## Still not working?

Use the **Report URL issue** command in the script menu, or open the [Site stopped working](https://github.com/andradeatdev/auto-continue-shortlinks/issues/new?template=site-broken.yml) form. Include the URL of the shortlink, your browser and your userscript manager.
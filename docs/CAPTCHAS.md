# CAPTCHAs

**English** · [Português (BR)](/docs/CAPTCHAS.pt-BR.md)

## Table of Contents

- [Manual action required](#manual-action-required)
- [hCaptcha](#hcaptcha)
  - [Accessibility cookie](#accessibility-cookie)
  - [Setting it up](#setting-it-up)
  - [If the challenge still appears](#if-the-challenge-still-appears)

## Manual action required

This script **does not solve CAPTCHAs** and has no plans to. It only automates clicks, removes unnecessary elements and performs other simple actions on shortlink pages.

Whenever a shortlink shows a CAPTCHA, **you need to solve it manually**. After you solve it, the script continues the process on its own.

## hCaptcha

Many of the supported hosts use [hCaptcha](https://www.hcaptcha.com/).

### Accessibility cookie

hCaptcha offers an accessibility option that can reduce or remove the need to solve visual challenges. After you register, hCaptcha gives you an encrypted cookie for your browser. Depending on each site's settings, the cookie lets you pass automatically or presents an accessibility challenge instead.

This feature is intended as an accommodation for people who have difficulty completing visual challenges. Check hCaptcha's own [accessibility page](https://www.hcaptcha.com/learning/accessibility/hcaptcha-accessibility/) to see whether it applies to you.

### Setting it up

1. Open <https://dashboard.hcaptcha.com/welcome_accessibility>.
2. If you don't have an account yet, create one and verify your email. If you already have one, just log in.
3. On the **Set Cookie** page, click the **Set Cookie** button.
4. Visit a page that shows hCaptcha. You should now pass automatically or get an accessibility challenge.

![hCaptcha accessibility page](/docs/images/hcaptcha-accessibility.png)

Things to know:

- The cookie is stored **per browser/device**. If you use several devices, log in and click **Set Cookie** on each one.
- The cookie must be **refreshed periodically**: log in and click **Set Cookie** again when the challenge comes back.
- The cookie can be used several times per day, but it is not unlimited. hCaptcha says this method is strictly rate limited, and you may need to wait if unusual behavior is detected from your computer.
- It only works while hCaptcha is allowed to set and read cookies on the sites you visit.

### If the challenge still appears

The accessibility cookie is a cross-site cookie (it belongs to `hcaptcha.com` but is read on other sites), so privacy tools often block it:

- **Ad blockers and privacy extensions** (uBlock Origin, AdGuard, etc.): allow `hcaptcha.com` and `*.hcaptcha.com`.
- **Firefox:** if Enhanced Tracking Protection has the cookie option set to **Isolate cross-site cookies**, the CAPTCHA iframe will not send the accessibility cookie. In that case you may need to set cookies to **Allow all cookies**, or turn off Enhanced Tracking Protection for the `hcaptcha.com` domain and for the site where you are completing the CAPTCHA.
- **Safari and Brave:** these block cross-site cookies by default. Allow cookies for `hcaptcha.com` or turn off cross-site tracking prevention (hCaptcha's accessibility page has instructions).
- **Cookie expired:** log in to the hCaptcha dashboard and click **Set Cookie** again.

For other problems, contact hCaptcha support through their accessibility page.
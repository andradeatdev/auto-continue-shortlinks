export const RULES = {
    TPI_OII: {
        rules: [
            {
                matches: [
                    { when: "element", selector: "[name='cf-turnstile-response']", check: { attribute: "value", value: "nonEmpty" } },
                ],

                steps: [
                    { do: "click", selector: "button#continue" },
                ],
            },
            {
                matches: [
                    { when: "element", selector: "a.get-link" },
                ],

                steps: [
                    { do: "click", selector: "a.get-link:not(.disabled)", timeout: 20_000 },
                ],
            },
        ],
    },
    HOSTING: {
        rules: [
            {
                steps: [
                    { do: "click", selector: "a#startButton" },
                    { do: "click", selector: "button#getnewlink" },
                ],
            },
        ],
    },
    OUO: {
        rules: [
            {
                steps: [
                    { do: "click", selector: "#btn-main:not(.disabled)", check: { attribute: "class", value: "nonEmpty" }, timeout: 20_000 },
                ],
            },
        ],
    },
    LINEGEE: {
        rules: [
            {
                steps: [
                    {
                        do: "sleep",
                        ms: 6000,
                    },
                    {
                        do: "redirect",
                        selector: "script",
                        check: { property: "textContent", value: { contains: "atob(" } },
                        property: "textContent",
                        transform: [
                            { op: "extract", pattern: /atob\('([^']+)'\)/, group: 1 },
                            { op: "base64-decode" },
                        ],
                    },
                ],
            },
        ],
    },
    INTERCELESTIAL: {
        rules: [
            {
                matches: [{ when: "not", clause: { when: "path", value: "/" } }],
                steps: [
                    { do: "click", selector: ":not(form) button.myButton", times: 2 },
                    {
                        do: "submit-via-gm",
                        selector: "form#xxc",
                        headers: {
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "Accept-Language": "en-US,en;q=0.9",
                            "Origin": "https://intercelestial.com",
                            "Referer": "https://intercelestial.com/",
                            "Upgrade-Insecure-Requests": "1",
                            "Sec-Fetch-Dest": "document",
                            "Sec-Fetch-Mode": "navigate",
                            "Sec-Fetch-Site": "same-origin",
                            "Sec-Fetch-User": "?1",
                        },
                        writeRedirect: true,
                    },
                    { do: "click", selector: "form button.myButton" },
                ],
            },
            {
                matches: [
                    { when: "path", value: "/" },
                ],

                steps: [
                    {
                        do: "click",
                        selector: ":not(form) button.myButton",
                    },
                    {
                        do: "submit-via-gm",
                        selector: "form#xxc",
                        headers: {
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "Accept-Language": "en-US,en;q=0.9",
                            "Origin": "https://intercelestial.com",
                            "Referer": "https://intercelestial.com/",
                            "Upgrade-Insecure-Requests": "1",
                            "Sec-Fetch-Dest": "document",
                            "Sec-Fetch-Mode": "navigate",
                            "Sec-Fetch-Site": "same-origin",
                            "Sec-Fetch-User": "?1",
                        },
                        writeRedirect: true,
                    },
                    { do: "click", selector: "form button.myButton" },
                ],
            },
        ],
    },
    PAHE_PLUS: {
        rules: [
            {
                matches: [
                    { when: "element", selector: "[data-hcaptcha-response]" },
                ],

                steps: [
                    {
                        do: "click",
                        selector: "button#invisibleCaptchaShortlink:not([disabled])",
                        check: { attribute: "disabled", value: "absent" },
                        timeout: 120_000,
                    },
                ],
            },
            {
                matches: [
                    { when: "element", selector: ".get-link" },
                ],

                steps: [
                    { do: "click", selector: ".get-link:not(.disabled)" },
                ],
            },
        ],
    },
    ADFOC: {
        patches: [
            {
                do: "set-property",
                chain: "count",
                value: 0,
            },
        ],

        rules: [
            {
                matches: [
                    { when: "element", selector: "#showSkip:not([style*='display: none'])" },
                ],

                steps: [
                    { do: "click", selector: "a.skip" },
                ],
            },
        ],
    },
    VEXFILE: {
        rules: [
            {
                steps: [
                    { do: "click", selector: ".generate-link:not(.blocked)" },
                    {
                        do: "redirect",
                        selector: ".generate-link[target='_blank']",
                        check: { attribute: "href", value: "nonEmpty" },
                    },
                ],
            },
        ],
    },
    FILES_PAYOUTS: {
        patches: [
            {
                do: "tune-timer",
                match: {
                    delay: 1000,
                },
                transform: [{ op: "multiplier", by: 0.05 }],
            },
        ],

        rules: [
            {
                matches: [
                    { when: "element", selector: "#method_free" },
                ],

                steps: [
                    { do: "click", selector: "#method_free" },
                ],
            },
            {
                matches: [
                    { when: "element", selector: "[name='cf-turnstile-response']", check: { attribute: "value", value: "nonEmpty" } },
                ],

                steps: [
                    {
                        do: "click",
                        selector: "#downloadbtn",
                        check: { attribute: "disabled", value: "absent" },
                        once: true,
                    },
                ],
            },
        ],
    },
    MODSFIRE: {
        rules: [
            {
                steps: [
                    {
                        do: "click",
                        selector: ".download-button",
                        check: { attribute: "href", value: "nonEmpty" },
                        times: 2,
                    },
                ],
            },
        ],
    },
    FILE_UPLOAD: {
        rules: [
            {
                matches: [
                    { when: "element", selector: "button[name='method_free']" },
                ],

                steps: [
                    { do: "click", selector: "button[name='method_free']" },
                ],
            },
            {
                matches: [
                    { when: "element", selector: "[data-hcaptcha-response]", check: { attribute: "data-hcaptcha-response", value: "nonEmpty" } },
                ],

                steps: [
                    {
                        do: "click",
                        selector: "#downloadbtn:not([disabled])",
                        check: { attribute: "disabled", value: "absent" },
                        timeout: 30_000,
                    },
                ],
            },
        ],
    },
    DJXMAZA: {
        rules: [
            {
                matches: [
                    { when: "ready-state", value: "interactive" },
                    { when: "element", selector: "#gdl:not([style*='display: none'])" },
                ],

                steps: [
                    { do: "click", selector: "#gdl:not([style*='display: none'])" },
                    { do: "sleep", ms: 2000 },
                    { do: "click", selector: "#gdlf:not([style*='display: none'])" },
                ],
            },
            {
                matches: [
                    { when: "ready-state", value: "interactive" },
                    { when: "element", selector: "#dln" },
                ],

                steps: [
                    { do: "click", selector: "#dln" },
                ],
            },
        ],
    },
    UPFILESGO: {
        rules: [
            {
                matches: [
                    { when: "element", selector: "[name='cf-turnstile-response']", check: { attribute: "value", value: "nonEmpty" } },
                ],

                steps: [
                    { do: "click", selector: "#link-button:not([disabled])" },
                ],
            },
            {
                matches: [
                    { when: "element", selector: "#countdown" },
                ],

                steps: [
                    { do: "click", selector: "#link-button:not(.disabled)" },
                ],
            },
            {
                matches: [
                    { when: "element", selector: "#link-button-free" },
                ],

                steps: [
                    { do: "click", selector: "#link-button-free:not([disabled])" },
                ],
            },
        ],
    },
    SAFEFILEKU: {
        patches: [
            {
                do: "tune-timer",
                match: {
                    delay: 500,
                    callback: "new Date().getTime()",
                },
                transform: [{ op: "multiplier", by: 0.05 }],
                patchDate: true,
            },
        ],

        rules: [
            {
                matches: [
                    { when: "element", selector: "[name='cf-turnstile-response']", check: { attribute: "value", value: "nonEmpty" } },
                ],

                steps: [
                    { do: "click", selector: "button[type='submit']" },
                ],
            },
            {
                matches: [
                    { when: "element", selector: "#download" },
                ],

                steps: [
                    {
                        do: "click",
                        selector: "#download[class*='bg-green']",
                        check: { attribute: "class", value: "nonEmpty" },
                        timeout: 20_000,
                    },
                ],
            },
        ],
    },
};

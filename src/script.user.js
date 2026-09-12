// ==UserScript==
// @name               Pahe - Auto continue links
// @namespace          https://greasyfork.org/users/821661
// @version            0.0.13
// @description        Auto-continues shortlinks (pahe and similar hosts): clicks continue/download buttons, speeds up timers, and stores reached destinations on Cloudflare Worker for instant next-time access.
// @author             hdyzen
//
// From: Pahe
// @match              https://tpi.li/*
// @match              https://oii.la/*
//
// @match              https://ssdhostting.com/*
// @match              https://selfhostt.com/*
// @match              https://financeehelp.com/*
// @match              https://cloudhostt.com/*
// @match              https://linegee.net/*
// @match              https://financeguidz.com/*
//
// @match              https://intercelestial.com/*
// @match              https://pahe.plus/*
//
// @match              https://ouo.io/*
// @match              https://ouo.press/*
//
// From: PlatinMods
// @match              https://vexfile.com/*
// @match              https://filespayouts.com/*
// @match              https://modsfire.com/*
// @match              https://www.file-upload.org/*
// @match              https://djxmaza.in/*
// @match              https://smartfeecalculator.com/*
// @match              https://gujjukhabar.in/*
// @match              https://pdfhindibook.com/*
// @match              https://upfilesgo.com/*
// @match              https://safefileku.com/*
// @match              https://uploadrar.com/*
// 
// Hosting
// @match              https://send.now/*
//
// @run-at             document-start
// @icon               https://www.google.com/s2/favicons?domain=pahe.ink
// @grant              GM_xmlhttpRequest
// @grant              GM_openInTab
// @grant              unsafeWindow
// @connect            shortlinks.fdyzen.workers.dev
//
// @license            GPL-3.0
// @homepageURL        https://github.com/andradeatdev/auto-continue-shortlinks/
// ==/UserScript==

const w = typeof unsafeWindow === "undefined" ? globalThis : unsafeWindow;

const CONFIG = {
    TIMEOUT_INTERVAL: 250,
    PATCH_TIMER_FACTOR: 0.05,
    WORKER_URL: "https://shortlinks.fdyzen.workers.dev",
    TOKEN_UUID: crypto.randomUUID(),
    FINAL_DOMAINS: [
        "send.now",
        "1fichier.com",
        "1024tera.com",
        "gdflix.io",
        "gdflix.dev",
        "mega.nz",
        "vik1ngfile.site",
        "pahe.plus",
    ],
    ORIGIN_DOMAINS: [
        "tpi.li",
        "oii.la",
        "intercelestial.com",
        "pahe.plus",
    ],
    SHORTLINK_PATTERNS: {
        "tpi.li": /^https:\/\/tpi\.li\/[A-Za-z0-9_-]{3,}$/,
        "oii.la": /^https:\/\/oii\.la\/[A-Za-z0-9_-]{3,}$/,
        "pahe.plus": /^https:\/\/pahe\.plus\/[A-Za-z0-9_-]{3,}$/,
    },
    TOKEN_URL_KEY: "pahe-acl-9d2f1c3e-4b7a-4e98-8c21-5f6d0a9b7c34",
};

const TEMPLATES = {
    TPI_OII: () => {
        justClick("#continue:not([disabled])");
        justClick(".get-link[href]:not(.disabled)");
    },
    HOSTING: () => {
        patchInterval();

        justRemove("#page > div", { text: "detected" });
        justClick("#startButton");
        justClick("a[href='#getmylink']", { visible: true });
        justClick("#getnewlink");
    },
    OUO: () => {
        patchInterval();

        justClick("#btn-main:not(.disabled)");
    },
    DEVUPLOADS: () => {
        patchInterval();

        justClick("#gdl[style*='block']");
        justClick("#gdlf[style*='block']");
        justScrollTo("#dln");
    },
};

const DOMAINS = {
    "tpi.li": TEMPLATES.TPI_OII,
    "oii.la": TEMPLATES.TPI_OII,
    "financeehelp.com": TEMPLATES.HOSTING,
    "cloudhostt.com": TEMPLATES.HOSTING,
    "financeguidz.com": TEMPLATES.HOSTING,
    "linegee.net": async () => {
        const script = await whenElement("script:not([src])", { text: "atob(" });
        const q = atob(script.getHTML().match(/atob\('([^']+)'\)/)[1]);

        let xxc;
        while (!xxc) {
            const request = await fetch(location.href + q);
            const response = await request.text();
            console.log("LineGee: response", response);
            const doc = new DOMParser().parseFromString(response, "text/html");
            xxc = doc.querySelector("#xxc");
            if (xxc) {
                location.assign(xxc.href);
            } else {
                await wait(500);
            }
        }
    },
    "ouo.io": TEMPLATES.OUO,
    "ouo.press": TEMPLATES.OUO,
    "intercelestial.com": async () => {
        justTap(document);
        justClick(".myButton");
        justClick(".myButton");
        justClick(".myButton");

        justDefine(w.Element.prototype, "innerHTML", {
            set(v) {
                if (typeof v === "string" && v.includes("antiadblock")) return;
                return v;
            },
        });

        justPatch(w.JSON, "stringify", (object, ...rest) => {
            if (object && typeof object === "object" && object.siteId && object.eid && "detected" in object) {
                object.detected = false;
                object.triggered = [];
            }
            return [object, ...rest];
        });

        justPatch(w.EventTarget.prototype, "addEventListener", (type, listener, options) => {
            if (typeof listener !== "function") return;

            const wrapped = function (event_) {
                if (typeof event_ !== "object" || event_ === null || event_.isTrusted === true) {
                    return listener.call(event_.currentTarget, event_);
                }
                return listener.call(event_.currentTarget, new Proxy(event_, {
                    get(target, property) {
                        if (property === "isTrusted") return true;
                        const v = Reflect.get(target, property);
                        return typeof v === "function" ? v.bind(target) : v;
                    },
                }));
            };

            return [type, wrapped, options];
        });

        justDefine(w, "open", {
            get() { return dummyWindow; },
            set(_v) { },
        });

        justPatch(w, "fetch", (url, options = {}) => {
            if (typeof url === "string" && url.includes("/v1/event") && typeof options.body === "string") {
                const body = JSON.parse(options.body);
                if (body && "detected" in body) {
                    body.detected = false;
                    body.triggered = [];
                    options.body = JSON.stringify(body);
                }
            }
            return [url, options];
        });
    },
    "pahe.plus": () => {
        justClick(":has([data-hcaptcha-response]) #invisibleCaptchaShortlink:not([disabled]), .get-link:not(.disabled)");
    },
    "vexfile.com": () => {
        justClick(".generate-link:not(.blocked)");
    },
    "filespayouts.com": () => {
        patchInterval({ text: "tick" });

        justClick("#method_free");
    },
    "modsfire.com": () => {
        patchInterval();

        justClick(".download-button:not([href])");
    },
    "www.file-upload.org": () => {
        justClick("button[name='method_free'], :has([data-hcaptcha-response]:not([data-hcaptcha-response=''])) #downloadbtn:not([disabled])");
    },
    "djxmaza.in": TEMPLATES.DEVUPLOADS,
    "smartfeecalculator.com": TEMPLATES.DEVUPLOADS,
    "gujjukhabar.in": TEMPLATES.DEVUPLOADS,
    "pdfhindibook.com": TEMPLATES.DEVUPLOADS,
    "upfilesgo.com": () => {
        justClick("#link-button-free:not([disabled]), #file-captcha #link-button:not([disabled])");
    },
    "safefileku.com": () => {
        patchInterval();
        justClick(":has([name='cf-turnstile-response'][value]) button[type='submit']");
    },
    "uploadrar.com": () => {
        justClick("button[name='method_free'], #downloadbtn:not([disabled])");
    },
    "send.now": async () => {
        justClick(":has([name='cf-turnstile-response'][value]) [type='submit']");
    },
};

const HOOKS = {
    setTimeout: w.setTimeout.bind(w),

    Date: w.Date,
};

const dummyWindow = () => ({ closed: false, close() { }, focus() { }, postMessage() { } });

async function main() {
    const { hostname, href, pathname, search } = location;
    const handler = DOMAINS[hostname];
    if (!handler) return;

    const pattern = CONFIG.SHORTLINK_PATTERNS[hostname];
    console.log("Pattern", pattern, "→", pattern?.test(href));
    if (pattern?.test(href)) w.sessionStorage.setItem(CONFIG.TOKEN_URL_KEY, href);

    if (CONFIG.WORKER_URL && isOriginHost(hostname) && (pathname !== "/" || search !== "")) {
        try {
            const result = await requestAPI("GET", `/api/check?url=${encodeURIComponent(href)}`);
            const check = result.body;
            console.log("Check", check, href);

            if (check?.status === "ok" && check.destination) {
                console.log("Bypass found", check.destination);
                navigateTo(check.destination);
                return;
            }
        } catch (error) {
            console.error("Error on check", error);
        }

        console.log("Bypass not found");
    }

    listenerNavigation();
    handler();
}
// eslint-disable-next-line unicorn/prefer-top-level-await -- userscript
main();

function click(node) {
    const event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: w,
    });

    node.dispatchEvent(event);
}

function wait(ms) {
    return new Promise(resolve => safeSetTimeout(resolve, ms));
}

async function justClick(selector, options = {}) {
    const { waitMs = 0 } = options;
    const node = await whenElement(selector, options);
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    if (waitMs > 0) {
        return safeSetTimeout(() => click(node), waitMs);
    }
    click(node);
}

async function justScrollTo(selector, options = {}) {
    const node = await whenElement(selector, options);
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
}

function justTap(node) {
    node.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
}

async function justRemove(selector, options = {}) {
    const node = await whenElement(selector, options);
    if (!node) return;
    node.remove();
}

function justDefine(owner, property, { get, set }) {
    const descriptor = Object.getOwnPropertyDescriptor(owner, property);
    Object.defineProperty(owner, property, {
        configurable: true,
        enumerable: true,
        get() {
            if (get) return get.call(this, descriptor.get.bind(this));
            return descriptor.get.call(this);
        },
        set(v) {
            if (set) {
                const result = set.call(this, v, descriptor.set.bind(this));
                if (result !== undefined) descriptor.set.call(this, result);
                return;
            }
            descriptor.set.call(this, v);
        },
    });
}

function justPatch(owner, name, wrapper) {
    const native = owner[name];

    owner[name] = function (...arguments_) {
        const next = wrapper.apply(this, arguments_);
        return native.apply(this, Array.isArray(next) ? next : arguments_);
    };

    return () => {
        owner[name] = native;
    };
}

function whenElement(selector, options = {}) {
    const { visible = false, text } = options;

    return new Promise(resolve => {
        const check = () => {
            const nodes = document.querySelectorAll(selector);
            for (const node of nodes) {
                if (!node) continue;

                if (visible && !node.offsetParent) continue;

                if (typeof text === "string" && !node.textContent.includes(text)) continue;
                if (text instanceof RegExp && !text.test(node.textContent)) continue;

                resolve(node);
                return;
            }

            safeSetTimeout(check, 250);
        };

        safeSetTimeout(check, 250);
    });
}

function safeSetTimeout(callback, delay) {
    const startTime = HOOKS.Date.now();
    let timeoutId;

    const check = () => {
        const elapsed = HOOKS.Date.now() - startTime;
        if (elapsed >= delay) {
            callback();
        } else {
            timeoutId = HOOKS.setTimeout(check, delay - elapsed);
        }
    };

    timeoutId = HOOKS.setTimeout(check, delay);

    return () => {
        HOOKS.clearTimeout(timeoutId);
    };
}

function patchInterval(options = {}) {
    const { factor = CONFIG.PATCH_TIMER_FACTOR, text, ms } = options;

    const startTime = HOOKS.Date.now();

    const now = () => {
        const realElapsed = HOOKS.Date.now() - startTime;
        const divisor = factor === 0 ? 0.001 : factor;
        const virtualElapsed = realElapsed / divisor;
        return startTime + virtualElapsed;
    };

    const callback = (target, thisArgument, argumentArray) => {
        if (typeof argumentArray[1] !== "number") {
            return Reflect.apply(target, thisArgument, argumentArray);
        }

        const function_ = argumentArray[0]?.toString();
        if (text && !function_.includes(text)) {
            return Reflect.apply(target, thisArgument, argumentArray);
        }

        if (ms != undefined && ms === argumentArray[1]) {
            return Reflect.apply(target, thisArgument, argumentArray);
        }

        argumentArray[1] *= factor;
        return Reflect.apply(target, thisArgument, argumentArray);
    };

    w.setInterval = new Proxy(w.setInterval, { apply: callback });
    w.setTimeout = new Proxy(w.setTimeout, { apply: callback });

    w.Date = new Proxy(w.Date, {
        construct(target, arguments_) {
            if (arguments_.length === 0) {
                return new target(now());
            }
            return new target(...arguments_);
        },
        apply(target, thisArgument, arguments_) {
            if (arguments_.length === 0) {
                return new target(now()).toString();
            }
            return new target(...arguments_).toString();
        },
        get(target, property, receiver) {
            if (property === "now") {
                return () => now();
            }
            return Reflect.get(target, property, receiver);
        },
    });
}

function isFinalHost(hostname) {
    return CONFIG.FINAL_DOMAINS.some((domain) => hostname === domain || hostname.endsWith("." + domain));
}

function isOriginHost(host) {
    return CONFIG.ORIGIN_DOMAINS.some((domain) => host === domain || host.endsWith("." + domain));
}

function requestAPI(method, endpoint, data) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method,
            url: `${CONFIG.WORKER_URL}${endpoint}`,
            headers: { "Content-Type": "application/json" },
            responseType: "json",
            data: data ? JSON.stringify(data) : undefined,
            onload: (httpResponse) => resolve({ status: httpResponse.status, body: httpResponse.response }),
            onerror: (error) => reject(error),
        });
    });
}

function navigateTo(url, info = "bypass_link") {
    w.navigation.navigate(url, { info });
}

function listenerNavigation() {
    if (!w.navigation || !CONFIG.WORKER_URL) return;

    navigation.addEventListener("navigate", async (event) => {
        if (event.info === "bypass_link") return;
        if (!isOriginHost(location.hostname)) return;

        try {
            const destinationURL = new URL(event.destination.url);

            if (!isFinalHost(destinationURL.hostname)) return;

            const shortlink = w.sessionStorage.getItem(CONFIG.TOKEN_URL_KEY);
            if (!shortlink) return;
            if (destinationURL.hostname === location.hostname) return;

            if (event.cancelable) {
                event.preventDefault();
            }

            console.log("Destination intercepted", event.destination.url);

            const result = await requestAPI("POST", "/api/save", {
                shortlink,
                destination: event.destination.url,
            });

            if (result.body?.status === "ok") {
                console.log("Saved!");
                w.sessionStorage.removeItem(CONFIG.TOKEN_URL_KEY);
            } else {
                console.warn("Save rejected", result.status, result.body?.message);
            }

            if (event.cancelable) navigateTo(event.destination.url);
        } catch (error) {
            console.error("Error on save", error);
        }
    });
}

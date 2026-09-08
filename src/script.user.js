// ==UserScript==
// @name               Pahe - Auto continue links
// @namespace          https://greasyfork.org/users/821661
// @version            0.0.10
// @description        just another bypass links for pahe
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
// @grant              unsafeWindow
//
// @license            GPL-3.0
// ==/UserScript==

const w = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

const CONFIG = {
    TIMEOUT_INTERVAL: 250,
    PATCH_TIMER_FACTOR: 0.05,
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
    "linegee.net": async () => {
        justClick(".btn-primary[href]", { wait: 2000 });
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
                if (v.includes("antiadblock")) return;
                return v;
            },
        });

        justPatch(w.JSON, "stringify", (obj, ...rest) => {
            if (obj && typeof obj === "object" && obj.siteId && obj.eid && "detected" in obj) {
                obj.detected = false;
                obj.triggered = [];
            }
            return [obj, ...rest];
        });

        justPatch(w.EventTarget.prototype, "addEventListener", (type, listener, opts) => {
            if (typeof listener !== "function") return;

            const wrapped = function (ev) {
                if (!ev || ev.isTrusted === true || typeof ev !== "object") {
                    return listener.call(this, ev);
                }
                return listener.call(this, new Proxy(ev, {
                    get(target, prop) {
                        if (prop === "isTrusted") return true;
                        const v = Reflect.get(target, prop);
                        return typeof v === "function" ? v.bind(target) : v;
                    },
                }));
            };

            return [type, wrapped, opts];
        });

        justDefine(w, "open", {
            get() {
                return () => ({ closed: false, close() { }, focus() { }, postMessage() { } });
            },
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

function main() {
    const { hostname } = location;
    const handler = DOMAINS[hostname];
    if (!handler) return;

    handler();
}
main();

function click(node) {
    const event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: w,
    });

    node.dispatchEvent(event);
}

async function justClick(selector, options = {}) {
    const { wait = 0 } = options;
    const node = await whenElement(selector, options);
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    if (wait > 0) {
        return safeSetTimeout(() => click(node), wait);
    }
    console.log("click", selector, node);
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

function justDefine(owner, prop, { get, set }) {
    const descriptor = Object.getOwnPropertyDescriptor(owner, prop);
    Object.defineProperty(owner, prop, {
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

    owner[name] = function (...args) {
        const next = wrapper.apply(this, args);
        return native.apply(this, Array.isArray(next) ? next : args);
    };

    return () => {
        owner[name] = native;
    };
}

function whenElement(selector, options = {}) {
    const { visible = false, text = null } = options;

    return new Promise(resolve => {
        const check = () => {
            const nodes = document.querySelectorAll(selector);
            for (const node of nodes) {
                if (!node) continue;

                if (visible && !node.offsetParent) continue;

                if (typeof text === "string" && !node.innerText.includes(text)) continue;
                if (text instanceof RegExp && !text.test(node.innerText)) continue;

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
        const virtualElapsed = factor === 0
            ? realElapsed / 0.001
            : realElapsed / factor;
        return startTime + virtualElapsed;
    };

    const cb = (target, thisArg, argArray) => {
        if (typeof argArray[1] !== "number") {
            return Reflect.apply(target, thisArg, argArray);
        }

        const fn = argArray[0]?.toString();
        if (text && !fn.includes(text)) {
            return Reflect.apply(target, thisArg, argArray);
        }

        if (ms != null && ms === argArray[1]) {
            return Reflect.apply(target, thisArg, argArray);
        }

        argArray[1] *= factor;
        return Reflect.apply(target, thisArg, argArray);
    };

    w.setInterval = new Proxy(w.setInterval, { apply: cb });
    w.setTimeout = new Proxy(w.setTimeout, { apply: cb });

    w.Date = new Proxy(w.Date, {
        construct(target, args) {
            if (args.length === 0) {
                return new target(now());
            }
            return new target(...args);
        },
        apply(target, thisArg, args) {
            if (args.length === 0) {
                return new target(now()).toString();
            }
            return target(...args);
        },
        get(target, prop, receiver) {
            if (prop === "now") {
                return () => now();
            }
            return Reflect.get(target, prop, receiver);
        },
    });
}
// ==UserScript==
// @name               Pahe - Auto continue links
// @namespace          https://greasyfork.org/users/821661
// @version            0.0.27
// @description        Auto-continues shortlinks (pahe and similar hosts): clicks continue/download buttons, speeds up timers, and stores reached destinations on Cloudflare Worker for instant next-time access.
// @author             hdyzen
//
// From: Pahe
// @match              https://tpi.li/*
// @match              https://oii.la/*
// @match              https://srnky.com/*
// @match              https://clksz.com/*
//
// @match              https://ssdhostting.com/*
// @match              https://selfhostt.com/*
// @match              https://financeehelp.com/*
// @match              https://cloudhostt.com/*
// @match              https://linegee.net/*
// @match              https://financeguidz.com/*
// @match              https://techbixby.com/*
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
// @match              https://uploady.io/*
// @match              https://apkadmin.com/*
// @match              https://www.up-4ever.net/*
// 
// From: OvaGames
// @match              https://shrinkme.click/*
// @match              https://themezon.net/*
// @match              https://en.mrproblogger.com/*
// 
// From: Others
// @match              https://cloud.unblockedgames.world/*
// @match              https://fc-lc.xyz/*
// @match              https://jobzhub.store/*
// @match              https://aii.sh/*
// @match              https://oii.io/*
// @match              https://aknewz.xyz/*
// @match              https://toolskitpro.net/*
// 
// @match              https://exeygo.com/*
// @match              https://cuttty.com/*
// @match              https://cety.app/*
// @match              https://cutlink.net/*
// @match              https://cutnet.net/*
// @match              https://cuttlinks.com/*
// @match              https://exe-links.com/*
// @match              https://exe-urls.com/*
// @match              https://exego.app/*
// @match              https://exnion.com/*
// 
// Hosting
// @match              https://send.now/*
//
// @run-at             document-start
// @icon               https://www.google.com/s2/favicons?domain=pahe.ink
// @grant              GM_xmlhttpRequest
// @grant              unsafeWindow
// @connect            shortlinks.fdyzen.workers.dev
//
// @license            GPL-3.0
// @homepageURL        https://github.com/andradeatdev/auto-continue-shortlinks/
// ==/UserScript==

// console.log("Intercelestial", document.documentElement.outerHTML);

const w = typeof unsafeWindow === "undefined" ? globalThis : unsafeWindow;

const CONFIG = {
    DEFAULT_TIMEOUT_INTERVAL: 250,
    DEFAULT_CLICK_DELAY: 150,
    DEFAULT_TIMER_FACTOR: 0.05,

    WORKER_URL: "https://shortlinks.fdyzen.workers.dev",
    FINAL_DOMAINS: [
        "send.now",
        "1fichier.com",
        "1024tera.com",
        "gdflix.io",
        "gdflix.dev",
        "mega.nz",
        "vik1ngfile.site",
        "pahe.plus",
        "filecrypt.cc",
    ],
    ORIGIN_DOMAINS: [
        "tpi.li",
        "oii.la",
        "srnky.com",
        "clksz.com",
        "pahe.plus",
        "en.mrproblogger.com",
    ],
    SHORTLINK_PATTERNS: {
        "tpi.li": /^https:\/\/tpi\.li\/[A-Za-z0-9_-]{3,}$/,
        "oii.la": /^https:\/\/oii\.la\/[A-Za-z0-9_-]{3,}$/,
        "srnky.com": /^https:\/\/srnky\.com\/[A-Za-z0-9_-]{3,}$/,
        "clksz.com": /^https:\/\/clksz\.com\/[A-Za-z0-9_-]{3,}$/,
        "pahe.plus": /^https:\/\/pahe\.plus\/[A-Za-z0-9_-]{3,}$/,
        "en.mrproblogger.com": /^https:\/\/en\.mrproblogger\.com\/[A-Za-z0-9_-]{3,}$/,
    },
    TOKEN_URL_KEY: "pahe-acl-9d2f1c3e-4b7a-4e98-8c21-5f6d0a9b7c34",
};

const state = {
    observer: undefined,
    callbacks: new Set(),
};

const actions = {
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    async click(node, options = {}) {
        const { wait, scroll } = options;

        console.log("Click", node, options);

        const event = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: w,
        });

        if (wait !== undefined) await tool.wait(wait);
        if (scroll) await actions.scroll(node, typeof scroll === "object" ? scroll : {});

        node.dispatchEvent(event);
    },

    async tap(node) {
        node.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    },

    async scroll(node, options = {}) {
        const { behavior = "smooth", block = "center", inline = "center" } = options;
        node.scrollIntoView({ behavior, block, inline });
    },

    async remove(node) {
        node.remove();
    },

    async style(node, options = {}) {
        const { styles } = options;

        const randStr = Math.random().toString(36).slice(2);
        node.setAttribute(randStr, "");

        const sheet = new CSSStyleSheet();
        for (const [key, value] of Object.entries(styles)) {
            sheet.insertRule(`[${randStr}] { ${key}: ${value}; }`);
        }

        document.adoptedStyleSheets.push(sheet);
    },

    async request(url, options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || "GET",
                url,
                headers: options.headers || {},
                responseType: options.responseType || "text",
                timeout: options.timeout,
                data: options.data,
                onload: resolve,
                onerror: reject,
                ontimeout: reject,
                onabort: reject,
            });
        });
    },
};

const tool = new Proxy(actions, {
    get(target, name) {
        const action = target[name];
        const isAction = typeof action !== "function";
        const isDirect = ["request", "wait"].includes(name);

        if (isAction || isDirect) {
            return action;
        }

        return (selector, options = {}) => {
            return executeAction(selector, options, action);
        };
    },
});

const patch = {
    timer(options = {}) {
        const { factor = CONFIG.DEFAULT_TIMER_FACTOR, text, ms } = options;

        const startTime = Date.now();

        const now = () => {
            const realElapsed = Date.now() - startTime;
            const divisor = factor === 0 ? 0.001 : factor;
            const virtualElapsed = realElapsed / divisor;
            return startTime + virtualElapsed;
        };

        const callback = (target, thisArg, argArray) => {
            if (typeof argArray[1] !== "number") {
                return Reflect.apply(target, thisArg, argArray);
            }

            const fn = argArray[0]?.toString();
            if (text && !fn.includes(text)) {
                return Reflect.apply(target, thisArg, argArray);
            }

            if (ms != undefined && ms === argArray[1]) {
                return Reflect.apply(target, thisArg, argArray);
            }

            argArray[1] *= factor;
            return Reflect.apply(target, thisArg, argArray);
        };

        w.setInterval = new Proxy(w.setInterval, { apply: callback });
        w.setTimeout = new Proxy(w.setTimeout, { apply: callback });

        w.Date = new Proxy(w.Date, {
            construct(target, argArray) {
                if (argArray.length === 0) {
                    return new target(now());
                }
                return new target(...argArray);
            },
            apply(target, thisArgument, argArray) {
                if (argArray.length === 0) {
                    return new target(now()).toString();
                }
                return new target(...argArray).toString();
            },
            get(target, property, receiver) {
                if (property === "now") {
                    return () => now();
                }
                return Reflect.get(target, property, receiver);
            },
        });
    },

    define(owner, property, { get, set }) {
        const descriptor = Object.getOwnPropertyDescriptor(owner, property);
        if (!descriptor) return;

        let value;

        const setter = (thisArg, v) => {
            if (descriptor.set) descriptor.set.call(thisArg, v);
            value = v;
        };
        const getter = (thisArg) => {
            if (descriptor.get) return descriptor.get.call(thisArg);
            return value;
        };

        Object.defineProperty(owner, property, {
            configurable: true,
            enumerable: true,
            get() {
                if (get) return get.call(this, () => getter(this));
                if (descriptor.get) return descriptor.get.call(this);
                return value;
            },
            set(v) {
                if (set) set.call(this, v, (outV) => setter(this, outV));
                if (descriptor.set) descriptor.set.call(this, v);
                value = v;
            },
        });
    },

    apply(owner, property, applyFn) {
        owner[property] = new Proxy(owner[property], {
            apply: applyFn,
        });
    },
};

const TEMPLATES = {
    TPI_OII: () => {
        patch.define(w, "onblur", { set() { } });

        tool.click("#continue:not([disabled])");
        tool.click(".get-link[href]:not(.disabled)");

        patch.define(w.Element.prototype, "innerHTML", { set(v) { return typeof v === "string" && v.includes("antiadblock") ? "" : v; } });
    },
    PAHE_HOSTING: () => {
        patch.timer();

        tool.remove("div", { css: { position: "fixed" }, text: "detected" });
        tool.click("#startButton");
        tool.click("a[href='#getmylink']");
        tool.click("#getnewlink");
    },
    OUO: () => {
        patch.timer();

        tool.click("#btn-main:not(.disabled)");
    },
    DEVUPLOADS: () => {
        patch.timer();

        tool.click("#gdl[style*='block']");
        tool.click("#gdlf[style*='block']");
        tool.scroll("#dln");
    },
    EXE_IO: async () => {
        tool.click(".link-button:not(.disabled)");
        tool.click(`:has([name="cf-turnstile-response"][value]) #invisibleCaptchaShortlink`);
    },
};

const DOMAINS = {
    "tpi.li": TEMPLATES.TPI_OII,
    "oii.la": TEMPLATES.TPI_OII,
    "srnky.com": TEMPLATES.TPI_OII,
    "clksz.com": TEMPLATES.TPI_OII,
    "financeehelp.com": TEMPLATES.PAHE_HOSTING,
    "cloudhostt.com": TEMPLATES.PAHE_HOSTING,
    "financeguidz.com": TEMPLATES.PAHE_HOSTING,
    "techbixby.com": TEMPLATES.PAHE_HOSTING,
    "linegee.net": async () => {
        const script = await waitElement("script:not([src])", { text: "atob(" });
        const q = atob(script.getHTML().match(/atob\('([^']+)'\)/)[1]);
        let xxc;
        while (!xxc) {
            const request = await fetch(location.href + q);
            const response = await request.text();
            const doc = new DOMParser().parseFromString(response, "text/html");
            xxc = doc.querySelector("#xxc[href]");
            if (xxc) {
                location.assign(xxc.href);
            } else {
                await tool.wait(500);
            }
        }
    },
    "ouo.io": TEMPLATES.OUO,
    "ouo.press": TEMPLATES.OUO,
    "intercelestial.com": async () => {
        const AD = ["pagead2.googlesyndication.com", "securepubads.g.doubleclick.net", "googletagservices.com", "s.amazon-adsystem.com", "googleadservices.com"];

        const patchAttachShadow = async (owner) => {
            owner.Element.prototype.attachShadow = new Proxy(owner.Element.prototype.attachShadow, {
                apply(target, thisArg, argArray) {
                    const shadowRoot = Reflect.apply(target, thisArg, argArray);
                    shadowRoot.insertAdjacentHTML("beforeend", "<style>* { display: none !important; }</style>");
                    return shadowRoot;
                },
            });
        };
        const patchFetch = async (owner) => {
            owner.fetch = new Proxy(owner.fetch, {
                async apply(target, thisArg, argArray) {
                    const url = String(typeof argArray[0] === "string" ? argArray[0] : argArray[0]?.url || "");
                    if (AD.some(h => url.includes(h))) {
                        try { await Reflect.apply(target, thisArg, argArray); } catch { }
                        return Object.create(null);
                    }

                    const res = await Reflect.apply(target, thisArg, argArray);
                    const isJson = res.headers.get("content-type")?.includes("json");

                    if (isJson && (res.type === "basic" || res.type === "cors")) {
                        res.clone().json()
                            .then(body => {
                                if (body.ok) tool.click(".myButton", { visible: true, scroll: true, repeat: 2 });
                            })
                            .catch(() => { });
                    }
                    return res;
                },
            });
        };

        patchFetch(w);
        patchAttachShadow(w);

        patch.apply(w.Node.prototype, "appendChild", (target, thisArg, argArray) => {
            const result = Reflect.apply(target, thisArg, argArray);
            const node = argArray[0];
            if (node.tagName === "IFRAME") {
                patchFetch(node.contentWindow);
            }
            return result;
        });

        patch.apply(w.EventTarget.prototype, "addEventListener", (target, thisArg, argArray) => {
            const listener = argArray[1];
            const wrapper = (event) => {
                const proxy = new Proxy(event, {
                    get(innerTarget, property, _receiver) {
                        if (property === "isTrusted") return true;

                        const value = Reflect.get(innerTarget, property, innerTarget);
                        if (typeof value === "function") return value.bind(innerTarget);

                        return value;
                    },
                    getOwnPropertyDescriptor(innerTarget, property) {
                        if (property === "isTrusted") return { get: () => true };
                        return Reflect.getOwnPropertyDescriptor(innerTarget, property);
                    },
                });

                listener(proxy);
            };
            argArray[1] = wrapper;
            return Reflect.apply(target, thisArg, argArray);
        });

        tool.style("body > div:has(a[href*='antiadblock'])", { styles: { display: "none !important" } });
        tool.click(".myButton", { visible: true, scroll: true });

        const patchLegHits = (owner) => {
            const LEG = /\/pagead\/conversion\.js(?:\?|$)|\/ads\/banners\/[0-9a-f]+\.gif(?:\?|$)/;

            const hijack = (proto, dest) => {
                const desc = Object.getOwnPropertyDescriptor(proto, "src");
                Object.defineProperty(proto, "src", {
                    configurable: true,
                    enumerable: desc.enumerable,
                    get() { return desc.get.call(this); },
                    set(value) {
                        const url = String(value);
                        if (!LEG.test(url)) {
                            desc.set.call(this, value);
                            return;
                        }

                        tool.request(url, {
                            headers: {
                                "Referer": `${location.origin}/`,
                                "Sec-Fetch-Dest": dest,
                                "Sec-Fetch-Mode": "no-cors",
                                "Sec-Fetch-Site": "same-origin",
                            },
                        })
                            .then(() => this.dispatchEvent(new Event("load")));
                    },
                });
            };

            hijack(owner.HTMLScriptElement.prototype, "script");
            hijack(owner.HTMLImageElement.prototype, "image");
        };
        patchLegHits(w);

        patch.apply(w.Promise, "all", () => {
            return [];
        });
    },
    "pahe.plus": () => {
        tool.click(":has([data-hcaptcha-response]) #invisibleCaptchaShortlink:not([disabled]), .get-link:not(.disabled)");
    },
    "vexfile.com": () => {
        tool.click(".generate-link:not(.blocked)");
    },
    "filespayouts.com": () => {
        patch.timer({ text: "tick" });

        tool.click("#method_free");
    },
    "modsfire.com": () => {
        patch.timer();

        tool.click(".download-button:not([href])");
    },
    "www.file-upload.org": () => {
        tool.click("button[name='method_free'], :has([data-hcaptcha-response]:not([data-hcaptcha-response=''])) #downloadbtn:not([disabled])");
    },
    "djxmaza.in": TEMPLATES.DEVUPLOADS,
    "smartfeecalculator.com": TEMPLATES.DEVUPLOADS,
    "gujjukhabar.in": TEMPLATES.DEVUPLOADS,
    "pdfhindibook.com": TEMPLATES.DEVUPLOADS,
    "upfilesgo.com": () => {
        tool.click("#link-button-free:not([disabled]), #file-captcha #link-button:not([disabled])");
    },
    "safefileku.com": () => {
        patch.timer();
        tool.click(":has([name='cf-turnstile-response'][value]) button[type='submit']");
    },
    "uploadrar.com": () => {
        tool.click("button[name='method_free'], #downloadbtn:not([disabled])");
    },
    "send.now": async () => {
        tool.click(":has([name='cf-turnstile-response'][value]) [type='submit']");
    },
    "shrinkme.click": async () => {
        tool.click(".btn-primary:not([disabled])");
    },
    "themezon.net": async () => {
        tool.click("#btn2");
        tool.click("#tp-snp2");
    },
    "en.mrproblogger.com": async () => {
        tool.click(".get-link:not(.disabled)");
    },
    "uploady.io": async () => {
        tool.click("#free_dwn");
        tool.click("#downloadbtn");
    },
    "apkadmin.com": async () => {
        tool.click("#downloadbtn");
    },
    "www.up-4ever.net": async () => {
        tool.remove("#u4ab_modal");
        tool.click(`button[name="method_free"]`);
    },
    "cloud.unblockedgames.world": async () => {
        tool.click("a[onclick]", { text: "Start Verification" });
        tool.click("#verify_button2, #verify_button", { repeat: 2 });

        const link = await waitElement("#two_steps_btn[href]");
        location.assign(link.href);
    },
    "exeygo.com": TEMPLATES.EXE_IO,
    "cuttty.com": TEMPLATES.EXE_IO,
    "cety.app": TEMPLATES.EXE_IO,
    "cutlink.net": TEMPLATES.EXE_IO,
    "cutnet.net": TEMPLATES.EXE_IO,
    "cuttlinks.com": TEMPLATES.EXE_IO,
    "exe-links.com": TEMPLATES.EXE_IO,
    "exe-urls.com": TEMPLATES.EXE_IO,
    "exego.app": TEMPLATES.EXE_IO,
    "exnion.com": TEMPLATES.EXE_IO,
    "fc-lc.xyz": async () => {
        tool.click(`:has([data-hcaptcha-response]:not([data-hcaptcha-response=''])) button#hCaptchaShortlink`);
        tool.click(`:has([name="cf-turnstile-response"][value]) button#submitBtn`);
    },
    "jobzhub.store": async () => {
        tool.click("#next", { visible: true });
        tool.click("#scroll", { visible: true });
        tool.click("#glink", { visible: true });
        tool.click(`:has([name="cf-turnstile-response"][value]) #surl`);
    },
    "aii.sh": async () => {
        tool.click(`:has([name="cf-turnstile-response"][value]) button#continue`);
        tool.click(".btn-primary[href]:not(.disabled)");
    },
    "oii.io": async () => {
        tool.click(`:has([data-hcaptcha-response]:not([data-hcaptcha-response=''])) button#hCaptchaShortlink`);
        tool.click(`:has([name="cf-turnstile-response"][value]) button#submitBtn`);

        mouseMove(120_000);
    },
    "aknewz.xyz": async () => {
        tool.click(`:has([name="cf-turnstile-response"][value]) #surl`);

        tool.click("#next");
        await tool.click("#scroll:not(.hidden)");
        tool.click("#scroll:not(.hidden)");
    },
    "toolskitpro.net": async () => {
        tool.remove("div", { css: { position: "fixed" } });
    },
};

async function main() {
    const { hostname, href, pathname, search } = location;
    const handler = DOMAINS[hostname];
    if (!handler) return;

    checkCache(hostname, href, pathname, search);
    listenerNavigation();
    handler();
}
// eslint-disable-next-line unicorn/prefer-top-level-await -- userscript
main();

async function checkCache(hostname, href, pathname, search) {
    const pattern = CONFIG.SHORTLINK_PATTERNS[hostname];
    console.log("Pattern", hostname, ">", pattern?.toString());
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
}

function executeAction(selector, options, action) {
    let remaining = options.repeat ?? 1;

    const fn = async () => {
        const nodes = document.querySelectorAll(selector);

        for (const node of nodes) {
            if (!resolveNode(node, options)) continue;

            if (--remaining <= 0) state.callbacks.delete(fn);

            await action(node, options);
        }
    };

    state.callbacks.add(fn);
    ensureObserver();
    fn();
}

function ensureObserver() {
    if (state.observer) return;

    state.observer = new MutationObserver(() => {
        for (const callback of state.callbacks) callback();
    });

    state.observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
    });
}

function waitElement(selector, options = {}) {
    return new Promise(resolve => {
        const check = () => {
            const nodes = document.querySelectorAll(selector);
            for (const node of nodes) {
                const resolved = resolveNode(node, options);
                if (!resolved) continue;

                resolve(resolved);
                return;
            }

            setTimeout(check, 250);
        };

        setTimeout(check, 250);
    });
}

function resolveNode(node, options = {}) {
    if (!node) return;

    const { visible, text, css } = options;

    if (visible && !node.offsetParent) return;
    if (typeof text === "string" && !node.textContent.includes(text)) return;
    if (text instanceof RegExp && !text.test(node.textContent)) return;
    if (css) {
        const style = getComputedStyle(node);
        for (const [key, value] of Object.entries(css)) {
            if (style[key] !== value) return;
        }
    }

    return node;
}

function mouseMove(duration = 1000) {
    const start = {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
    };

    const end = {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
    };

    const startTime = performance.now();

    const animate = (actualTime) => {
        const progress = Math.min(
            (actualTime - startTime) / duration,
            1,
        );

        const smooth = progress * progress * (3 - 2 * progress);

        const x = start.x + (end.x - start.x) * smooth;
        const y = start.y + (end.y - start.y) * smooth;

        document.dispatchEvent(
            new MouseEvent("mousemove", {
                bubbles: true,
                clientX: x,
                clientY: y,
            }),
        );

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
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
            console.log("Is cancelable?", event.cancelable);

            const result = await requestAPI("POST", "/api/save", {
                shortlink,
                destination: event.destination.url,
            });

            console.log("Status", result.status, "| Body", result.body);

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

// ==UserScript==
// @name               Pahe - Auto continue links
// @namespace          https://greasyfork.org/users/821661
// @version            1.0.3
// @description        Auto-continues shortlinks (pahe and similar hosts): clicks continue/download buttons, speeds up timers, and stores reached destinations on Cloudflare Worker for instant next-time access.
// @author             hdyzen
//
// From: Pahe
// @match              https://tpi.li/*
// @match              https://oii.la/*
// @match              https://srnky.com/*
// @match              https://clksz.com/*
//
// @match              https://financeehelp.com/*
// @match              https://cloudhostt.com/*
// @match              https://linegee.net/*
// @match              https://financeguidz.com/*
// @match              https://techbixby.com/*
// @match              https://loanbixby.com/*
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
// @match              https://zdrive.to/*
// @match              https://cloudfam.io/*
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
// @match              https://icutlink.com/*
// @match              https://uiil.ink/*
// 
// @match              https://boost.ink/*
// @match              https://bst.gg/*
// @match              https://rekonise.com/*
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
// @match              https://lnbz.la/*
// @match              https://avnsgames.com/*
//
// @run-at             document-start
// @icon               https://www.google.com/s2/favicons?domain=pahe.ink
// @grant              GM_xmlhttpRequest
// @grant              unsafeWindow
// 
// @connect            shortlinks.fdyzen.workers.dev
// @connect            intercelestial.com
//
// @license            GPL-3.0
// @homepageURL        https://github.com/andradeatdev/auto-continue-shortlinks/
// ==/UserScript==

const config = {
    defaultTimerFactor: 0.05,
};

const local = typeof unsafeWindow === "undefined" ? globalThis : unsafeWindow;

const watch = {
    observing: false,
    observer: undefined,
    callbacks: new Set(),

    observe() {
        if (watch.observing) return;
        watch.observing = true;

        let isScheduled = false;
        const schedule = (mutations) => {
            if (isScheduled) return;
            isScheduled = true;
            requestAnimationFrame(() => {
                isScheduled = false;
                for (const callback of watch.callbacks) callback(mutations);
            });
        };

        watch.observer = new MutationObserver((mutations) => {
            schedule(mutations);
        });
        watch.observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
        });
    },

    change(callback) {
        if (!watch.observing) watch.observe();
        watch.callbacks.add(callback);

        return () => watch.callbacks.delete(callback);
    },

    aside(callback) {
        watch.observer.disconnect();
        callback();
        watch.observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
        });
    },
};

const resolvers = {
    visible(node, visible) {
        return node.checkVisibility({ visibilityProperty: true }) === visible;
    },
    text(node, text) {
        if (typeof text === "string") return node.textContent.includes(text);
        if (text instanceof RegExp) return text.test(node.textContent);
    },
    css(node, css) {
        const style = getComputedStyle(node);
        for (const [key, value] of Object.entries(css)) {
            if (style[key] !== value) return false;
        }
        return true;
    },
};

const tools = {
    sheet: new CSSStyleSheet(),

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    *select(selector, options = {}) {
        const { visible, text, css } = options;

        const nodes = document.querySelectorAll(selector);
        for (const node of nodes) {
            if (typeof visible === "boolean" && !resolvers.visible(node, visible)) continue;
            if (text !== undefined && !resolvers.text(node, text)) continue;
            if (css !== undefined && !resolvers.css(node, css)) continue;
            yield node;
        }
    },

    click(selector, options = {}) {
        const { wait = 0, scroll = false, count = 1 } = options;
        let remaining = count;

        const cleanup = watch.change(async () => {
            const nodes = tools.select(selector, options);
            for (const node of nodes) {
                if (remaining-- <= 0) {
                    cleanup();
                    break;
                }

                if (wait > 0) await tools.wait(wait);
                if (scroll !== false) await tools.scroll(node, typeof scroll === "object" ? scroll : {});

                const event = new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: local,
                });

                node.dispatchEvent(event);
            }

        });
    },

    remove(selector, options = {}) {
        watch.change(() => {
            const nodes = tools.select(selector, options);
            for (const node of nodes) {
                node.remove();
            }
        });
    },

    request(url, options = {}) {
        if (typeof url !== "string") return console.error("[tools.request] Missing `url` argument");

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

    redirect(selector, options = {}) {
        const { attr = "href", decodeB64 = false } = options;

        const foundAttr = (node) => {
            if (typeof attr === "string") return node.getAttribute(attr);
            if (attr instanceof RegExp) {
                const attrNames = node.getAttributeNames();
                for (const name of attrNames) {
                    if (attr.test(name)) {
                        return name;
                    }
                }
            }
        };

        watch.change(() => {
            const nodes = tools.select(selector, options);
            for (const node of nodes) {
                let url = foundAttr(node);
                if (!url) continue;

                if (decodeB64 === true) {
                    url = atob(url);
                }

                location.assign(url);
            }
        });
    },

    element(selector, options = {}) {
        return new Promise((resolve) => {
            watch.change(() => {
                const nodes = tools.select(selector, options);
                for (const node of nodes) {
                    resolve(node);
                    return;
                }
            });
        });
    },
};

const patches = {
    apply(owner, property, applyFn) {
        owner[property] = new Proxy(owner[property], {
            apply: applyFn,
        });
    },

    define(owner, property, { get, set }) {
        const descriptor = Object.getOwnPropertyDescriptor(owner, property) || {};

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

    timer(options = {}) {
        const { factor = config.defaultTimerFactor, text, ms } = options;

        const startTime = Date.now();
        const now = () => {
            const realElapsed = Date.now() - startTime;
            const divisor = factor === 0 ? 0.001 : factor;
            const virtualElapsed = realElapsed / divisor;
            return startTime + virtualElapsed;
        };

        const callback = (target, thisArg, argArray) => {
            const isDelayValid = typeof argArray[1] === "number";
            const isTextMatch = !text || argArray[0]?.toString().includes(text);
            const isMsMatch = ms === undefined || ms === argArray[1];

            if (isDelayValid && isTextMatch && isMsMatch) {
                argArray[1] *= factor;
            }

            return Reflect.apply(target, thisArg, argArray);
        };

        patches.apply(local, "setInterval", callback);
        patches.apply(local, "setTimeout", callback);

        local.Date = new Proxy(local.Date, {
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
};

const bypass = {
    cacheURL: "https://shortlinks.fdyzen.workers.dev",
    shortenerPatterns: {
        "tpi.li": /^\/[A-Za-z0-9_-]{3,}$/,
        "oii.la": /^\/[A-Za-z0-9_-]{3,}$/,
        "srnky.com": /^\/[A-Za-z0-9_-]{3,}$/,
        "clksz.com": /^\/[A-Za-z0-9_-]{3,}$/,
        "pahe.plus": /^\/[A-Za-z0-9_-]{3,}$/,
        "en.mrproblogger.com": /^\/[A-Za-z0-9_-]{3,}$/,
        "intercelestial.com": /^\/\?ht=[a-zA-Z0-9%]+$/,
    },
    finalDomains: [
        "send.now",
        "1fichier.com",
        "1024tera.com",
        /\w+\.gdflix\.(io|dev)$/,
        "mega.nz",
        "vik1ngfile.site",
        "pahe.plus",
        "filecrypt.cc",
        "ouo.io",
        "ouo.press",
    ],

    exec(hostname, href, pathname, search) {
        if (!this.cacheURL) return;

        const pattern = this.shortenerPatterns[hostname];
        if (!pattern?.test(pathname + search)) return;

        this.cache(href);
        this.listener(href);
    },

    cache(href) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `${this.cacheURL}/api/check?url=${encodeURIComponent(href)}`,
            headers: { "Content-Type": "application/json" },
            responseType: "json",
            onload: (data) => {
                const { response } = data;
                if (response.status !== "ok" || !response.destination) return;
                navigation.navigate(response.destination, { info: "bypass_link" });
            },
        });
    },

    listener(href) {
        navigation.addEventListener("navigate", (event) => {
            if (event.info === "bypass_link") return;

            const destinationURL = new URL(event.destination.url);
            const isFinalHost = this.isFinalHost(destinationURL.hostname);
            const isSameURL = destinationURL.href === href;

            if (!isFinalHost || isSameURL) return;
            event.preventDefault();

            this.save(href, destinationURL.href);
        });
    },

    save(href, destination) {
        GM_xmlhttpRequest({
            method: "POST",
            url: `${this.cacheURL}/api/save`,
            headers: { "Content-Type": "application/json" },
            responseType: "json",
            data: JSON.stringify({
                shortlink: href,
                destination,
            }),
            onload: (data) => {
                const { response } = data;
                if (response.status !== "ok") return;
                navigation.navigate(destination, { info: "bypass_link" });
            },
        });
    },

    isFinalHost(hostname) {
        for (const domain of this.finalDomains) {
            if (typeof domain === "string" && hostname === domain) return true;
            if (domain instanceof RegExp && domain.test(hostname)) return true;
        }
    },
};

const domains = {
    execute(domain, handler) {
        const { hostname, href, pathname, search } = location;
        if (hostname !== domain) return;

        bypass.exec(hostname, href, pathname, search);
        handler();
    },
};

const templates = {
    tpi() {
        templates.antiAdblockCore();

        tools.click("#continue:not([disabled])");
        tools.click(".get-link[href]:not(.disabled)");
    },
    host() {
        patches.timer();

        tools.remove("div", { css: { position: "fixed" }, text: "detected" });
        tools.click("#startButton");
        tools.click("a[href='#getmylink']");
        tools.click("#getnewlink");
    },
    ouo() {
        patches.timer();

        tools.click("#btn-main:not(.disabled)");
        tools.click(`:has([name="cf-turnstile-response"][value]) #invisibleCaptchaShortlink`);
    },
    devuploads() {
        patches.timer();

        tools.click("#gdl[style*='block']");
        tools.click("#gdlf[style*='block']");
        tools.click("#dln");
    },
    exeio() {
        tools.click(".link-button:not(.disabled)");
        tools.click(`:has([name="cf-turnstile-response"][value]) #invisibleCaptchaShortlink`);
    },
    boostink() {
        tools.redirect("script[src*='unlock.js']", { preprocess: ["base64"], attr: /[a-z]{5,}/ });
    },
    pahe() {
        local.Element.prototype.setAttribute = new Proxy(local.Element.prototype.setAttribute, {
            apply(target, thisArg, argArray) {
                const [name, value] = argArray;

                if ((name === "src" || name === "href") && /\d+x\d+|pagead|ads/.test(value)) {
                    const destMap = {
                        IMG: "image",
                        SCRIPT: "script",
                        LINK: "style",
                    };
                    const dest = destMap[thisArg.tagName];

                    tools.request(value, {
                        headers: {
                            "Referer": `${location.origin}/`,
                            "Sec-Fetch-Dest": dest,
                            "Sec-Fetch-Mode": "no-cors",
                            "Sec-Fetch-Site": "same-origin",
                        },
                    }).then(() => {
                        Reflect.apply(target, thisArg, [name, value]);
                        if (thisArg.tagName === "IMG") {
                            Object.defineProperty(thisArg, "naturalWidth", { get: () => 1, configurable: true });
                        } else if (thisArg.tagName === "LINK") {
                            Object.defineProperty(thisArg, "sheet", { get: () => ({}), configurable: true });
                        }
                        thisArg.onerror = () => { };
                        thisArg.dispatchEvent(new Event("load"));
                    });

                    return;
                }

                return Reflect.apply(target, thisArg, argArray);
            },
        });
    },
    antiAdblockCore() {
        const AD = ["pagead2.googlesyndication.com", "securepubads.g.doubleclick.net", "googletagservices.com", "s.amazon-adsystem.com", "googleadservices.com"];

        const patchFetch = async (owner) => {
            owner.fetch = new Proxy(owner.fetch, {
                async apply(target, thisArg, argArray) {
                    const [url] = argArray;
                    if (AD.some(h => url.includes(h))) return Object.create(null);

                    return Reflect.apply(target, thisArg, argArray);
                },
            });
        };
        patchFetch(local);

        patches.apply(local.Promise, "all", () => []);
    },
};

domains.execute("tpi.li", templates.tpi);
domains.execute("oii.la", templates.tpi);
domains.execute("srnky.com", templates.tpi);
domains.execute("clksz.com", templates.tpi);

domains.execute("financeehelp.com", templates.host);
domains.execute("cloudhostt.com", templates.host);
domains.execute("financeguidz.com", templates.host);
domains.execute("techbixby.com", templates.host);
domains.execute("loanbixby.com", templates.host);

domains.execute("ouo.io", templates.ouo);
domains.execute("ouo.press", templates.ouo);

domains.execute("djxmaza.in", templates.devuploads);
domains.execute("smartfeecalculator.com", templates.devuploads);
domains.execute("gujjukhabar.in", templates.devuploads);
domains.execute("pdfhindibook.com", templates.devuploads);

domains.execute("exeygo.com", templates.exeio);
domains.execute("cuttty.com", templates.exeio);
domains.execute("cety.app", templates.exeio);
domains.execute("cutlink.net", templates.exeio);
domains.execute("cutnet.net", templates.exeio);
domains.execute("cuttlinks.com", templates.exeio);
domains.execute("exe-links.com", templates.exeio);
domains.execute("exe-urls.com", templates.exeio);
domains.execute("exego.app", templates.exeio);
domains.execute("exnion.com", templates.exeio);

domains.execute("boost.ink", templates.boostink);
domains.execute("bst.gg", templates.boostink);

domains.execute("linegee.net", async () => {
    templates.antiAdblockCore();

    const script = await tools.element("script:not([src])", { text: "atob(" });
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
            await tools.wait(500);
        }
    }
});

domains.execute("pahe.plus", () => {
    templates.antiAdblockCore();
    templates.pahe();
    tools.click(":has([data-hcaptcha-response]) #invisibleCaptchaShortlink:not([disabled])");
    tools.redirect(".get-link[href]:not(.disabled)");
});

domains.execute("intercelestial.com", async () => {
    templates.antiAdblockCore();
    templates.pahe();
    tools.click(".myButton", { count: 3 });

    if (/^\?ht=[a-zA-Z0-9%]+$/.test(location.search)) {
        sessionStorage.setItem("acs-shortlink", location.href);
    };

    const xxc = document.querySelector("#xxc[href]");
    const shortlink = sessionStorage.getItem("acs-shortlink");
    if (xxc && shortlink) {
        window.stop();
        bypass.save(shortlink, xxc.href);
    }
});

domains.execute("vexfile.com", () => {
    tools.click(".generate-link:not(.blocked)");
});

domains.execute("filespayouts.com", () => {
    patches.timer({ text: "tick" });
    tools.click("#method_free");
});

domains.execute("modsfire.com", () => {
    patches.timer();
    tools.click(".download-button:not([href])");
});

domains.execute("www.file-upload.org", () => {
    tools.click("button[name='method_free'], :has([data-hcaptcha-response]:not([data-hcaptcha-response=''])) #downloadbtn:not([disabled])");
});

domains.execute("upfilesgo.com", () => {
    tools.click("#link-button-free:not([disabled]), #file-captcha #link-button:not([disabled])");
});

domains.execute("safefileku.com", () => {
    patches.timer();
    tools.click(":has([name='cf-turnstile-response'][value]) button[type='submit']");
});

domains.execute("uploadrar.com", () => {
    tools.click("button[name='method_free'], #downloadbtn:not([disabled])");
});

domains.execute("shrinkme.click", async () => {
    tools.click(".btn-primary:not([disabled])");
});

domains.execute("themezon.net", async () => {
    tools.click("#btn2");
    tools.click("#tp-snp2");
});

domains.execute("en.mrproblogger.com", async () => {
    tools.click(".get-link:not(.disabled)");
});

domains.execute("uploady.io", async () => {
    tools.click("#free_dwn");
    tools.click("#downloadbtn");
});

domains.execute("apkadmin.com", async () => {
    tools.click("#downloadbtn");
});

domains.execute("www.up-4ever.net", async () => {
    tools.remove("#u4ab_modal");
    tools.click(`button[name="method_free"]`);

    tools.click("#downloadbtn");

    tools.click(":has([name='cf-turnstile-response'][value]) [type='submit']:not([disabled])");
    tools.click("#dl2btn");
});

domains.execute("cloud.unblockedgames.world", async () => {
    tools.click("a[onclick]", { text: "Start Verification" });
    tools.click("#verify_button2, #verify_button", { count: 2 });

    const link = await tools.element("#two_steps_btn[href]");
    location.assign(link.href);
});

domains.execute("fc-lc.xyz", async () => {
    tools.click(`:has([data-hcaptcha-response]:not([data-hcaptcha-response=''])) button#hCaptchaShortlink`);
    tools.click(`:has([name="cf-turnstile-response"][value]) button#submitBtn`);
});

domains.execute("jobzhub.store", async () => {
    tools.click("#next", { visible: true });
    tools.click("#scroll", { visible: true });
    tools.click("#glink", { visible: true });
    tools.click(`:has([name="cf-turnstile-response"][value]) #surl:not(.disabled)`);
});

domains.execute("aii.sh", async () => {
    tools.click(`:has([name="cf-turnstile-response"][value]) button#continue`);
    tools.click(".btn-primary[href]:not(.disabled)");
});

domains.execute("oii.io", async () => {
    patches.define(local, "AdscoreInit", { get: () => () => { } });

    tools.click(`:has([data-hcaptcha-response]:not([data-hcaptcha-response=''])) button#hCaptchaShortlink`);
    tools.click(`:has([name="cf-turnstile-response"][value]) button#submitBtn`);

    while (true) {
        document.dispatchEvent(new MouseEvent("mousemove"));
        await tools.wait(100);
    }
});

domains.execute("aknewz.xyz", async () => {
    tools.click("#next");
    tools.click("#scroll:not(.hidden)", { count: 2 });

    tools.click(`:has([name="cf-turnstile-response"][value]) #surl`);
});

domains.execute("toolskitpro.net", async () => {
    tools.remove("div", { css: { position: "fixed" } });
    tools.click(".show #afterBtn");
    tools.click("#nxt");
    tools.click("#getl");
});

domains.execute("icutlink.com", async () => {
    tools.click(".get-link:not(.disabled)");
});

domains.execute("lnbz.la", async () => {
    templates.antiAdblockCore();

    tools.click(`:has([name="cf-turnstile-response"][value]) #continue`);
    tools.click(".get-link:not(.disabled)");
});

domains.execute("avnsgames.com", async () => {
    tools.click("#getnewlink");
});

domains.execute("zdrive.to", async () => {
    tools.click("#freeBtn", { wait: 500 });
    tools.click("#down_1Form button", { visible: true });
    tools.click("#down_2Form button", { visible: true });
    tools.click(".btn-download:not(.disabled)");
});

domains.execute("cloudfam.io", async () => {
    tools.redirect("#btn-clean-continue[href]");
    tools.redirect("#cf-btn-free[href]");
    tools.redirect("#free-btn[href]");
    tools.redirect("#cf-dl-btn[href]");
});

domains.execute("uiil.ink", async () => {
    tools.click("#form-continue [type='submit']");
    tools.click(`:has([name="cf-turnstile-response"][value]) #invisibleCaptchaShortlink`);
    tools.click(`#multiLinkBtn:not(.disabled)`);
});

domains.execute("rekonise.com", async () => {
    patches.apply(local, "open", (target, thisArg, argArray) => {
        if (!document.querySelector(".all-done-row")) return;
        location.assign(argArray[0]);
    });

    tools.click(".action-button:not([disabled])", { count: 10 });
    tools.click(":has(.all-done-row) .cta-button:not([disabled])", { wait: 2000 });
});

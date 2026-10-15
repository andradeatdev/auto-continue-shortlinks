// ==UserScript==
// @name               Pahe - Auto continue links
// @namespace          https://greasyfork.org/users/821661
// @version            1.2.4
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
// @match              https://invest.datapendidikan.com/*
// @match              https://crm.urlwebsite.com/*
// @match              https://go.fakta.id/*
// @match              https://safelinkearn.com/*
// @match              https://www.mirrored.to/*
//
// @run-at             document-start
// @icon               https://www.google.com/s2/favicons?domain=pahe.ink
// 
// @grant              GM_xmlhttpRequest
// @grant              unsafeWindow
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_registerMenuCommand
// 
// @connect            shortlinks.zencore.fun
// @connect            intercelestial.com
//
// @copyright          2024-2026 hdyzen (andradeatdev) — https://github.com/andradeatdev/auto-continue-shortlinks/
// @license            GPL-3.0
// @homepageURL        https://github.com/andradeatdev/auto-continue-shortlinks/
// ==/UserScript==

// Copyright (C) 2026 hdyzen (andradeatdev). This script is free software:
// you may copy, modify and redistribute it only under the GNU General Public
// License v3. Source and this notice must be kept intact (GPL-3.0, §4–§5).

const config = {
    defaultTimerFactor: 0.05,

    get useCache() {
        return commands.cmds.useCache.value;
    },
    get useContinue() {
        return commands.cmds.useContinue.value;
    },
    get usePatcher() {
        return commands.cmds.usePatcher.value;
    },
};

const win = typeof unsafeWindow === "undefined" ? globalThis : unsafeWindow;

const commands = {
    cmds: {
        useCache: {
            name: "Use cache",
            value: GM_getValue("useCache", true),
        },
        useContinue: {
            name: "Use continue",
            value: GM_getValue("useContinue", true),
        },
        usePatcher: {
            name: "Use patcher",
            value: GM_getValue("usePatcher", true),
        },
    },

    exec() {
        for (const [name, cmd] of Object.entries(this.cmds)) {
            GM_registerMenuCommand(`[${cmd.value ? "✔" : "✘"}] ${cmd.name}`, () => this.toggleCommand(name, cmd));
        }
    },

    toggleCommand(name, cmd) {
        const value = GM_getValue(name, cmd.value);
        GM_setValue(name, !value);
        location.reload();
    },
};

const watch = {
    OPTIONS: { childList: true, subtree: true, attributes: true, characterData: true },
    callbacks: new Set(),
    observer: undefined,
    queue: [],
    isScheduled: false,

    drain() {
        for (const record of this.observer.takeRecords()) this.queue.push(record);
    },

    flush() {
        this.isScheduled = false;
        this.drain();

        const records = this.queue;
        this.queue = [];
        if (records.length === 0) return;

        for (const callback of this.callbacks) {
            try {
                callback(records);
            } catch (error) {
                console.error(error);
            }
        }

        this.observer.takeRecords();
    },

    schedule() {
        if (this.isScheduled) return;
        this.isScheduled = true;
        requestAnimationFrame(() => this.flush());
    },

    observe() {
        if (this.observer) return;
        this.observer = new MutationObserver((records) => {
            for (const record of records) this.queue.push(record);
            this.schedule();
        });
        this.observer.observe(document.documentElement, this.OPTIONS);
    },

    change(callback) {
        this.observe();
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    },

    ignore(callback) {
        if (!this.observer) return callback();

        this.drain();
        if (this.queue.length > 0) this.schedule();

        try {
            return callback();
        } finally {
            this.observer.takeRecords();
        }
    },
};

const tool = {
    assertSelector(name, selector) {
        if (typeof selector !== "string") {
            throw new TypeError(`[tools.${name}] 'selector' must be a string`);
        }
    },

    isVisible(node, isVisible) {
        if (typeof isVisible !== "boolean") return true;
        return node.checkVisibility({ visibilityProperty: true }) === isVisible;
    },

    hasText(node, text) {
        if (text === undefined || text === null) return true;
        const content = node.textContent;
        if (typeof text === "string") return content.includes(text);
        if (text instanceof RegExp) {
            text.lastIndex = 0;
            return text.test(content);
        }
        return false;
    },

    hasCSS(node, css) {
        if (!css) return true;

        const style = getComputedStyle(node);
        return Object.entries(css).every(([key, value]) => style[key] === value);
    },

    getAttr(node, attr) {
        if (typeof attr === "string") return node.getAttribute(attr);
        if (attr instanceof RegExp) {
            attr.lastIndex = 0;
            const name = node.getAttributeNames().find(n => attr.test(n));
            return node.getAttribute(name);
        }
    },

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    *select(selector, options = {}) {
        this.assertSelector("select", selector);
        const { visible, text, css } = options;

        const nodes = document.querySelectorAll(selector);
        for (const node of nodes) {
            if (!tool.isVisible(node, visible)) continue;
            if (!tool.hasText(node, text)) continue;
            if (!tool.hasCSS(node, css)) continue;
            yield node;
        }
    },

    each(selector, options = {}, handler) {
        this.assertSelector("each", selector);

        const seen = new WeakSet();
        let isStopped = false;
        let isRunning = false;
        let isDirty = false;

        const handle = async (node) => {
            if (seen.has(node)) return;
            if (await handler(node, stop) === false) return;
            seen.add(node);
        };

        const run = async () => {
            if (isStopped) return;
            if (isRunning) {
                isDirty = true;
                return;
            }

            isRunning = true;
            let nodes = tool.select(selector, options);
            // eslint-disable-next-line no-unmodified-loop-condition -- isStopped can be changed by handle()
            while (!isStopped) {
                const { value: node, done } = nodes.next();
                if (!done) await handle(node);
                else if (isDirty) {
                    isDirty = false;
                    nodes = tool.select(selector, options);
                } else break;
            }
            isRunning = false;
        };

        const unwatch = watch.change(run);
        const stop = () => {
            isStopped = true;
            unwatch();
        };

        run();
        return stop;
    },

    click(selector, options = {}) {
        this.assertSelector("click", selector);
        const { wait = 0, scroll = false, count = 1, bubbles = true, when } = options;
        const { behavior = "smooth", block = "center", inline = "center" } = scroll || {};
        let remaining = count;

        return tool.each(selector, options, async (node, stop) => {
            if (when && !when(node)) return false;

            if (wait > 0) await tool.wait(wait);
            if (!node.isConnected) return false;

            if (when && !when(node)) return false;

            if (scroll !== false) node.scrollIntoView({ behavior, block, inline });

            const event = new MouseEvent("click", {
                bubbles,
                cancelable: true,
                view: win,
            });

            node.dispatchEvent(event);

            if (--remaining <= 0) stop();
            else if (when) return false;
        });
    },

    scroll(selector, options = {}) {
        this.assertSelector("scroll", selector);
        const { behavior = "smooth", block = "center", inline = "center" } = options;

        return tool.each(selector, options, async (node, stop) => {
            node.scrollIntoView({ behavior, block, inline });
            stop();
        });
    },

    remove(selector, options = {}) {
        this.assertSelector("remove", selector);
        return tool.each(selector, options, (node) => node.remove());
    },

    wrap(selector, options = {}) {
        this.assertSelector("wrap", selector);
        return tool.each(selector, options, (node) => {
            console.log(node);
            const wrapper = document.createElement("div");
            wrapper.style.cssText = `
                visibility: hidden !important;
                pointer-events: none !important;
                opacity: 0 !important;
            `;
            document.body.append(wrapper);
            wrapper.append(node);
        });
    },

    redirect(selector, options = {}) {
        this.assertSelector("redirect", selector);
        const { attr = "href", decodeB64 = false } = options;

        return tool.each(selector, options, async (node, stop) => {
            let url = tool.getAttr(node, attr);
            if (!url) return false;

            if (decodeB64 === true) {
                try { url = atob(url); } catch { return; }
            }

            stop();
            location.assign(url);
        });
    },

    element(selector, options = {}) {
        this.assertSelector("element", selector);
        const { timeout } = options;

        return new Promise((resolve) => {
            let timer;
            let isDone = false;

            const stop = tool.each(selector, options, (node, stop) => {
                isDone = true;
                clearTimeout(timer);
                stop();
                resolve(node);
            });

            if (!isDone && timeout > 0) {
                timer = setTimeout(() => {
                    stop();
                    resolve();
                }, timeout);
            }
        });
    },

    request(url, options = {}) {
        if (typeof url !== "string") throw new TypeError("[tools.request] Missing `url` argument");

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

const patch = {
    apply(owner, property, applyFn) {
        patch.fnToString ||= win.Function.prototype.toString;
        patch.fnToStringMap ||= new WeakMap();

        const target = owner[property];
        if (target === undefined) return;

        const func = function (...argArray) {
            return applyFn(target, this, argArray);
        };
        patch.fnToStringMap.set(func, target);

        Object.defineProperty(func, "toString", {
            configurable: true,
            value: Function.prototype.toString.bind(target),
        });

        win.Function.prototype.toString = function () {
            const original = patch.fnToStringMap.get(this);
            if (original) return patch.fnToString.call(original);
            return patch.fnToString.call(this);
        };

        owner[property] = func;
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

        patch.apply(win, "setInterval", callback);
        patch.apply(win, "setTimeout", callback);

        win.Date = new Proxy(win.Date, {
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

    fetch(options = {}) {
        const { url, returnValue = Object.create(null) } = options;

        const isValidUrl = (u) => {
            if (typeof url === "string") return u.includes(url);
            if (url instanceof RegExp) {
                url.lastIndex = 0;
                return url.test(u);
            }
            return true;
        };

        patch.apply(win, "fetch", (target, thisArg, argArray) => {
            const [url] = argArray;
            if (isValidUrl(url)) return returnValue;
            return Reflect.apply(target, thisArg, argArray);
        });
    },
};

const bypass = {
    cacheURL: "https://shortlinks.zencore.fun",
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
        /^(\w+\.)?gdflix\.(io|dev)$/,
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
                if (response.status !== "ok") { console.error(response); }
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
        if (!handler) return;

        const { hostname, href, pathname, search } = location;
        if (hostname !== domain) return;

        commands.exec();

        if (config.useCache && handler.cache) handler.cache();
        else if (config.useCache) bypass.exec(hostname, href, pathname, search);

        if (config.usePatcher) handler.patcher?.();
        if (config.useContinue) handler.continue?.();
    },
};

const templates = {
    tpi: {
        patcher() {
            templates.antiAdbCore.patcher();
            templates.pahe.patcher();
        },
        continue() {
            tool.click("#continue:not([disabled])");
            tool.click(".get-link[href]:not(.disabled)");
        },
    },
    host: {
        patcher() {
            patch.timer();
        },
        continue() {
            tool.remove("div", { css: { position: "fixed" }, text: "detected" });
            tool.click("#startButton");
            tool.click("a[href='#getmylink']");
            tool.click("#getnewlink");
        },
    },
    ouo: {
        patcher() {
            patch.timer();
        },
        continue() {
            tool.click("#btn-main:not(.disabled)");
            tool.click(`:has([name="cf-turnstile-response"][value]) #invisibleCaptchaShortlink`);
        },
    },
    devuploads: {
        patcher() {
            patch.timer();
        },
        continue() {
            tool.click("#gdl[style*='block']");
            tool.click("#gdlf[style*='block']");
            tool.click("#dln");
        },
    },
    exeio: {
        patcher() {
            tool.click(".link-button:not(.disabled)");
        },
        continue() {
            tool.click(`:has([name="cf-turnstile-response"][value]) #invisibleCaptchaShortlink`);
        },
    },
    boostink: {
        continue() {
            tool.redirect("script[src*='unlock.js']", { decodeB64: true, attr: /[a-z]{5,}/ });
        },
    },
    pndk: {
        continue() {
            tool.remove("#sn-panel");
            tool.click("#continue");
            tool.click("#btget button", { text: /Next|bot|continue/, wait: 100, count: 2, when: (node) => !node.disabled });
            tool.click("#next-btn button", { visible: true, count: 2 });
        },
    },
    pahe: {
        patcher() {
            const mirror = (url, dest) => {
                tool.request(url, {
                    headers: {
                        "Referer": `${location.origin}/`,
                        "Sec-Fetch-Dest": dest,
                        "Sec-Fetch-Mode": "no-cors",
                        "Sec-Fetch-Site": "same-origin",
                    },
                }).catch(() => { });
            };
            const rewrite = (tag, name, value) => {
                if (typeof value !== "string" || /^data:/i.test(value)) return null;

                if (tag === "SCRIPT" && name === "src" && /pagead\/conversion\.js/.test(value)) {
                    mirror(value, "script");
                    return "data:text/javascript,//pagead/conversion.js";
                }

                if (tag === "LINK" && name === "href" && /120x600-[0-9a-f]{8}\.css/.test(value)) {
                    const [, hash] = /120x600-([0-9a-f]{8})\.css/.exec(value);
                    mirror(value, "style");
                    return `data:text/css,/*/120x600-${hash}.css*/`;
                }

                if (tag === "IMG" && name === "src" && /\/ads\/banners\/[0-9a-f]{6,16}\.gif/.test(value)) {
                    mirror(value, "image");
                    return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                }

                return null;
            };

            const hook = (target, thisArg, argArray) => {
                const [name, value] = argArray;
                const rewritten = rewrite(thisArg?.tagName, String(name).toLowerCase(), value);
                if (rewritten !== null) argArray[1] = rewritten;
                return Reflect.apply(target, thisArg, argArray);
            };

            const realms = new WeakSet();
            const patchRealm = (realm) => {
                try {
                    const raw = realm?.wrappedJSObject || realm;
                    const proto = raw?.Element?.prototype;
                    if (!proto || realms.has(proto)) return;
                    realms.add(proto);
                    patch.apply(proto, "setAttribute", hook);
                } catch { }
            };

            const adoptNode = (node) => {
                let tagName = null;
                try { tagName = node?.tagName; } catch { }
                if (String(tagName).toUpperCase() !== "IFRAME") return;
                patchRealm(node.contentWindow || node.contentDocument?.defaultView);
            };

            const adopt = (target, thisArg, argArray) => {
                const result = Reflect.apply(target, thisArg, argArray);
                for (const arg of argArray) {
                    if (Array.isArray(arg)) arg.forEach(adoptNode);
                    else adoptNode(arg);
                }
                return result;
            };

            patchRealm(win);
            for (const [owner, property] of [
                [win.Node?.prototype, "insertBefore"],
                [win.Node?.prototype, "appendChild"],
                [win.Node?.prototype, "replaceChild"],
                [win.Element?.prototype, "prepend"],
                [win.Element?.prototype, "append"],
                [win.Element?.prototype, "after"],
                [win.Element?.prototype, "before"],
                [win.Element?.prototype, "replaceChildren"],
                [win.Element?.prototype, "insertAdjacentElement"],
                [win.Document?.prototype, "append"],
                [win.Document?.prototype, "prepend"],
            ]) {
                if (owner) patch.apply(owner, property, adopt);
            }

            const sweep = () => {
                try {
                    for (let index = 0; index < win.length; index++) patchRealm(win[index]);
                    for (const frame of document.querySelectorAll("iframe")) patchRealm(frame.contentWindow);
                } catch { }
            };

            sweep();
            win.addEventListener("DOMContentLoaded", sweep, { once: true });
            win.addEventListener("load", sweep, { once: true });
        },
    },
    antiAdbCore: {
        patcher() {
            const AD_REGEX = /pagead2.googlesyndication.com|securepubads.g.doubleclick.net|googletagservices.com|s.amazon-adsystem.com|googleadservices.com/;

            patch.apply(win, "fetch", async (target, thisArg, argArray) => {
                const [url] = argArray;

                if (!(typeof url === "string" && AD_REGEX.test(url))) return Reflect.apply(target, thisArg, argArray);
                const response = await target("https://jsonplaceholder.typicode.com/users", { mode: "no-cors" });

                return response;
            });

            patch.apply(win.performance, "getEntriesByName", (target, thisArg, argArray) => {
                const [name] = argArray;
                if (typeof name === "string" && AD_REGEX.test(name)) {
                    return [{
                        name,
                        entryType: "resource",
                        startTime: 0,
                        duration: 100,
                        initiatorType: "fetch",
                        nextHopProtocol: "h2",
                        workerStart: 0,
                        redirectStart: 0,
                        redirectEnd: 0,
                        fetchStart: 0,
                        domainLookupStart: 0,
                        domainLookupEnd: 0,
                        connectStart: 0,
                        connectEnd: 0,
                        secureConnectionStart: 0,
                        requestStart: 1,
                        responseStart: 10,
                        responseEnd: 100,
                        transferSize: 145_000,
                        encodedBodySize: 145_000,
                        decodedBodySize: 145_000,
                    }];
                }
                return Reflect.apply(target, thisArg, argArray);
            });

            tool.wrap("html > div[style]");
        },
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

domains.execute("invest.datapendidikan.com", templates.pndk);
domains.execute("crm.urlwebsite.com", templates.pndk);
domains.execute("go.fakta.id", templates.pndk);

domains.execute("linegee.net", {
    patcher() {
        templates.antiAdbCore.patcher();
    },
    async continue() {
        const script = await tool.element("script:not([src])", { text: "atob(" });
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
});

domains.execute("pahe.plus", {
    patcher() {
        templates.antiAdbCore.patcher();
        templates.pahe.patcher();
    },
    continue() {
        tool.click(":has([data-hcaptcha-response]) #invisibleCaptchaShortlink:not([disabled])");
        tool.redirect(".get-link[href^='https://']:not(.disabled)");
    },
});

domains.execute("intercelestial.com", {
    patcher() {
        templates.antiAdbCore.patcher();
        templates.pahe.patcher();

        patch.define(win, "LLct", { get: () => "1" });
        patch.define(win, "LLpd", { get: () => Date.now() - 284 });
    },
    continue() {
        tool.click(".myButton", { count: 3, bubbles: false });
    },
    cache() {
        bypass.cache(location.href);

        if (/^\?ht=[a-zA-Z0-9%]+$/.test(location.search)) {
            sessionStorage.setItem("acs-shortlink", location.href);
        };

        const xxc = document.querySelector("#xxc[href]");
        const shortlink = sessionStorage.getItem("acs-shortlink");
        if (xxc && shortlink) {
            window.stop();
            bypass.save(shortlink, xxc.href);
        }
    },
});

domains.execute("vexfile.com", {
    continue() {
        tool.click(".generate-link:not(.blocked)");
    },
});

domains.execute("filespayouts.com", {
    patcher() {
        patch.timer({ text: "tick" });
    },
    continue() {
        tool.click("#method_free");
    },
});

domains.execute("modsfire.com", {
    patcher() {
        patch.timer();
    },
    continue() {
        tool.click(".download-button:not([href])");
    },
});

domains.execute("www.file-upload.org", {
    continue() {
        tool.click("button[name='method_free']");
        tool.click(":has([data-hcaptcha-response]:not([data-hcaptcha-response=''])) #downloadbtn:not([disabled])");
    },
});

domains.execute("upfilesgo.com", {
    continue() {
        tool.click("#link-button-free:not([disabled])");
        tool.click("#file-captcha #link-button:not([disabled])");
    },
});

domains.execute("safefileku.com", {
    patcher() {
        patch.timer();
    },
    continue() {
        tool.click(":has([name='cf-turnstile-response'][value]) button[type='submit']");
    },
});

domains.execute("uploadrar.com", {
    continue() {
        tool.click("button[name='method_free']");
        tool.click("#downloadbtn:not([disabled])");
    },
});

domains.execute("shrinkme.click", {
    continue() {
        tool.click(".btn-primary:not([disabled])");
    },
});

domains.execute("themezon.net", {
    continue() {
        tool.click("#btn2");
        tool.click("#tp-snp2");
    },
});

domains.execute("en.mrproblogger.com", {
    continue() {
        tool.click(".get-link:not(.disabled)");
    },
});

domains.execute("uploady.io", {
    continue() {
        tool.click("#free_dwn");
        tool.click("#downloadbtn");
    },
});

domains.execute("apkadmin.com", {
    continue() {
        tool.click("#downloadbtn");
    },
});

domains.execute("www.up-4ever.net", {
    continue() {
        tool.remove("#u4ab_modal");
        tool.click(`button[name="method_free"]`);

        tool.click("#downloadbtn");

        tool.click(":has([name='cf-turnstile-response'][value]) [type='submit']:not([disabled])");
        tool.click("#dl2btn");
    },
});

domains.execute("cloud.unblockedgames.world", {
    continue() {
        tool.click("a[onclick]", { text: "Start Verification" });
        tool.click("#verify_button2");
        tool.click("##verify_button");

        tool.redirect("#two_steps_btn[href]");
    },
});

domains.execute("fc-lc.xyz", {
    continue() {
        tool.click(`:has([data-hcaptcha-response]:not([data-hcaptcha-response=''])) button#hCaptchaShortlink`);
        tool.click(`:has([name="cf-turnstile-response"][value]) button#submitBtn`);
    },
});

domains.execute("jobzhub.store", {
    continue() {
        tool.click("#next", { visible: true });
        tool.click("#scroll", { visible: true });
        tool.click("#glink", { visible: true });
        tool.click(`:has([name="cf-turnstile-response"][value]) #surl:not(.disabled)`);
    },
});

domains.execute("aii.sh", {
    continue() {
        tool.click(`:has([name="cf-turnstile-response"][value]) button#continue`);
        tool.click(".btn-primary[href]:not(.disabled)");
    },
});

domains.execute("oii.io", {
    patcher() {
        patch.define(win, "AdscoreInit", { get: () => () => { } });
    },
    async continue() {
        tool.click(`:has([data-hcaptcha-response]:not([data-hcaptcha-response=''])) button#hCaptchaShortlink`);
        tool.click(`:has([name="cf-turnstile-response"][value]) button#submitBtn`);

        while (true) {
            document.dispatchEvent(new MouseEvent("mousemove"));
            await tool.wait(100);
        }
    },
});

domains.execute("aknewz.xyz", {
    continue() {
        tool.click("#next");
        tool.click("#scroll:not(.hidden)", { count: 2 });
        tool.click(`:has([name="cf-turnstile-response"][value]) #surl`);
    },
});

domains.execute("toolskitpro.net", {
    continue() {
        tool.remove("div", { css: { position: "fixed" } });
        tool.click(".show #afterBtn");
        tool.click("#nxt");
        tool.click("#getl");
    },
});

domains.execute("icutlink.com", {
    continue() {
        tool.click(".get-link:not(.disabled)");
    },
});

domains.execute("lnbz.la", {
    patcher() {
        templates.antiAdbCore.patcher();
    },
    continue() {
        tool.click(`:has([name="cf-turnstile-response"][value]) #continue`);
        tool.click(".get-link:not(.disabled)");
    },
});

domains.execute("avnsgames.com", {
    continue() {
        tool.click("#getnewlink");
    },
});

domains.execute("zdrive.to", {
    continue() {
        tool.click("#freeBtn", { wait: 500 });
        tool.click("#down_1Form button", { visible: true });
        tool.click("#down_2Form button", { visible: true });
        tool.click(".btn-download:not(.disabled)");
    },
});

domains.execute("cloudfam.io", {
    continue() {
        tool.redirect("#btn-clean-continue[href]");
        tool.redirect("#cf-btn-free[href]");
        tool.redirect("#free-btn[href]");
        tool.redirect("#cf-dl-btn[href]");
    },
});

domains.execute("uiil.ink", {
    continue() {
        tool.click("#form-continue [type='submit']");
        tool.click(`:has([name="cf-turnstile-response"][value]) #invisibleCaptchaShortlink`);
        tool.click(`#multiLinkBtn:not(.disabled)`);
    },
});

domains.execute("rekonise.com", {
    patcher() {
        patch.apply(win, "open", (target, thisArg, argArray) => {
            if (!document.querySelector(".all-done-row")) return;
            location.assign(argArray[0]);
        });
    },
    continue() {
        tool.click(".action-button:not([disabled])", { count: 10 });
        tool.click(":has(.all-done-row) .cta-button:not([disabled])", { wait: 2000 });
    },
});

domains.execute("safelinkearn.com", {
    continue() {
        tool.click(".open-btn");
    },
});

domains.execute("www.mirrored.to", {
    continue() {
        tool.click(".get_btn");
        tool.redirect(".highlight a[href]:has(.get_btn)");
    },
});
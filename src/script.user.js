// ==UserScript==
// @name               Pahe - Auto continue links
// @namespace          https://greasyfork.org/users/821661
// @version            1.6.1
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
// @match              https://coinclix.co/*
// @match              https://geekgrove.net/*
// @match              https://www.google.com/url?*
// @match              https://toolkit.inshorturl.com/*
// @match              https://mahitimanch.in/*
// @match              https://inshorturl.in/*
// 
// @match              https://boost.ink/*
// @match              https://bst.gg/*
// @match              https://rekonise.com/*
// 
// @match              https://exeygo.com/*
// @match              https://exe-links.com/*
// @match              https://exe-urls.com/*
// @match              https://exego.app/*
// @match              https://exnion.com/*
// 
// @match              https://cuttty.com/*
// @match              https://cety.app/*
// @match              https://cutlink.net/*
// @match              https://cutnet.net/*
// @match              https://cuttlinks.com/*
// 
// @match              https://lnbz.la/*
// @match              https://avnsgames.com/*
// 
// @match              https://invest.datapendidikan.com/*
// @match              https://crm.urlwebsite.com/*
// @match              https://go.fakta.id/*
// @match              https://safelinkearn.com/*
// @match              https://www.mirrored.to/*
// 
// @match              https://xut.io/*
// @match              https://textfrog.com/*
// @match              https://eduify.app/*
// @match              https://gamescrate.app/*
// 
// @run-at             document-start
// @icon               https://www.google.com/s2/favicons?domain=pahe.ink
// 
// @grant              GM_xmlhttpRequest
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_addValueChangeListener
// @grant              GM_registerMenuCommand
// @grant              GM_openInTab
// @grant              unsafeWindow
// @grant              window.close
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

    isEnabled(name) {
        const cmd = commands.cmds[name];
        if (!cmd?.value) return false;
        const blacklist = Object.values(cmd.cmds)[0].value;
        return !blacklist.includes(location.hostname);
    },

    get useCache() {
        return config.isEnabled("useCache");
    },
    get useContinue() {
        return config.isEnabled("useContinue");
    },
    get usePatcher() {
        return config.isEnabled("usePatcher");
    },
};

const win = typeof unsafeWindow === "undefined" ? globalThis : unsafeWindow;

const commands = {
    cmds: {
        useCache: {
            name: "Use cache - all domains",
            value: GM_getValue("useCache", true),

            cmds: {
                useCacheBlacklist: {
                    name: "This domain",
                    value: GM_getValue("useCacheBlacklist", []),
                },
            },
        },
        useContinue: {
            name: "Use continue - all domains",
            value: GM_getValue("useContinue", true),

            cmds: {
                useContinueBlacklist: {
                    name: "This domain",
                    value: GM_getValue("useContinueBlacklist", []),
                },
            },
        },
        usePatcher: {
            name: "Use patcher - all domains",
            value: GM_getValue("usePatcher", true),

            cmds: {
                usePatcherBlacklist: {
                    name: "This domain",
                    value: GM_getValue("usePatcherBlacklist", []),
                },
            },
        },
        reportUrl: {
            name: "Report URL issue",
            when: () => bypass.shortenerPatterns[location.hostname]?.test(location.pathname + location.search),
            action() {
                GM_openInTab("https://github.com/andradeatdev/auto-continue-shortlinks/issues/new?template=site-broken.yml");
                // const reason = prompt("Report reason (1-500 chars):")?.trim();
                // if (reason) bypass.report(reason);
            },
        },
    },

    exec() {
        for (const [name, cmd] of Object.entries(this.cmds)) {
            if (cmd.when && !cmd.when()) continue;

            this.registerMenuCommand(name, cmd);
        }
    },

    registerMenuCommand(name, cmd) {
        if (cmd.action) {
            GM_registerMenuCommand(`▶  ${cmd.name}`, () => cmd.action());
            return;
        }

        GM_registerMenuCommand(`[${cmd.value ? "✔" : "✖"}] ${cmd.name}`, () => this.toggleCommand(name, cmd));

        if (!cmd.cmds) return;

        for (const [n, c] of Object.entries(cmd.cmds)) {
            const isDomainAllowed = !c.value.includes(location.hostname);
            const domainIcon = isDomainAllowed ? "✔" : "✖";
            const icon = cmd.value ? domainIcon : "–";
            GM_registerMenuCommand(`\u{2003}└ [${icon}] ${c.name} (${name.replace("use", "").toLowerCase()})`, () => this.toggleCommandForNot(n, c, isDomainAllowed));
        }
    },

    toggleCommand(name, cmd) {
        const value = GM_getValue(name, cmd.value);
        GM_setValue(name, !value);
        location.reload();
    },

    toggleCommandForNot(name, cmd, isDomainAllowed) {
        if (isDomainAllowed) cmd.value.push(location.hostname);
        else cmd.value = cmd.value.filter(v => v !== location.hostname);

        GM_setValue(name, cmd.value);
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

    input(selector, options = {}) {
        this.assertSelector("input", selector);
        const { value = "" } = options;

        return tool.each(selector, options, (node, stop) => {
            node.value = value;
            stop();
        });
    },

    remove(selector, options = {}) {
        this.assertSelector("remove", selector);
        return tool.each(selector, options, (node) => node.remove());
    },

    wrap(selector, options = {}) {
        this.assertSelector("wrap", selector);
        return tool.each(selector, options, (node, stop) => {
            const wrapper = document.createElement("div");
            wrapper.style.cssText = `
                visibility: hidden !important;
                pointer-events: none !important;
                opacity: 0 !important;
            `;
            document.body.append(wrapper);
            wrapper.append(node);
            stop();
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
            onload: ({ response }) => {
                if (response?.status !== "ok" || !response.destination) return;
                const url = new URL(response.destination);
                if (url.protocol !== "https:" || !this.isFinalHost(url.hostname)) return;
                navigation.navigate(url.href, { info: "bypass_link" });
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

    report(reason) {
        GM_xmlhttpRequest({
            method: "POST",
            url: `${this.cacheURL}/api/report`,
            headers: { "Content-Type": "application/json" },
            responseType: "json",
            data: JSON.stringify({
                url: location.href,
                reason,
            }),
            onload: ({ response }) => {
                if (response?.status !== "ok") console.error(response);
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
    add(hosts, handler) {
        if (!handler) return;
        if (![hosts].flat().includes(location.hostname)) return;

        const { hostname, href, pathname, search } = location;

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
        continue() {
            tool.click(".link-button:not(.disabled)");
            tool.click(`:has([name="cf-turnstile-response"][value]) #invisibleCaptchaShortlink`);
        },
    },
    cuttty: {
        continue() {
            tool.click("#submit-button:not([disabled])");
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
    xutio: {
        continue() {
            tool.click("#sl-primary:not([disabled])", { visible: true });
            tool.click(".get-link:not(.disabled)");
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

            win.Promise = class ModPromise extends Promise {
                constructor(executor) {
                    const wrapper = (resolve, reject) => {
                        const resolveMod = (value) => {
                            if (Array.isArray(value) && value.length === 1 && typeof value[0] === "string") {
                                resolve([]);
                            }
                            resolve(value);
                        };
                        const rejectMod = (reason) => {
                            reject(reason);
                        };
                        executor(resolveMod, rejectMod);
                    };
                    super(wrapper);
                }
            };
        },
    },
    antiAdbCore: {
        patcher() {
            const AD_REGEX = /pagead2.googlesyndication.com|securepubads.g.doubleclick.net|googletagservices.com|s.amazon-adsystem.com|googleadservices.com/;

            patch.apply(win, "fetch", (target, thisArg, argArray) => {
                const [url] = argArray;

                if (!(typeof url === "string" && AD_REGEX.test(url))) return Reflect.apply(target, thisArg, argArray);

                return target("https://jsonplaceholder.typicode.com/users", { mode: "no-cors" });
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

domains.add(["tpi.li", "oii.la", "srnky.com", "clksz.com"], templates.tpi);
domains.add(["financeehelp.com", "cloudhostt.com", "financeguidz.com", "techbixby.com", "loanbixby.com"], templates.host);
domains.add(["ouo.io", "ouo.press"], templates.ouo);
domains.add(["djxmaza.in", "smartfeecalculator.com", "gujjukhabar.in", "pdfhindibook.com"], templates.devuploads);
domains.add(["exeygo.com", "exe-links.com", "exe-urls.com", "exego.app", "exnion.com"], templates.exeio);
domains.add(["cuttty.com", "cety.app", "cutlink.net", "cutnet.net", "cuttlinks.com"], templates.cuttty);
domains.add(["boost.ink", "bst.gg"], templates.boostink);
domains.add(["invest.datapendidikan.com", "crm.urlwebsite.com", "go.fakta.id"], templates.pndk);
domains.add(["xut.io", "textfrog.com", "eduify.app", "gamescrate.app"], templates.xutio);

domains.add("linegee.net", {
    patcher() {
        templates.antiAdbCore.patcher();
        templates.pahe.patcher();
    },
    continue() {
        tool.click(".btn-primary", { wait: 4000 });
    },
});

domains.add("pahe.plus", {
    patcher() {
        templates.antiAdbCore.patcher();
        templates.pahe.patcher();
    },
    continue() {
        tool.click(":has([data-hcaptcha-response]) #invisibleCaptchaShortlink:not([disabled])");
        tool.redirect(".get-link[href^='https://']:not(.disabled)");
    },
});

domains.add("intercelestial.com", {
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

domains.add("vexfile.com", {
    continue() {
        tool.click(".generate-link:not(.blocked)");
    },
});

domains.add("filespayouts.com", {
    patcher() {
        patch.timer({ text: "tick" });
    },
    continue() {
        tool.click("#method_free");
    },
});

domains.add("modsfire.com", {
    patcher() {
        patch.timer();
    },
    continue() {
        tool.click(".download-button:not([href])");
    },
});

domains.add("www.file-upload.org", {
    continue() {
        tool.click("button[name='method_free']");
        tool.click(":has([data-hcaptcha-response]:not([data-hcaptcha-response=''])) #downloadbtn:not([disabled])");
    },
});

domains.add("upfilesgo.com", {
    continue() {
        tool.click("#link-button-free:not([disabled])");
        tool.click("#file-captcha #link-button:not([disabled])");
    },
});

domains.add("safefileku.com", {
    patcher() {
        patch.timer();
    },
    continue() {
        tool.click(":has([name='cf-turnstile-response'][value]) button[type='submit']");
    },
});

domains.add("uploadrar.com", {
    continue() {
        tool.click("button[name='method_free']");
        tool.click("#downloadbtn:not([disabled])");
    },
});

domains.add("shrinkme.click", {
    continue() {
        tool.click(".btn-primary:not([disabled])");
    },
});

domains.add("themezon.net", {
    continue() {
        tool.click("#btn2");
        tool.click("#tp-snp2");
    },
});

domains.add("en.mrproblogger.com", {
    continue() {
        tool.click(".get-link:not(.disabled)");
    },
});

domains.add("uploady.io", {
    continue() {
        tool.click("#free_dwn");
        tool.click("#downloadbtn");
    },
});

domains.add("apkadmin.com", {
    continue() {
        tool.click("#downloadbtn");
    },
});

domains.add("www.up-4ever.net", {
    continue() {
        tool.remove("#u4ab_modal");
        tool.click(`button[name="method_free"]`);

        tool.click("#downloadbtn");

        tool.click(":has([name='cf-turnstile-response'][value]) [type='submit']:not([disabled])");
        tool.click("#dl2btn");
    },
});

domains.add("cloud.unblockedgames.world", {
    continue() {
        tool.click("a[onclick]", { text: "Start Verification" });
        tool.click("#verify_button2");
        tool.click("#verify_button");

        tool.redirect("#two_steps_btn[href]");
    },
});

domains.add("fc-lc.xyz", {
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

domains.add("jobzhub.store", {
    continue() {
        tool.click("#next", { visible: true });
        tool.click("#scroll", { visible: true });
        tool.click("#glink", { visible: true });
        tool.click(`:has([name="cf-turnstile-response"][value]) #surl:not(.disabled)`);
    },
});

domains.add("aii.sh", {
    continue() {
        tool.click(`:has([name="cf-turnstile-response"][value]) button#continue`);
        tool.click(".btn-primary[href]:not(.disabled)");
    },
});

domains.add("oii.io", {
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

domains.add("aknewz.xyz", {
    continue() {
        tool.click("#next");
        tool.click("#scroll:not(.hidden)", { count: 2 });
        tool.click(`:has([name="cf-turnstile-response"][value]) #surl`);
    },
});

domains.add("toolskitpro.net", {
    continue() {
        tool.remove("div", { css: { position: "fixed" } });
        tool.click(".show #afterBtn");
        tool.click("#nxt");
        tool.click("#getl");
    },
});

domains.add("icutlink.com", {
    continue() {
        tool.click(".get-link:not(.disabled)");
    },
});

domains.add("lnbz.la", {
    patcher() {
        templates.antiAdbCore.patcher();
    },
    continue() {
        tool.click(`:has([name="cf-turnstile-response"][value]) #continue`);
        tool.click(".get-link:not(.disabled)");
    },
});

domains.add("avnsgames.com", {
    continue() {
        tool.click("#getnewlink");
    },
});

domains.add("zdrive.to", {
    continue() {
        tool.click("#freeBtn", { wait: 500 });
        tool.click("#down_1Form button", { visible: true });
        tool.click("#down_2Form button", { visible: true });
        tool.click(".btn-download:not(.disabled)");
    },
});

domains.add("cloudfam.io", {
    continue() {
        tool.redirect("#btn-clean-continue[href]");
        tool.redirect("#cf-btn-free[href]");
        tool.redirect("#free-btn[href]");
        tool.redirect("#cf-dl-btn[href]");
    },
});

domains.add("uiil.ink", {
    continue() {
        tool.click("#form-continue [type='submit']");
        tool.click(`:has([name="cf-turnstile-response"][value]) #invisibleCaptchaShortlink`);
        tool.click(`#multiLinkBtn:not(.disabled)`);
    },
});

domains.add("coinclix.co", {
    async continue() {
        tool.click("#link-card > #btnVerification");
        tool.redirect("#link-card > .btn-primary[href]");

        const linkInstructions = await tool.element("#link-instructions-body");
        const keys = linkInstructions.querySelectorAll("kbd");
        const key = keys[keys.length - 1];
        const url = `https://geekgrove.net/?key=${key.textContent}`;

        GM_openInTab(`https://www.google.com/url?sa=t&source=web&rct=j&url=${encodeURIComponent(url)}&ved=2ahUKEwjS8I_fjaDdAhXqKsAKHQLeD3cQFjAAegQIABAB`, {
            active: true,
            insert: true,
        });

        GM_addValueChangeListener("geekgrove-keys", async (_key, oldValue, newValue) => {
            tool.input("#link-card input#verificationCode", { value: newValue });
            tool.click("#link-card button#btnVerification");
        });
    },
});

domains.add("geekgrove.net", {
    patcher() {
        patch.define(win.document, "activeElement", { get: () => ({ tagName: "IFRAME" }) });
        patch.apply(win.Document.prototype, "hasFocus", () => false);

        tool.remove(".container-fluid:has(h2), body > .row, nav ~ .row, body .▶, .revbid-bottom-container, html > iframe, .▭");
    },
    async continue() {
        const key = new URLSearchParams(location.search).get("key");
        if (key) {
            const resp = await fetch("/link/process/", {
                "method": "POST",
                "credentials": "include",
                "headers": { "Content-Type": "application/json" },
                "referrer": "https://geekgrove.net/",
                "body": `{"linkInit":"${key}"}`,
            });
            const text = await resp.text();
            const match = text.match(/href=\\"([^\\]+)/)?.[1];
            if (!match) return;
            location.assign(match);
        };

        tool.click("#btnLinkStart", { text: "Start" });
        tool.click("#btnLinkContinue", { text: "Verify", wait: 1000 });
        tool.click("#btnLinkContinue", { text: "Verify" });
        tool.click("#btnLpcont", { text: "Continue" });

        const returnKey = await tool.element("#linkResHeader kbd");
        GM_setValue("geekgrove-keys", returnKey.textContent);
        window.close();
    },
});

domains.add("www.google.com", {
    continue() {
        tool.redirect("a[href^='https://']");
    },
});

domains.add("toolkit.inshorturl.com", {
    continue() {
        tool.redirect("#lkActions a[href]");
    },
});

domains.add("mahitimanch.in", {
    continue() {
        tool.click("#link");
        tool.click("#linkx");
        tool.redirect("#gtelinkbtn");
    },
});

domains.add("inshorturl.in", {
    continue() {
        tool.redirect("#ts-get-link[href^='https']");
    },
});

domains.add("rekonise.com", {
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

domains.add("safelinkearn.com", {
    continue() {
        tool.click(".open-btn");
    },
});

domains.add("www.mirrored.to", {
    continue() {
        tool.click(".get_btn");
        tool.redirect(".highlight a[href]:has(.get_btn)");
    },
});
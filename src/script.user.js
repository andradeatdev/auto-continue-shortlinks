// ==UserScript==
// @name               Pahe - Auto continue links
// @namespace          https://greasyfork.org/users/821661
// @version            1.22.3
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
// @match              https://pahe.ink/*
//
// @match              https://ouo.io/*
// @match              https://ouo.press/*
//
// From: PlatinMods
// @match              https://vexfile.com/*
// @match              https://filespayouts.com/*
// @match              https://modsfire.com/*
// @match              https://www.file-upload.org/*
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
// @match              https://aradmag.online/*
// @match              https://horrorpay.online/*
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
// @match              https://blog.adlink.click/*
// @match              https://bit.ly/*
// @match              https://adfoc.us/*
// @match              https://speedy-links.com/*
// @match              https://nerventualken.com/captcha?urid=*
// @match              https://datanodes.to/*
// @match              https://fuckingfast.co/*
// @match              https://filekeeper.net/*
// @match              https://linkvertise.com/*
// @match              https://app.khaddavi.net/*
// @match              https://sfl.gl/*
// @match              https://link4m.net/*
// @match              https://www.nexusmods.com/*
// @match              https://f95zone.to/*
// @match              https://online-fix.me/*
// @match              https://anon.to/*
// @match              https://devuploads.com/*
// @match              https://katfile.co/*
// @match              https://datavaults.co/*
// @match              https://link.snipcash.com/*
// @match              https://fdsite.lat/*
// @match              https://topshare.in/*
// @match              https://dailyuploads.net/*
// @match              https://psa.wf/*
// @match              https://get-to.link/*
// @match              https://no-bots-allowed.org/*
// 
// @match              https://premium.hairmova.com/*
// @match              https://product.hairmova.com/*
// 
// @match              https://gplinks.co/*
// @match              https://skrresults.com/*
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
// @grant              GM_info
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

const win = typeof unsafeWindow === "undefined" ? globalThis : unsafeWindow;

const config = {
    defaultTimerFactor: 0.05,

    isEnabled(name) {
        const global = storage.get(name, true);
        const local = storage.local().get(name, true);
        return global && local;
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

const storage = {
    set(key, value) {
        GM_setValue(key, value);
    },

    get(key, defaultValue) {
        return GM_getValue(key, defaultValue);
    },

    local() {
        return this.scope("@local", location.hostname);
    },
    global() {
        return this.scope("@global");
    },

    scope(ns, bucket) {
        const read = () => {
            const root = storage.get(ns, {});
            return bucket === undefined ? root : root[bucket] || {};
        };

        const scope = {
            get(key, defaultValue) {
                const value = read()[key];
                return value === undefined ? defaultValue : value;
            },
            set(key, value) {
                const root = storage.get(ns, {});

                if (bucket === undefined) {
                    root[key] = value;
                } else {
                    root[bucket] ||= {};
                    root[bucket][key] = value;
                }

                storage.set(ns, root);
            },
            merge(key, value) {
                scope.set(key, { ...scope.get(key, {}), ...value });
            },
            watch(key, callback) {
                const pick = (root) => (bucket === undefined ? root : root?.[bucket])?.[key];

                return GM_addValueChangeListener(ns, (name, oldRoot, newRoot, remote) => {
                    const before = pick(oldRoot);
                    const after = pick(newRoot);

                    if (JSON.stringify(before) === JSON.stringify(after)) return;

                    callback(after, before, remote);
                });
            },
        };

        return scope;
    },
};

const commands = {
    cmds: {
        useCache: {
            name: "Use cache - all domains",
            value: storage.get("useCache", true),

            cmds: {
                useCache: {
                    name: "This domain",
                    value: storage.local().get("useCache", true),
                },
            },
        },
        useContinue: {
            name: "Use continue - all domains",
            value: storage.get("useContinue", true),

            cmds: {
                useContinue: {
                    name: "This domain",
                    value: storage.local().get("useContinue", true),
                },
            },
        },
        usePatcher: {
            name: "Use patcher - all domains",
            value: storage.get("usePatcher", true),

            cmds: {
                usePatcher: {
                    name: "This domain",
                    value: storage.local().get("usePatcher", true),
                },
            },
        },
        supportHost: {
            name: "Support a new shortlink/host",
            action() {
                GM_openInTab("https://github.com/andradeatdev/auto-continue-shortlinks/issues/new?template=site-request.yml");
            },
        },
        reportUrl: {
            name: "Report URL issue",
            action() {
                const { script, scriptHandler, platform, userAgentData } = GM_info;

                const browser = platform?.browserName && platform.browserVersion
                    ? `${platform.browserName} ${platform.browserVersion}`
                    : userAgentData?.brands
                        ?.filter(({ brand }) => !/Not.?A.?Brand/i.test(brand))
                        .map(({ brand, version }) => `${brand} ${version}`)
                        .join(", ") || "Unknown browser";

                const params = new URLSearchParams({
                    template: "site-broken.yml",
                    url: location.href.split("?", 1)[0],
                    version: script.version,
                    env: `${browser} + ${scriptHandler} ${GM_info.version}`,
                });

                GM_openInTab(
                    `https://github.com/andradeatdev/auto-continue-shortlinks/issues/new?${params}`,
                );
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
            const isLocalEnabled = c.value;
            const domainIcon = isLocalEnabled ? "✔" : "✖";
            const icon = cmd.value ? domainIcon : "–";
            GM_registerMenuCommand(`\u{2003}└ [${icon}] ${c.name} (${name.replace("use", "").toLowerCase()})`, () => this.toggleCommandLocal(n, c));
        }
    },

    toggleCommand(name, cmd) {
        const value = storage.get(name, cmd.value);
        storage.set(name, !value);
        location.reload();
    },

    toggleCommandLocal(name, cmd) {
        const value = storage.local().get(name, cmd.value);
        storage.local().set(name, !value);
        location.reload();
    },
};

const watch = {
    OPTIONS: { childList: true, subtree: true, attributes: true, characterData: true },
    callbacks: new Set(),
    observer: undefined,
    queue: [],
    isScheduled: false,
    pending: new Set(),

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

        for (const root of this.pending) this.observer.observe(root, this.OPTIONS);
        this.pending.clear();
    },

    attach(root) {
        if (!this.observer) {
            this.pending.add(root);
            return;
        }

        this.observer.observe(root, this.OPTIONS);
        this.schedule();
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

const shadow = {
    roots: new WeakMap(),

    of(host) {
        return host.shadowRoot || this.roots.get(host) || undefined;
    },

    track(host, root) {
        this.roots.set(host, root);
        watch.attach(root);
    },

    queryAll(selector, root = document) {
        const [head, ...tail] = selector.split(">>>").map(part => part.trim());
        let nodes = [...root.querySelectorAll(head)];

        for (const part of tail) {
            nodes = nodes.flatMap((host) => {
                const inner = this.of(host);
                if (!inner) return [];

                watch.attach(inner);
                return [...inner.querySelectorAll(part)];
            });
        }

        return nodes;
    },
};

const tool = {
    guard(name, selector) {
        if (typeof selector !== "string") throw new TypeError(`[tool.${name}] 'selector' must be a string`);
    },

    shown(node, isVisible) {
        if (typeof isVisible !== "boolean") return true;
        return node.checkVisibility({ visibilityProperty: true }) === isVisible;
    },

    reads(node, text) {
        if (text === undefined || text === null) return true;
        const content = node.textContent;
        if (typeof text === "string") return content.includes(text);
        if (text instanceof RegExp) {
            text.lastIndex = 0;
            return text.test(content);
        }
        return false;
    },

    styled(node, css) {
        if (!css) return true;

        const style = getComputedStyle(node);
        return Object.entries(css).every(([key, value]) => style[key] === value);
    },

    attr(node, attr) {
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
        this.guard("select", selector);

        const nodes = shadow.queryAll(selector);
        for (const node of nodes) {
            if (this.match(node, options)) yield node;
        }
    },

    match(node, options = {}) {
        const { visible, text, css } = options;

        if (!tool.shown(node, visible)) return false;
        if (!tool.reads(node, text)) return false;
        if (!tool.styled(node, css)) return false;

        return true;
    },

    stalk(selector, options, handler) {
        this.guard("each", selector);

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

        run().catch(error => console.error(error));
        return stop;
    },

    click(selector, options = {}) {
        this.guard("click", selector);
        const { wait = 0, scroll = false, count = 1, bubbles = true, when } = options;
        const { behavior = "smooth", block = "center", inline = "center" } = scroll || {};
        let remaining = count;

        return tool.stalk(selector, options, async (node, stop) => {
            if (when && !when(node)) return false;

            if (wait > 0) await tool.wait(wait);
            if (!node.isConnected) return false;

            if (when && !when(node)) return false;

            if (scroll !== false) node.scrollIntoView({ behavior, block, inline });

            const event = new MouseEvent("click", {
                bubbles,
                cancelable: true,
                composed: true,
                view: win,
            });

            node.dispatchEvent(event);

            if (--remaining <= 0) stop();
            else return false;
        });
    },

    scroll(selector, options = {}) {
        this.guard("scroll", selector);
        const { behavior = "smooth", block = "center", inline = "center" } = options;

        return tool.stalk(selector, options, async (node, stop) => {
            node.scrollIntoView({ behavior, block, inline });
            stop();
        });
    },

    input(selector, options = {}) {
        this.guard("input", selector);
        const { value = "" } = options;

        return tool.stalk(selector, options, (node, stop) => {
            node.value = value;
            stop();
        });
    },

    remove(selector, options = {}) {
        this.guard("remove", selector);
        return tool.stalk(selector, options, (node) => node.remove());
    },

    wrap(selector, options = {}) {
        this.guard("wrap", selector);
        return tool.stalk(selector, options, (node, stop) => {
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

    hide(selector) {
        this.guard("hide", selector);
        const style = document.createElement("style");
        style.textContent = `${selector} { display: none !important; }`;
        document.documentElement.append(style);
        return () => style.remove();
    },

    redirect(selector, options = {}) {
        this.guard("redirect", selector);
        const { attr = "href", decodeB64 = false } = options;

        return tool.stalk(selector, options, async (node, stop) => {
            let url = tool.attr(node, attr);
            if (!url) return false;

            if (decodeB64 === true) {
                try { url = atob(url); } catch { return; }
            }

            stop();
            location.assign(url);
        });
    },

    element(selector, options = {}) {
        this.guard("element", selector);
        const { timeout } = options;

        return new Promise((resolve) => {
            let timer;
            let isDone = false;

            const done = tool.stalk(selector, options, (node, stop) => {
                isDone = true;
                clearTimeout(timer);
                stop();
                resolve(node);
            });

            if (!isDone && timeout > 0) {
                timer = setTimeout(() => {
                    done();
                    resolve();
                }, timeout);
            }
        });
    },

    request(url, options = {}) {
        if (typeof url !== "string") throw new TypeError("[tool.request] Missing `url` argument");

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

    turnstile(selector) {
        return `:has([name="cf-turnstile-response"][value]) ${selector}`;
    },

    hcaptcha(selector) {
        return `:has([data-hcaptcha-response]:not([data-hcaptcha-response=''])) ${selector}`;
    },

    recaptcha(selector) {
        const poll = (node) => {
            if (node.value === "") return setTimeout(() => poll(node), 500);
            node.dataset.recaptchaSolved = "";
        };
        tool.stalk("#g-recaptcha-response", {}, (node, stop) => {
            stop();
            setTimeout(() => poll(node), 500);
        });

        return `:has(#g-recaptcha-response[data-recaptcha-solved]) ${selector}`;
    },
};

const patch = {
    installToString() {
        if (patch.toStringPatched) return;
        patch.toStringPatched = true;

        patch.fnToString = win.Function.prototype.toString;
        patch.fnToStringMap = new WeakMap();

        const newToString = function () {
            const original = patch.fnToStringMap.get(this);
            return patch.fnToString.call(original || this);
        };

        patch.fnToStringMap.set(newToString, patch.fnToString);

        Object.defineProperties(newToString, {
            name: { value: "toString", configurable: true },
            length: { value: 0, configurable: true },
        });

        const desc = Object.getOwnPropertyDescriptor(win.Function.prototype, "toString");
        Object.defineProperty(win.Function.prototype, "toString", { ...desc, value: newToString });
    },

    hook(owner, property, handler) {
        const target = owner[property];
        if (typeof target !== "function") return false;

        patch.installToString();

        const traps = {};

        if (handler.apply) {
            traps.apply = (t, thisArg, argArray) => handler.apply(t, thisArg, argArray);
        }
        if (handler.construct) {
            traps.construct = (t, argArray, newTarget) => handler.construct(t, argArray, newTarget);
        }

        const proxy = new Proxy(target, traps);
        patch.fnToStringMap.set(proxy, target);

        const proto = target.prototype;
        if (proto && proto.constructor === target) {
            Object.defineProperty(proto, "constructor", {
                value: proxy,
                writable: true,
                configurable: true,
                enumerable: false,
            });
        }

        const desc = Object.getOwnPropertyDescriptor(owner, property);
        if (desc && "value" in desc) {
            Object.defineProperty(owner, property, { ...desc, value: proxy });
        } else {
            owner[property] = proxy;
        }

        return true;
    },

    apply(owner, property, applyFn) {
        return this.hook(owner, property, { apply: applyFn });
    },

    construct(owner, property, constructFn) {
        return this.hook(owner, property, { construct: constructFn });
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

    haste(options = {}) {
        const { factor = config.defaultTimerFactor, text, ms, when } = options;

        const speed = 1 / (factor || 0.001);
        const realDate = win.Date.now.bind(win.Date);
        const realPerf = win.performance.now.bind(win.performance);

        let isChecking = false;
        const isFast = () => {
            if (!when) return true;
            if (isChecking) return false;
            isChecking = true;
            try {
                return Boolean(when());
            } catch {
                return false;
            } finally {
                isChecking = false;
            }
        };

        const clock = (read) => {
            let realAt = read();
            let virtualAt = realAt;
            let isCurrentFast = false;

            return (nextFast) => {
                const real = read();

                if (nextFast !== isCurrentFast) {
                    virtualAt += (real - realAt) * (isCurrentFast ? speed : 1);
                    realAt = real;
                    isCurrentFast = nextFast;
                }

                return virtualAt + (real - realAt) * (isCurrentFast ? speed : 1);
            };
        };

        const dateNow = clock(realDate);
        const perfNow = clock(realPerf);

        const shouldScale = (fn, delay) =>
            typeof delay === "number" &&
            (ms === undefined || ms === delay) &&
            (!text || String(fn).includes(text));

        const scale = (target, thisArg, args) => {
            if (shouldScale(args[0], args[1]) && isFast()) args[1] *= factor;
            return Reflect.apply(target, thisArg, args);
        };

        patch.apply(win, "setTimeout", scale);
        patch.apply(win, "setInterval", scale);

        patch.apply(win.Date, "now", () => dateNow(isFast()));

        patch.hook(win, "Date", {
            construct: (target, args, newTarget) =>
                Reflect.construct(target, args.length > 0 ? args : [dateNow(isFast())], newTarget),
            apply: target => new target(dateNow(isFast())).toString(),
        });

        patch.apply(win.performance, "now", () => perfNow(isFast()));
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
            const [urlArg] = argArray;
            if (isValidUrl(urlArg)) return returnValue;
            return Reflect.apply(target, thisArg, argArray);
        });
    },

    listener(options = {}) {
        const { type, mode = "prevent", excludeTarget, includesText, excludeText } = options;

        patch.apply(win.EventTarget.prototype, "addEventListener", (target, thisArg, argArray) => {
            const [name, listener] = argArray;
            const listenerSource = typeof listener === "function" ? listener.toString() : "";

            const shouldBlock =
                mode === "prevent" &&
                (type === undefined || type === name) &&
                !(excludeTarget !== undefined && thisArg instanceof Element && thisArg.matches(excludeTarget)) &&
                (includesText === undefined || listenerSource.includes(includesText)) &&
                (excludeText === undefined || !listenerSource.includes(excludeText));

            if (shouldBlock) return;

            return Reflect.apply(target, thisArg, argArray);
        });
    },

    mask(selector, styles, options) {
        this.computedStyleMap ||= new Map();
        this.computedStyleMap.set(selector, { styles, options });

        if (this.computedStylePatched) return;
        this.computedStylePatched = true;

        patch.apply(win, "getComputedStyle", (target, thisArg, argArray) => {
            const [node] = argArray;
            const result = Reflect.apply(target, thisArg, argArray);

            if (!node || typeof node.matches !== "function") return result;

            for (const [sel, conf] of this.computedStyleMap) {
                if (!node.matches(sel)) continue;
                if (!tool.match(node, conf.options)) continue;

                return new Proxy(result, {
                    get(t, prop, receiver) {
                        return Object.hasOwn(conf.styles, prop) ? conf.styles[prop] : Reflect.get(t, prop, receiver);
                    },
                });
            }

            return result;
        });
    },
};

const bypass = {
    cacheURL: "https://shortlinks.zencore.fun",
    cacheMaxEntries: 50,
    shortenerPatterns: {
        "tpi.li": /^\/[A-Za-z0-9_-]{3,}$/,
        "oii.la": /^\/[A-Za-z0-9_-]{3,}$/,
        "srnky.com": /^\/[A-Za-z0-9_-]{3,}$/,
        "clksz.com": /^\/[A-Za-z0-9_-]{3,}$/,
        "pahe.plus": /^\/[A-Za-z0-9_-]{3,}$/,
        "en.mrproblogger.com": /^\/[A-Za-z0-9_-]{3,}$/,
        "intercelestial.com": /^\/\?ht=[a-zA-Z0-9%]+$/,
        "speedy-links.com": /^\/s\?[A-Za-z0-9_-]{3,}$/,
        "online-fix.me": /^\/ext\/.+$/,
        "link.snipcash.com": /^\/[A-Za-z0-9_-]{3,}$/,
    },
    finalDomains: [
        "send.now",
        "1fichier.com",
        "1024tera.com",
        /^(\w+\.)?gdflix\.(\w+)$/,
        "mega.nz",
        "vik1ngfile.site",
        "vikingfile.com",
        "pahe.plus",
        "filecrypt.cc",
        "ouo.io",
        "ouo.press",
        /^rentry.(org|co)$/,
        "bzzhr.to",
        "pixeldrain.com",
        "workupload.com",
        "datanodes.to",
        "gofile.io",
        "mxdrop.click",
        "uploadhaven.com",
    ],

    exec(hostname, href, pathname, search) {
        if (!this.cacheURL) return;

        const pattern = this.shortenerPatterns[hostname];
        if (!pattern?.test(pathname + search)) return;

        if (config.useCache) this.cache(href);
        this.listener(href);
        this.clear();
    },

    cache(href) {
        const cacheLocal = storage.global().get("bypass-local", {});
        const destCached = cacheLocal[href];
        if (destCached) return navigation.navigate(destCached, { info: "bypass_link" });

        GM_xmlhttpRequest({
            method: "GET",
            url: `${this.cacheURL}/api/check?url=${encodeURIComponent(href)}`,
            headers: { "Content-Type": "application/json" },
            responseType: "json",
            onload: ({ response }) => {
                if (response?.status !== "ok" || !response.destination) return;
                const url = new URL(response.destination);
                if (url.protocol !== "https:" || !this.trusted(url.hostname)) return;
                navigation.navigate(url.href, { info: "bypass_link" });
            },
        });
    },

    listener(href) {
        navigation.addEventListener("navigate", (event) => {
            if (event.info === "bypass_link") return;

            const destinationURL = new URL(event.destination.url);
            const isFinalHost = this.trusted(destinationURL.hostname);
            const isSameURL = destinationURL.href === href;

            if (!isFinalHost || isSameURL) return;
            event.preventDefault();

            this.save(href, destinationURL.href);
        });
    },

    save(href, destination) {
        storage.global().merge("bypass-local", { [href]: destination });

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

    clear() {
        const cacheLocal = storage.global().get("bypass-local", {});
        const entries = Object.entries(cacheLocal);
        if (entries.length <= this.cacheMaxEntries) return;

        storage.global().set("bypass-local", {});
    },

    trusted(hostname) {
        for (const domain of this.finalDomains) {
            if (typeof domain === "string" && hostname === domain) return true;
            if (domain instanceof RegExp && domain.test(hostname)) return true;
        }
    },

    title(title, links) {
        GM_xmlhttpRequest({
            method: "POST",
            url: `${this.cacheURL}/api/titles`,
            headers: { "Content-Type": "application/json" },
            responseType: "json",
            data: JSON.stringify({
                title,
                links,
            }),
            onload: (data) => {
                const { response } = data;
                if (response.status !== "ok") { console.error(response); }
            },
        });
    },

    async lookup(titles) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `${this.cacheURL}/api/titles/lookup`,
                headers: { "Content-Type": "application/json" },
                responseType: "json",
                data: JSON.stringify({
                    titles,
                }),
                onload: (data) => {
                    const { response } = data;
                    if (response.status !== "ok") { console.error(response); }
                    resolve(response.results);
                },
            });
        });
    },
};

const domains = {
    exec(stage, enabled, handler) {
        const fn = handler[stage];
        if (!fn) return;
        if (!enabled) return;

        const fail = (error) => console.error(`[${stage}]`, error);;

        try {
            fn.call(handler)?.catch?.(fail);
        } catch (error) {
            fail(error);
        }
    },

    add(hosts, handler) {
        if (!handler) return;
        if (![hosts].flat().includes(location.hostname)) return;

        const { hostname, href, pathname, search } = location;

        commands.exec();

        if (config.useCache && handler.cache) {
            handler.cache();
        } else {
            bypass.exec(hostname, href, pathname, search);
        }

        this.exec("patcher", config.usePatcher, handler);
        this.exec("continue", config.useContinue, handler);
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
            patch.haste();
            tool.hide("#masthead, aside, #content > :not(center, form), footer");
            tool.remove("div", { css: { position: "fixed" }, text: "detected" });
        },
        continue() {
            tool.click("#startButton");
            tool.click("a[href='#getmylink']");
            tool.click("#getnewlink");
        },
    },
    ouo: {
        patcher() {
            patch.haste();
        },
        continue() {
            tool.click("#btn-main:not(.disabled)");
            tool.click(tool.turnstile("#invisibleCaptchaShortlink"));
        },
    },
    exeio: {
        continue() {
            tool.click("#submit-button:not([disabled])", { count: 2 });
            tool.click(tool.turnstile("#submit-button:not([disabled])"));
        },
    },
    cuttty: {
        continue() {
            tool.click("#submit-button:not([disabled])");
        },
    },
    nobots: {
        patcher() {
            tool.hide(".single-content > :not(div), #masthead, .post-navigation, .entry-related, #comments, footer");
        },
        continue() {
            tool.scroll("#safegate-wait1");
            tool.click("#safegate-proceed-btn", { visible: true });
            tool.scroll("#safegate-wait2", { visible: true });
            tool.click("#safegate-go", { visible: true });

            tool.stalk("#safegate-reveal-overlay > div > div > span", {}, node => {
                storage.global().set("no-bots-allowed", node.textContent.trim());
                window.close();
            });
        },
    },
    boostink: {
        async continue() {
            const res = await tool.request(location.href);
            const match = /unlock.js.+[a-z]+="([^"]+)"/.exec(res.response);
            if (!match) return;

            const decoded = atob(match[1]);
            location.assign(decoded);
        },
    },
    pndk: {
        patcher() {
            const adsSelectors = ".adsbox, .pub_300x250, .ad-banner, .ad-unit, .text-ad, .adsbygoogle, .ad-placement, .textads, .banner-ads, #adsense";

            tool.hide(".crumb, .post-title, .post-meta, .share, figure, .toc, .site-footer, .side, .section-title, h1");
            patch.mask(adsSelectors, { display: "block", visibility: "visible" });
            patch.define(win.HTMLElement.prototype, "offsetParent", {
                get(getter) {
                    return this.matches(adsSelectors) ? document.body : getter();
                },
            });
            patch.define(win.HTMLElement.prototype, "offsetHeight", {
                get(getter) {
                    return this.matches(adsSelectors) ? 1 : getter();
                },
            });
            patch.define(win.HTMLElement.prototype, "offsetWidth", {
                get(getter) {
                    return this.matches(adsSelectors) ? 1 : getter();
                },
            });
            patch.define(win.HTMLImageElement.prototype, "src", {
                set() {
                    this.onerror = () => { };
                    this.onload();
                },
            });
        },
        continue() {
            tool.click(tool.turnstile("#go-btn"));
            tool.click("#step-top .step-btn:not([disabled])");
            tool.click("#step-bottom .step-btn:not([disabled])", { count: 2 });
        },
    },
    xutio: {
        continue() {
            tool.click("#sl-primary:not([disabled])", { visible: true });
            tool.click(".get-link:not(.disabled)");
        },
    },
    fclc_oii: {
        patcher() {
            patch.define(win, "AdscoreInit", { get: () => () => { } });
        },
        async continue() {
            tool.click(tool.hcaptcha("button#hCaptchaShortlink"));
            tool.click(tool.turnstile("button#submitBtn"));

            setInterval(() => document.dispatchEvent(new MouseEvent("mousemove")), 100);
        },
    },
    pahe: {
        patcher() {
            const mirror = (url, dest) => {
                // console.log("url", url, "| dest", dest);

                tool.request(url, {
                    headers: {
                        "Referer": `${location.origin}/`,
                        "Sec-Fetch-Dest": dest,
                        "Sec-Fetch-Mode": "no-cors",
                        "Sec-Fetch-Site": "same-origin",
                    },
                })
                    .then((res) => console.log("Res", res))
                    .catch((error) => console.log("Error", error));
            };

            document.addEventListener("error", event => {
                const el = event.target;

                if (el instanceof HTMLScriptElement && el.src.includes("pagead/conversion.js")) {
                    mirror(el.src, "script");
                } else if (el instanceof HTMLLinkElement && el.href.includes("120x600")) {
                    mirror(el.href, "style");
                }
            }, { capture: true });

            patch.construct(win, "Image", (target, argArray, newTarget) => {
                const img = Reflect.construct(target, argArray, newTarget);
                img.addEventListener("error", () => {
                    if (!img.src.includes("ads/banner")) return;
                    mirror(img.src, "image");
                });
                return img;
            });

            patch.construct(win, "Promise", (Target, argArray, newTarget) => {
                const [executor, ...rest] = argArray;
                if (typeof executor !== "function") return Reflect.construct(Target, argArray, newTarget);

                const wrapper = (resolve, reject) => {
                    const resolveMod = (value) => {
                        if (Array.isArray(value) && value.length === 1 && typeof value[0] === "string") {
                            return resolve([]);
                        }
                        return resolve(value);
                    };
                    return executor(resolveMod, reject);
                };
                return Reflect.construct(Target, [wrapper, ...rest], newTarget);
            });
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

            patch.apply(win.Node.prototype, "appendChild", (target, thisArg, argArray) => {
                const [node] = argArray;
                const result = Reflect.apply(target, thisArg, argArray);
                if (node.nodeName === "SLOT") {
                    const sheet = new CSSStyleSheet();
                    sheet.replaceSync("div:has([role='dialog']) { display: none !important; }");
                    thisArg.adoptedStyleSheets.push(sheet);
                }
                return result;
            });

            patch.apply(win.Document.prototype, "createElementNS", (target, thisArg, argArray) => {
                return argArray[1].includes("-") ? undefined : Reflect.apply(target, thisArg, argArray);
            });

            tool.wrap("body > div:has([role='dialog'])");
        },
    },
};

domains.add(["tpi.li", "oii.la", "srnky.com", "clksz.com"], templates.tpi);
domains.add(["financeehelp.com", "cloudhostt.com", "financeguidz.com", "techbixby.com", "loanbixby.com"], templates.host);
domains.add(["ouo.io", "ouo.press"], templates.ouo);
domains.add(["exeygo.com", "exe-links.com", "exe-urls.com", "exego.app", "exnion.com"], templates.exeio);
domains.add(["cuttty.com", "cety.app", "cutlink.net", "cutnet.net", "cuttlinks.com"], templates.cuttty);
domains.add(["boost.ink", "bst.gg"], templates.boostink);
domains.add(["invest.datapendidikan.com", "crm.urlwebsite.com", "go.fakta.id"], templates.pndk);
domains.add(["xut.io", "textfrog.com", "eduify.app", "gamescrate.app"], templates.xutio);
domains.add(["fc-lc.xyz", "oii.io"], templates.fclc_oii);
domains.add(["premium.hairmova.com", "product.hairmova.com"], templates.nobots);

domains.add("pahe.ink", {
    patcher() {
        templates.antiAdbCore.patcher();
        templates.pahe.patcher();
    },
});

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
        tool.click(tool.hcaptcha("#invisibleCaptchaShortlink:not([disabled])"));
        tool.redirect(".get-link[href^='https://']:not(.disabled)");
    },
});

domains.add("intercelestial.com", {
    patcher() {
        templates.antiAdbCore.patcher();
        templates.pahe.patcher();

        patch.listener({ type: "click", excludeTarget: ".myButton" });
        patch.apply(win, "open", () => { });
        patch.define(win, "LLct", { get: () => "1" });
        patch.define(win, "LLpd", { get: () => Date.now() - 284 });

        tool.hide(`.right-sidebar.penci_sidebar.container, .penci-home-popular-posts.container, p, ul, li, [href*="s0-greate"], #sidebar, .post-pagination, .single-breadcrumb.penci-breadcrumb.container, .penci-move-title-above.post-image, #footer-section, .post-related, #comments, .post-share.tags-share-box, .alignleft.wp-caption, #target.pk-page-ready > #sales-banner, html > div`);
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
        tool.redirect(".generate-link:not(.blocked)");
    },
});

domains.add("filespayouts.com", {
    patcher() {
        patch.haste({ text: "tick" });
    },
    continue() {
        tool.click("#method_free");
        tool.click(tool.turnstile("#downloadbtn"));
    },
});

domains.add("modsfire.com", {
    patcher() {
        patch.haste();
    },
    continue() {
        tool.click(".download-button");
    },
});

domains.add("www.file-upload.org", {
    continue() {
        tool.click("button[name='method_free']");
        tool.click(tool.hcaptcha("#downloadbtn:not([disabled])"));
    },
});

domains.add("upfilesgo.com", {
    continue() {
        tool.click("#link-button-free:not([disabled])");
        tool.click("#file-captcha #link-button:not([disabled])");
        tool.click(".get-link:not(.disabled)");
    },
});

domains.add("safefileku.com", {
    patcher() {
        patch.haste();
    },
    continue() {
        tool.click(tool.turnstile("button[type='submit']"));
    },
});

domains.add("uploadrar.com", {
    continue() {
        tool.click("button[name='method_free']");
        tool.click("#downloadbtn:not([disabled])");
        tool.click("a.btn-primary.active[href]");
    },
});

domains.add("shrinkme.click", {
    continue() {
        tool.click(tool.turnstile(".btn-primary:not([disabled])"));
        tool.click(".get-link:not(.disabled)");
    },
});

domains.add("themezon.net", {
    patcher() {
        tool.hide("nav, header, .entry > :not(#smg-spot-end), .feat, aside, .author-box, .related, footer, .share-in");
        tool.remove("#j-adblock");
    },
    continue() {
        tool.click("#smg-spot-header #j-start", { wait: 1000 });
        tool.click("#j-next:not([disabled])");
        tool.click("#smg-spot-end #j-start", { wait: 1000 });
    },
});

domains.add("en.mrproblogger.com", {
    continue() {
        tool.click(".get-link:not(.disabled)");
    },
});

domains.add("aradmag.online", {
    patcher() {
        patch.haste();
        patch.apply(win, "open", () => { });
    },
    continue() {
        tool.click("[id^='ow_step']:last-of-type button");
        tool.click("#offerContinueBtn");
        tool.click("#continueBtn:not([disabled])");
    },
});

domains.add("horrorpay.online", {
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

        tool.click(tool.turnstile("[type='submit']:not([disabled])"));
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

domains.add("jobzhub.store", {
    continue() {
        tool.click("#next", { visible: true });
        tool.click("#scroll", { visible: true });
        tool.click("#glink", { visible: true });
        tool.click(tool.turnstile("#surl:not(.disabled)"));
    },
});

domains.add("aii.sh", {
    continue() {
        tool.click(tool.turnstile("button#continue"));
        tool.click(".btn-primary[href]:not(.disabled)");
    },
});

domains.add("aknewz.xyz", {
    continue() {
        tool.click("#next");
        tool.click("#scroll:not(.hidden)", { count: 2 });
        tool.click(tool.turnstile("#surl"));
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
        tool.click(tool.turnstile("#continue"));
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
        tool.click(tool.turnstile("#invisibleCaptchaShortlink"));
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

        storage.global().watch("geekgrove-return-key", async (newValue) => {
            tool.input("#link-card input#verificationCode", { value: newValue });
            tool.click("#link-card button#btnVerification");
        });
    },
});

domains.add("geekgrove.net", {
    patcher() {
        patch.define(win.document, "activeElement", { get: () => ({ tagName: "IFRAME" }) });
        patch.apply(win.Document.prototype, "hasFocus", () => false);
        patch.listener({ type: "click", excludeTarget: "button" });

        tool.remove(".container-fluid:has(h2), body > .row, nav ~ .row, body .▶, .revbid-bottom-container, html > iframe, .▭, body > div:has(#accept-btn), div[style*='z-index']");
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
            const match = /href=\\"([^\\]+)/.exec(text);
            if (!match) return;

            location.assign(match[1]);
        };

        tool.click("#btnLinkStart", { text: "Start" });
        tool.click("#btnLinkContinue", { text: "Verify", wait: 1000 });
        tool.click("#btnLinkContinue", { text: "Verify" });
        tool.click("#btnLpcont", { text: "Continue" });

        const returnKey = await tool.element("#linkResHeader kbd");
        storage.global().set("geekgrove-return-key", returnKey.textContent);
        window.close();
    },
});

domains.add("www.google.com", {
    continue() {
        tool.redirect("a[href^='https://'], a[href^='/goto?url=']");
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

domains.add("blog.adlink.click", {
    continue() {
        tool.click(".btn.get-link:not(.disabled)");
    },
});

domains.add("bit.ly", {
    continue() {
        tool.click(`#${CSS.escape("action:continue")}`);
    },
});

domains.add("adfoc.us", {
    continue() {
        tool.click(".nv-skip");
    },
});

domains.add("speedy-links.com", {
    patcher() {
        patch.apply(win, "fetch", async (target, thisArg, argArray) => {
            const [, init] = argArray;
            if (init?.method === "POST" && typeof init.body === "string") {
                const body = init.body.replaceAll(/(?<="num_of_tasks":|"max_tasks":)\d+/g, "1");
                init.body = body;
            }

            const response = await Reflect.apply(target, thisArg, argArray);
            const clone = response.clone();
            const isJson = response.headers.get("content-type")?.includes("application/json");

            if (isJson) {
                const json = await clone.json();
                if (!Array.isArray(json)) return response;

                const tasks = json.filter(t => t.title === "Confirm you are human");

                return Response.json(tasks, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                });
            }

            return response;
        });
    },
    continue() {
        tool.click("[data-task]");
        tool.click(".d31-unlock-btn.enabled");
    },
});

domains.add("nerventualken.com", {
    continue() {
        tool.click(tool.turnstile("#go"));
    },
});

domains.add("datanodes.to", {
    continue() {
        tool.click("#method_free:not([disabled])");
        tool.click("button.py-3", { text: "Free Download" });
        tool.click("button.py-3", { text: "Start Download" });
    },
});

domains.add("fuckingfast.co", {
    continue() {
        tool.click(".link-button", { wait: 500 });
    },
});

domains.add("filekeeper.net", {
    continue() {
        tool.click("#download-button");
    },
});

domains.add("linkvertise.com", {
    patcher() {
        patch.haste({ factor: 0.05 });

        patch.apply(win.HTMLElement.prototype, "click", (target, thisArg, argArray) => {
            if (thisArg.nodeName === "A" && thisArg.href) location.assign(thisArg.href);
            return Reflect.apply(target, thisArg, argArray);
        });
    },
    continue() {
        tool.redirect("a[href]:has(> button)", { text: "Get access" });
        tool.click("ui-divider + lv-membership-plan-option");
        tool.click(":has(ui-divider + lv-membership-plan-option > div.active) .membership-plan-selection__button button");
        tool.click(".skip-button > *", { count: 4 });
        tool.click(".success-card button");
    },
});

domains.add("app.khaddavi.net", {
    continue() {
        tool.click("button.ready", { count: 4 });
    },
});

domains.add("sfl.gl", {
    continue() {
        tool.click("button", { text: "OPEN LINK" });
    },
});

domains.add("link4m.net", {
    patcher() {
        tool.remove("body > div", { text: "Adblock" });
    },
    continue() {
        tool.click(".get-link:not(.disabled)");
    },
});

domains.add("gplinks.co", {
    continue() {
        tool.redirect(".gate-btn-skip");
        tool.redirect(tool.turnstile("#captchaButton:not(.disabled)"));
    },
});

domains.add("skrresults.com", {
    patcher() {
        patch.haste({ factor: 0.01 });
    },
    continue() {
        tool.click("#VerifyBtn", { visible: true });
        tool.click("#NextBtn", { visible: true });
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

domains.add("www.nexusmods.com", {
    continue() {
        tool.click("mod-file-download >>> .nxm-button-secondary-filled-weak");
    },
});

domains.add("f95zone.to", {
    cache() {
        const params = new URLSearchParams(location.search);
        const k = params.get("k");
        if (!k) return;

        const url = `${location.origin}${location.pathname}?k=${k}`;
        bypass.cache(url);
        bypass.listener(url);
    },
    continue() {
        tool.click(tool.hcaptcha(".f95dl-go button"));
    },
});

domains.add("online-fix.me", {
    patcher() {
        patch.haste();
    },
    continue() {
        tool.click(".dl_content button[onclick]");
    },
});

domains.add("anon.to", {
    continue() {
        tool.redirect("a#continue[href]");
    },
});

domains.add("devuploads.com", {
    patcher() {
        tool.hide(".dl-promo, .dl-promo-mini, section.card-pad, .signup-band");
    },
    continue() {
        tool.click("[type='submit'][name='method_free']:not([disabled], [value*='Please wait'])", { wait: 1000, count: 2 });
        tool.click(".dl-actions button[type='submit']", { wait: 1000 });
        tool.click(".dl-actions button.is-ready", { wait: 1000 });
        tool.click(".dl-actions a[href]", { text: "Download File", wait: 1000 });
        tool.click(".dl-actions a[href].is-ready", { text: "Download File", wait: 1000 });
    },
});

domains.add("katfile.co", {
    patcher() {
        tool.hide("#kfPrem, .kf-shorts-promo, .kf-dl2-side");
    },
    continue() {
        tool.click(".kfd-slow", { wait: 1000, count: 2 });
        tool.click(tool.turnstile(".downloadbtn"));
        tool.redirect("a#dlink[href]");
    },
});

domains.add("datavaults.co", {
    continue() {
        tool.click("#original");
        tool.click(tool.recaptcha("#downloadbtn:not([disabled])"));
    },
});

domains.add("link.snipcash.com", {
    continue() {
        tool.click(tool.recaptcha("#invisibleCaptchaShortlink:not([disabled])"));
        tool.click(".get-link:not(.disabled)");
    },
});

domains.add("fdsite.lat", {
    continue() {
        tool.click(".dl-card button.btn-primary", { wait: 1000, visible: true });
    },
});

domains.add("topshare.in", {
    patcher() {
        tool.hide(".post-content-container, #normal");
    },
    continue() {
        tool.click("#btn-download", { visible: true });
    },
});

domains.add("dailyuploads.net", {
    patcher() {
        patch.haste();
    },
    continue() {
        tool.click(".du-dl-opt.is-free");
        tool.click("#downloadbtn:not([disabled])");
    },
});

domains.add("psa.wf", {
    async cache() {
        const entry = await tool.element(".entry-inner:has(> .sp-wrap)");
        const headsNode = entry.querySelectorAll(".sp-head");
        const titles = [...headsNode].filter(head => tool.match(head, { text: /-PSA$/m })).map(n => n.textContent.trim());

        const links = await bypass.lookup(titles);
        for (const link of links) {
            if (!link.found) continue;

            tool.stalk(".sp-head", { text: link.title }, n => {
                const downloadIcon = n.nextElementSibling.querySelector(".fa-download");
                const body = downloadIcon.closest(".sp-body");
                const nodeLinks = link.links.map(l => `<a href="${l}">${l}</a>`).join("<br>");
                body.insertAdjacentHTML("afterbegin", `<p>${nodeLinks}</p>`);
            });
        }
    },
    async continue() {
        if (!location.pathname.startsWith("/safegate/")) return;

        const drag = (thumb, track) => {
            const maxLeft = track.offsetWidth - thumb.offsetWidth - 4;
            const rect = thumb.getBoundingClientRect();

            const x = rect.left + (maxLeft - ((Number(thumb.style.left) || 2) - 2)) + rect.width / 2;
            const y = rect.top + rect.height / 2;

            thumb.dispatchEvent(new MouseEvent("mousedown", {
                bubbles: true,
                clientX: rect.left + rect.width / 2,
                clientY: y,
            }));

            document.dispatchEvent(new MouseEvent("mousemove", {
                bubbles: true,
                clientX: x,
                clientY: y,
            }));

            document.dispatchEvent(new MouseEvent("mouseup", {
                bubbles: true,
                clientX: x,
                clientY: y,
            }));
        };

        const track = await tool.element("#sg-track");
        const thumb = track.querySelector("#sg-thumb");
        drag(thumb, track);

        tool.stalk("#sg-code-a", {}, async (node, stop) => {
            stop();
            storage.global().set("no-bots-allowed", node.textContent.trim());
            GM_openInTab("https://no-bots-allowed.org", { active: true, insert: true });

            const input = await tool.element("input.sg-input");
            const button = await tool.element("button.sg-btn");
            storage.global().watch("no-bots-allowed", (newValue) => {
                input.value = newValue;
                button.click();
            });
        });
    },
});

domains.add("get-to.link", {
    async cache() {
        const titleNode = await tool.element("#content-box center h2");
        const pNode = await tool.element("#content-box p:has(a[href][target='_blank'])");

        const title = titleNode.textContent.trim();
        const links = [...pNode.querySelectorAll("a[href][target='_blank']")].map(l => l.href);

        bypass.title(title, links);
    },
});

domains.add("no-bots-allowed.org", {
    continue() {
        const code = storage.global().get("no-bots-allowed");

        tool.stalk("input#nba-code", {}, (node, stop) => {
            if (!code) return stop();
            node.value = code;
        });

        tool.click(":has(input#nba-code:not(:placeholder-shown)) .nba-btn");
    },
});
// ==UserScript==
// @name               Pahe - Auto continue links
// @namespace          https://greasyfork.org/users/821661
// @version            1.23.11
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
// @match              https://aradmag.online/*
//
// From: Others
// @match              https://cloud.unblockedgames.world/*
// @match              https://fc-lc.xyz/*
// @match              https://jobzhub.store/*
// @match              https://aii.sh/*
// @match              https://oii.io/*
// @match              https://aknewz.xyz/*
// @match              https://toolskitpro.net/*
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
// @match              https://fileroy.com/*
// 
// @match              https://en.mrproblogger.com/*
// @match              https://horrorpay.online/*
// @match              https://icutlink.com/*
// 
// @match              https://astrorede.com/*
// @match              https://app.lovemodz.space/*
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
// @connect            clksz.com
// @connect            srnky.com
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

                return GM_addValueChangeListener(ns, (_name, oldRoot, newRoot, remote) => {
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
    get cmds() {
        const toggle = (key) => ({
            name: `Use ${key.slice(3).toLowerCase()} - all domains`,
            value: storage.get(key, true),
            cmds: {
                [key]: { name: "This domain", value: storage.local().get(key, true) },
            },
        });

        return {
            useCache: toggle("useCache"),
            useContinue: toggle("useContinue"),
            usePatcher: toggle("usePatcher"),
            supportHost: {
                name: "Support a new shortlink/host",
                action() {
                    GM_openInTab("https://github.com/andradeatdev/auto-continue-shortlinks/discussions/10");
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

                    GM_openInTab(`https://github.com/andradeatdev/auto-continue-shortlinks/issues/new?${params}`);
                },
            },
            version: {
                name: `Version ${GM_info.script.version}`,
                action() {
                    GM_openInTab("https://github.com/andradeatdev/auto-continue-shortlinks/");
                },
            },
        };
    },

    exec() {
        for (const [name, cmd] of Object.entries(this.cmds)) {
            if (cmd.when && !cmd.when()) continue;
            this.registerMenuCommand(name, cmd);
        }
    },

    registerMenuCommand(name, cmd) {
        if (cmd.action) {
            GM_registerMenuCommand(`▶  ${cmd.name}`, () => cmd.action?.());
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
    observer: new MutationObserver((records) => watch.executor(records)),
    running: false,
    queue: [],
    isScheduled: false,
    pending: new Set(),
    attached: new WeakSet(),

    drain() {
        for (const record of this.observer.takeRecords()) this.queue.push(record);
    },

    executor(records) {
        for (const record of records) this.queue.push(record);
        this.schedule();
    },

    flush() {
        this.isScheduled = false;
        this.drain();

        const records = this.queue;
        this.queue = [];
        if (records.length === 0) return;

        for (const callback of this.callbacks) safe.run(() => callback(records));

        this.observer.takeRecords();
    },

    schedule() {
        if (this.isScheduled) return;
        this.isScheduled = true;

        const run = () => { if (this.isScheduled) this.flush(); };
        requestAnimationFrame(run);
        setTimeout(run, 200);
    },

    observe() {
        if (this.running) return;
        this.running = true;
        this.observer.observe(document.documentElement, this.OPTIONS);

        for (const root of this.pending) this.observer.observe(root, this.OPTIONS);
        this.pending.clear();
    },

    attach(root) {
        if (this.attached.has(root)) return;
        this.attached.add(root);

        if (!this.running) {
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
};

const safe = {
    run(fn, onError = console.error) {
        const fail = (error) => { onError(error); };

        try {
            const result = fn();
            return typeof result?.then === "function" ? result.then(undefined, fail) : result;
        } catch (error) {
            fail(error);
        }
    },

    url(value, base = location.href) {
        if (typeof value !== "string" || !value) return;
        return this.run(() => {
            const url = new URL(value, base);
            return url.protocol === "https:" || url.protocol === "http:" ? url.href : undefined;
        }, () => { });
    },
};

const ctxs = {
    ctxs: new Map(),

    of(name) {
        const ctx = this.ctxs.get(name) || {};
        this.ctxs.set(name, ctx);
        return ctx;
    },
};

const matcher = {
    value(actual, expected, { exact = false } = {}) {
        if (typeof expected === "function") return Boolean(expected(actual));

        if (typeof actual === "string" && expected instanceof RegExp) {
            expected.lastIndex = 0;
            return expected.test(actual);
        }

        if (!exact && typeof actual === "string" && typeof expected === "string") {
            return Boolean(expected) && actual.includes(expected);
        }

        return actual === expected;
    },

    text(actual, expected) {
        if (this.isNil(expected)) return true;

        if (typeof expected === "object" && !(expected instanceof RegExp)) {
            const { includes, excludes } = expected;
            if (includes && !matcher.value(actual, includes)) return false;
            if (excludes && matcher.value(actual, excludes)) return false;
            return true;
        }

        return matcher.value(actual, expected);
    },

    attrs(node, attrs) {
        if (this.isNil(attrs)) return true;
        return Object.entries(attrs).every(([name, expected]) => {
            if (expected === true) return node.hasAttribute(name);
            if (expected === false) return !node.hasAttribute(name);
            return matcher.value(node.getAttribute(name), expected);
        });
    },

    props(node, props) {
        if (this.isNil(props)) return true;
        return Object.entries(props).every(([key, expected]) => matcher.value(node[key], expected));
    },

    css(node, css) {
        if (this.isNil(css)) return true;
        const style = getComputedStyle(node);
        return Object.entries(css).every(([key, value]) => style[key] === value);
    },

    is(node, selector) {
        return typeof node?.matches === "function" && node.matches(selector);
    },

    visibility(node, visible) {
        if (this.isNil(visible)) return true;
        return node.checkVisibility({ visibilityProperty: true, opacityProperty: true }) === visible;
    },

    node(node, options) {
        if (this.isNil(options)) return true;
        const { is, not, attrs, props, text, visible, css, when } = options;

        const checks = [
            [!this.isNil(is), () => !this.is(node, is)],
            [!this.isNil(not), () => this.is(node, not)],
            [!this.isNil(attrs), () => !this.attrs(node, attrs)],
            [!this.isNil(props), () => !this.props(node, props)],
            [!this.isNil(text), () => !this.text(node.textContent, text)],
            [typeof visible === "boolean", () => !this.visibility(node, visible)],
            [!this.isNil(css), () => !this.css(node, css)],
            [!this.isNil(when), () => !when(node)],
        ];

        return checks.every(([enabled, test]) => !enabled || !test());
    },

    isNil(value) {
        return value === null || value === undefined;
    },
};

const shadow = {
    roots: new WeakMap(),
    isCapturing: false,

    of(host) {
        return host.shadowRoot || this.roots.get(host);
    },

    capture() {
        if (this.isCapturing) return;
        this.isCapturing = true;

        patch.apply(win.Element.prototype, "attachShadow", (target, thisArg, argArray) => {
            const root = Reflect.apply(target, thisArg, argArray);
            this.roots.set(thisArg, root);
            watch.attach(root);
            return root;
        });
    },
};

const dom = {
    stalk(selector, handler, opts = {}) {
        const { limit = Infinity } = opts;
        const seen = new WeakSet();

        let handled = 0;
        let isStopped = false;
        let isRunning = false;
        let isDirty = false;

        const handle = async (node) => {
            if (seen.has(node)) return;

            const result = await handler(node);
            if (result?.stop === true) return stop();
            if (result?.continue === true) return;

            seen.add(node);
            if (++handled >= limit) stop();
        };

        const sweep = async () => {
            for (const node of dom.select(selector, opts)) {
                if (isStopped) break;
                await handle(node);
            }
        };

        const run = async () => {
            if (isStopped) return;
            if (isRunning) { isDirty = true; return; }

            isRunning = true;
            await safe.run(sweep);
            isRunning = false;

            if (isDirty) { isDirty = false; run(); }
        };

        const unwatch = watch.change(run);
        const stop = () => { isStopped = true; unwatch(); };

        run();
        return stop;
    },

    *find(selector, root = document) {
        if (!selector.includes(">>>")) {
            yield* root.querySelectorAll(selector);
            return;
        }

        shadow.capture();

        const [head, ...tail] = selector.split(">>>").map(part => part.trim());
        yield* dom.pierce(root.querySelectorAll(head), tail);
    },

    *pierce(nodes, parts) {
        if (parts.length === 0) {
            yield* nodes;
            return;
        }

        const [part, ...rest] = parts;

        for (const host of nodes) {
            const inner = shadow.of(host);
            if (!inner) continue;

            watch.attach(inner);
            yield* dom.pierce(inner.querySelectorAll(part), rest);
        }
    },

    query(selector, options = {}) {
        const { timeout = 0 } = options;
        return new Promise((resolve, reject) => {
            let timer;

            const done = dom.stalk(selector, node => {
                clearTimeout(timer);
                resolve(node);
                return { stop: true };
            }, options);

            if (timeout > 0) {
                timer = setTimeout(() => {
                    done();
                    reject(new Error(`Timeout of ${timeout}ms reached waiting for: ${selector}`));
                }, timeout);
            }
        });
    },

    async queries(selectors, options = {}) {
        const entries = Object.entries(selectors);
        const nodes = await Promise.all(entries.map(([, selector]) => this.query(selector, options)));
        return Object.fromEntries(entries.map(([key], i) => [key, nodes[i]]));
    },

    *select(selector, options = {}) {
        for (const node of this.find(selector)) if (matcher.node(node, options)) yield node;
    },
};

const accessor = ({ read, write, erase }) => ({
    get(selector, { extra = {}, match = {} } = {}) {
        const { name } = extra;
        return dom.query(selector, match).then(node => read(node, name));
    },

    set(selector, { extra = {}, match = {} } = {}) {
        const { values = {} } = extra;
        return dom.stalk(selector, node => {
            for (const [key, value] of Object.entries(values)) write(node, key, value);
        }, { limit: 1, ...match });
    },

    remove(selector, { extra = {}, match = {} } = {}) {
        const names = [extra.names].flat();
        return dom.stalk(selector, node => {
            for (const name of names) erase(node, name);
        }, { limit: 1, ...match });
    },
});

const attr = accessor({
    read: (node, key) => node.getAttribute(key),
    write: (node, key, value) => node.setAttribute(key, value),
    erase: (node, key) => node.removeAttribute(key),
});

const prop = accessor({
    read: (node, key) => node[key],
    write: (node, key, value) => { node[key] = value; },
    erase: (node, key) => { delete node[key]; },
});

const act = {
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    click(selector, { extra = {}, match = {} } = {}) {
        const { wait = 0, scroll = false, count = 1, times = 1, event } = extra;
        const { behavior = "smooth", block = "center", inline = "center" } = scroll || {};
        const init = { bubbles: true, cancelable: true, composed: true, view: win, ...event };
        let remaining = count;

        return dom.stalk(selector, async (node) => {
            if (wait > 0) {
                await act.sleep(wait);
                if (!node.isConnected || !matcher.node(node, match)) return { continue: true };
            }

            if (scroll !== false) node.scrollIntoView({ behavior, block, inline });
            for (let i = 0; i < times; i++) node.dispatchEvent(new MouseEvent("click", init));

            return --remaining <= 0 ? { stop: true } : { continue: true };
        }, match);
    },

    scroll(selector, { extra = {}, match = {} } = {}) {
        const { behavior = "smooth", block = "center", inline = "center" } = extra;
        return dom.stalk(selector, node => node.scrollIntoView({ behavior, block, inline }), { limit: 1, ...match });
    },

    remove(selector, { match = {} } = {}) {
        return dom.stalk(selector, node => node.remove(), match);
    },

    stash(selector, { match = {} } = {}) {
        return dom.stalk(selector, node => {
            const wrapper = document.createElement("div");

            wrapper.style.cssText = `
                visibility: hidden !important;
                pointer-events: none !important;
                opacity: 0 !important;
            `;

            document.body.append(wrapper);
            wrapper.append(node);
        }, { limit: 1, ...match });
    },

    hide(selector, { extra = {} } = {}) {
        const { root = document.documentElement } = extra;
        const style = document.createElement("style");

        style.textContent = `${selector} { display: none !important; }`;
        root.append(style);

        return () => style.remove();
    },

    follow(selector, { extra = {}, match = {} } = {}) {
        const { attr = "href" } = extra;
        return dom.stalk(selector, node => {
            const href = safe.url(node.getAttribute(attr));
            if (!href) return { continue: true };
            location.assign(href);
        }, { limit: 1, attrs: { [attr]: true }, ...match });
    },
};

const captcha = {
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

        dom.stalk("#g-recaptcha-response", (node) => {
            setTimeout(() => poll(node), 500);
            return { stop: true };
        });

        return `:has(#g-recaptcha-response[data-recaptcha-solved]) ${selector}`;
    },
};

const net = {
    get(url, options = {}) {
        return this.request(url, options);
    },

    post(url, body) {
        return this.request(url, { data: body });
    },

    request(url, options = {}) {
        if (typeof url !== "string") throw new TypeError("[net.request] Missing `url` argument");

        const { method = "GET", headers = {}, data, timeout, overrideMimeType, responseType = "text", anonymous } = options;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                headers,
                responseType,
                data,
                timeout,
                overrideMimeType,
                anonymous,
                onload: resolve,
                onerror: reject,
                ontimeout: reject,
                onabort: reject,
            });
        });
    },

    json(method, url, body) {
        return this.request(url, {
            method,
            data: body && JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
            responseType: "json",
        });
    },
};

const worker = {
    url: "https://shortlinks.zencore.fun",
    links: {
        find(href) {
            return net.json("GET", `${worker.url}/api/check?url=${encodeURIComponent(href)}`);
        },

        save(href, destination) {
            return net.json("POST", `${worker.url}/api/save`, { shortlink: href, destination });
        },
    },
    titles: {
        save(title, links) {
            return net.json("POST", `${worker.url}/api/titles`, { title, links });
        },

        find(titles) {
            return net.json("POST", `${worker.url}/api/titles/lookup`, { titles });
        },
    },
};

const patch = {
    conceal(fake, original) {
        const ctx = ctxs.of("conceal");

        ctx.originals ??= new WeakMap();
        ctx.originals.set(fake, ctx.originals.get(original) ?? original);

        if (ctx.patched) return;
        ctx.patched = true;

        const proto = win.Function.prototype;
        const native = proto.toString;

        const toString = function () {
            return native.call(ctx.originals.get(this) ?? this);
        };

        Object.defineProperties(toString, {
            name: { value: "toString", configurable: true },
            length: { value: 0, configurable: true },
        });

        ctx.originals.set(toString, native);

        const desc = Object.getOwnPropertyDescriptor(proto, "toString");
        Object.defineProperty(proto, "toString", { ...desc, value: toString });
    },

    hook(owner, property, handler) {
        const target = owner[property];
        if (typeof target !== "function") return false;

        const proxy = new Proxy(target, handler);
        patch.conceal(proxy, target);

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
        if (desc && "value" in desc) Object.defineProperty(owner, property, { ...desc, value: proxy });
        else owner[property] = proxy;
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
                return getter(this);
            },
            set(v) {
                if (set) { set.call(this, v, (outV) => setter(this, outV)); return; }
                setter(this, v);
            },
        });
    },

    haste(options = {}) {
        const { factor = 0.005, text, ms, when } = options;

        const speed = 1 / (factor || 0.001);
        const realDate = win.Date.now.bind(win.Date);
        const realPerf = win.performance.now.bind(win.performance);

        let isChecking = false;
        const isFast = () => {
            if (!when) return true;
            if (isChecking) return false;

            isChecking = true;
            const result = safe.run(when);
            isChecking = false;

            return Boolean(result);
        };

        const clock = (read) => {
            let realAt = read();
            let virtualAt = realAt;
            let isCurrentFast = false;

            return (nextFast) => {
                const real = read();
                const currentSpeed = isCurrentFast ? speed : 1;

                if (nextFast !== isCurrentFast) {
                    virtualAt += (real - realAt) * currentSpeed;
                    realAt = real;
                    isCurrentFast = nextFast;
                }

                return virtualAt + (real - realAt) * currentSpeed;
            };
        };

        const dateNow = clock(realDate);
        const perfNow = clock(realPerf);

        const shouldScale = (fn, delay) =>
            typeof delay === "number" &&
            (ms === undefined || ms === delay) &&
            matcher.text(String(fn), text);

        const scale = (target, thisArg, args) => {
            if (shouldScale(args[0], args[1]) && isFast()) args[1] *= factor;
            return Reflect.apply(target, thisArg, args);
        };

        patch.apply(win, "setTimeout", scale);
        patch.apply(win, "setInterval", scale);

        patch.apply(win.Date, "now", () => dateNow(isFast()));
        patch.apply(win.performance, "now", () => perfNow(isFast()));

        patch.hook(win, "Date", {
            construct: (target, args, newTarget) =>
                Reflect.construct(target, args.length > 0 ? args : [dateNow(isFast())], newTarget),
            apply: target => new target(dateNow(isFast())).toString(),
        });
    },

    fetch(options = {}) {
        const { url, returnValue = Object.create(null) } = options;

        const isMatch = (input) => matcher.text(String(input?.url ?? input), url);

        patch.apply(win, "fetch", (target, thisArg, argArray) => {
            const [urlArg] = argArray;
            if (isMatch(urlArg)) return returnValue;

            return Reflect.apply(target, thisArg, argArray);
        });
    },

    listener(options = {}) {
        const { type, target, text } = options;
        const sourceOf = fn => typeof fn === "function" ? fn.toString() : "";

        patch.apply(win.EventTarget.prototype, "addEventListener", (fn, thisArg, argArray) => {
            const [name, listener] = argArray;
            const original = () => Reflect.apply(fn, thisArg, argArray);

            if (!matcher.isNil(type) && !matcher.value(name, type, { exact: true })) return original();
            if (!matcher.node(thisArg, target)) return original();
            if (!matcher.isNil(text) && !matcher.text(sourceOf(listener), text)) return original();
        });
    },

    mask(selector, { extra = {}, options = {} } = {}) {
        const ctx = ctxs.of("mask");

        ctx.map ??= new Map();
        ctx.map.set(selector, { styles: extra.styles, options });

        if (ctx.patched) return;
        ctx.patched = true;

        patch.apply(win, "getComputedStyle", (target, thisArg, argArray) => {
            const result = Reflect.apply(target, thisArg, argArray);
            const [node] = argArray;

            if (!node?.matches) return result;

            const match = ctx.map.entries()
                .find(([sel, conf]) => matcher.node(node, { ...conf.options, is: sel }))?.[1];

            if (!match) return result;

            return new Proxy(result, {
                get(t, prop) {
                    if (Object.hasOwn(match.styles, prop)) return match.styles[prop];
                    const value = Reflect.get(t, prop, t);
                    return typeof value === "function" ? value.bind(t) : value;
                },
            });
        });
    },
};

const bypass = {
    SLUG_PATTERN: /^\/[A-Za-z0-9_-]{3,}$/,
    gatePatterns: {
        "clksz.com": /^\/r\/[^/]+\/.+$/,
        "srnky.com": /^\/r\/[^/]+\/.+$/,
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
        "flycutlink.com",
        "drive.google.com",
    ],

    exec(href, pathname, search, pattern) {
        if (!worker.url || !pattern.test(pathname + search)) return;

        this.cache(href);
        this.listener(href);
    },

    trusted(hostname) {
        return this.finalDomains.some(domain => matcher.value(hostname, domain, { exact: true }));
    },

    async cache(href) {
        const { response } = await worker.links.find(href);
        if (response?.status !== "ok" || !response.destination) return;

        const url = new URL(response.destination);
        if (url.protocol !== "https:" || !this.trusted(url.hostname)) return;

        navigation.navigate(url.href, { info: "bypass_link" });
    },

    listener(href) {
        navigation.addEventListener("navigate", (event) => {
            if (event.info === "bypass_link") return;

            const dest = new URL(event.destination.url);
            if (dest.href === href) return;

            if (this.trusted(dest.hostname)) {
                event.preventDefault();
                this.save(href, dest.href);
                return;
            }

            if (this.gate(dest)) {
                event.preventDefault();
                this.follow(href, dest.href);
            }
        });
    },

    gate(dest) {
        const pattern = this.gatePatterns[dest.hostname];
        if (!pattern) return false;

        return pattern.test(dest.pathname + dest.search);
    },

    async follow(href, destination) {
        const res = await net.get(destination, {
            headers: {
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                Host: location.hostname,
                Referer: location.href,
                Cookie: document.cookie,
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
            },
        });

        const final = new URL(res.finalUrl);
        if (!this.trusted(final.hostname)) {
            navigation.navigate(final.href, { info: "bypass_link" });
            return;
        }
        await this.save(href, final.href);
    },

    async save(href, destination) {
        if (typeof href !== "string" || typeof destination !== "string") {
            console.error("Can't save shortlink, 'href' and 'destination' args need be a string");
            return;
        }

        const res = worker.links.save(href, destination).catch(console.error);
        const result = await Promise.race([res, act.sleep(1500)]);
        if (result && result.response?.status !== "ok") console.error(result.response);
        navigation.navigate(destination, { info: "bypass_link", history: "replace" });
    },

    async title(title, links) {
        const { response } = await worker.titles.save(title, links);
        if (response?.status !== "ok") console.error(response);
    },

    async lookup(titles) {
        const { response } = await worker.titles.find(titles);

        if (response?.status !== "ok") console.error(response);
        if (!response?.results) console.error("Titles undefined");

        return response?.results || [];
    },
};

const domains = {
    STAGES: ["cache", "patcher", "continue"],

    exec(stage, enabled, handler) {
        const fn = handler[stage];
        if (!fn || !enabled) return;

        safe.run(() => fn.call(handler), error => console.error(`[${stage}]`, error));
    },

    add(hosts, ...parts) {
        if (![hosts].flat().includes(location.hostname)) return;

        const handler = this.compose(...parts.filter(Boolean));
        const { href, pathname, search } = location;

        commands.exec();

        if (config.useCache && handler.cache) {
            handler.cache();
        } else if (config.useCache && handler.shortlink) {
            bypass.exec(href, pathname, search, handler.shortlink);
        }

        this.exec("patcher", config.usePatcher, handler);
        this.exec("continue", config.useContinue, handler);
    },

    compose(...parts) {
        const merged = Object.assign({}, ...parts);

        for (const stage of this.STAGES) {
            const fns = parts.map(part => part[stage]).filter(Boolean);
            if (fns.length === 0) continue;

            merged[stage] = function () {
                return Promise.all(fns.map(fn =>
                    safe.run(() => fn.call(this), error => console.error(`[${stage}]`, error)),
                ));
            };
        }

        return merged;
    },
};

const generics = {
    haste: (options) => ({ patcher() { patch.haste(options); } }),
    getLink: {
        continue() {
            act.click(".get-link:not(.disabled)");
        },
    },
    pahe: {
        patcher() {
            const mirror = (url, dest) => {
                net.request(url, {
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

            patch.apply(win.Node.prototype, "appendChild", (target, thisArg, argArray) => {
                const [node] = argArray;
                const result = Reflect.apply(target, thisArg, argArray);

                const hasHifen = node.tagName?.includes("-");
                if (hasHifen) {
                    node.remove();
                    return;
                }

                const isModal = node.getHTML?.().includes("adblock");
                if (isModal) {
                    node.remove();
                    return;
                }

                if (node.nodeName === "SLOT") {
                    act.hide(":not(slot)", { extra: { root: node.getRootNode() } });
                    return;
                }

                return result;
            });
        },
    },
};

domains.add(["tpi.li", "oii.la", "srnky.com", "clksz.com"], generics.antiAdbCore, generics.pahe, {
    shortlink: bypass.SLUG_PATTERN,
    patcher() {
        attr.remove(":is(html, body)[style]", { extra: { names: "style" }, match: { limit: 20 } });
        patch.apply(win.Object, "getOwnPropertyDescriptor", (target, thisArg, argArray) => {
            const [obj, prop] = argArray;
            const desc = Reflect.apply(target, thisArg, argArray);
            if (prop === "isTrusted" && obj instanceof Event) {
                return { ...desc, get: () => true };
            }
            return desc;
        });
    },
    continue() {
        act.click("form button.btn-primary:not([disabled])");
        act.click("button.btn-success:not(.disabled)");
    },
});

domains.add(["financeehelp.com", "cloudhostt.com", "financeguidz.com", "techbixby.com", "loanbixby.com"], {
    patcher() {
        patch.haste();
        act.hide("#masthead, aside, #content > :not(center, form), footer");
        act.remove("div", { match: { css: { position: "fixed" }, text: "detected" } });
    },
    continue() {
        act.click("#startButton", { extra: { wait: 2000 } });
        act.click("#getnewlink", { match: { visible: true } });
    },
});

domains.add(["ouo.io", "ouo.press"], {
    patcher() {
        patch.haste();
    },
    continue() {
        act.click("#btn-main:not(.disabled)");
        act.click(dom.turnstile("#invisibleCaptchaShortlink"));
    },
});

domains.add(["exeygo.com", "exe-links.com", "exe-urls.com", "exego.app", "exnion.com"], {
    continue() {
        act.click("#submit-button:not([disabled])", { extra: { count: 2 } });
        act.click(dom.turnstile("#submit-button:not([disabled])"));
    },
});

domains.add(["cuttty.com", "cety.app", "cutlink.net", "cutnet.net", "cuttlinks.com"], {
    continue() {
        act.click("#submit-button:not([disabled])");
    },
});

domains.add(["boost.ink", "bst.gg"], {
    async continue() {
        const res = await net.request(location.href);
        const match = /unlock.js.+[a-z]+="([^"]+)"/.exec(res.response);
        if (!match) return;

        const target = safe.url(atob(match[1]));
        location.assign(target);
    },
});

domains.add(["invest.datapendidikan.com", "crm.urlwebsite.com", "go.fakta.id"], {
    patcher() {
        const adsSelectors = ".adsbox, .pub_300x250, .ad-banner, .ad-unit, .text-ad, .adsbygoogle, .ad-placement, .textads, .banner-ads, #adsense";

        act.hide(".crumb, .post-title, .post-meta, .share, figure, .toc, .site-footer, .side, .section-title, h1");
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
        act.click("#go-btn:not([disabled])");
        act.click("#step-top .step-btn:not([disabled])");
        act.click("#step-bottom .step-btn:not([disabled])", { extra: { count: 2 } });
    },
});

domains.add(["xut.io", "textfrog.com", "eduify.app", "gamescrate.app"], {
    continue() {
        act.click("#sl-primary:not([disabled])", { match: { visible: true } });
        act.click(".get-link:not(.disabled)");
    },
});

domains.add(["fc-lc.xyz", "oii.io"], {
    patcher() {
        patch.define(win, "AdscoreInit", { get: () => () => { } });
    },
    async continue() {
        act.click(dom.hcaptcha("button#hCaptchaShortlink"));
        act.click(dom.turnstile("button#submitBtn"));

        setInterval(() => document.dispatchEvent(new MouseEvent("mousemove")), 100);
    },
});

domains.add(["premium.hairmova.com", "product.hairmova.com"], {
    patcher() {
        act.hide(".single-content > :not(div), #masthead, .post-navigation, .entry-related, #comments, footer");
    },
    continue() {
        act.scroll("#safegate-wait1");
        act.click("#safegate-proceed-btn", { match: { visible: true } });
        act.scroll("#safegate-wait2", { match: { visible: true } });
        act.click("#safegate-go", { match: { visible: true } });

        dom.stalk("#safegate-reveal-overlay > div > div > span", node => {
            storage.global().set("no-bots-allowed", node.textContent.trim());
            window.close();
        });
    },
});

domains.add("pahe.ink", {
    patcher() {
        generics.antiAdbCore.patcher();
        generics.pahe.patcher();
    },
});

domains.add("linegee.net", {
    patcher() {
        generics.antiAdbCore.patcher();
        generics.pahe.patcher();
    },
    continue() {
        act.click(".btn-primary", { extra: { wait: 4000 } });
    },
});

domains.add("pahe.plus", {
    patcher() {
        generics.antiAdbCore.patcher();
        generics.pahe.patcher();
        patch.listener({ type: "click", target: { not: "#invisibleCaptchaShortlink" } });
        act.hide(".banner, body > [style*='fixed'], html > div");
    },
    continue() {
        act.click(dom.hcaptcha("#invisibleCaptchaShortlink:not([disabled])"), { extra: { event: { bubbles: false } } });
        act.follow(".get-link[href^='https://']:not(.disabled)");
    },
});

domains.add("intercelestial.com", {
    patcher() {
        generics.antiAdbCore.patcher();
        generics.pahe.patcher();

        patch.listener({ type: "click", target: { not: ".myButton" } });
        patch.apply(win, "open", () => { });
        patch.define(win, "LLct", { get: () => "1" });
        patch.define(win, "LLpd", { get: () => Date.now() - 284 });

        act.hide(`.right-sidebar.penci_sidebar.container, .penci-home-popular-posts.container, p, ul, li, [href*="s0-greate"], #sidebar, .post-pagination, .single-breadcrumb.penci-breadcrumb.container, .penci-move-title-above.post-image, #footer-section, .post-related, #comments, .post-share.tags-share-box, .alignleft.wp-caption, #target.pk-page-ready > #sales-banner, html > div`);
    },
    continue() {
        act.click(".myButton", { extra: { count: 3, event: { bubbles: false } } });
    },
    async cache() {
        const pattern = bypass.shortenerPatterns[location.hostname];
        if (pattern?.test(location.pathname + location.search)) bypass.cache(location.href);

        if (/^\?ht=[a-zA-Z0-9%]+$/.test(location.search)) {
            sessionStorage.setItem("acs-shortlink", location.href);
        };

        const xxc = await dom.query("#xxc[href]");
        const shortlink = sessionStorage.getItem("acs-shortlink");
        if (xxc && shortlink) {
            window.stop();
            bypass.save(shortlink, xxc.href);
        }
    },
});

domains.add("vexfile.com", {
    continue() {
        act.follow(".generate-link[href]:not(.blocked)");
    },
});

domains.add("filespayouts.com", {
    patcher() {
        patch.haste({ text: "tick" });
    },
    continue() {
        act.click("#method_free");
        act.click(dom.turnstile("#downloadbtn"));
    },
});

domains.add("modsfire.com", {
    patcher() {
        patch.haste();
    },
    continue() {
        act.click(".download-button");
    },
});

domains.add("www.file-upload.org", {
    continue() {
        act.click("button[name='method_free']");
        act.click(dom.hcaptcha("#downloadbtn:not([disabled])"));
    },
});

domains.add("upfilesgo.com", {
    continue() {
        act.click("#link-button-free:not([disabled])");
        act.click("#file-captcha #link-button:not([disabled])");
        act.click(".get-link:not(.disabled)");
    },
});

domains.add("safefileku.com", {
    patcher() {
        patch.haste();
    },
    continue() {
        act.click(dom.turnstile("button[type='submit']"));
    },
});

domains.add("uploadrar.com", {
    continue() {
        act.click("button[name='method_free']");
        act.click("#downloadbtn:not([disabled])");
        act.click("a.btn-primary.active[href]");
    },
});

domains.add("shrinkme.click", {
    continue() {
        act.click(dom.turnstile(".btn-primary:not([disabled])"));
        act.click(".get-link:not(.disabled)");
    },
});

domains.add("themezon.net", {
    patcher() {
        act.hide("nav, header, .entry > :not(#smg-spot-end), .feat, aside, .author-box, .related, footer, .share-in");
        act.remove("#j-adblock");
    },
    continue() {
        act.click("#smg-spot-header #j-start", { extra: { wait: 1000 } });
        act.click("#j-next:not([disabled])");
        act.click("#smg-spot-end #j-start", { extra: { wait: 1000 } });
    },
});

domains.add(["en.mrproblogger.com", "horrorpay.online", "icutlink.com"], {
    continue() {
        act.click(".get-link:not(.disabled)");
    },
});

domains.add("aradmag.online", {
    patcher() {
        patch.haste();
        patch.apply(win, "open", () => { });
    },
    continue() {
        act.click("[id^='ow_step']:last-of-type button");
        act.click("#offerContinueBtn");
        act.click("#continueBtn:not([disabled])");
    },
});

domains.add("uploady.io", {
    continue() {
        act.click("#free_dwn");
        act.click("#downloadbtn");
    },
});

domains.add("apkadmin.com", {
    continue() {
        act.click("#downloadbtn");
    },
});

domains.add("www.up-4ever.net", {
    continue() {
        act.remove("#u4ab_modal");
        act.click(`button[name="method_free"]`);

        act.click("#downloadbtn");

        act.click(dom.turnstile("[type='submit']:not([disabled])"));
        act.click("#dl2btn");
    },
});

domains.add("cloud.unblockedgames.world", {
    continue() {
        act.click("a[onclick]", { match: { text: "Start Verification" } });
        act.click("#verify_button2");
        act.click("#verify_button");

        act.follow("#two_steps_btn[href]");
    },
});

domains.add("jobzhub.store", {
    continue() {
        act.click("#next", { match: { visible: true } });
        act.click("#scroll", { match: { visible: true } });
        act.click("#glink", { match: { visible: true } });
        act.click(dom.turnstile("#surl:not(.disabled)"));
    },
});

domains.add("aii.sh", {
    continue() {
        act.click(dom.turnstile("button#continue"));
        act.click(".btn-primary[href]:not(.disabled)");
    },
});

domains.add("aknewz.xyz", {
    continue() {
        act.click("#next");
        act.click("#scroll:not(.hidden)", { extra: { count: 2 } });
        act.click(dom.turnstile("#surl"));
    },
});

domains.add("toolskitpro.net", {
    continue() {
        act.remove("div", { match: { css: { position: "fixed" } } });
        act.click(".show #afterBtn");
        act.click("#nxt");
        act.click("#getl");
    },
});

domains.add("lnbz.la", {
    patcher() {
        generics.antiAdbCore.patcher();
    },
    continue() {
        act.click(dom.turnstile("#continue"));
        act.click(".get-link:not(.disabled)");
    },
});

domains.add("avnsgames.com", {
    continue() {
        act.click("#getnewlink");
    },
});

domains.add("zdrive.to", {
    continue() {
        act.click("#freeBtn", { extra: { wait: 500 } });
        act.click("#down_1Form button", { match: { visible: true } });
        act.click("#down_2Form button", { match: { visible: true } });
        act.click(".btn-download:not(.disabled)");
    },
});

domains.add("cloudfam.io", {
    continue() {
        act.follow("#btn-clean-continue[href]");
        act.follow("#cf-btn-free[href]");
        act.follow("#free-btn[href]");
        act.follow("#cf-dl-btn[href]");
    },
});

domains.add("uiil.ink", {
    continue() {
        act.click("#form-continue [type='submit']");
        act.click(dom.turnstile("#invisibleCaptchaShortlink"));
        act.click(`#multiLinkBtn:not(.disabled)`);
    },
});

domains.add("coinclix.co", {
    async continue() {
        act.click("#link-card > #btnVerification");
        act.follow("#link-card > .btn-primary[href]");

        const linkInstructions = await dom.query("#link-instructions-body");
        const keys = linkInstructions.querySelectorAll("kbd");
        const key = keys[keys.length - 1];
        const url = `https://geekgrove.net/?key=${key.textContent}`;

        GM_openInTab(`https://www.google.com/url?sa=t&source=web&rct=j&url=${encodeURIComponent(url)}&ved=2ahUKEwjS8I_fjaDdAhXqKsAKHQLeD3cQFjAAegQIABAB`, {
            active: true,
            insert: true,
        });

        storage.global().watch("geekgrove-return-key", async (newValue) => {
            act.prop("#link-card input#verificationCode", { values: { value: newValue } });
            act.click("#link-card button#btnVerification");
        });
    },
});

domains.add("geekgrove.net", {
    patcher() {
        patch.define(win.document, "activeElement", { get: () => ({ tagName: "IFRAME" }) });
        patch.apply(win.Document.prototype, "hasFocus", () => false);
        patch.listener({ type: "click", target: { not: "button" } });

        act.remove(".container-fluid:has(h2), body > .row, nav ~ .row, body .▶, .revbid-bottom-container, html > iframe, .▭, body > div:has(#accept-btn), div[style*='z-index']");
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

            const target = safe.url(match[1]);
            if (target) location.assign(target);
        };

        act.click("#btnLinkStart", { match: { text: "Start" } });
        act.click("#btnLinkContinue", { match: { text: "Verify" }, extra: { wait: 1000 } });
        act.click("#btnLinkContinue", { match: { text: "Verify" } });
        act.click("#btnLpcont", { match: { text: "Continue" } });

        const returnKey = await dom.query("#linkResHeader kbd");
        storage.global().set("geekgrove-return-key", returnKey.textContent);
        window.close();
    },
});

domains.add("www.google.com", {
    continue() {
        act.follow("a[href^='https://'], a[href^='/goto?url=']");
    },
});

domains.add("toolkit.inshorturl.com", {
    continue() {
        act.follow("#lkActions a[href]");
    },
});

domains.add("mahitimanch.in", {
    continue() {
        act.click("#link");
        act.click("#linkx");
        act.follow("#gtelinkbtn[href]");
    },
});

domains.add("inshorturl.in", {
    continue() {
        act.follow("#ts-get-link[href^='https']");
    },
});

domains.add("blog.adlink.click", {
    continue() {
        act.click(".btn.get-link:not(.disabled)");
    },
});

domains.add("bit.ly", {
    continue() {
        act.click(`#${CSS.escape("action:continue")}`);
    },
});

domains.add("adfoc.us", {
    continue() {
        act.click(".nv-skip");
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
        act.click("[class*='task-list'] > *");
        act.click("[class*='unlock-btn'].enabled");
    },
});

domains.add("nerventualken.com", {
    continue() {
        act.click(dom.turnstile("#go"));
    },
});

domains.add("datanodes.to", {
    continue() {
        act.click("#method_free:not([disabled])");
        act.click("button.py-3", { match: { text: "Free Download" } });
        act.click("button.py-3", { match: { text: "Start Download" } });
    },
});

domains.add("fuckingfast.co", {
    continue() {
        act.click(".link-button", { extra: { wait: 500 } });
    },
});

domains.add("filekeeper.net", {
    continue() {
        act.click("#download-button");
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
        act.follow("a[href]:has(> button)", { match: { text: "Get access" } });
        act.click("ui-divider + lv-membership-plan-option");
        act.click(":has(ui-divider + lv-membership-plan-option > div.active) .membership-plan-selection__button button");
        act.click(".skip-button > *", { extra: { count: 4 } });
        act.click(".success-card button");
    },
});

domains.add("app.khaddavi.net", {
    continue() {
        act.click("button.ready", { extra: { count: 4 } });
    },
});

domains.add("sfl.gl", {
    continue() {
        act.click("button", { match: { text: "OPEN LINK" } });
    },
});

domains.add("link4m.net", {
    patcher() {
        act.remove("body > div", { match: { text: "Adblock" } });
    },
    continue() {
        act.click(".get-link:not(.disabled)");
    },
});

domains.add("gplinks.co", {
    continue() {
        act.follow(".gate-btn-skip[href]");
        act.follow(dom.turnstile("#captchaButton[href]:not(.disabled)"));
    },
});

domains.add("skrresults.com", {
    patcher() {
        patch.haste({ factor: 0.01 });
    },
    continue() {
        act.click("#VerifyBtn", { match: { visible: true } });
        act.click("#NextBtn", { match: { visible: true } });
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
        act.click(".action-button:not([disabled])", { extra: { count: 10 } });
        act.click(":has(.all-done-row) .cta-button:not([disabled])", { extra: { wait: 2000 } });
    },
});

domains.add("safelinkearn.com", {
    continue() {
        act.click(".open-btn");
    },
});

domains.add("www.mirrored.to", {
    continue() {
        act.click(".get_btn");
        act.follow(".highlight a[href]:has(.get_btn)");
    },
});

domains.add("www.nexusmods.com", {
    continue() {
        act.click("mod-file-download >>> .nxm-button-secondary-filled-weak");
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
        act.click(dom.hcaptcha(".f95dl-go button"));
    },
});

domains.add("online-fix.me", {
    patcher() {
        patch.haste();
    },
    continue() {
        act.click(".dl_content button[onclick]");
    },
});

domains.add("anon.to", {
    continue() {
        act.follow("a#continue[href]");
    },
});

domains.add("devuploads.com", {
    patcher() {
        act.hide(".dl-promo, .dl-promo-mini, section.card-pad, .signup-band");
    },
    continue() {
        act.click("[type='submit'][name='method_free']:not([disabled], [value*='Please wait'])", { extra: { wait: 1000, count: 2 } });
        act.click(".dl-actions button[type='submit']", { extra: { wait: 1000 } });
        act.click(".dl-actions button.is-ready", { extra: { wait: 1000 } });
        act.click(".dl-actions a[href]", { match: { text: "Download File" }, extra: { wait: 1000 } });
        act.click(".dl-actions a[href].is-ready", { match: { text: "Download File" }, extra: { wait: 1000 } });
    },
});

domains.add("katfile.co", {
    patcher() {
        act.hide("#kfPrem, .kf-shorts-promo, .kf-dl2-side");
    },
    continue() {
        act.click(".kfd-slow", { extra: { wait: 1000, count: 2 } });
        act.click(dom.turnstile(".downloadbtn"));
        act.follow("a#dlink[href]");
    },
});

domains.add("datavaults.co", {
    continue() {
        act.click("#original");
        act.click(dom.recaptcha("#downloadbtn:not([disabled])"));
    },
});

domains.add("link.snipcash.com", {
    continue() {
        act.click(dom.recaptcha("#invisibleCaptchaShortlink:not([disabled])"));
        act.click(".get-link:not(.disabled)");
    },
});

domains.add("fdsite.lat", {
    continue() {
        act.click(".dl-card button.btn-primary", { extra: { wait: 1000 }, match: { visible: true } });
    },
});

domains.add("topshare.in", {
    patcher() {
        act.hide(".post-content-container, #normal");
    },
    continue() {
        act.click("#btn-download", { match: { visible: true } });
    },
});

domains.add("dailyuploads.net", {
    patcher() {
        patch.haste();
    },
    continue() {
        act.click(".du-dl-opt.is-free");
        act.click("#downloadbtn:not([disabled])");
    },
});

domains.add("psa.wf", {
    async cache() {
        const entry = await dom.query(".entry-inner:has(> .sp-wrap)");
        const headsNode = entry.querySelectorAll(".sp-head");
        const titles = [...headsNode].filter(head => matcher.node(head, { text: /-PSA$/m })).map(n => n.textContent.trim());

        const links = await bypass.lookup(titles);
        for (const link of links) {
            if (!link.found) continue;

            dom.stalk(".sp-head", n => {
                const downloadIcon = n.nextElementSibling?.querySelector(".fa-download");
                const body = downloadIcon?.closest(".sp-body");
                const nodeLinks = link.links.map(l => `<a href="${l}">${l}</a>`).join("<br>");
                body?.insertAdjacentHTML("afterbegin", `<p>${nodeLinks}</p>`);
            }, { text: link.title });
        }
    },
    async continue() {
        if (!location.pathname.startsWith("/safegate/")) return;

        const fire = (target, type, clientX, clientY) => target.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX, clientY }));

        const drag = (thumb, track) => {
            const maxLeft = track.offsetWidth - thumb.offsetWidth - 4;
            const rect = thumb.getBoundingClientRect();

            const x = rect.left + (maxLeft - ((Number(thumb.style.left) || 2) - 2)) + rect.width / 2;
            const y = rect.top + rect.height / 2;

            fire(thumb, "mousedown", rect.left + rect.width / 2, y);
            fire(document, "mousemove", x, y);
            fire(document, "mouseup", x, y);
        };

        const track = await dom.query("#sg-track");
        const thumb = track.querySelector("#sg-thumb");
        drag(thumb, track);

        dom.stalk("#sg-code-a", async (node) => {
            storage.global().set("no-bots-allowed", node.textContent.trim());
            GM_openInTab("https://no-bots-allowed.org", { active: true, insert: true });

            const { input, button } = await dom.queries({
                input: "input.sg-input",
                button: "button.sg-btn",
            });
            storage.global().watch("no-bots-allowed", (newValue) => {
                input.value = newValue;
                button.click();
            });

            return { stop: true };
        });
    },
});

domains.add("get-to.link", {
    async cache() {
        const { titleNode, pNode } = await dom.queries({
            titleNode: "#content-box center h2",
            pNode: "#content-box p:has(a[href][target='_blank'])",
        });

        const title = titleNode.textContent.trim();
        const links = [...pNode.querySelectorAll("a[href][target='_blank']")].map(l => l.href);

        bypass.title(title, links);
    },
});

domains.add("no-bots-allowed.org", {
    continue() {
        const code = storage.global().get("no-bots-allowed");

        dom.stalk("input#nba-code", node => {
            if (!code) return { stop: true };
            node.value = code;
        });

        act.click(":has(input#nba-code:not(:placeholder-shown)) .nba-btn");
    },
});

domains.add("fileroy.com", {
    continue() {
        act.click(".fr-gate-button:not([disabled])");
        act.click(".download-file-link", { extra: { wait: 1000 } });
    },
});

domains.add("astrorede.com", {
    continue() {
        act.click("#bt");
        act.click("#bt", { match: { text: "CONTINUAR" } });
    },
});

domains.add("app.lovemodz.space", {
    patcher() {
        patch.haste();
    },
    continue() {
        act.click("#sl-g1");
        act.click("#sl-g3", { match: { visible: true } });
        act.click("#sl-g5", { match: { visible: true } });
    },
});
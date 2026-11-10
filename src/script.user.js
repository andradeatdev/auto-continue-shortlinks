// ==UserScript==
// @name               Pahe - Auto continue links
// @namespace          https://greasyfork.org/users/821661
// @version            1.26.2
// @description        Auto-continues shortlinks (pahe and similar hosts): clicks continue/download buttons, speeds up timers, and stores reached destinations on Cloudflare Worker for instant next-time access.
// @author             hdyzen
//
// From: Pahe
// @match              https://tpi.li/*
// @match              https://oii.la/*
// @match              https://srnky.com/*
// @match              https://clksz.com/*
// @match              https://aii.sh/*
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
// @match              https://en.thenaukriadda.in/*
// 
// @match              https://alpharede.com/*
// @match              https://forumdinheiro.com/*
// @match              https://guis2.com/*
// @match              https://horoscopeonday.com/*
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
// @match              https://www.filecrypt.cc/*
// 
// @run-at             document-start
// @icon               https://www.google.com/s2/favicons?domain=pahe.ink
// 
// @grant              GM_xmlhttpRequest
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_deleteValue
// @grant              GM_addValueChangeListener
// @grant              GM_removeValueChangeListener
// @grant              GM_registerMenuCommand
// @grant              GM_openInTab
// @grant              GM_info
// @grant              unsafeWindow
// @grant              window.close
// 
// @connect            shortlinks.zencore.fun
// @connect            intercelestial.com
// @connect            tpi.li
// @connect            oii.la
// @connect            srnky.com
// @connect            clksz.com
// @connect            aii.sh
//
// @copyright          2024-2026 hdyzen (andradeatdev) — https://github.com/andradeatdev/auto-continue-shortlinks/
// @license            GPL-3.0
// @homepageURL        https://github.com/andradeatdev/auto-continue-shortlinks/
// ==/UserScript==

// Copyright (C) 2026 hdyzen (andradeatdev). This script is free software:
// you may copy, modify and redistribute it only under the GNU General Public
// License v3. Source and this notice must be kept intact (GPL-3.0, §4–§5).

const win = typeof unsafeWindow === "undefined" ? globalThis : unsafeWindow;

// ===== L0 — base: safe, handle, matcher, ctx, storage, config, net =====

const safe = {
    run(fn, spec = {}) {
        const { onError = console.error } = spec;
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
        }, { onError: () => { } });
    },

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
};

const handle = {
    make(input = {}) {
        const { stop = () => { }, done = Promise.resolve(), applied = true } = input;
        let isStopped = false;

        return {
            done,
            applied,
            stop() {
                if (isStopped) return;
                isStopped = true;
                safe.run(stop);
            },
        };
    },

    join(handles) {
        return handle.make({
            done: Promise.all(handles.map(h => h.done)),
            applied: handles.every(item => item.applied),
            stop: () => { for (const item of handles) item.stop(); },
        });
    },
};

const ctx = {
    store: new Map(),

    of(name, init) {
        if (!this.store.has(name)) this.store.set(name, init ?? {});
        return this.store.get(name);
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
        if (this.nil(expected)) return true;

        if (typeof expected === "object" && !(expected instanceof RegExp)) {
            const { includes, excludes } = expected;
            if (includes && !matcher.value(actual, includes)) return false;
            if (excludes && matcher.value(actual, excludes)) return false;
            return true;
        }

        return matcher.value(actual, expected);
    },

    attrs(node, attrs) {
        if (this.nil(attrs)) return true;
        return Object.entries(attrs).every(([name, expected]) => {
            if (expected === true) return node.hasAttribute(name);
            if (expected === false) return !node.hasAttribute(name);
            return matcher.value(node.getAttribute(name), expected);
        });
    },

    props(node, props) {
        if (this.nil(props)) return true;
        return Object.entries(props).every(([key, expected]) => matcher.value(node[key], expected));
    },

    css(node, css) {
        if (this.nil(css)) return true;
        const style = getComputedStyle(node);
        return Object.entries(css).every(([key, value]) => style[key] === value);
    },

    is(node, selector) {
        return typeof node?.matches === "function" && node.matches(selector);
    },

    visibility(node, visible) {
        if (this.nil(visible)) return true;
        return node.checkVisibility({ visibilityProperty: true, opacityProperty: true }) === visible;
    },

    node(node, options) {
        if (this.nil(options)) return true;
        const { is, not, attrs, props, text, visible, css, when } = options;

        const checks = [
            [!this.nil(is), () => !this.is(node, is)],
            [!this.nil(not), () => this.is(node, not)],
            [!this.nil(attrs), () => !this.attrs(node, attrs)],
            [!this.nil(props), () => !this.props(node, props)],
            [!this.nil(text), () => !this.text(node.textContent, text)],
            [typeof visible === "boolean", () => !this.visibility(node, visible)],
            [!this.nil(css), () => !this.css(node, css)],
            [!this.nil(when), () => !when(node)],
        ];

        return checks.every(([enabled, test]) => !enabled || !test());
    },

    nil(value) {
        return value === null || value === undefined;
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
        const full = key => bucket === undefined ? `${ns}|${key}` : `${ns}|${bucket}|${key}`;

        const scope = {
            get(key, defaultValue) {
                const value = storage.get(full(key));
                return value ?? defaultValue;
            },

            set(key, value) {
                storage.set(full(key), value);
            },

            remove(key) {
                GM_deleteValue(full(key));
            },

            merge(key, value) {
                scope.set(key, { ...scope.get(key, {}), ...value });
            },

            watch(key, callback) {
                const id = GM_addValueChangeListener(full(key), (_name, before, after, remote) => {
                    if (JSON.stringify(before) === JSON.stringify(after)) return;
                    callback(after, before, remote);
                });

                return handle.make({
                    stop: () => {
                        if (typeof GM_removeValueChangeListener === "function") GM_removeValueChangeListener(id);
                    },
                });
            },
        };

        return scope;
    },

    migrate() {
        for (const ns of ["@local", "@global"]) {
            const root = this.get(ns);
            if (!root) continue;

            const copy = (prefix, values = {}) => {
                const entries = Object.entries(values);
                for (const [key, value] of entries) {
                    const name = `${prefix}|${key}`;
                    if (!this.get(name)) this.set(name, value);
                }
            };

            if (ns === "@global") copy(ns, root);
            else for (const [host, values] of Object.entries(root)) copy(`${ns}|${host}`, values);

            GM_deleteValue(ns);
        }
    },
};

const config = {
    enabled(name) {
        const global = storage.get(name, true);
        const local = storage.local().get(name, true);
        return global && local;
    },

    get cache() {
        return config.enabled("useCache");
    },
    get continue() {
        return config.enabled("useContinue");
    },
    get patcher() {
        return config.enabled("usePatcher");
    },
};

const net = {
    get(url, spec = {}) {
        return this.request(url, spec);
    },

    post(url, body) {
        return this.request(url, { method: "POST", data: body });
    },

    request(url, spec = {}) {
        if (typeof url !== "string") throw new TypeError("[net.request] Missing `url` argument");

        const { method = "GET", headers = {}, data, timeout, overrideMimeType, responseType = "text", anonymous } = spec;

        const fail = (reason) => ({
            ok: false,
            status: 0,
            url,
            error: new Error(`[net.request] ${reason}: ${url}`),
        });

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method,
                url,
                headers,
                responseType,
                data,
                timeout,
                overrideMimeType,
                anonymous,
                onload: (response) => resolve({
                    ok: response.status >= 200 && response.status < 300,
                    status: response.status,
                    url: response.finalUrl ?? url,
                    data: response.response,
                }),
                onerror: (failure) => resolve(fail(failure?.error || "falha de rede")),
                ontimeout: () => resolve(fail("timeout")),
                onabort: () => resolve(fail("abortado")),
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

// ===== L1 — engine: observer, proxy, hook, shadow, frame =====

const observer = {
    OPTIONS: { childList: true, subtree: true, attributes: true, characterData: true },
    callbacks: new Set(),
    mutations: new MutationObserver((records) => observer.executor(records)),
    running: false,
    queue: [],
    isScheduled: false,
    pending: new Set(),
    attached: new WeakSet(),

    drain() {
        for (const record of this.mutations.takeRecords()) this.queue.push(record);
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

        this.mutations.takeRecords();
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
        this.mutations.observe(document.documentElement, this.OPTIONS);

        for (const root of this.pending) this.mutations.observe(root, this.OPTIONS);
        this.pending.clear();
    },

    attach(root) {
        if (this.attached.has(root)) return;
        this.attached.add(root);

        if (!this.running) {
            this.pending.add(root);
            return;
        }

        this.mutations.observe(root, this.OPTIONS);
        this.schedule();
    },

    change(callback) {
        this.observe();
        this.callbacks.add(callback);
        return handle.make({ stop: () => this.callbacks.delete(callback) });
    },
};

const proxy = {
    swap(owner, property, install) {
        const own = Object.getOwnPropertyDescriptor(owner, property);
        if (own && !own.configurable) return;

        install(own);

        return () => {
            if (own) Object.defineProperty(owner, property, own);
            else delete owner[property];
        };
    },

    wrap(owner, property, traps, label) {
        const target = owner[property];

        if (typeof target !== "function") {
            console.warn(`[hook.${label}] '${property}' is not a function`);
            return handle.make({ applied: false });
        }

        const proto = target.prototype;
        const isConstructor = Boolean(proto && proto.constructor === target);
        const ctorDesc = isConstructor ? Object.getOwnPropertyDescriptor(proto, "constructor") : undefined;

        const undo = proxy.swap(owner, property, (own) => {
            const wrapped = new Proxy(target, traps);
            proxy.conceal(wrapped, target);

            if (isConstructor) {
                Object.defineProperty(proto, "constructor", {
                    value: wrapped,
                    writable: true,
                    configurable: true,
                    enumerable: false,
                });
            }

            if (own && "value" in own) Object.defineProperty(owner, property, { ...own, value: wrapped });
            else owner[property] = wrapped;
        });

        if (!undo) {
            console.warn(`[hook.${label}] '${property}' is not configurable`);
            return handle.make({ applied: false });
        }

        return handle.make({
            stop: () => {
                undo();

                if (!isConstructor) return;
                if (ctorDesc) Object.defineProperty(proto, "constructor", ctorDesc);
                else delete proto.constructor;
            },
        });
    },

    conceal(fake, original) {
        const bag = ctx.of("conceal");

        bag.originals ??= new WeakMap();
        bag.originals.set(fake, bag.originals.get(original) ?? original);

        if (bag.patched) return;
        bag.patched = true;

        const proto = win.Function.prototype;
        const native = win.Function.prototype.toString;

        const toString = function () {
            return native.call(bag.originals.get(this) ?? this);
        };

        Object.defineProperties(toString, {
            name: { value: "toString", configurable: true },
            length: { value: 0, configurable: true },
        });

        bag.originals.set(toString, native);

        proxy.swap(proto, "toString", (own) => Object.defineProperty(proto, "toString", {
            configurable: true,
            enumerable: own?.enumerable ?? true,
            get: () => toString,
            set: () => { },
        }));
    },
};

const hook = {
    apply(owner, property, fn) {
        return proxy.wrap(owner, property, {
            apply: (target, self, args) => fn({
                target, self, args,
                call: (next = args) => Reflect.apply(target, self, next),
            }),
        }, "apply");
    },

    construct(owner, property, fn) {
        return proxy.wrap(owner, property, {
            construct: (target, args, self) => fn({
                target, args, self,
                call: (next = args) => Reflect.construct(target, next, self),
            }),
        }, "construct");
    },

    define(owner, property, input) {
        const orig = hook.base(owner, property);
        const { get, set } = input;
        const isConstant = "value" in input;
        const isCustom = isConstant || Boolean(get);

        const undo = proxy.swap(owner, property, () => Object.defineProperty(owner, property, {
            configurable: true,
            enumerable: orig.desc?.enumerable ?? true,
            get() {
                if (!isCustom) return orig.get(this);
                if (isConstant) return input.value;

                return get.call(this, () => orig.get(this), this);
            },
            set(value) {
                if (!set) { orig.set(this, value); return; }

                const setter = (...out) => orig.set(this, out.length > 0 ? out[0] : value);
                set.call(this, value, setter, this);
            },
        }));

        if (!undo) {
            console.warn(`[hook.define] '${property}' is not configurable`);
            return handle.make({ applied: false });
        }

        return handle.make({ stop: undo });
    },

    getter(owner, property, fn) {
        return hook.define(owner, property, { get: (getter, self) => fn(getter, self) });
    },

    setter(owner, property, fn) {
        return hook.define(owner, property, { set: (value, setter, self) => fn(value, setter, self) });
    },

    constant(owner, property, value) {
        return hook.define(owner, property, { value });
    },

    base(owner, property) {
        let desc;
        for (let o = owner; o && !desc; o = Object.getPrototypeOf(o)) {
            desc = Object.getOwnPropertyDescriptor(o, property);
        }

        const store = new WeakMap();

        return {
            desc,
            get(self) {
                if (desc?.get) return desc.get.call(self);
                return store.has(self) ? store.get(self) : desc?.value;
            },
            set(self, value) {
                if (desc?.set) desc.set.call(self, value);
                else if (!desc?.get) store.set(self, value);
            },
        };
    },

    fetch(input = {}) {
        const { url = "", value = {} } = input;
        const isMatch = (target) => matcher.text(String(target?.url ?? target), url);

        return proxy.wrap(win, "fetch", {
            apply: (target, self, args) => {
                const [requested] = args;
                return isMatch(requested) ? Promise.resolve(new Response(value)) : Reflect.apply(target, self, args);
            },
        }, "fetch");
    },

    listener(input = {}) {
        const { type, target, text } = input;
        const sourceOf = fn => typeof fn === "function" ? fn.toString() : "";

        return hook.apply(win.EventTarget.prototype, "addEventListener", ({ self, args, call }) => {
            const [name, listener] = args;

            if (!matcher.nil(type) && !matcher.value(name, type, { exact: true })) return call();
            if (!matcher.node(self, target)) return call();
            if (!matcher.nil(text) && !matcher.text(sourceOf(listener), text)) return call();
        });
    },

    haste(input = {}) {
        const { factor = 0.005, text, ms, when } = input;

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

        const scale = ({ args, call }) => {
            if (shouldScale(args[0], args[1]) && isFast()) args[1] *= factor;
            return call();
        };

        return handle.join([
            hook.apply(win, "setTimeout", scale),
            hook.apply(win, "setInterval", scale),
            hook.apply(win.Date, "now", () => dateNow(isFast())),
            hook.apply(win.performance, "now", () => perfNow(isFast())),
            proxy.wrap(win, "Date", {
                construct: (target, args, newTarget) =>
                    Reflect.construct(target, args.length > 0 ? args : [dateNow(isFast())], newTarget),
                apply: target => new target(dateNow(isFast())).toString(),
            }, "haste"),
        ]);
    },

    mask(target, spec = {}) {
        const { styles, match } = spec;
        const bag = ctx.of("mask", { map: new Map() });

        bag.map.set(target, { styles, match });

        bag.watcher ??= hook.apply(win, "getComputedStyle", ({ args, call }) => {
            const result = call();
            const [node] = args;

            if (!node?.matches) return result;

            const found = bag.map.entries()
                .find(([selector, conf]) => matcher.node(node, { ...conf.match, is: selector }))?.[1];

            if (!found) return result;

            return new Proxy(result, {
                get(computed, prop) {
                    if (Object.hasOwn(found.styles ?? {}, prop)) return found.styles[prop];
                    const value = Reflect.get(computed, prop, computed);
                    return typeof value === "function" ? value.bind(computed) : value;
                },
            });
        });

        return handle.make({
            applied: bag.watcher.applied,
            stop: () => {
                bag.map.delete(target);
                if (bag.map.size > 0) return;

                bag.watcher.stop();
                bag.watcher = undefined;
            },
        });
    },
};

const shadow = {
    roots: new WeakMap(),
    watcher: undefined,

    of(host) {
        return host.shadowRoot || this.roots.get(host);
    },

    capture() {
        if (this.watcher) return this.watcher;

        this.watcher = hook.apply(win.Element.prototype, "attachShadow", ({ self, call }) => {
            const root = call();
            this.roots.set(self, root);
            observer.attach(root);
            return root;
        });

        return this.watcher;
    },

    *select(selector, root = document) {
        const pierce = function* (nodes, parts) {
            if (parts.length === 0) {
                yield* nodes;
                return;
            }

            const [part, ...rest] = parts;

            for (const host of nodes) {
                const inner = shadow.of(host);
                if (!inner) continue;

                observer.attach(inner);
                yield* pierce(inner.querySelectorAll(part), rest);
            }
        };

        if (!selector.includes(">>>")) {
            yield* root.querySelectorAll(selector);
            return;
        }

        shadow.capture();

        const [head, ...tail] = selector.split(">>>").map(part => part.trim());
        yield* pierce(root.querySelectorAll(head), tail);
    },
};

const frame = {
    installers: new Set(),
    seen: new WeakSet(),
    watcher: undefined,

    scope(install) {
        safe.run(() => install(win));
        this.installers.add(install);
        return this.capture();
    },

    visit(frameWin) {
        if (!frameWin || frameWin === win) return;

        const realm = frameWin.Function;
        if (this.seen.has(realm)) return;
        this.seen.add(realm);

        for (const install of this.installers) safe.run(() => install(frameWin));
    },

    capture() {
        if (this.watcher) return this.watcher;

        const methods = [
            [win.Node.prototype, "appendChild"],
            [win.Node.prototype, "insertBefore"],
            [win.Node.prototype, "replaceChild"],

            [win.Element.prototype, "append"],
            [win.Element.prototype, "prepend"],
            [win.Element.prototype, "replaceChildren"],
            [win.Element.prototype, "before"],
            [win.Element.prototype, "after"],
            [win.Element.prototype, "replaceWith"],

            [win.Element.prototype, "insertAdjacentElement"],

            [win.Range.prototype, "insertNode"],
        ];

        const instrument = (node) => {
            if (node instanceof HTMLIFrameElement) visitFrame(node);
            if (typeof node.querySelectorAll !== "function") return;
            for (const ifr of node.querySelectorAll("iframe")) visitFrame(ifr);
        };

        const visitFrame = (iframe) => {
            if (!iframe.isConnected) return;
            const frameWin = iframe.contentWindow;
            this.visit(frameWin);
        };

        this.watcher = handle.join(methods.map(([prototype, method]) => hook.apply(prototype, method, ({ args, call }) => {
            const result = call();
            for (const arg of args) if (arg instanceof Node) instrument(arg);
            return result;
        })));

        return this.watcher;
    },
};

// ===== L2 — API: dom, attr, prop, el, captcha, worker, bypass =====

const dom = {
    watch(target, handler, spec = {}) {
        const { match, limit: max, root = document } = spec;
        let nodes;

        if (typeof target !== "string") {
            nodes = target instanceof Node ? [target] : [...target ?? []].filter(Boolean);
        }

        if (nodes?.length === 0) {
            return handle.make({ applied: false });
        }

        const limit = max ?? (nodes ? nodes.length : Infinity);
        const seen = new WeakSet();

        let handled = 0;
        let isStopped = false;
        let isRunning = false;
        let isDirty = false;

        const { promise: done, resolve: settle } = Promise.withResolvers();

        const visit = async (node) => {
            if (seen.has(node)) return;

            const result = await safe.run(() => handler(node));
            if (result?.stop === true) return watcher.stop();
            if (result?.continue === true) return;

            seen.add(node);
            if (++handled >= limit) watcher.stop();
        };

        const sweep = async () => {
            const found = this.select(target, { match, root });

            for (const node of found) {
                if (isStopped) break;
                await visit(node);
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

        const changes = observer.change(run);

        const watcher = handle.make({
            stop: () => {
                isStopped = true;
                changes.stop();
                settle();
            },
            done,
        });

        run();
        return watcher;
    },

    find(target, spec = {}) {
        const { match, timeout = 0, root } = spec;

        return new Promise((resolve, reject) => {
            let timer;
            let stop = () => { };

            if (timeout > 0) {
                timer = setTimeout(() => {
                    stop();
                    reject(new Error(`Timeout of ${timeout}ms reached waiting for: ${typeof target === "string" ? target : "<element>"}`));
                }, timeout);
            }

            const watcher = this.watch(target, node => {
                clearTimeout(timer);
                resolve(node);
                return { stop: true };
            }, { match, root });

            stop = () => watcher.stop();
        });
    },

    async finds(selectors, spec = {}) {
        const entries = Object.entries(selectors);
        const nodes = await Promise.all(entries.map(([, target]) => this.find(target, spec)));
        return Object.fromEntries(entries.map(([key], i) => [key, nodes[i]]));
    },

    *select(target, spec = {}) {
        const { match, root = document } = spec;
        let nodes;

        if (typeof target === "string") {
            nodes = shadow.select(target, root);
        } else {
            nodes = target instanceof Node ? [target] : [...target ?? []].filter(Boolean);
        }

        for (const node of nodes) {
            if (node?.isConnected && matcher.node(node, match)) yield node;
        }
    },
};

const attr = {
    async get(target, name, spec = {}) {
        const { match, timeout } = spec;
        const node = await dom.find(target, { match, timeout });
        return node.getAttribute(name);
    },

    set(target, values, spec = {}) {
        const { limit = 1, match } = spec;

        return dom.watch(target, node => {
            for (const [key, value] of Object.entries(values)) node.setAttribute(key, value);
        }, { limit, match });
    },

    remove(target, names, spec = {}) {
        const list = [names].flat();
        const { limit = 1, match } = spec;
        let remaining = limit;

        return dom.watch(target, node => {
            for (const name of list) node.removeAttribute(name);
            return --remaining <= 0 ? { stop: true } : { continue: true };
        }, { match });
    },
};

const prop = {
    async get(target, name, spec = {}) {
        const { match, timeout } = spec;
        const node = await dom.find(target, { match, timeout });
        return node[name];
    },

    set(target, values, spec = {}) {
        const { limit = 1, match } = spec;

        return dom.watch(target, node => {
            for (const [key, value] of Object.entries(values)) node[key] = value;
        }, { limit, match });
    },

    remove(target, names, spec = {}) {
        const list = [names].flat();
        const { limit = 1, match } = spec;

        return dom.watch(target, node => {
            for (const name of list) delete node[name];
        }, { limit, match });
    },
};

const el = {
    click(target, spec = {}) {
        const { wait = 0, scroll = false, times = 1, event, limit = 1, match } = spec;
        const { behavior = "smooth", block = "center", inline = "center" } = scroll === true ? {} : scroll;
        const init = { bubbles: true, cancelable: true, composed: true, view: win, ...event };
        let remaining = limit;

        return dom.watch(target, async (node) => {
            if (wait > 0) {
                await safe.sleep(wait);
                if (!node.isConnected || !matcher.node(node, match)) return { continue: true };
            }

            if (scroll !== false) node.scrollIntoView({ behavior, block, inline });
            for (let i = 0; i < times; i++) node.dispatchEvent(new MouseEvent("click", init));

            return --remaining <= 0 ? { stop: true } : { continue: true };
        }, { match });
    },

    scroll(target, spec = {}) {
        const { behavior = "smooth", block = "center", inline = "center", limit = 1, match } = spec;

        return dom.watch(target, node => node.scrollIntoView({ behavior, block, inline }), { limit, match });
    },

    remove(target, spec = {}) {
        const { limit, match } = spec;

        return dom.watch(target, node => node.remove(), { limit, match });
    },

    stash(target, spec = {}) {
        const { limit = 1, match } = spec;

        return dom.watch(target, node => {
            const wrapper = document.createElement("div");

            wrapper.style.cssText = `
                visibility: hidden !important;
                pointer-events: none !important;
                opacity: 0 !important;
            `;

            document.body.append(wrapper);
            wrapper.append(node);
        }, { limit, match });
    },

    hide(target, spec = {}) {
        const { limit, match, root } = spec;
        const { scopes } = ctx.of("hide", { scopes: new WeakSet() });

        return dom.watch(target, node => {
            const scope = node.getRootNode?.() ?? document;
            const container = scope.nodeType === 9 ? scope.documentElement : scope;

            if (!scopes.has(container)) {
                const style = document.createElement("style");

                style.textContent = "[data-acs-hide] { display: none !important; }";
                container.append(style);
                scopes.add(container);
            }

            node.dataset.acsHide = "";
            node.style.setProperty("display", "none", "important");
        }, { limit, match, root });
    },

    follow(target, spec = {}) {
        const { attr: name = "href", limit = 1, match } = spec;

        return dom.watch(target, node => {
            const value = safe.url(node.getAttribute(name));
            if (!value || value === location.href) return { continue: true };
            location.assign(value);
        }, { limit, match: { attrs: { [name]: true }, ...match } });
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

        dom.watch("#g-recaptcha-response", (node) => {
            setTimeout(() => poll(node), 500);
            return { stop: true };
        });

        return `:has(#g-recaptcha-response[data-recaptcha-solved]) ${selector}`;
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

const bypass = {
    SLUG_PATTERN: /^\/[A-Za-z0-9_-]{3,}$/,
    gatePatterns: {
        "tpi.li": /^\/r\/[^/]+\/.+$/,
        "oii.la": /^\/r\/[^/]+\/.+$/,
        "srnky.com": /^\/r\/[^/]+\/.+$/,
        "clksz.com": /^\/r\/[^/]+\/.+$/,
        "aii.sh": /^\/r\/[^/]+\/.+$/,
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
        "driveseed.org",
    ],

    run(href, pathname, search, pattern) {
        if (!worker.url || !pattern?.test(pathname + search)) return;

        this.cache(href);
        this.listener(href);
    },

    trusted(hostname) {
        return this.finalDomains.some(domain => matcher.value(hostname, domain, { exact: true }));
    },

    async cache(href) {
        const { data } = await worker.links.find(href);
        if (data?.status !== "ok" || !data.destination) return;

        const url = new URL(data.destination);
        if (url.protocol !== "https:" || !this.trusted(url.hostname)) return;
        if (url.href === location.href) return;

        this.navigate(url.href);
    },

    listener(href) {
        if (typeof navigation === "undefined") return;
        navigation.addEventListener("navigate", (event) => {
            if (event.info === "bypass_link") return;
            if (!event.cancelable || event.downloadRequest || event.hashChange) return;

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

    navigate(destination) {
        if (typeof navigation === "undefined") return;
        navigation.navigate(destination, { info: "bypass_link" });
    },

    async follow(href, destination) {
        const result = await net.get(destination, {
            headers: {
                Referer: location.href,
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
            },
        });

        const final = new URL(result.url);
        if (!this.trusted(final.hostname)) { this.navigate(destination); return; }
        await this.save(href, final.href);
    },

    async save(href, destination) {
        if (typeof href !== "string" || typeof destination !== "string" || href === destination) {
            return;
        }

        const result = await Promise.race([worker.links.save(href, destination), safe.sleep(1500)]);
        if (result && result.data?.status !== "ok") console.error(result.data ?? result.error);
        this.navigate(destination);
    },

    async title(title, links) {
        const { data } = await worker.titles.save(title, links);
        if (data?.status !== "ok") console.error(data);
    },

    async lookup(titles) {
        const { data } = await worker.titles.find(titles);

        if (data?.status !== "ok") console.error(data);
        if (!data?.results) return;

        return data?.results || [];
    },
};

// ===== L3 — app: commands, domains =====

const commands = {
    rendered: false,

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
                    const { script, scriptHandler, platform = {}, userAgentData = {} } = GM_info;

                    const browser = platform.browserName && platform.browserVersion
                        ? `${platform.browserName} ${platform.browserVersion}`
                        : userAgentData.brands?.
                            filter(({ brand }) => !/Not.?A.?Brand/i.test(brand))
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

    run() {
        if (this.rendered) return;
        this.rendered = true;

        for (const [name, cmd] of Object.entries(this.cmds)) {
            if (cmd.when && !cmd.when()) continue;
            this.register(name, cmd);
        }
    },

    register(name, cmd) {
        if (cmd.action) {
            GM_registerMenuCommand(`▶  ${cmd.name}`, () => cmd.action?.());
            return;
        }

        GM_registerMenuCommand(`[${cmd.value ? "✔" : "✖"}] ${cmd.name}`, () => this.toggle(name, cmd));

        if (!cmd.cmds) return;

        for (const [n, c] of Object.entries(cmd.cmds)) {
            const isLocalEnabled = c.value;
            const domainIcon = isLocalEnabled ? "✔" : "✖";
            const icon = cmd.value ? domainIcon : "–";
            GM_registerMenuCommand(`\u{2003}└ [${icon}] ${c.name} (${name.replace("use", "").toLowerCase()})`, () => this.toggle(n, c, { local: true }));
        }
    },

    toggle(name, input, spec = {}) {
        const { local = false } = spec;

        if (local) {
            const value = storage.local().get(name, input.value);
            storage.local().set(name, !value);
        } else {
            const value = storage.get(name, input.value);
            storage.set(name, !value);
        }

        location.reload();
    },
};

const domains = {
    STAGES: ["cache", "patcher", "continue"],

    run(stage, enabled, handler) {
        const fn = handler[stage];
        if (!fn || !enabled) return;

        safe.run(() => fn.call(handler), { onError: error => console.error(`[${stage}]`, error) });
    },

    add(hosts, ...parts) {
        if (![hosts].flat().includes(location.hostname)) return;

        const handler = this.compose(...parts.filter(Boolean));
        const { href, pathname, search } = location;

        handler.cache ??= () => bypass.run(href, pathname, search, handler.shortlink);

        commands.run();
        this.run("cache", config.cache, handler);
        this.run("patcher", config.patcher, handler);
        this.run("continue", config.continue, handler);
    },

    compose(...parts) {
        const merged = Object.assign({}, ...parts);

        for (const stage of this.STAGES) {
            const fns = parts.map(part => part[stage]).filter(Boolean);
            if (fns.length === 0) continue;

            merged[stage] = function () {
                return Promise.all(fns.map(fn =>
                    safe.run(() => fn.call(this), { onError: error => console.error(`[${stage}]`, error) }),
                ));
            };
        }

        return merged;
    },
};

// ===== sites: generics + domains.add =====

// Drop the migration call after a few releases.
storage.migrate();

const generics = {
    haste: (options) => ({ patcher() { hook.haste(options); } }),
    getLink: {
        continue() {
            el.click(".get-link:not(.disabled)");
        },
    },
    pahe: {
        patcher() {
            dom.find("link[href*='120x600-']").then(n => { n.href = "data:text/css,/120x600-x"; });

            hook.apply(win.EventTarget.prototype, "dispatchEvent", ({ args: [type], call }) => {
                if (type === "DOMContentLoaded") return;
                return call();
            });

            hook.apply(win.performance, "getEntriesByName", ({ args: [name], call }) => {
                if (typeof name === "string" && /gpt(?:%2E|[.])js/i.test(name)) {
                    return [{ name, entryType: "resource", encodedBodySize: 1, decodedBodySize: 32_768 }];
                }

                return call();
            });

            const mirror = (url, dest) => {
                net.request(url, {
                    headers: {
                        "Referer": `${location.origin}/`,
                        "Sec-Fetch-Dest": dest,
                        "Sec-Fetch-Mode": "no-cors",
                        "Sec-Fetch-Site": "same-origin",
                    },
                });
            };

            document.addEventListener("error", event => {
                const source = event.target;

                if (source instanceof HTMLScriptElement && source.src.includes("pagead/conversion.js")) {
                    mirror(source.src, "script");
                } else if (source instanceof HTMLLinkElement && source.href.includes("120x600")) {
                    mirror(source.href, "style");
                }
            }, { capture: true });

            hook.construct(win, "Image", ({ call }) => {
                const img = call();
                img.addEventListener("error", event => {
                    if (img.src.includes("antiadblockcore.com")) {
                        event.stopImmediatePropagation();
                        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                        return;
                    }

                    if (!img.src.includes("ads/banner")) return;

                    mirror(img.src, "image");
                }, { capture: true });
                return img;
            });

            hook.construct(win, "Promise", ({ args, call }) => {
                const [executor, ...rest] = args;
                if (typeof executor !== "function") return call();

                const wrapper = (resolve, reject) => {
                    const resolveMod = (value) => {
                        if (Array.isArray(value) && value.length === 1 && typeof value[0] === "string") {
                            return resolve([]);
                        }
                        return resolve(value);
                    };
                    return executor(resolveMod, reject);
                };
                return call([wrapper, ...rest]);
            });
        },
    },
    antiAdbCore: {
        patcher() {
            const AD_REGEX = /pagead2.googlesyndication.com|securepubads.g.doubleclick.net|googletagservices.com|s.amazon-adsystem.com|googleadservices.com/;

            hook.apply(win, "fetch", ({ target, args: [url], call }) => {
                if (!(typeof url === "string" && AD_REGEX.test(url))) return call();
                return target("https://jsonplaceholder.typicode.com/users", { mode: "no-cors" });
            });

            hook.apply(win.Node.prototype, "appendChild", ({ args: [node], call }) => {
                const result = call();

                const hasHifen = node.tagName?.includes("-");
                if (hasHifen) { node.remove(); return; }

                const isModal = node.getHTML?.().includes("adblock");
                if (isModal) { node.remove(); return; }

                if (node.nodeName === "SLOT") {
                    el.hide(":not(slot)", { root: node.getRootNode() });
                    return;
                }

                return result;
            });
        },
    },
};

domains.add(["tpi.li", "oii.la", "srnky.com", "clksz.com", "aii.sh"], generics.antiAdbCore, generics.pahe, {
    shortlink: bypass.SLUG_PATTERN,
    patcher() {
        attr.remove(":is(html, body)[style]", "style", { limit: 10 });
        hook.apply(win.Object, "getOwnPropertyDescriptor", ({ args: [obj, prop], call }) => {
            const desc = call();
            return prop === "isTrusted" && obj instanceof Event ? { ...desc, get: () => true } : desc;
        });
    },
    continue() {
        el.click("button:where(.btn-primary, .btn-success):not([disabled], .disabled)");
    },
});

domains.add(["financeehelp.com", "cloudhostt.com", "financeguidz.com", "techbixby.com", "loanbixby.com"], generics.haste(), {
    continue() {
        el.click("#startButton:not([style])", { wait: 500 });
        el.click("#getnewlink", { wait: 2500, match: { visible: true } });
    },
});

domains.add(["ouo.io", "ouo.press"], generics.haste(), {
    continue() {
        el.click("#btn-main:not(.disabled)");
        el.click(captcha.turnstile("#invisibleCaptchaShortlink"));
    },
});

domains.add(["exeygo.com", "exe-links.com", "exe-urls.com", "exego.app", "exnion.com"], {
    continue() {
        el.click("#submit-button:not([disabled])", { limit: 2 });
        el.click(captcha.turnstile("#submit-button:not([disabled])"));
    },
});

domains.add(["cuttty.com", "cety.app", "cutlink.net", "cutnet.net", "cuttlinks.com"], {
    continue() {
        el.click("#submit-button:not([disabled])");
    },
});

domains.add(["boost.ink", "bst.gg"], {
    async continue() {
        const { data } = await net.request(location.href);
        const match = /unlock.js.+[a-z]+="([^"]+)"/.exec(data);
        if (!match) return;

        const target = safe.url(atob(match[1]));
        location.assign(target);
    },
});

domains.add(["invest.datapendidikan.com", "crm.urlwebsite.com", "go.fakta.id"], {
    patcher() {
        const AD_SELECTORS = ".adsbox, .pub_300x250, .ad-banner, .ad-unit, .text-ad, .adsbygoogle, .ad-placement, .textads, .banner-ads, #adsense";
        const isAd = (node) => node.matches(AD_SELECTORS);

        el.hide(".crumb, .post-title, .post-meta, .share, figure, .toc, .site-footer, .side, .section-title, h1");
        hook.mask(AD_SELECTORS, { styles: { display: "block", visibility: "visible" } });

        hook.getter(win.HTMLElement.prototype, "offsetParent", (getter, self) => {
            return isAd(self) ? document.body : getter();
        });
        hook.getter(win.HTMLElement.prototype, "offsetHeight", (getter, self) => {
            return isAd(self) ? 1 : getter();
        });
        hook.getter(win.HTMLElement.prototype, "offsetWidth", (getter, self) => {
            return isAd(self) ? 1 : getter();
        });
        hook.setter(win.HTMLImageElement.prototype, "src", (value, setter, self) => {
            self.onerror = undefined;
            self.onload();
        });
    },
    continue() {
        el.click("#go-btn:not([disabled])");
        el.click("#step-top .step-btn:not([disabled])");
        el.click("#step-bottom .step-btn:not([disabled])", { limit: 2 });
    },
});

domains.add(["xut.io", "textfrog.com", "eduify.app", "gamescrate.app"], generics.getLink, {
    continue() {
        el.click("#sl-primary:not([disabled])", { match: { visible: true } });
    },
});

domains.add(["fc-lc.xyz", "oii.io"], {
    patcher() {
        hook.constant(win, "AdscoreInit", () => { });
    },
    async continue() {
        el.click(captcha.hcaptcha("button#hCaptchaShortlink"));
        el.click(captcha.turnstile("button#submitBtn"));

        setInterval(() => document.dispatchEvent(new MouseEvent("mousemove")), 100);
    },
});

domains.add(["premium.hairmova.com", "product.hairmova.com"], {
    patcher() {
        el.hide(".single-content > :not(div), #masthead, .post-navigation, .entry-related, #comments, footer");
    },
    continue() {
        el.scroll("#safegate-wait1");
        el.click("#safegate-proceed-btn", { match: { visible: true } });
        el.scroll("#safegate-wait2", { match: { visible: true } });
        el.click("#safegate-go", { match: { visible: true } });

        dom.watch("#safegate-reveal-overlay > div > div > span", node => {
            storage.global().set("no-bots-allowed", node.textContent.trim());
            window.close();
        });
    },
});

domains.add("pahe.ink", generics.antiAdbCore, generics.pahe);

domains.add("linegee.net", generics.antiAdbCore, generics.pahe, {
    continue() {
        el.click(".btn-primary", { wait: 4000 });
    },
});

domains.add("pahe.plus", generics.antiAdbCore, generics.pahe, {
    shortlink: bypass.SLUG_PATTERN,
    patcher() {
        hook.listener({ type: "click", target: { not: "#invisibleCaptchaShortlink" } });
        el.hide(".banner, body > [style*='fixed'], html > div");
    },
    continue() {
        el.click(captcha.hcaptcha("#invisibleCaptchaShortlink:not([disabled])"), { event: { bubbles: false } });
        el.follow(".get-link[href^='https://']:not(.disabled)");
    },
});

domains.add("intercelestial.com", generics.antiAdbCore, generics.pahe, {
    shortlink: /^\/\?ht=[a-zA-Z0-9%]+$/,
    patcher() {
        hook.listener({ type: "click", target: { not: ".myButton" } });
        hook.apply(win, "open", () => { });
        hook.constant(win, "LLct", "1");
        hook.getter(win, "LLpd", () => Date.now() - 284);
        frame.scope(w => hook.apply(w.Element.prototype, "attachShadow", () => { }));

        el.hide(`.right-sidebar.penci_sidebar.container, .penci-home-popular-posts.container, p, ul, li, [href*="s0-greate"], #sidebar, .post-pagination, .single-breadcrumb.penci-breadcrumb.container, .penci-move-title-above.post-image, #footer-section, .post-related, #comments, .post-share.tags-share-box, .alignleft.wp-caption, #target.pk-page-ready > #sales-banner, html > div`);
    },
    continue() {
        el.click(".myButton", { limit: 3, event: { bubbles: false } });
    },
    async cache() {
        if (this.shortlink.test(location.pathname + location.search)) {
            bypass.cache(location.href);
            sessionStorage.setItem("acs-shortlink", location.href);
        }

        const xxc = await dom.find("#xxc[href]");
        const shortlink = sessionStorage.getItem("acs-shortlink");
        if (xxc && shortlink) {
            window.stop();
            bypass.save(shortlink, xxc.href);
        }
    },
});

domains.add("vexfile.com", {
    continue() {
        el.follow(".generate-link[href]:not(.blocked)");
    },
});

domains.add("filespayouts.com", generics.haste({ text: "tick" }), {
    continue() {
        el.click("#method_free");
        el.click(captcha.turnstile("#downloadbtn"));
    },
});

domains.add("modsfire.com", generics.haste(), {
    continue() { el.click(".download-button"); },
});

domains.add("www.file-upload.org", {
    continue() {
        el.click("button[name='method_free']");
        el.click(captcha.hcaptcha("#downloadbtn:not([disabled])"));
    },
});

domains.add("upfilesgo.com", {
    continue() {
        el.click("#link-button-free:not([disabled])");
        el.click("#file-captcha #link-button:not([disabled])");
        el.click(".get-link:not(.disabled)");
    },
});

domains.add("safefileku.com", generics.haste(), {
    continue() {
        el.click(captcha.turnstile("button[type='submit']"));
    },
});

domains.add("uploadrar.com", {
    continue() {
        el.click("button[name='method_free']");
        el.click("#downloadbtn:not([disabled])");
        el.click("a.btn-primary.active[href]");
    },
});

domains.add("shrinkme.click", generics.getLink, {
    continue() {
        el.click(captcha.turnstile(".btn-primary:not([disabled])"));
    },
});

domains.add("themezon.net", {
    patcher() {
        el.hide("nav, header, .entry > :not(#smg-spot-end), .feat, aside, .author-box, .related, footer, .share-in");
        el.remove("#j-adblock");
    },
    continue() {
        el.click("#smg-spot-header #j-start", { wait: 1000 });
        el.click("#j-next:not([disabled])");
        el.click("#smg-spot-end #j-start", { wait: 1000 });
    },
});

domains.add("en.mrproblogger.com", generics.getLink, { shortlink: bypass.SLUG_PATTERN });

domains.add(["horrorpay.online", "icutlink.com"], generics.getLink);

domains.add("aradmag.online", generics.haste(), {
    patcher() {
        hook.apply(win, "open", () => { });
    },
    continue() {
        el.click("[id^='ow_step']:last-of-type button");
        el.click("#offerContinueBtn");
        el.click("#continueBtn:not([disabled])");
    },
});

domains.add("uploady.io", {
    continue() {
        el.click("#free_dwn");
        el.click("#downloadbtn");
    },
});

domains.add("apkadmin.com", {
    continue() {
        el.click("#downloadbtn");
    },
});

domains.add("www.up-4ever.net", {
    patcher() {
        el.remove("#u4ab_modal");
    },
    continue() {
        el.click(`button[name="method_free"]`);
        el.click("#downloadbtn.is-ready");
        el.follow("a#dl2btn[href]");
    },
});

domains.add("cloud.unblockedgames.world", {
    continue() {
        el.click("a[onclick]", { match: { text: "Start Verification" } });
        el.click("#verify_button2");
        el.click("#verify_button");

        el.follow("#two_steps_btn[href]");
    },
});

domains.add("jobzhub.store", {
    continue() {
        el.click("#next", { match: { visible: true } });
        el.click("#scroll", { match: { visible: true } });
        el.click("#glink", { match: { visible: true } });
        el.click(captcha.turnstile("#surl:not(.disabled)"));
    },
});

domains.add("aknewz.xyz", {
    continue() {
        el.click("#next");
        el.click("#scroll:not(.hidden)", { limit: 2 });
        el.click(captcha.turnstile("#surl"));
    },
});

domains.add("toolskitpro.net", {
    continue() {
        el.remove("div", { match: { css: { position: "fixed" } } });
        el.click(".show #afterBtn");
        el.click("#nxt");
        el.click("#getl");
    },
});

domains.add("lnbz.la", generics.antiAdbCore, generics.getLink, {
    continue() {
        el.click(captcha.turnstile("#continue"));
    },
});

domains.add("avnsgames.com", {
    continue() {
        el.click("#getnewlink");
    },
});

domains.add("zdrive.to", {
    continue() {
        el.click("#freeBtn", { wait: 500 });
        el.click("#down_1Form button", { match: { visible: true } });
        el.click("#down_2Form button", { match: { visible: true } });
        el.click(".btn-download:not(.disabled)");
    },
});

domains.add("cloudfam.io", {
    continue() {
        el.follow("#btn-clean-continue[href]");
        el.follow("#cf-btn-free[href]");
        el.follow("#free-btn[href]");
        el.follow("#cf-dl-btn[href]");
    },
});

domains.add("uiil.ink", {
    continue() {
        el.click("#form-continue [type='submit']");
        el.click(captcha.turnstile("#invisibleCaptchaShortlink"));
        el.click(`#multiLinkBtn:not(.disabled)`);
    },
});

domains.add("coinclix.co", {
    async continue() {
        el.click("#link-card > #btnVerification");
        el.follow("#link-card > .btn-primary[href]");

        const linkInstructions = await dom.find("#link-instructions-body");
        const keys = linkInstructions.querySelectorAll("kbd");
        const key = keys[keys.length - 1];
        const url = `https://geekgrove.net/?key=${key.textContent}`;

        GM_openInTab(`https://www.google.com/url?sa=t&source=web&rct=j&url=${encodeURIComponent(url)}&ved=2ahUKEwjS8I_fjaDdAhXqKsAKHQLeD3cQFjAAegQIABAB`, {
            active: true,
            insert: true,
        });

        storage.global().watch("geekgrove-return-key", async (newValue) => {
            prop.set("#link-card input#verificationCode", { value: newValue });
            el.click("#link-card button#btnVerification");
        });
    },
});

domains.add("geekgrove.net", {
    patcher() {
        hook.getter(win.document, "activeElement", { tagName: "IFRAME" });
        hook.apply(win.Document.prototype, "hasFocus", () => false);
        hook.listener({ type: "click", target: { not: "button" } });

        el.remove(".container-fluid:has(h2), body > .row, nav ~ .row, body .▶, .revbid-bottom-container, html > iframe, .▭, body > div:has(#accept-btn), div[style*='z-index']");
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

        el.click("#btnLinkStart", { match: { text: "Start" } });
        el.click("#btnLinkContinue", { wait: 1000, match: { text: "Verify" } });
        el.click("#btnLinkContinue", { match: { text: "Verify" } });
        el.click("#btnLpcont", { match: { text: "Continue" } });

        const returnKey = await dom.find("#linkResHeader kbd");
        storage.global().set("geekgrove-return-key", returnKey.textContent);
        window.close();
    },
});

domains.add("www.google.com", {
    continue() {
        el.follow("a[href^='https://'], a[href^='/goto?url=']");
    },
});

domains.add("toolkit.inshorturl.com", {
    continue() {
        el.follow("#lkActions a[href]");
    },
});

domains.add("mahitimanch.in", {
    continue() {
        el.click("#link");
        el.click("#linkx");
        el.follow("#gtelinkbtn[href]");
    },
});

domains.add("inshorturl.in", {
    continue() {
        el.follow("#ts-get-link[href^='https']");
    },
});

domains.add("blog.adlink.click", generics.getLink);

domains.add("bit.ly", {
    continue() {
        el.click(`#${CSS.escape("action:continue")}`);
    },
});

domains.add("adfoc.us", {
    continue() {
        el.click(".nv-skip");
    },
});

domains.add("speedy-links.com", {
    shortlink: /^\/s\?[A-Za-z0-9_-]{3,}$/,
    patcher() {
        hook.apply(win, "fetch", async ({ args: [, init], call }) => {
            if (init?.method === "POST" && typeof init.body === "string") {
                const body = init.body.replaceAll(/(?<="num_of_tasks":|"max_tasks":)\d+/g, "1");
                init.body = body;
            }

            const response = await call();
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
        el.click("[class*='task-list'] > *");
        el.click("[class*='unlock-btn'].enabled");
    },
});

domains.add("nerventualken.com", {
    continue() {
        el.click(captcha.turnstile("#go"));
    },
});

domains.add("datanodes.to", {
    continue() {
        el.click("#method_free:not([disabled])");
        el.click("button.py-3", { match: { text: "Free Download" } });
        el.click("button.py-3", { match: { text: "Start Download" } });
    },
});

domains.add("fuckingfast.co", {
    continue() {
        el.click(".link-button", { wait: 500 });
    },
});

domains.add("filekeeper.net", {
    continue() {
        el.click("#download-button");
    },
});

domains.add("linkvertise.com", {
    patcher() {
        hook.haste({ factor: 0.05 });

        hook.apply(win.HTMLElement.prototype, "click", ({ self, call }) => {
            if (self.nodeName === "A" && self.href) location.assign(self.href);
            return call();
        });
    },
    continue() {
        el.follow("a[href]:has(> button)", { match: { text: "Get access" } });
        el.click("ui-divider + lv-membership-plan-option");
        el.click(":has(ui-divider + lv-membership-plan-option > div.active) .membership-plan-selection__button button");
        el.click(".skip-button > *", { limit: 4 });
        el.click(".success-card button");
    },
});

domains.add("app.khaddavi.net", {
    continue() {
        el.click("button.ready", { limit: 4 });
    },
});

domains.add("sfl.gl", {
    continue() {
        el.click("button", { match: { text: "OPEN LINK" } });
    },
});

domains.add("link4m.net", generics.getLink, {
    patcher() {
        el.remove("body > div", { match: { text: "Adblock" } });
    },
});

domains.add("gplinks.co", {
    continue() {
        el.follow(".gate-btn-skip[href]");
        el.follow(captcha.turnstile("#captchaButton[href]:not(.disabled)"));
    },
});

domains.add("skrresults.com", generics.haste({ factor: 0.01 }), {
    continue() {
        el.click("#VerifyBtn", { match: { visible: true } });
        el.click("#NextBtn", { match: { visible: true } });
    },
});

domains.add("rekonise.com", {
    patcher() {
        hook.apply(win, "open", ({ args: [url] }) => {
            if (!document.querySelector(".all-done-row")) return;
            location.assign(url);
        });
    },
    continue() {
        el.click(".action-button:not([disabled])", { limit: 10 });
        el.click(":has(.all-done-row) .cta-button:not([disabled])", { wait: 2000 });
    },
});

domains.add("safelinkearn.com", {
    continue() {
        el.click(".open-btn");
    },
});

domains.add("www.mirrored.to", {
    continue() {
        el.click(".get_btn");
        el.follow(".highlight a[href]:has(.get_btn)");
    },
});

domains.add("www.nexusmods.com", {
    continue() {
        el.click("mod-file-download >>> .nxm-button-secondary-filled-weak");
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
        el.click(captcha.hcaptcha(".f95dl-go button"));
    },
});

domains.add("online-fix.me", generics.haste(), {
    shortlink: /^\/ext\/.+$/,
    continue() {
        el.click(".dl_content button[onclick]");
    },
});

domains.add("anon.to", {
    continue() {
        el.follow("a#continue[href]");
    },
});

domains.add("devuploads.com", {
    patcher() {
        el.hide(".dl-promo, .dl-promo-mini, section.card-pad, .signup-band");
    },
    continue() {
        el.click("[type='submit'][name='method_free']:not([disabled], [value*='Please wait'])", { wait: 1000, limit: 2 });
        el.click(".dl-actions button[type='submit']", { wait: 1000 });
        el.click(".dl-actions button.is-ready", { wait: 1000 });
        el.click(".dl-actions a[href]", { wait: 1000, match: { text: "Download File" } });
        el.click(".dl-actions a[href].is-ready", { wait: 1000, match: { text: "Download File" } });
    },
});

domains.add("katfile.co", {
    patcher() {
        el.hide("#kfPrem, .kf-shorts-promo, .kf-dl2-side");
    },
    continue() {
        el.click(".kfd-slow", { wait: 1000, limit: 2 });
        el.click(captcha.turnstile(".downloadbtn"));
        el.follow("a#dlink[href]");
    },
});

domains.add("datavaults.co", {
    continue() {
        el.click("#original");
        el.click(captcha.recaptcha("#downloadbtn:not([disabled])"));
    },
});

domains.add("link.snipcash.com", generics.getLink, {
    shortlink: bypass.SLUG_PATTERN,
    continue() {
        el.click(captcha.recaptcha("#invisibleCaptchaShortlink:not([disabled])"));
    },
});

domains.add("fdsite.lat", {
    continue() {
        el.click(".dl-card button.btn-primary", { wait: 1000, match: { visible: true } });
    },
});

domains.add("topshare.in", {
    patcher() {
        el.hide(".post-content-container, #normal");
    },
    continue() {
        el.click("#btn-download", { match: { visible: true } });
    },
});

domains.add("dailyuploads.net", generics.haste(), {
    continue() {
        el.click(".du-dl-opt.is-free");
        el.click("#downloadbtn:not([disabled])");
    },
});

domains.add("psa.wf", {
    async cache() {
        const entry = await dom.find(".entry-inner:has(> .sp-wrap)");
        const headsNode = entry.querySelectorAll(".sp-head");
        const titles = [...headsNode].filter(head => matcher.node(head, { text: /-PSA$/m })).map(n => n.textContent.trim());

        const links = await bypass.lookup(titles);
        for (const link of links) {
            if (!link.found) continue;

            dom.watch(".sp-head", n => {
                const downloadIcon = n.nextElementSibling?.querySelector(".fa-download");
                const body = downloadIcon?.closest(".sp-body");
                const nodeLinks = link.links.map(l => `<a href="${l}">${l}</a>`).join("<br>");
                body?.insertAdjacentHTML("afterbegin", `<p>${nodeLinks}</p>`);
            }, { match: { text: link.title } });
        }
    },
    async continue() {
        if (!location.pathname.startsWith("/safegate/")) return;

        const fire = (target, type, clientX, clientY) => target.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX, clientY }));

        const drag = (thumb, rail) => {
            const maxLeft = rail.offsetWidth - thumb.offsetWidth - 4;
            const rect = thumb.getBoundingClientRect();

            const x = rect.left + (maxLeft - ((Number(thumb.style.left) || 2) - 2)) + rect.width / 2;
            const y = rect.top + rect.height / 2;

            fire(thumb, "mousedown", rect.left + rect.width / 2, y);
            fire(document, "mousemove", x, y);
            fire(document, "mouseup", x, y);
        };

        const rail = await dom.find("#sg-track");
        const thumb = rail.querySelector("#sg-thumb");
        drag(thumb, rail);

        dom.watch("#sg-code-a", async (node) => {
            storage.global().set("no-bots-allowed", node.textContent.trim());
            GM_openInTab("https://no-bots-allowed.org", { active: true, insert: true });

            const { input, button } = await dom.finds({
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
        const { titleNode, pNode } = await dom.finds({
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

        dom.watch("input#nba-code", node => {
            if (!code) return { stop: true };
            node.value = code;
        });

        el.click(":has(input#nba-code:not(:placeholder-shown)) .nba-btn");
    },
});

domains.add("fileroy.com", {
    continue() {
        el.click(".fr-gate-button:not([disabled])");
        el.click(".download-file-link", { wait: 1000 });
    },
});

domains.add("en.thenaukriadda.in", {
    shortlink: /^\/\?sid=.+$/,
    continue() {
        el.click(".wp-block-button__link", { wait: 500, limit: 10 });
    },
    cache() {
        if (this.shortlink.test(location.pathname + location.search)) {
            bypass.cache(location.href);
            sessionStorage.setItem("acs-shortlink", location.href);
        }

        const init = sessionStorage.getItem("acs-shortlink");
        if (init) bypass.listener(init);
    },
});

domains.add("astrorede.com", {
    continue() {
        el.click("#bt", { wait: 500, limit: 10 });
        el.click("#bt", { match: { text: "CONTINUAR" } });
    },
});

domains.add("app.lovemodz.space", generics.haste(), {
    continue() {
        el.click("#sl-g1");
        el.click("#sl-g3", { match: { visible: true } });
        el.click("#sl-g5", { match: { visible: true } });
    },
});

domains.add("alpharede.com", {
    continue() {
        el.click("button", { match: { text: "IR PARA O LINK" }, wait: 1000, limit: 10 });
    },
});

domains.add(["forumdinheiro.com", "guis2.com", "horoscopeonday.com"], generics.haste(), {
    patcher() {
        const page = (delay = 1000) => {
            const undoHidden = hook.constant(document, "hidden", true);
            const undoVisibility = hook.constant(document, "visibilityState", "hidden");

            win.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true }));
            document.dispatchEvent(new Event("visibilitychange"));

            setTimeout(() => {
                undoHidden.stop();
                undoVisibility.stop();

                win.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true }));
                document.dispatchEvent(new Event("visibilitychange"));

            }, delay);
        };

        setInterval(page, 500);
        setTimeout(() => location.reload(), 6000);

        el.hide("body > div:not([class])", { match: { text: "bloqueador" } });
        el.hide("h1, h2, p, div:has(> img), ul, aside, footer, header, input, a, svg, span");
    },
    continue() {
        el.scroll("#init", { limit: 10 });
        el.click("#count", { scroll: true, limit: 10 });
        el.click("article button:not([disabled])", { limit: 10 });
    },
});

domains.add("www.filecrypt.cc", {
    async patcher() {
        hook.apply(win, "open", ({ args: [url], call }) => url.includes("www.filecrypt.") && call());
        el.hide("body > :not(#page)");

        dom.find("form[onsubmit*='CNLPOP']").then(async form => {
            const match = /'([^']{32})'.+?'([^']{35,})'/.exec(form.getAttribute("onsubmit"));
            if (!match) return;

            const [, hex, b64] = match;
            const key = new Uint8Array(hex.match(/.{1,2}/g).map(b => Number.parseInt(b, 16)));
            const cipher = Uint8Array.from(atob(b64), c => c.codePointAt(0));

            const cryptoKey = await crypto.subtle.importKey(
                "raw", key, { name: "AES-CBC" }, false, ["decrypt"],
            );
            const decryptedBuffer = await crypto.subtle.decrypt(
                { name: "AES-CBC", iv: key }, cryptoKey, cipher,
            );

            const plain = new TextDecoder().decode(decryptedBuffer);
            const clean = plain.split(/[\r\n]+/).map(url => url.replaceAll("\u{0}", "").trim());

            const trs = document.querySelectorAll("tr:has(a.download[href])");
            for (const tr of trs) {
                const hostname = tr.querySelector(".external_link[href]")?.hostname;
                const anchor = tr.querySelector("a.download[href]");
                if (!hostname || !anchor) continue;

                const idx = clean.findIndex((u) => u.startsWith(`https://${hostname}`));
                const target = clean[idx];
                if (!target) continue;

                clean.splice(idx, 1);
                anchor.href = target;
            }
        });
    },
});
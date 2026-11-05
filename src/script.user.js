// ==UserScript==
// @name               Pahe - Auto continue links
// @namespace          https://greasyfork.org/users/821661
// @version            1.23.4
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
// @match              https://fileroy.com/*
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
//
// @copyright          2024-2026 hdyzen (andradeatdev) — https://github.com/andradeatdev/auto-continue-shortlinks/
// @license            GPL-3.0
// @homepageURL        https://github.com/andradeatdev/auto-continue-shortlinks/
// ==/UserScript==

// Copyright (C) 2026 hdyzen (andradeatdev). This script is free software:
// you may copy, modify and redistribute it only under the GNU General Public
// License v3. Source and this notice must be kept intact (GPL-3.0, §4–§5).

/** @type {Window & typeof globalThis} */
const win = typeof unsafeWindow === "undefined" ? globalThis : unsafeWindow;

/**
 * @typedef {Object} MatchOptions
 * @property {Record<string, boolean|string|RegExp|Function>} [attrs] Attribute filters. `true` = exists, `false` = missing.
 * @property {Record<string, string|RegExp|Function|*>} [props] Node property filters (e.g. `{ disabled: false }`).
 * @property {string|RegExp|Function} [text] Filter by `textContent`.
 * @property {boolean} [visible] Require the node to be visible (`true`) or hidden (`false`).
 * @property {Record<string, string>} [css] Computed style values the node must have.
 */

/**
 * @typedef {Object} StalkResult
 * @property {boolean} [stop] Stop watching entirely.
 * @property {boolean} [continue] Skip this node and re-check it on the next run.
 */

/**
 * `limit` is the max number of distinct nodes to handle before stopping.
 * @typedef {MatchOptions & { limit?: number }} StalkOptions
 */

/**
 * @typedef {(node: Element) => StalkResult|void|Promise<StalkResult|void>} StalkHandler
 */

/**
 * @typedef {Object} ScrollOptions
 * @property {ScrollBehavior} [behavior="smooth"]
 * @property {ScrollLogicalPosition} [block="center"]
 * @property {ScrollLogicalPosition} [inline="center"]
 */

/**
 * @typedef {StalkOptions & {
 *   wait?: number,
 *   scroll?: false|ScrollOptions,
 *   count?: number,
 *   times?: number,
 *   bubbles?: boolean,
 *   when?: (node: Element) => boolean
 * }} ClickOptions
 */

/**
 * @typedef {Object} StorageScope
 * @property {(key: string, defaultValue?: *) => *} get
 * @property {(key: string, value: *) => void} set
 * @property {(key: string, value: Object) => void} merge
 * @property {(key: string, callback: (after: *, before: *, remote: boolean) => void) => number} watch
 */

/**
 * @typedef {Object} RequestOptions
 * @property {string} [method="GET"]
 * @property {Record<string, string>} [headers]
 * @property {*} [data]
 * @property {number} [timeout]
 * @property {string} [overrideMimeType]
 * @property {XMLHttpRequestResponseType} [responseType="text"]
 * @property {"follow"|"error"|"manual"} [redirect]
 * @property {boolean} [anonymous]
 */

/**
 * @typedef {Object} HasteOptions
 * @property {number} [factor] Timer multiplier (smaller = faster).
 * @property {string} [text] Only speed up callbacks whose source includes this text.
 * @property {number} [ms] Only speed up timers with exactly this delay.
 * @property {() => boolean} [when] Only speed up while this returns true.
 */

/**
 * @typedef {Object} DomainHandler
 * @property {() => void|Promise<void>} [patcher] Runs first; installs patches and hides.
 * @property {() => void|Promise<void>} [continue] Runs after; clicks/redirects through the page.
 * @property {() => void|Promise<void>} [cache] Replaces the default bypass cache logic.
 */

/**
 * @typedef {Object} Command
 * @property {string} name
 * @property {boolean} [value]
 * @property {() => boolean} [when]
 * @property {() => void} [action]
 * @property {Record<string, Command>} [cmds]
 */

const config = {
    /**
     * Returns true only if the setting is enabled both globally and for the current domain.
     * @param {string} name
     * @returns {boolean}
     */
    isEnabled(name) {
        const global = storage.get(name, true);
        const local = storage.local().get(name, true);
        return global && local;
    },

    /**
     * Whether the destination cache is enabled.
     * @returns {boolean}
     */
    get useCache() {
        return config.isEnabled("useCache");
    },
    /**
     * Whether auto-continue actions are enabled.
     * @returns {boolean}
     */
    get useContinue() {
        return config.isEnabled("useContinue");
    },
    /**
     * Whether patches are enabled.
     * @returns {boolean}
     */
    get usePatcher() {
        return config.isEnabled("usePatcher");
    },
};

const storage = {
    /**
     * Saves a value with GM_setValue.
     * @param {string} key
     * @param {*} value
     */
    set(key, value) {
        GM_setValue(key, value);
    },

    /**
     * Reads a value with GM_getValue.
     * @param {string} key
     * @param {*} [defaultValue]
     * @returns {*}
     */
    get(key, defaultValue) {
        return GM_getValue(key, defaultValue);
    },

    /**
     * Scope limited to the current hostname.
     * @returns {StorageScope}
     */
    local() {
        return this.scope("@local", location.hostname);
    },

    /**
     * Scope shared across all domains.
     * @returns {StorageScope}
     */
    global() {
        return this.scope("@global");
    },

    /**
     * Creates a scoped view over one storage key.
     * @param {string} ns Root storage key.
     * @param {string} [bucket] Optional sub-key (e.g. a hostname).
     * @returns {StorageScope}
     */
    scope(ns, bucket) {
        const read = () => {
            const root = storage.get(ns, {});
            return bucket === undefined ? root : root[bucket] || {};
        };

        const scope = {
            /**
             * Reads a value from the scope.
             * @param {string} key
             * @param {*} [defaultValue]
             * @returns {*}
             */
            get(key, defaultValue) {
                const value = read()[key];
                return value === undefined ? defaultValue : value;
            },

            /**
             * Writes a value to the scope.
             * @param {string} key
             * @param {*} value
             */
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

            /**
             * Shallow-merges an object into the stored object at `key`.
             * @param {string} key
             * @param {Object} value
             */
            merge(key, value) {
                scope.set(key, { ...scope.get(key, {}), ...value });
            },

            /**
             * Calls back when the value at `key` changes (also from other tabs).
             * @param {string} key
             * @param {(after: *, before: *, remote: boolean) => void} callback
             * @returns {number} Listener id.
             */
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
    /** @type {Record<string, Command>} */
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

    /** Registers all menu commands (skips those whose `when` returns false). */
    exec() {
        for (const [name, cmd] of Object.entries(this.cmds)) {
            if (cmd.when && !cmd.when()) continue;
            this.registerMenuCommand(name, cmd);
        }
    },

    /**
     * Registers one command, plus its per-domain sub-commands.
     * @param {string} name
     * @param {Command} cmd
     */
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

    /**
     * Toggles a global setting and reloads the page.
     * @param {string} name
     * @param {Command} cmd
     */
    toggleCommand(name, cmd) {
        const value = storage.get(name, cmd.value);
        storage.set(name, !value);
        location.reload();
    },

    /**
     * Toggles a setting for the current domain and reloads the page.
     * @param {string} name
     * @param {Command} cmd
     */
    toggleCommandLocal(name, cmd) {
        const value = storage.local().get(name, cmd.value);
        storage.local().set(name, !value);
        location.reload();
    },
};

const watch = {
    /** @type {MutationObserverInit} */
    OPTIONS: { childList: true, subtree: true, attributes: true, characterData: true },
    /** @type {Set<(records: MutationRecord[]) => void>} */
    callbacks: new Set(),
    /** @type {MutationObserver} */
    observer: new MutationObserver((records) => watch.executor(records)),
    /** @type {boolean} */
    running: false,
    /** @type {MutationRecord[]} */
    queue: [],
    /** @type {boolean} */
    isScheduled: false,
    /** @type {Set<Node>} */
    pending: new Set(),

    /** Moves pending mutation records into the queue. */
    drain() {
        for (const record of this.observer.takeRecords()) this.queue.push(record);
    },

    /**
     * Queues mutation records and schedules a single flush.
     * @param {MutationRecord[]} records
     */
    executor(records) {
        for (const record of records) this.queue.push(record);
        this.schedule();
    },

    /** Delivers queued mutation records to all callbacks. */
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

    /** Schedules a single flush on the next animation frame. */
    schedule() {
        if (this.isScheduled) return;
        this.isScheduled = true;
        requestAnimationFrame(() => this.flush());
    },

    /** Starts the shared MutationObserver (no-op if already started). */
    observe() {
        if (this.running) return;
        this.running = true;
        this.observer.observe(document.documentElement, this.OPTIONS);

        for (const root of this.pending) this.observer.observe(root, this.OPTIONS);
        this.pending.clear();
    },

    /**
     * Observes an extra root (e.g. a shadow root). Queued if the observer has not started.
     * @param {Node} root
     */
    attach(root) {
        if (!this.running) {
            this.pending.add(root);
            return;
        }

        this.observer.observe(root, this.OPTIONS);
        this.schedule();
    },

    /**
     * Subscribes to DOM changes.
     * @param {(records: MutationRecord[]) => void} callback
     * @returns {() => boolean} Unsubscribe function.
     */
    change(callback) {
        this.observe();
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    },
};

const ctxs = {
    /** @type {Map<string, Record<string, *>>} */
    ctxs: new Map(),

    /**
     * Returns a persistent object for `name`, creating it if needed. Used to share state between patches.
     * @param {string} name
     * @returns {Record<string, *>}
     */
    of(name) {
        if (!this.ctxs.has(name)) {
            this.ctxs.set(name, {});
        }

        return this.ctxs.get(name);
    },
};

const shadow = {
    /** @type {WeakMap<Element, ShadowRoot>} */
    roots: new WeakMap(),

    /**
     * Returns the shadow root of a host, including closed roots registered with `track`.
     * @param {Element} host
     * @returns {ShadowRoot|undefined}
     */
    of(host) {
        return host.shadowRoot || this.roots.get(host) || undefined;
    },

    /**
     * Registers a (closed) shadow root for a host and observes it.
     * @param {Element} host
     * @param {ShadowRoot} root
     */
    track(host, root) {
        this.roots.set(host, root);
        watch.attach(root);
    },

    /**
     * Finds the first element. Use `>>>` to pierce shadow roots.
     * @param {string} selector
     * @param {ParentNode} [root=document]
     * @returns {Element|undefined}
     */
    query(selector, root = document) {
        const [head, ...tail] = selector.split(">>>").map(part => part.trim());
        let node = root.querySelector(head);

        for (const part of tail) {
            if (!node) return;

            const inner = this.of(node);
            if (!inner) return;

            watch.attach(inner);
            node = inner.querySelector(part);
        }

        return node;
    },

    /**
     * Finds all elements. Use `>>>` to pierce shadow roots.
     * @param {string} selector
     * @param {ParentNode} [root=document]
     * @returns {Element[]}
     */
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

const dom = {
    /**
     * Throws if `selector` is not a string.
     * @param {string} name Caller name for the error.
     * @param {*} selector
     */
    guard(name, selector) {
        if (typeof selector !== "string") throw new TypeError(`[dom.${name}] 'selector' must be a string`);
    },

    /**
     * Watches the DOM and runs `handler` on each new matching node.
     * Return `{ stop: true }` to stop, `{ continue: true }` to retry the node later.
     * Any other return marks the node as handled.
     * @param {string} selector
     * @param {StalkHandler} handler
     * @param {StalkOptions} [opts]
     * @returns {() => void} Function that stops watching.
     */
    stalk(selector, handler, opts = {}) {
        this.guard("stalk", selector);

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

        const run = async () => {
            if (isStopped) return;
            if (isRunning) { isDirty = true; return; }

            isRunning = true;
            const nodes = dom.select(selector, opts);
            for (const node of nodes) {
                if (isStopped) break;
                await handle(node);
            }
            isRunning = false;

            if (isDirty) { isDirty = false; run(); }
        };

        const unwatch = watch.change(run);
        const stop = () => { isStopped = true; unwatch(); };

        run().catch(console.error);
        return stop;
    },

    /**
     * Waits for the first matching node.
     * @param {string} selector
     * @param {StalkOptions & { timeout?: number }} [options] `timeout` in ms rejects the promise.
     * @returns {Promise<Element>}
     */
    query(selector, options = {}) {
        this.guard("query", selector);
        const { timeout } = options;

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

    /**
     * Yields every node matching the selector and the match options.
     * @param {string} selector
     * @param {MatchOptions} [options]
     * @returns {Generator<Element>}
     */
    *select(selector, options = {}) {
        this.guard("select", selector);

        const nodes = shadow.queryAll(selector);
        for (const node of nodes) {
            if (this.match(node, options)) yield node;
        }
    },

    /**
     * Checks a node against all match options.
     * @param {Element} node
     * @param {MatchOptions} [options]
     * @returns {boolean}
     */
    match(node, options = {}) {
        const { attrs, props, text, visible, css } = options;

        if (!dom.attrs(node, attrs)) return false;
        if (!dom.props(node, props)) return false;
        if (!dom.text(node, text)) return false;
        if (!dom.visible(node, visible)) return false;
        if (!dom.css(node, css)) return false;

        return true;
    },

    /**
     * Compares a value: string (contains), RegExp (test), function (predicate) or strict equality.
     * @param {*} actual
     * @param {*} expected
     * @returns {boolean}
     */
    test(actual, expected) {
        if (typeof actual === "string" && typeof expected === "string") return actual.includes(expected);
        if (typeof expected === "function") return !!expected(actual);
        if (typeof actual === "string" && expected instanceof RegExp) {
            expected.lastIndex = 0;
            return expected.test(actual);
        }

        return actual === expected;
    },

    /**
     * Matches attribute filters. `true` = exists, `false` = missing.
     * @param {Element} node
     * @param {MatchOptions["attrs"]} [attrs]
     * @returns {boolean}
     */
    attrs(node, attrs) {
        if (!attrs) return true;

        return Object.entries(attrs).every(([name, expected]) => {
            if (expected === true) return node.hasAttribute(name);
            if (expected === false) return !node.hasAttribute(name);
            return dom.test(node.getAttribute(name), expected);
        });
    },

    /**
     * Matches node property filters.
     * @param {Element} node
     * @param {MatchOptions["props"]} [props]
     * @returns {boolean}
     */
    props(node, props) {
        if (!props) return true;
        return Object.entries(props).every(([key, expected]) => dom.test(node[key], expected));
    },

    /**
     * Matches visibility. Skipped if `isVisible` is not a boolean.
     * @param {Element} node
     * @param {boolean} [isVisible]
     * @returns {boolean}
     */
    visible(node, isVisible) {
        if (typeof isVisible !== "boolean") return true;
        return node.checkVisibility({ visibilityProperty: true }) === isVisible;
    },

    /**
     * Matches `textContent`.
     * @param {Element} node
     * @param {string|RegExp|Function} [text]
     * @returns {boolean}
     */
    text(node, text) {
        if (text == undefined) return true;
        return dom.test(node.textContent, text);
    },

    /**
     * Matches computed styles.
     * @param {Element} node
     * @param {Record<string, string>} [css]
     * @returns {boolean}
     */
    css(node, css) {
        if (!css) return true;

        const style = getComputedStyle(node);
        return Object.entries(css).every(([key, value]) => style[key] === value);
    },

    /**
     * Reads an attribute by name, or by the first attribute name matching a RegExp.
     * @param {Element} node
     * @param {string|RegExp} attr
     * @returns {string|null|undefined}
     */
    attr(node, attr) {
        if (typeof attr === "string") return node.getAttribute(attr);
        if (attr instanceof RegExp) {
            attr.lastIndex = 0;
            const name = node.getAttributeNames().find(n => attr.test(n));
            // No matching attribute: `name` is undefined, and `getAttribute` returns null.
            return node.getAttribute(name);
        }
    },

    /**
     * Wraps a selector so it only matches after Cloudflare Turnstile is solved.
     * @param {string} selector
     * @returns {string}
     */
    turnstile(selector) {
        return `:has([name="cf-turnstile-response"][value]) ${selector}`;
    },

    /**
     * Wraps a selector so it only matches after hCaptcha is solved.
     * @param {string} selector
     * @returns {string}
     */
    hcaptcha(selector) {
        return `:has([data-hcaptcha-response]:not([data-hcaptcha-response=''])) ${selector}`;
    },

    /**
     * Wraps a selector so it only matches after reCAPTCHA is solved.
     * @param {string} selector
     * @returns {string}
     */
    recaptcha(selector) {
        const poll = (node) => {
            if (node.value === "") return setTimeout(() => poll(node), 500);
            node.dataset.recaptchaSolved = "";
        };

        this.stalk("#g-recaptcha-response", (node) => {
            setTimeout(() => poll(node), 500);
            return { stop: true };
        });

        return `:has(#g-recaptcha-response[data-recaptcha-solved]) ${selector}`;
    },
};

const act = {
    /**
     * Throws if `selector` is not a string.
     * @param {string} name
     * @param {*} selector
     */
    guard(name, selector) {
        if (typeof selector !== "string") throw new TypeError(`[act.${name}] 'selector' must be a string`);
    },

    /**
     * Resolves after `ms` milliseconds.
     * @param {number} ms
     * @returns {Promise<void>}
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Clicks matching elements, optionally waiting and scrolling first.
     * @param {string} selector
     * @param {ClickOptions} [options]
     * @returns {() => void} Stop function.
     */
    click(selector, options = {}) {
        this.guard("click", selector);

        const { wait = 0, scroll = false, count = 1, times = 1, bubbles = true, when } = options;
        const { behavior = "smooth", block = "center", inline = "center" } = scroll || {};
        let remaining = count;

        return dom.stalk(selector, async (node) => {
            if (when && !when(node)) return { continue: true };

            if (wait > 0) await act.wait(wait);
            if (!node.isConnected) return { continue: true };

            if (when && !when(node)) return { continue: true };

            if (scroll !== false) node.scrollIntoView({ behavior, block, inline });

            const event = new MouseEvent("click", {
                bubbles,
                cancelable: true,
                composed: true,
                view: win,
            });

            for (let i = 0; i < times; i++) node.dispatchEvent(event);

            return --remaining <= 0 ? { stop: true } : { continue: true };
        }, options);
    },

    /**
     * Scrolls matching elements into view.
     * @param {string} selector
     * @param {StalkOptions & ScrollOptions} [options]
     * @returns {() => void}
     */
    scroll(selector, options = {}) {
        this.guard("scroll", selector);

        const { behavior = "smooth", block = "center", inline = "center" } = options;
        return dom.stalk(selector, node => {
            node.scrollIntoView({ behavior, block, inline });
            return { stop: true };
        }, options);
    },

    /**
     * Sets the `value` of matching inputs.
     * @param {string} selector
     * @param {StalkOptions & { value?: string }} [options]
     * @returns {() => void}
     */
    input(selector, options = {}) {
        this.guard("input", selector);

        const { value = "" } = options;
        return dom.stalk(selector, node => {
            node.value = value;
            return { stop: true };
        }, options);
    },

    /**
     * Removes matching elements.
     * @param {string} selector
     * @param {StalkOptions} [options]
     * @returns {() => void}
     */
    remove(selector, options = {}) {
        this.guard("remove", selector);

        return dom.stalk(selector, node => node.remove(), options);
    },

    /**
     * Moves matching elements into an invisible wrapper.
     * @param {string} selector
     * @param {StalkOptions} [options]
     * @returns {() => void}
     */
    wrap(selector, options = {}) {
        this.guard("wrap", selector);
        return dom.stalk(selector, node => {
            const wrapper = document.createElement("div");
            wrapper.style.cssText = `
                visibility: hidden !important;
                pointer-events: none !important;
                opacity: 0 !important;
            `;

            document.body.append(wrapper);
            wrapper.append(node);

            return { stop: true };
        }, options);
    },

    /**
     * Hides matching elements with injected CSS.
     * @param {string} selector
     * @param {{ root?: Node }} [options]
     * @returns {() => void} Function that undoes the hiding.
     */
    hide(selector, options = {}) {
        this.guard("hide", selector);

        const { root = document.documentElement } = options;

        const style = document.createElement("style");
        style.textContent = `${selector} { display: none !important; }`;
        root.append(style);

        return () => style.remove();
    },

    /**
     * Navigates to the URL found in an attribute of the matching element.
     * @param {string} selector
     * @param {StalkOptions & { attr?: string|RegExp }} [options]
     * @returns {() => void}
     */
    redirect(selector, options = {}) {
        this.guard("redirect", selector);

        const { attr = "href" } = options;
        return dom.stalk(selector, async (node) => {
            const url = dom.attr(node, attr);
            if (!url) return { continue: true };

            location.assign(url);
            return { stop: true };
        }, options);
    },
};

const net = {
    /**
     * GET request.
     * @param {string} url
     * @param {RequestOptions} [options]
     * @returns {Promise<Object>} GM response.
     */
    get(url, options = {}) {
        return this.request(url, options);
    },

    /**
     * POST request.
     * @param {string} url
     * @param {*} body
     * @returns {Promise<Object>}
     */
    post(url, body) {
        return this.request(url, { data: body });
    },

    /**
     * Promise wrapper around GM_xmlhttpRequest.
     * @param {string} url
     * @param {RequestOptions} [options]
     * @returns {Promise<Object>}
     */
    request(url, options = {}) {
        if (typeof url !== "string") throw new TypeError("[net.request] Missing `url` argument");

        const { method = "GET", headers = {}, data, timeout, overrideMimeType, responseType = "text", redirect, anonymous } = options;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                headers,
                responseType,
                data,
                timeout,
                overrideMimeType,
                redirect,
                anonymous,
                onload: resolve,
                onerror: reject,
                ontimeout: reject,
                onabort: reject,
            });
        });
    },

    /**
     * Sends and receives JSON.
     * @param {string} method
     * @param {string} url
     * @param {Object} [body]
     * @returns {Promise<Object>}
     */
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
    /** @type {string} */
    url: "https://shortlinks.zencore.fun",
    links: {
        /**
         * Looks up a saved destination for a shortlink.
         * @param {string} href
         * @returns {Promise<Object>}
         */
        find(href) {
            return net.json("GET", `${worker.url}/api/check?url=${encodeURIComponent(href)}`);
        },

        /**
         * Saves a shortlink and its destination.
         * @param {string} href
         * @param {string} destination
         * @returns {Promise<Object>}
         */
        save(href, destination) {
            return net.json("POST", `${worker.url}/api/save`, { shortlink: href, destination });
        },
    },
    titles: {
        /**
         * Saves download links for a title.
         * @param {string} title
         * @param {string[]} links
         * @returns {Promise<Object>}
         */
        save(title, links) {
            return net.json("POST", `${worker.url}/api/titles`, { title, links });
        },

        /**
         * Looks up saved links for several titles.
         * @param {string[]} titles
         * @returns {Promise<Object>}
         */
        find(titles) {
            return net.json("POST", `${worker.url}/api/titles/lookup`, { titles });
        },
    },
};

const patch = {
    /**
     * Makes a fake function look native when `toString` is called.
     * @param {Function} fake
     * @param {Function} original
     */
    conceal(fake, original) {
        const ctx = ctxs.of("conceal");

        ctx.originals ??= new WeakMap();
        ctx.originals.set(fake, ctx.originals.get(original) ?? original);

        if (ctx.concealed) return;
        ctx.concealed = true;

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

    /**
     * Replaces a function with a Proxy using the given handler.
     * @param {Object} owner
     * @param {string} property
     * @param {ProxyHandler<Function>} handler
     * @returns {false|void} False if the target is not a function.
     */
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

    /**
     * Intercepts calls to a function.
     * @param {Object} owner
     * @param {string} property
     * @param {(target: Function, thisArg: *, args: any[]) => *} applyFn
     */
    apply(owner, property, applyFn) {
        return this.hook(owner, property, { apply: applyFn });
    },

    /**
     * Intercepts `new` on a constructor.
     * @param {Object} owner
     * @param {string} property
     * @param {(target: Function, args: any[], newTarget: Function) => Object} constructFn
     */
    construct(owner, property, constructFn) {
        return this.hook(owner, property, { construct: constructFn });
    },

    /**
     * Overrides a property with custom getter/setter that can call the original behavior.
     * @param {Object} owner
     * @param {string} property
     * @param {{ get?: Function, set?: Function }} accessors
     */
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

    /**
     * Speeds up timers (`setTimeout`, `setInterval`, `Date`, `performance.now`).
     * @param {HasteOptions} [options]
     */
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
            (!text || String(fn).includes(text));

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

    /**
     * Blocks matching `fetch` calls and returns a fake value instead.
     * @param {{ url?: string|RegExp, returnValue?: * }} [options]
     */
    fetch(options = {}) {
        const { url, returnValue = Object.create(null) } = options;

        const isMatch = (input) => {
            if (typeof url === "string") return input.includes(url);
            if (url instanceof RegExp) { url.lastIndex = 0; return url.test(input); }
            return true;
        };

        patch.apply(win, "fetch", (target, thisArg, argArray) => {
            const [urlArg] = argArray;
            if (isMatch(urlArg)) return returnValue;

            return Reflect.apply(target, thisArg, argArray);
        });
    },

    /**
     * Blocks matching `addEventListener` registrations.
     * @param {{ type?: string, excludeTarget?: string, includesText?: string, excludeText?: string }} [options]
     */
    listener(options = {}) {
        const { type, excludeTarget, includesText, excludeText } = options;

        patch.apply(win.EventTarget.prototype, "addEventListener", (target, thisArg, argArray) => {
            const [name, listener] = argArray;

            if (type !== undefined && type !== name) {
                return Reflect.apply(target, thisArg, argArray);
            }

            if (excludeTarget !== undefined && thisArg instanceof Element && thisArg.matches(excludeTarget)) {
                return Reflect.apply(target, thisArg, argArray);
            }

            if (includesText !== undefined || excludeText !== undefined) {
                const source = typeof listener === "function" ? listener.toString() : "";

                if (includesText !== undefined && !source.includes(includesText)) {
                    return Reflect.apply(target, thisArg, argArray);
                }
                if (excludeText !== undefined && source.includes(excludeText)) {
                    return Reflect.apply(target, thisArg, argArray);
                }
            }
        });
    },

    /**
     * Fakes `getComputedStyle` results for nodes matching `selector`.
     * @param {string} selector
     * @param {Record<string, string>} styles
     * @param {MatchOptions} [options]
     */
    mask(selector, styles, options) {
        const ctx = ctxs.of("mask");

        ctx.map ??= new Map();
        ctx.map.set(selector, { styles, options });

        if (ctx.patched) return;
        ctx.patched = true;

        patch.apply(win, "getComputedStyle", (target, thisArg, argArray) => {
            const result = Reflect.apply(target, thisArg, argArray);
            const [node] = argArray;

            if (!node?.matches) return result;

            const match = ctx.map.values().find(conf =>
                node.matches(selector) && dom.match(node, conf.options),
            );

            if (!match) return result;

            return new Proxy(result, {
                get: (t, prop) => Object.hasOwn(match.styles, prop) ? match.styles[prop] : t[prop],
            });
        });
    },
};

const bypass = {
    /** @type {number} */
    cacheMaxEntries: 50,
    /** @type {Record<string, RegExp>} */
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
    /** @type {Record<string, RegExp>} */
    gatePatterns: {
        "clksz.com": /^\/r\/[^/]+\/.+$/,
    },
    /** @type {(string|RegExp)[]} */
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
    ],

    /**
     * Starts cache lookup and navigation tracking if the current URL is a known shortlink.
     * @param {string} hostname
     * @param {string} href
     * @param {string} pathname
     * @param {string} search
     */
    exec(hostname, href, pathname, search) {
        if (!worker.url) return;

        const pattern = this.shortenerPatterns[hostname];
        if (!pattern?.test(pathname + search)) return;

        if (config.useCache) this.cache(href);
        this.listener(href);
        this.clear();
    },

    /**
     * Redirects to a known destination (local cache first, then worker).
     * @param {string} href
     * @returns {Promise<void>}
     */
    async cache(href) {
        const cacheLocal = storage.global().get("bypass-local", {});
        const destCached = cacheLocal[href];
        if (destCached) return navigation.navigate(destCached, { info: "bypass_link" });

        const { response } = await worker.links.find(href);
        console.log("res", response);
        if (response?.status !== "ok" || !response.destination) return;

        const url = new URL(response.destination);
        if (url.protocol !== "https:" || !this.trusted(url.hostname)) return;

        navigation.navigate(url.href, { info: "bypass_link" });
    },

    /**
     * Listens for navigations and saves trusted destinations.
     * @param {string} href
     */
    listener(href) {
        navigation.addEventListener("navigate", (event) => {
            if (event.info === "bypass_link") return;
            console.dir("navigate", event);

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

    /**
     * Whether the destination is an intermediate gate page that must be followed.
     * @param {URL} dest
     * @returns {boolean|undefined}
     */
    gate(dest) {
        const pattern = this.gatePatterns[dest.hostname];
        if (!pattern) return;

        return pattern.test(dest.pathname + dest.search);
    },

    /**
     * Follows a gate URL to its final destination and saves it.
     * @param {string} href
     * @param {string} destination
     * @returns {Promise<void>}
     */
    async follow(href, destination) {
        const { finalUrl } = await net.get(destination, {
            headers: {
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                Host: location.hostname,
                Referer: location.href,
                Cookie: document.cookie,
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
            },
        });

        const final = new URL(finalUrl);
        if (!this.trusted(final.hostname)) return;

        this.save(href, final);
    },

    /**
     * Saves a destination locally and on the worker, then navigates to it.
     * @param {string} href
     * @param {string|URL} destination
     * @returns {Promise<void>}
     */
    async save(href, destination) {
        storage.global().merge("bypass-local", { [href]: destination });

        const { response } = await worker.links.save(href, destination);
        if (response?.status !== "ok") { console.error(response); }
        navigation.navigate(destination, { info: "bypass_link" });
    },

    /** Resets the local cache when it exceeds `cacheMaxEntries`. */
    clear() {
        const cacheLocal = storage.global().get("bypass-local", {});
        const entries = Object.entries(cacheLocal);
        if (entries.length <= this.cacheMaxEntries) return;

        storage.global().set("bypass-local", {});
    },

    /**
     * Whether the hostname is a trusted final destination.
     * @param {string} hostname
     * @returns {boolean|undefined}
     */
    trusted(hostname) {
        for (const domain of this.finalDomains) {
            if (typeof domain === "string" && hostname === domain) return true;
            if (domain instanceof RegExp && domain.test(hostname)) return true;
        }
    },

    /**
     * Saves download links for a title on the worker.
     * @param {string} title
     * @param {string[]} links
     * @returns {Promise<void>}
     */
    async title(title, links) {
        const { response } = await worker.titles.save(title, links);
        if (response?.status !== "ok") console.error(response);
    },

    /**
     * Fetches saved links for titles from the worker.
     * @param {string[]} titles
     * @returns {Promise<Object[]|undefined>}
     */
    async lookup(titles) {
        const { response } = await worker.titles.find(titles);

        if (response?.status !== "ok") console.error(response);
        if (!response.results) return console.error("Titles undefined");

        return response.results;
    },
};

const domains = {
    /**
     * Runs one stage (`patcher`/`continue`) of a handler, catching sync and async errors.
     * @param {"patcher"|"continue"} stage
     * @param {boolean} enabled
     * @param {DomainHandler} handler
     */
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

    /**
     * Registers a handler for one or more hostnames. Runs only if it matches the current page.
     * @param {string|string[]} hosts
     * @param {DomainHandler} handler
     */
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

const generics = {
    pahe: {
        patcher() {
            const mirror = (url, dest) => {
                // console.log("url", url, "| dest", dest);

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
                    act.hide(":not(slot)", { root: node.getRootNode() });
                    return;
                }

                return result;
            });
        },
    },
};

domains.add(["tpi.li", "oii.la", "srnky.com", "clksz.com"], {
    patcher() {
        generics.antiAdbCore.patcher();
        generics.pahe.patcher();
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
        act.remove("div", { css: { position: "fixed" }, text: "detected" });
        patch.listener({ type: "click", excludeTarget: "#startButton, #getnewlink" });
    },
    continue() {
        act.click("#startButton", { wait: 2000 });
        act.click("#getnewlink", { visible: true });
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
        act.click("#submit-button:not([disabled])", { count: 2 });
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

        const decoded = atob(match[1]);
        location.assign(decoded);
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
        act.click("#step-bottom .step-btn:not([disabled])", { count: 2 });
    },
});

domains.add(["xut.io", "textfrog.com", "eduify.app", "gamescrate.app"], {
    continue() {
        act.click("#sl-primary:not([disabled])", { visible: true });
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
        act.click("#safegate-proceed-btn", { visible: true });
        act.scroll("#safegate-wait2", { visible: true });
        act.click("#safegate-go", { visible: true });

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
        act.click(".btn-primary", { wait: 4000 });
    },
});

domains.add("pahe.plus", {
    patcher() {
        generics.antiAdbCore.patcher();
        generics.pahe.patcher();
        patch.listener({ type: "click", excludeTarget: "#invisibleCaptchaShortlink" });
        act.hide(".banner, body > [style*='fixed'], html > div");
    },
    continue() {
        act.click(dom.hcaptcha("#invisibleCaptchaShortlink:not([disabled])"), { bubbles: false });
        act.redirect(".get-link[href^='https://']:not(.disabled)");
    },
});

domains.add("intercelestial.com", {
    patcher() {
        generics.antiAdbCore.patcher();
        generics.pahe.patcher();

        patch.listener({ type: "click", excludeTarget: ".myButton" });
        patch.apply(win, "open", () => { });
        patch.define(win, "LLct", { get: () => "1" });
        patch.define(win, "LLpd", { get: () => Date.now() - 284 });

        act.hide(`.right-sidebar.penci_sidebar.container, .penci-home-popular-posts.container, p, ul, li, [href*="s0-greate"], #sidebar, .post-pagination, .single-breadcrumb.penci-breadcrumb.container, .penci-move-title-above.post-image, #footer-section, .post-related, #comments, .post-share.tags-share-box, .alignleft.wp-caption, #target.pk-page-ready > #sales-banner, html > div`);
    },
    continue() {
        act.click(".myButton", { count: 3, bubbles: false });
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
        act.redirect(".generate-link:not(.blocked)");
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
        act.click("#smg-spot-header #j-start", { wait: 1000 });
        act.click("#j-next:not([disabled])");
        act.click("#smg-spot-end #j-start", { wait: 1000 });
    },
});

domains.add("en.mrproblogger.com", {
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

domains.add("horrorpay.online", {
    continue() {
        act.click(".get-link:not(.disabled)");
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
        act.click("a[onclick]", { text: "Start Verification" });
        act.click("#verify_button2");
        act.click("#verify_button");

        act.redirect("#two_steps_btn[href]");
    },
});

domains.add("jobzhub.store", {
    continue() {
        act.click("#next", { visible: true });
        act.click("#scroll", { visible: true });
        act.click("#glink", { visible: true });
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
        act.click("#scroll:not(.hidden)", { count: 2 });
        act.click(dom.turnstile("#surl"));
    },
});

domains.add("toolskitpro.net", {
    continue() {
        act.remove("div", { css: { position: "fixed" } });
        act.click(".show #afterBtn");
        act.click("#nxt");
        act.click("#getl");
    },
});

domains.add("icutlink.com", {
    continue() {
        act.click(".get-link:not(.disabled)");
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
        act.click("#freeBtn", { wait: 500 });
        act.click("#down_1Form button", { visible: true });
        act.click("#down_2Form button", { visible: true });
        act.click(".btn-download:not(.disabled)");
    },
});

domains.add("cloudfam.io", {
    continue() {
        act.redirect("#btn-clean-continue[href]");
        act.redirect("#cf-btn-free[href]");
        act.redirect("#free-btn[href]");
        act.redirect("#cf-dl-btn[href]");
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
        act.redirect("#link-card > .btn-primary[href]");

        const linkInstructions = await dom.query("#link-instructions-body");
        const keys = linkInstructions.querySelectorAll("kbd");
        const key = keys[keys.length - 1];
        const url = `https://geekgrove.net/?key=${key.textContent}`;

        GM_openInTab(`https://www.google.com/url?sa=t&source=web&rct=j&url=${encodeURIComponent(url)}&ved=2ahUKEwjS8I_fjaDdAhXqKsAKHQLeD3cQFjAAegQIABAB`, {
            active: true,
            insert: true,
        });

        storage.global().watch("geekgrove-return-key", async (newValue) => {
            act.input("#link-card input#verificationCode", { value: newValue });
            act.click("#link-card button#btnVerification");
        });
    },
});

domains.add("geekgrove.net", {
    patcher() {
        patch.define(win.document, "activeElement", { get: () => ({ tagName: "IFRAME" }) });
        patch.apply(win.Document.prototype, "hasFocus", () => false);
        patch.listener({ type: "click", excludeTarget: "button" });

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

            location.assign(match[1]);
        };

        act.click("#btnLinkStart", { text: "Start" });
        act.click("#btnLinkContinue", { text: "Verify", wait: 1000 });
        act.click("#btnLinkContinue", { text: "Verify" });
        act.click("#btnLpcont", { text: "Continue" });

        const returnKey = await dom.query("#linkResHeader kbd");
        storage.global().set("geekgrove-return-key", returnKey.textContent);
        window.close();
    },
});

domains.add("www.google.com", {
    continue() {
        act.redirect("a[href^='https://'], a[href^='/goto?url=']");
    },
});

domains.add("toolkit.inshorturl.com", {
    continue() {
        act.redirect("#lkActions a[href]");
    },
});

domains.add("mahitimanch.in", {
    continue() {
        act.click("#link");
        act.click("#linkx");
        act.redirect("#gtelinkbtn");
    },
});

domains.add("inshorturl.in", {
    continue() {
        act.redirect("#ts-get-link[href^='https']");
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
        act.click("button.py-3", { text: "Free Download" });
        act.click("button.py-3", { text: "Start Download" });
    },
});

domains.add("fuckingfast.co", {
    continue() {
        act.click(".link-button", { wait: 500 });
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
        act.redirect("a[href]:has(> button)", { text: "Get access" });
        act.click("ui-divider + lv-membership-plan-option");
        act.click(":has(ui-divider + lv-membership-plan-option > div.active) .membership-plan-selection__button button");
        act.click(".skip-button > *", { count: 4 });
        act.click(".success-card button");
    },
});

domains.add("app.khaddavi.net", {
    continue() {
        act.click("button.ready", { count: 4 });
    },
});

domains.add("sfl.gl", {
    continue() {
        act.click("button", { text: "OPEN LINK" });
    },
});

domains.add("link4m.net", {
    patcher() {
        act.remove("body > div", { text: "Adblock" });
    },
    continue() {
        act.click(".get-link:not(.disabled)");
    },
});

domains.add("gplinks.co", {
    continue() {
        act.redirect(".gate-btn-skip");
        act.redirect(dom.turnstile("#captchaButton:not(.disabled)"));
    },
});

domains.add("skrresults.com", {
    patcher() {
        patch.haste({ factor: 0.01 });
    },
    continue() {
        act.click("#VerifyBtn", { visible: true });
        act.click("#NextBtn", { visible: true });
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
        act.click(".action-button:not([disabled])", { count: 10 });
        act.click(":has(.all-done-row) .cta-button:not([disabled])", { wait: 2000 });
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
        act.redirect(".highlight a[href]:has(.get_btn)");
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
        act.redirect("a#continue[href]");
    },
});

domains.add("devuploads.com", {
    patcher() {
        act.hide(".dl-promo, .dl-promo-mini, section.card-pad, .signup-band");
    },
    continue() {
        act.click("[type='submit'][name='method_free']:not([disabled], [value*='Please wait'])", { wait: 1000, count: 2 });
        act.click(".dl-actions button[type='submit']", { wait: 1000 });
        act.click(".dl-actions button.is-ready", { wait: 1000 });
        act.click(".dl-actions a[href]", { text: "Download File", wait: 1000 });
        act.click(".dl-actions a[href].is-ready", { text: "Download File", wait: 1000 });
    },
});

domains.add("katfile.co", {
    patcher() {
        act.hide("#kfPrem, .kf-shorts-promo, .kf-dl2-side");
    },
    continue() {
        act.click(".kfd-slow", { wait: 1000, count: 2 });
        act.click(dom.turnstile(".downloadbtn"));
        act.redirect("a#dlink[href]");
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
        act.click(".dl-card button.btn-primary", { wait: 1000, visible: true });
    },
});

domains.add("topshare.in", {
    patcher() {
        act.hide(".post-content-container, #normal");
    },
    continue() {
        act.click("#btn-download", { visible: true });
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
        const titles = [...headsNode].filter(head => dom.match(head, { text: /-PSA$/m })).map(n => n.textContent.trim());

        const links = await bypass.lookup(titles);
        for (const link of links) {
            if (!link.found) continue;

            dom.stalk(".sp-head", n => {
                const downloadIcon = n.nextElementSibling.querySelector(".fa-download");
                const body = downloadIcon.closest(".sp-body");
                const nodeLinks = link.links.map(l => `<a href="${l}">${l}</a>`).join("<br>");
                body.insertAdjacentHTML("afterbegin", `<p>${nodeLinks}</p>`);
            }, { text: link.title });
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

        const track = await dom.query("#sg-track");
        const thumb = track.querySelector("#sg-thumb");
        drag(thumb, track);

        dom.stalk("#sg-code-a", async (node) => {
            storage.global().set("no-bots-allowed", node.textContent.trim());
            GM_openInTab("https://no-bots-allowed.org", { active: true, insert: true });

            const input = await dom.query("input.sg-input");
            const button = await dom.query("button.sg-btn");
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
        const titleNode = await dom.query("#content-box center h2");
        const pNode = await dom.query("#content-box p:has(a[href][target='_blank'])");

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
        act.click(".download-file-link", { wait: 1000 });
    },
});

domains.add("astrorede.com", {
    continue() {
        act.click("#bt");
        act.click("#bt", { text: "CONTINUAR" });
    },
});

domains.add("app.lovemodz.space", {
    patcher() {
        patch.haste();
    },
    continue() {
        act.click("#sl-g1");
        act.click("#sl-g3", { visible: true });
        act.click("#sl-g5", { visible: true });
    },
});
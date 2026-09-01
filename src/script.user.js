// ==UserScript==
// @name               Pahe - Auto continue links
// @namespace          https://greasyfork.org/users/821661
// @version            0.0.6
// @description        just another bypass links for pahe
// @author             hdyzen
//
// From: Pahe
// @match              https://tpi.li/*
// @match              https://oii.la/*
//
// @match              https://ssdhostting.com/*
// @match              https://selfhostt.com/*
//
// @match              https://intercelestial.com/*
// @match              https://pahe.plus/*
//
// @match              https://ouo.io/*
// @match              https://ouo.press/*
//
// @match              https://adfoc.us/*
// 
// From: PlatinMods
// @match              https://vexfile.com/*
// @match              https://filespayouts.com/*
// @match              https://modsfire.com/*
// @match              https://www.file-upload.org/*
// @match              https://djxmaza.in/*
// @match              https://upfilesgo.com/*
// @match              https://safefileku.com/*
//
// @run-at             document-start
// @icon               https://www.google.com/s2/favicons?domain=pahe.ink
// @grant              none
// 
// @license            GPL-3.0
// ==/UserScript==

const CONFIG = {
    DEBUG: true,

    DEFAULT_STEP_TIMEOUT: 10_000,
    RULE_MATCH_TIMEOUT: 120_000,
    POLL_INTERVAL: 250,
};

const logger = createLogger(location.hostname);

const HOOKS = {
    setTimeout: window.setTimeout.bind(window),
    setInterval: window.setInterval.bind(window),
    clearTimeout: window.clearTimeout.bind(window),
    clearInterval: window.clearInterval.bind(window),

    Date: window.Date,

    log: window.console.log.bind(window.console),
    warn: window.console.warn.bind(window),
    error: window.console.error.bind(window),
    info: window.console.info.bind(window),
    debug: window.console.debug.bind(window),
};

const readers = {
    attribute: (node, name) => node.getAttribute(name),
    property: (node, name) => node[name],
    style: (node, name) => getComputedStyle(node)[name],
    classList: (node, name) => node.classList.contains(name),
};

const restraints = {
    "nonEmpty": (actual) => {
        if (actual == null) return false;
        if (typeof actual === "string") return actual.trim() !== "";
        if (typeof actual === "number") return actual !== 0;
        if (typeof actual === "boolean") return actual === true;
        if (Array.isArray(actual)) return actual.length > 0;
        return true;
    },
    "absent": (actual) => actual == null,
    "present": (actual) => actual != null,

    not: (actual, inner) => !matchRestraint(actual, inner),
    min: (actual, threshold) => typeof actual === "number" && actual >= threshold,
    max: (actual, threshold) => typeof actual === "number" && actual <= threshold,
    contains: (actual, substring) => String(actual).includes(substring),
    prefix: (actual, str) => String(actual).startsWith(str),
    suffix: (actual, str) => String(actual).endsWith(str),
    any: (actual, options) => options.some(r => matchRestraint(actual, r)),
};

const handlers = {
    patches: {},
    actions: {},
};

const domainRules = {
    "tpi.li": {
        rules: [
            {
                matches: [
                    { when: "element", selector: "[name='cf-turnstile-response']", check: { attribute: "value", value: "nonEmpty" } },
                ],

                steps: [
                    { do: "click", selector: "button#continue" },
                ],
            },
            {
                matches: [
                    { when: "element", selector: "a.get-link" },
                ],

                steps: [
                    { do: "click", selector: "a.get-link:not(.disabled)", timeout: 20_000 },
                ],
            },
        ],
    },

    "oii.la": {
        rules: [
            {
                matches: [
                    { when: "element", selector: "[name='cf-turnstile-response']", check: { attribute: "value", value: "nonEmpty" } },
                ],

                steps: [
                    { do: "click", selector: "button#continue" },
                ],
            },
            {
                matches: [
                    { when: "element", selector: "a.get-link" },
                ],

                steps: [
                    { do: "click", selector: "a.get-link:not(.disabled)", timeout: 20_000 },
                ],
            },
        ],
    },

    "ssdhostting.com": {
        rules: [
            {
                steps: [
                    { do: "click", selector: "a#startButton" },
                    { do: "click", selector: "button#getnewlink" },
                ],
            },
        ],
    },

    "selfhostt.com": {
        rules: [
            {
                steps: [
                    { do: "click", selector: "a#startButton" },
                    { do: "click", selector: "button#getnewlink" },
                ],
            },
        ],
    },

    "ouo.io": {
        rules: [
            {
                steps: [
                    { do: "click", selector: "#btn-main:not(.disabled)", check: { attribute: "class", value: "nonEmpty" }, timeout: 20_000 },
                ],
            },
        ],
    },

    "ouo.press": {
        rules: [
            {
                steps: [
                    { do: "click", selector: "#btn-main:not(.disabled)", check: { attribute: "class", value: "nonEmpty" }, timeout: 20_000 },
                ],
            },
        ],
    },

    "intercelestial.com": {
        patches: [
            {
                do: "tune-timer",
                match: {
                    delay: 1000,
                },
                transform: {
                    factor: 20,
                },
            },
        ],

        rules: [
            {
                steps: [
                    {
                        do: "click",
                        selector: "button.myButton",
                        times: 3,
                        delay: 1000,
                    },
                ],
            },
        ],
    },

    "pahe.plus": {
        rules: [
            {
                matches: [
                    { when: "element", selector: "[data-hcaptcha-response]" },
                ],

                steps: [
                    {
                        do: "click",
                        selector: "button#invisibleCaptchaShortlink:not([disabled])",
                        check: { attribute: "disabled", value: "absent" },
                        timeout: 120_000,
                    },
                ],
            },
            {
                matches: [
                    { when: "element", selector: ".get-link" },
                ],

                steps: [
                    { do: "click", selector: ".get-link:not(.disabled)" },
                ],
            },
        ],
    },

    "adfoc.us": {
        patches: [
            {
                do: "set-property",
                chain: "count",
                value: 0,
            },
        ],

        rules: [
            {
                matches: [
                    { when: "element", selector: "#showSkip:not([style*='display: none'])" },
                ],

                steps: [
                    { do: "click", selector: "a.skip" },
                ],
            },
        ],
    },

    "vexfile.com": {
        rules: [
            {
                steps: [
                    { do: "click", selector: ".generate-link:not(.blocked)" },
                    {
                        do: "redirect",
                        selector: ".generate-link[target='_blank']",
                        check: { attribute: "href", value: "nonEmpty" },
                    },
                ],
            },
        ],
    },

    "filespayouts.com": {
        patches: [
            {
                do: "tune-timer",
                match: {
                    delay: 1000,
                },
                transform: {
                    factor: 20,
                },
            },
        ],

        rules: [
            {
                matches: [
                    { when: "element", selector: "#method_free" },
                ],

                steps: [
                    { do: "click", selector: "#method_free" },
                ],
            },
            {
                matches: [
                    { when: "element", selector: "[name='cf-turnstile-response']", check: { attribute: "value", value: "nonEmpty" } },
                ],

                steps: [
                    {
                        do: "click",
                        selector: "#downloadbtn",
                        check: { attribute: "disabled", value: "absent" },
                        once: true,
                    },
                ],
            },
        ],
    },

    "modsfire.com": {
        rules: [
            {
                steps: [
                    {
                        do: "click",
                        selector: ".download-button",
                        check: { attribute: "href", value: "nonEmpty" },
                        times: 2,
                    },
                ],
            },
        ],
    },

    "www.file-upload.org": {
        rules: [
            {
                matches: [
                    { when: "element", selector: "button[name='method_free']" },
                ],

                steps: [
                    { do: "click", selector: "button[name='method_free']" },
                ],
            },
            {
                matches: [
                    { when: "element", selector: "[data-hcaptcha-response]", check: { attribute: "data-hcaptcha-response", value: "nonEmpty" } },
                ],

                steps: [
                    {
                        do: "click",
                        selector: "#downloadbtn:not([disabled])",
                        check: { attribute: "disabled", value: "absent" },
                        timeout: 30_000,
                    },
                ],
            },
        ],
    },

    "djxmaza.in": {
        rules: [
            {
                matches: [
                    { when: "ready-state", value: "interactive" },
                    { when: "element", selector: "#gdl:not([style*='display: none'])" },
                ],

                steps: [
                    { do: "click", selector: "#gdl:not([style*='display: none'])" },
                    { do: "sleep", ms: 2000 },
                    { do: "click", selector: "#gdlf:not([style*='display: none'])" },
                ],
            },
            {
                matches: [
                    { when: "ready-state", value: "interactive" },
                    { when: "element", selector: "#dln" },
                ],

                steps: [
                    { do: "click", selector: "#dln" },
                ],
            },
        ],
    },

    "upfilesgo.com": {
        rules: [
            {
                matches: [
                    { when: "element", selector: "[name='cf-turnstile-response']", check: { attribute: "value", value: "nonEmpty" } },
                ],

                steps: [
                    { do: "click", selector: "#link-button:not([disabled])" },
                ],
            },
            {
                matches: [
                    { when: "element", selector: "#countdown" },
                ],

                steps: [
                    { do: "click", selector: "#link-button:not(.disabled)" },
                ],
            },
            {
                matches: [
                    { when: "element", selector: "#link-button-free" },
                ],

                steps: [
                    { do: "click", selector: "#link-button-free:not([disabled])" },
                ],
            },
        ],
    },

    "safefileku.com": {
        patches: [
            {
                do: "tune-timer",
                match: {
                    delay: 500,
                    callback: "new Date().getTime()",
                },
                transform: {
                    factor: 20,
                    patchDate: true,
                },
            },
        ],

        rules: [
            {
                matches: [
                    { when: "element", selector: "[name='cf-turnstile-response']", check: { attribute: "value", value: "nonEmpty" } },
                ],

                steps: [
                    { do: "click", selector: "button[type='submit']" },
                ],
            },
            {
                matches: [
                    { when: "element", selector: "#download" },
                ],

                steps: [
                    {
                        do: "click",
                        selector: "#download[class*='bg-green']",
                        check: { attribute: "class", value: "nonEmpty" },
                        timeout: 20_000,
                    },
                ],
            },
        ],
    },
};

function main() {
    const host = location.hostname;
    const matched = domainRules[host];

    if (!matched) {
        logger.error("No domain rules found for host:", host);
        return;
    }

    logger.info("Host matched:", host, "| rules:", (matched.rules || []).length);

    const ctx = {
        lastElement: null,
        aborted: false,
    };

    if (matched.patches?.length) {
        for (const patch of matched.patches) {
            if (!handlers.patches[patch.do]) {
                throw new Error(`Unknown patch '${patch.do}' in patch list: ${JSON.stringify(patch)}`);
            }

            const handler = handlers.patches[patch.do];
            handler(patch, ctx);
        }
    }

    const tryMatch = () => {
        for (const rule of matched.rules || []) {
            if (matchesRule(rule)) {
                logger.debug("Rule matched:", JSON.stringify(rule.matches), "| steps:", rule.steps?.length ?? 0);
                return rule;
            }
        }
        return null;
    };

    const runRule = (rule) => {
        logger.info("Rule matched, executing...");
        executeRule(rule, ctx).catch((err) => {
            logger.error("executeRule threw:", err);
            ctx.aborted = true;
        });
    };

    const rule = tryMatch();
    if (rule) {
        runRule(rule);
        return;
    }

    logger.debug("No rule matched immediately, polling for", CONFIG.RULE_MATCH_TIMEOUT, "ms...");

    waitFor(tryMatch, {
        timeout: CONFIG.RULE_MATCH_TIMEOUT,
        label: "rule-match",
    })
        .then(runRule)
        .catch((err) => {
            logger.error("No rule matched within timeout:", err.message);
        });
}

function createLogger(hostname) {
    const prefix = `[Bypass][${hostname}]`;

    return {
        error: (...args) => HOOKS.error(prefix, "ERROR:", ...args),
        warn: (...args) => HOOKS.warn(prefix, "WARN:", ...args),

        log: (...args) => CONFIG.DEBUG && HOOKS.log(prefix, ...args),
        info: (...args) => CONFIG.DEBUG && HOOKS.info(prefix, "INFO:", ...args),
        debug: (...args) => CONFIG.DEBUG && HOOKS.debug(prefix, "DEBUG:", ...args),
    };
}

function matchWhen(match) {
    switch (match.when) {
        case "ready-state": {
            if (typeof match.value !== "string") {
                logger.error("ready-state clause requires a string value, got:", match.value);
                return false;
            }
            const ok = document.readyState === match.value;
            if (!ok) logger.debug(`ready-state not satisfied (current=${document.readyState}, want=${match.value})`);
            return ok;
        }

        case "path": {
            if (match.value === undefined) {
                return true;
            }
            if (typeof match.value === "string") {
                return location.pathname === match.value;
            }
            if (match.value instanceof RegExp) {
                return match.value.test(location.pathname);
            }
            logger.error("path clause 'value' must be a string or RegExp, got:", match.value);
            return false;
        }

        case "element": {
            if (typeof match.selector !== "string" || match.selector === "") {
                logger.warn("element clause without valid selector:", match);
                return false;
            }
            const node = document.querySelector(match.selector);
            if (!node) {
                logger.debug(`element not found: ${match.selector}`);
                return false;
            }
            if (match.check && !matchCheck(node, match.check)) {
                logger.debug(`element check failed for selector: ${match.selector}`, match.check);
                return false;
            }
            return true;
        }
        default:
            logger.warn("Unknown 'when' type:", match?.when, "| match:", match);
            return false;
    }
}

function resolveReader(entry) {
    const readerKeys = Object.keys(readers).filter(r => entry[r] !== undefined);

    if (readerKeys.length === 0) {
        logger.error("Check entry has no reader:", entry);
        return null;
    }
    if (readerKeys.length > 1) {
        logger.error("Check entry with multiple readers, use a check list instead:", entry);
        return null;
    }

    const key = readerKeys[0];
    if (typeof key !== "string" || key === "") {
        logger.error("Check entry reader name is empty:", entry);
        return null;
    }

    const fn = readers[key];
    if (typeof fn !== "function") {
        logger.error("Unknown reader:", key, entry);
        return null;
    }

    const name = entry[key];
    if (typeof name !== "string" || name === "") {
        logger.error(`Check reader '${key}' must be a non-empty string, got:`, name, entry);
        return null;
    }

    return { key, fn, name };
}

function matchCheck(node, check) {
    if (Array.isArray(check)) {
        return check.every(c => matchCheck(node, c));
    }

    const resolved = resolveReader(check);
    if (!resolved) return false;

    const actual = resolved.fn(node, resolved.name);
    logger.debug(`Check ${resolved.key}="${resolved.name}" =>`, actual, "restraint:", check.value);

    if (check.value === undefined) {
        logger.error("Check entry without value:", check);
        return false;
    }

    return matchRestraint(actual, check.value);
}

function matchRestraint(actual, restraint) {
    if (restraint === null) return actual == null;

    if (typeof restraint === "string") {
        if (restraint in restraints) {
            return restraints[restraint](actual);
        }
        return String(actual) === restraint;
    }

    if (typeof restraint === "boolean") {
        return actual === restraint;
    }

    if (typeof restraint === "number") {
        return actual === restraint;
    }

    if (restraint instanceof RegExp) {
        return actual != null && restraint.test(String(actual));
    }

    if (typeof restraint === "object") {
        if (restraint.not !== undefined) {
            return !matchRestraint(actual, restraint.not);
        }
        if (restraint.any !== undefined) {
            return Array.isArray(restraint.any) && restraint.any.some(r => matchRestraint(actual, r));
        }

        let ok = true;
        for (const key of Object.keys(restraint)) {
            if (key in restraints && typeof restraints[key] === "function") {
                ok = ok && restraints[key](actual, restraint[key]);
            } else {
                logger.error("Unknown composite restraint:", restraint);
                return false;
            }
        }
        return ok;
    }

    logger.warn("Unsupported restraint type:", typeof restraint, restraint);
    return false;
}

function matchesRule(rule) {
    if (rule.matches === undefined || rule.matches.length === 0) return true;

    for (const match of rule.matches) {
        if (!matchWhen(match)) {
            logger.debug("Rule clause failed:", JSON.stringify(match));
            return false;
        }
    }

    return true;
}

async function executeRule(rule, ctx) {
    if (rule.steps === undefined || rule.steps.length === 0) {
        logger.warn("Rule has no steps:", rule);
        return;
    }

    logger.info("Executing steps:", rule.steps.length);

    for (const [index, step] of rule.steps.entries()) {
        if (ctx.aborted) {
            logger.warn("Rule aborted, skipping remaining steps.");
            return;
        }

        if (step.do === undefined) {
            logger.warn(`Step [${index + 1}] has no 'do' property:`, step);
            continue;
        }

        const handler = handlers.actions[step.do];
        if (!handler) {
            logger.warn(`Step [${index + 1}] unknown action '${step.do}':`, step);
            continue;
        }

        const startTime = HOOKS.Date.now();
        logger.info(`Running step [${index + 1}/${rule.steps.length}]:`, step.do, { selector: step.selector });

        try {
            await handler(step, ctx);
        } catch (err) {
            logger.error(`Step [${index + 1}/${rule.steps.length}] '${step.do}' failed:`, err);
        }

        const elapsed = HOOKS.Date.now() - startTime;
        logger.info(`Step [${index + 1}/${rule.steps.length}] completed:`, step.do, `(${elapsed}ms)`);
    }
}

function waitFor(condition, options = {}) {
    const { timeout = 15000, interval = 250, label = "" } = options;
    const tag = label ? `[${label}]` : "";
    let pollCount = 0;

    return new Promise((resolve, reject) => {
        const fastResult = condition();
        if (fastResult) {
            logger.debug(`waitFor${tag} resolved immediately`);
            resolve(fastResult);
            return;
        }

        let settled = false;

        const done = (callback, value) => {
            if (settled) return;
            settled = true;
            HOOKS.clearInterval(pollID);
            cancelTimeout();
            callback(value);
        };

        const pollID = HOOKS.setInterval(() => {
            try {
                const result = condition();
                pollCount++;
                if (result) {
                    logger.debug(`waitFor${tag} resolved after ${pollCount} polls`);
                    done(resolve, result);
                }
            } catch (err) {
                logger.error(`waitFor${tag} condition threw:`, err);
                done(reject, err);
            }
        }, interval);

        const cancelTimeout = safeSetTimeout(() => {
            logger.debug(`waitFor${tag} timed out after ${timeout}ms (${pollCount} polls)`);
            done(reject, new Error(`waitFor${tag} timed out after ${timeout}ms`));
        }, timeout);
    });
}

async function resolveTarget(step, ctx, { required = false } = {}) {
    const timeout = step.timeout ?? CONFIG.DEFAULT_STEP_TIMEOUT;

    if (typeof step.selector === "string") {
        return waitFor(() => {
            const node = document.querySelector(step.selector);
            if (!node) return false;
            if (step.check && !matchCheck(node, step.check)) return false;
            logger.debug(`resolveTarget found: ${step.selector}`);
            return node;
        }, {
            timeout,
            label: "resolveTarget",
        });
    }

    if (ctx.lastElement) {
        logger.debug("resolveTarget found: lastElement");
        return ctx.lastElement;
    }

    if (required) {
        throw new Error(`Action requires an 'selector' or 'ctx.lastElement', but none was provided. ${step.do}`);
    }
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

function addPatch(name, handler) {
    handlers.patches[name] = handler;
}

function addAction(name, handler) {
    handlers.actions[name] = handler;
}

addAction("click", async (step, ctx) => {
    const { selector, times = 1, delay = 500, once = false } = step;
    let node = await resolveTarget(step, ctx, { required: true });

    if (!node) {
        logger.debug("Click target not found:", selector ?? "(lastElement)");
        return;
    }

    const onceKey = once && selector
        ? `once:${location.hostname}:${location.pathname}:${selector}`
        : null;

    if (onceKey && sessionStorage.getItem(onceKey)) {
        logger.debug("Click skipped (once already done):", selector);
        return;
    }

    logger.debug("Click action:", selector ?? "(lastElement)", "| target:", node);

    const event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
    });

    for (let i = 1; i <= times; i++) {
        node = times === 1 ? node : await resolveTarget(step, ctx, { required: true });

        logger.debug(`Click ${i}/${times}:`, selector ?? "(lastElement)");
        node.dispatchEvent(event);
        ctx.lastElement = node;

        if (i < times) await new Promise(r => safeSetTimeout(r, delay));
    }

    if (onceKey) sessionStorage.setItem(onceKey, "1");

    logger.debug("Click(s) dispatched on:", node);
});

addAction("sleep", async (step) => {
    const ms = step.ms || 1000;
    logger.info("Sleeping for", ms, "ms");

    await new Promise(r => safeSetTimeout(r, ms));

    logger.debug("Sleep finished");
});

addAction("scroll-into-view", async (step, ctx) => {
    const node = await resolveTarget(step, ctx, { required: true });
    if (!node) {
        logger.warn("scroll-into-view target not found:", step.selector);
        return;
    }
    logger.debug("scroll-into-view:", step.selector);
    node.scrollIntoView({ behavior: "smooth", block: "center" });
    ctx.lastElement = node;
});

addAction("set-element-property", async (step, ctx) => {
    const node = await resolveTarget(step, ctx, { required: true });
    if (!node) {
        logger.warn("set-element-property target not found:", step.selector);
        return;
    }
    if (typeof step.name !== "string" || step.name === "") {
        logger.warn("set-element-property requires a 'name' property:", step);
        return;
    }
    if (step.value === undefined) {
        logger.warn("set-element-property requires a 'value' property:", step);
        return;
    }
    logger.debug("set-element-property:", step.selector, "property:", step.name, "=", step.value);
    node[step.name] = step.value;
    ctx.lastElement = node;
});

addAction("remove-element-property", async (step, ctx) => {
    const node = await resolveTarget(step, ctx, { required: true });
    if (!node) {
        logger.warn("remove-element-property target not found:", step.selector);
        return;
    }
    if (typeof step.name !== "string" || step.name === "") {
        logger.warn("remove-element-property requires a 'name' property:", step);
        return;
    }
    logger.debug("remove-element-property:", step.selector, "property:", step.name);
    delete node[step.name];
    ctx.lastElement = node;
});

addAction("set-attribute", async (step, ctx) => {
    const node = await resolveTarget(step, ctx, { required: true });
    if (!node) {
        logger.warn("set-attribute target not found:", step.selector);
        return;
    }
    const attrs = step.attributes;
    if (!attrs || typeof attrs !== "object" || Object.keys(attrs).length === 0) {
        logger.warn("set-attribute requires an 'attributes' object:", step);
        return;
    }
    logger.debug("set-attribute:", step.selector, "attrs:", attrs);
    for (const [name, value] of Object.entries(attrs)) {
        node.setAttribute(name, String(value));
    }
    ctx.lastElement = node;
});

addAction("remove-element", async (step, ctx) => {
    const node = await resolveTarget(step, ctx, { required: true });
    if (!node) {
        logger.warn("remove-element target not found:", step.selector);
        return;
    }
    logger.debug("remove-element:", step.selector);
    node.remove();
    ctx.lastElement = node;
});

addAction("redirect", async (step, ctx) => {
    const node = await resolveTarget(step, ctx, { required: true });
    if (!node) {
        logger.warn("Redirect target not found:", step.selector);
        return;
    }

    const readerKeys = Object.keys(readers).filter(r => step[r] !== undefined);
    if (readerKeys.length > 1) {
        logger.error("Redirect must have exactly one reader (property, attribute, style, classList):", step);
        ctx.aborted = true;
        return;
    }

    const resolved = readerKeys.length === 0
        ? { key: "property", fn: readers.property, name: "href" }
        : resolveReader(step);
    if (!resolved) {
        logger.error("Redirect has an invalid reader:", step);
        ctx.aborted = true;
        return;
    }

    const url = resolved.fn(node, resolved.name);

    if (typeof url !== "string" || url.trim() === "") {
        logger.warn("Redirect URL is empty:", step);
        ctx.aborted = true;
        return;
    }

    logger.info("Redirecting via", resolved.key, `"${resolved.name}"`, "→", url);
    window.location.href = url;

    ctx.aborted = true;
});

addPatch("set-property", async (step) => {
    const chain = step.chain.startsWith("window.") ? step.chain.slice(7) : step.chain;
    if (typeof chain !== "string" || chain === "") {
        logger.warn("set-property requires a non-empty 'chain':", step);
        return;
    }

    const { value } = step;
    const parts = chain.split(".");
    let current = window;
    for (let i = 0; i < parts.length - 1; i++) {
        const prop = parts[i];
        if (!current[prop] || typeof current[prop] !== "object") current[prop] = {};
        current = current[prop];
    }
    const lastKey = parts[parts.length - 1];

    logger.debug(`set-property: ${chain} = ${value}`);

    Object.defineProperty(current, lastKey, {
        configurable: true,
        enumerable: true,
        get() {
            return value;
        },
        set() { },
    });
    logger.debug(`set-property done: defined "${lastKey}" on ${chain}`);
});

addPatch("tune-timer", async (step) => {
    const { delay, callback } = step.match || {};
    const { factor = 20, patchDate = false } = step.transform || {};

    let isVirtualContext = false;
    const startTime = HOOKS.Date.now();

    const matchDelay = (value) => value === delay || delay === undefined;

    const matchCallback = (value) => {
        if (callback === undefined) return true;

        if (typeof value !== "function") return false;
        const fn = value.toString();

        if (typeof callback === "string") {
            return fn.includes(callback);
        }
        if (callback instanceof RegExp) {
            return callback.test(fn);
        }
        return false;
    };

    const virtualNow = () => {
        const realElapsed = HOOKS.Date.now() - startTime;
        return startTime + realElapsed * factor;
    };


    const hookTimer = (target, thisArg, args) => {
        const [fn, timeout = 0] = args;

        if (!matchDelay(timeout) || !matchCallback(fn)) {
            return Reflect.apply(target, thisArg, args);
        }

        const originalFn = fn;
        const wrappedFn = (...innerArgs) => {
            const prev = isVirtualContext;
            isVirtualContext = true;
            try {
                return originalFn.apply(thisArg, innerArgs);
            } finally {
                isVirtualContext = prev;
            }
        };

        logger.debug(`tune-timer: timeout=${timeout}, factor=${factor}`);

        args[0] = wrappedFn;
        args[1] = timeout / factor;

        return Reflect.apply(target, thisArg, args);
    };

    window.setInterval = new Proxy(HOOKS.setInterval, { apply: hookTimer });
    window.setTimeout = new Proxy(HOOKS.setTimeout, { apply: hookTimer });

    if (!patchDate) return;

    window.Date = new Proxy(HOOKS.Date, {
        construct(target, args) {
            if (args.length === 0) {
                return new target(isVirtualContext ? virtualNow() : HOOKS.Date.now());
            }
            return new target(...args);
        },
        apply(target, thisArg, args) {
            if (args.length === 0) {
                return new target(isVirtualContext ? virtualNow() : HOOKS.Date.now()).toString();
            }
            return target(...args);
        },
        get(target, prop, receiver) {
            if (prop === "now") {
                return () => isVirtualContext ? virtualNow() : HOOKS.Date.now();
            }
            return Reflect.get(target, prop, receiver);
        },
    });
});

// Call main
main();
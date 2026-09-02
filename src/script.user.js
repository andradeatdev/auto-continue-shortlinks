// ==UserScript==
// @name               Pahe - Auto continue links
// @namespace          https://greasyfork.org/users/821661
// @version            0.0.7
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

    DEFAULT_CLICK_DELAY: 500,
    DEFAULT_SLEEP_MS: 1_000,
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

const READER_KEYS = Object.keys(readers);

const restraints = {
    "nonEmpty": (actual) => {
        if (actual == null) return false;
        if (typeof actual === "string") return actual.trim() !== "";
        if (typeof actual === "number") return actual !== 0;
        if (typeof actual === "boolean") return actual === true;
        if (Array.isArray(actual)) return actual.length > 0;
        return true;
    },
    // Intentional loose equality: catches both null and undefined
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

const transforms = {
    trim: (value) => String(value).trim(),

    extract: (value, { pattern, group = 0 }) => {
        if (typeof pattern === "string") {
            const s = String(value);
            const i = s.indexOf(pattern);
            return i === -1 ? "" : s.slice(i, i + pattern.length);
        }
        if (pattern instanceof RegExp) {
            const m = String(value).match(pattern);
            return m ? m[group] ?? m[0] : "";
        }
        logger.error("extract op requires 'pattern' as a string or RegExp:", pattern);
        return value;
    },

    replace: (value, { from, to }) => {
        if (from instanceof RegExp) return String(value).replace(from, to);
        return String(value).split(from).join(to);
    },

    "base64-decode": (value) => {
        try { return atob(value); } catch { return value; }
    },

    prefix: (value, { with: p }) => p + value,
    suffix: (value, { with: s }) => value + s,

    multiplier: (value, { by = 1 }) => typeof value === "number" ? value * by : value,
};

const clauseHandlers = {
    "ready-state": (match) => {
        if (typeof match.value !== "string") {
            logger.error("ready-state clause requires a string value, got:", match.value);
            return false;
        }
        const ok = document.readyState === match.value;
        if (!ok) logger.debug(`ready-state not satisfied (current=${document.readyState}, want=${match.value})`);
        return ok;
    },

    "path": (match) => {
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
    },

    "element": (match) => {
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
    },

    "query": (match) => {
        if (typeof match.name !== "string" || match.name === "") {
            logger.error("query clause requires a non-empty 'name':", match);
            return false;
        }
        const value = new URLSearchParams(location.search).get(match.name);
        if (match.value === undefined) {
            return value !== null;
        }
        return matchRestraint(value, match.value);
    },

    "not": (match) => {
        const inner = match.clause;
        if (!inner || typeof inner.when !== "string" || !Object.hasOwn(clauseHandlers, inner.when)) {
            logger.error("not clause requires a nested 'clause' with a known 'when':", match);
            return false;
        }
        return !matchWhen(inner);
    },

    "all": (match) => {
        if (!Array.isArray(match.clauses) || match.clauses.length === 0) {
            logger.error("all clause requires a non-empty 'clauses' array:", match);
            return false;
        }
        return match.clauses.every((c) => matchWhen(c));
    },

    "any": (match) => {
        if (!Array.isArray(match.clauses) || match.clauses.length === 0) {
            logger.error("any clause requires a non-empty 'clauses' array:", match);
            return false;
        }
        return match.clauses.some((c) => matchWhen(c));
    },
};

const handlers = {
    patches: {},
    actions: {},
};

const RULES = {
    TPI_OII: {
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
    HOSTING: {
        rules: [
            {
                steps: [
                    { do: "click", selector: "a#startButton" },
                    { do: "click", selector: "button#getnewlink" },
                ],
            },
        ],
    },
    OUO: {
        rules: [
            {
                steps: [
                    { do: "click", selector: "#btn-main:not(.disabled)", check: { attribute: "class", value: "nonEmpty" }, timeout: 20_000 },
                ],
            },
        ],
    },
    LINEGEE: {
        rules: [
            {
                steps: [
                    {
                        do: "sleep",
                        ms: 6000,
                    },
                    {
                        do: "redirect",
                        selector: "script",
                        check: { property: "textContent", value: { contains: "atob(" } },
                        property: "textContent",
                        transform: [
                            { op: "extract", pattern: /atob\('([^']+)'\)/, group: 1 },
                            { op: "base64-decode" },
                        ],
                    },
                ],
            },
        ],
    },
    INTERCELESTIAL: {
        patches: [
            {
                do: "tune-timer",
                match: {
                    delay: 1000,
                },
                transform: [{ op: "multiplier", by: 0.05 }],
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
    PAHE_PLUS: {
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
    ADFOC: {
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
    VEXFILE: {
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
    FILES_PAYOUTS: {
        patches: [
            {
                do: "tune-timer",
                match: {
                    delay: 1000,
                },
                transform: [{ op: "multiplier", by: 0.05 }],
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
    MODSFIRE: {
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
    FILE_UPLOAD: {
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
    DJXMAZA: {
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
    UPFILESGO: {
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
    SAFEFILEKU: {
        patches: [
            {
                do: "tune-timer",
                match: {
                    delay: 500,
                    callback: "new Date().getTime()",
                },
                transform: [{ op: "multiplier", by: 0.05 }],
                patchDate: true,
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

const domainRules = {
    "tpi.li": RULES.TPI_OII,
    "oii.la": RULES.TPI_OII,
    "ssdhostting.com": RULES.HOSTING,
    "selfhostt.com": RULES.HOSTING,
    "financeehelp.com": RULES.HOSTING,
    "cloudhostt.com": RULES.HOSTING,
    "linegee.net": RULES.LINEGEE,
    "ouo.io": RULES.OUO,
    "ouo.press": RULES.OUO,
    "intercelestial.com": RULES.INTERCELESTIAL,
    "pahe.plus": RULES.PAHE_PLUS,
    "adfoc.us": RULES.ADFOC,
    "vexfile.com": RULES.VEXFILE,
    "filespayouts.com": RULES.FILES_PAYOUTS,
    "modsfire.com": RULES.MODSFIRE,
    "www.file-upload.org": RULES.FILE_UPLOAD,
    "djxmaza.in": RULES.DJXMAZA,
    "upfilesgo.com": RULES.UPFILESGO,
    "safefileku.com": RULES.SAFEFILEKU,
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
            if (matchRule(rule)) {
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
    if (!Object.hasOwn(clauseHandlers, match.when)) {
        logger.warn("Unknown 'when' type:", match.when, "| match:", match);
        return false;
    }
    return clauseHandlers[match.when](match);
}

function resolveReader(entry) {
    const readerKeys = READER_KEYS.filter(r => entry[r] !== undefined);

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

function matchTransform(value, transform) {
    if (transform === undefined || transform === null) return value;

    const ops = Array.isArray(transform) ? transform : [transform];
    for (const op of ops) {
        if (!op || typeof op !== "object" || typeof op.op !== "string") {
            logger.error("Invalid transform op:", op);
            continue;
        }
        const fn = transforms[op.op];
        if (!fn) {
            logger.error("Unknown transform op:", op.op);
            continue;
        }
        value = fn(value, op);
    }
    return value;
}

function matchRule(rule) {
    if (rule.matches == null || rule.matches.length === 0) return true;

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
            ctx.aborted = true;
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
            cancelTimeout();
            callback(value);
        };

        const check = () => {
            try {
                const result = condition();
                pollCount++;
                if (!result) {
                    safeSetTimeout(check, interval);
                    return;
                }
                logger.debug(`waitFor${tag} resolved after ${pollCount} polls`);
                done(resolve, result);
            } catch (err) {
                logger.error(`waitFor${tag} condition threw:`, err);
                done(reject, err);
            }
        };

        safeSetTimeout(check, interval);

        const cancelTimeout = safeSetTimeout(() => {
            logger.debug(`waitFor${tag} timed out after ${timeout}ms (${pollCount} polls)`);
            done(reject, new Error(`waitFor${tag} timed out after ${timeout}ms`));
        }, timeout);
    });
}

async function resolveTarget(step, ctx) {
    const timeout = step.timeout ?? CONFIG.DEFAULT_STEP_TIMEOUT;

    if (typeof step.selector === "string") {
        return waitFor(() => {
            const nodes = document.querySelectorAll(step.selector);
            for (const node of nodes) {
                if (step.check && !matchCheck(node, step.check)) continue;
                logger.debug(`resolveTarget found: ${step.selector}`);
                return node;
            }
        }, {
            timeout,
            label: "resolve-target",
        });
    }

    if (ctx.lastElement) {
        logger.debug("resolveTarget found: lastElement");
        return ctx.lastElement;
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
    const { selector, times = 1, delay = CONFIG.DEFAULT_CLICK_DELAY, once = false } = step;
    let node = await resolveTarget(step, ctx);

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
        node = times === 1 ? node : await resolveTarget(step, ctx);

        logger.debug(`Click ${i}/${times}:`, selector ?? "(lastElement)");
        node.dispatchEvent(event);
        ctx.lastElement = node;

        if (i < times) await new Promise(r => safeSetTimeout(r, delay));
    }
    if (onceKey) sessionStorage.setItem(onceKey, "1");

    logger.debug("Click(s) dispatched on:", node);
});

addAction("sleep", async (step) => {
    const ms = step.ms ?? CONFIG.DEFAULT_SLEEP_MS;
    logger.info("Sleeping for", ms, "ms");

    await new Promise(r => safeSetTimeout(r, ms));

    logger.debug("Sleep finished");
});

addAction("scroll-into-view", async (step, ctx) => {
    const node = await resolveTarget(step, ctx);
    if (!node) {
        logger.warn("scroll-into-view target not found:", step.selector);
        return;
    }
    logger.debug("scroll-into-view:", step.selector);
    node.scrollIntoView({ behavior: "smooth", block: "center" });
    ctx.lastElement = node;
});

addAction("set-element-property", async (step, ctx) => {
    const node = await resolveTarget(step, ctx);
    if (!node) {
        logger.warn("set-element-property target not found:", step.selector);
        return;
    }
    if (typeof step.name !== "string" || step.name === "") {
        logger.warn("set-element-property requires a 'name' property:", step);
        return;
    }
    let { value } = step;
    if (value === undefined) {
        if (step.transform === undefined) {
            logger.warn("set-element-property requires 'value' or 'transform':", step);
            return;
        }
        value = matchTransform(node[step.name], step.transform);
    }
    logger.debug("set-element-property:", step.selector, "property:", step.name, "=", value);
    node[step.name] = value;
    ctx.lastElement = node;
});

addAction("remove-element-property", async (step, ctx) => {
    const node = await resolveTarget(step, ctx);
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
    const node = await resolveTarget(step, ctx);
    if (!node) {
        logger.warn("set-attribute target not found:", step.selector);
        return;
    }
    if (typeof step.name !== "string" || step.name === "") {
        logger.warn("set-attribute requires a 'name' property:", step);
        return;
    }
    if (typeof step.value !== "string") {
        logger.warn("set-attribute requires a 'value' property:", step);
        return;
    }
    logger.debug("set-attribute:", step.selector, "attribute:", step.name, "=", step.value);
    node.setAttribute(step.name, step.value);
    ctx.lastElement = node;
});

addAction("remove-element", async (step, ctx) => {
    const node = await resolveTarget(step, ctx);
    if (!node) {
        logger.warn("remove-element target not found:", step.selector);
        return;
    }
    logger.debug("remove-element:", step.selector);
    node.remove();
});

addAction("redirect", async (step, ctx) => {
    const node = await resolveTarget(step, ctx);
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
    const finalUrl = matchTransform(url, step.transform);

    if (typeof finalUrl !== "string" || finalUrl.trim() === "") {
        logger.warn("Redirect URL is empty:", step);
        ctx.aborted = true;
        return;
    }

    logger.info("Redirecting via", resolved.key, `"${resolved.name}"`, "→", finalUrl);
    window.location.href = finalUrl;

    ctx.aborted = true;
});

addPatch("set-property", async (step) => {
    if (typeof step.chain !== "string" || step.chain === "") {
        logger.warn("set-property requires a non-empty 'chain':", step);
        return;
    }

    const chain = step.chain.startsWith("window.") ? step.chain.slice(7) : step.chain;

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
        set() { logger.debug(`set-property: ignored set on ${chain}`); },
    });
    logger.debug(`set-property done: defined "${lastKey}" on ${chain}`);
});

addPatch("tune-timer", async (step) => {
    const { delay, callback } = step.match || {};
    const { patchDate = false, transform } = step;

    const dateFactor = (() => {
        const ops = Array.isArray(transform) ? transform : transform ? [transform] : [];
        const mult = ops.find((o) => o && o.op === "multiplier");
        if (mult && typeof mult.by === "number" && isFinite(mult.by) && mult.by > 0) {
            return 1 / mult.by;
        }
        if (mult) logger.warn("tune-timer: multiplier 'by' must be a positive finite number, got:", mult.by, "— using factor 1");
        return 1;
    })();

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
        return startTime + realElapsed * dateFactor;
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

        logger.debug("tune-timer: timeout=", timeout, "transform=", transform);

        args[0] = wrappedFn;
        args[1] = matchTransform(timeout, transform);

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
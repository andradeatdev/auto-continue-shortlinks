import { readers, READER_KEYS } from "./config.js";
import { logger } from "./logger.js";

export const restraints = {
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

export const transforms = {
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

export const clauseHandlers = {
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

export function matchRestraint(actual, restraint) {
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

export function matchTransform(value, transform) {
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

export function matchCheck(node, check) {
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

export function resolveReader(entry) {
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

export function matchWhen(match) {
    if (!Object.hasOwn(clauseHandlers, match.when)) {
        logger.warn("Unknown 'when' type:", match.when, "| match:", match);
        return false;
    }
    return clauseHandlers[match.when](match);
}

export function matchRule(rule) {
    if (rule.matches == null || rule.matches.length === 0) return true;

    for (const match of rule.matches) {
        if (!matchWhen(match)) {
            logger.debug("Rule clause failed:", JSON.stringify(match));
            return false;
        }
    }

    return true;
}

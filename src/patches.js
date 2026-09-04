import { self, HOOKS } from "./config.js";
import { logger } from "./logger.js";
import { matchTransform } from "./matching.js";
import { addPatch } from "./engine.js";

addPatch("set-property", async (step) => {
    if (typeof step.chain !== "string" || step.chain === "") {
        logger.warn("set-property requires a non-empty 'chain':", step);
        return;
    }

    const chain = step.chain.startsWith("self.") ? step.chain.slice(7) : step.chain;

    const { value } = step;
    const parts = chain.split(".");
    let current = self;
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

    self.setInterval = new Proxy(HOOKS.setInterval, { apply: hookTimer });
    self.setTimeout = new Proxy(HOOKS.setTimeout, { apply: hookTimer });

    if (!patchDate) return;

    self.Date = new Proxy(HOOKS.Date, {
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

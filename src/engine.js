import { CONFIG, HOOKS, self, handlers } from "./config.js";
import { logger } from "./logger.js";
import { matchCheck, matchRule } from "./matching.js";

export function waitFor(condition, options = {}) {
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

export async function resolveTarget(step, ctx) {
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

export function safeSetTimeout(callback, delay) {
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

export async function executeRule(rule, ctx) {
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

export function addPatch(name, handler) {
    handlers.patches[name] = handler;
}

export function addAction(name, handler) {
    handlers.actions[name] = handler;
}

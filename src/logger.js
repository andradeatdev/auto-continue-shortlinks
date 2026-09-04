import { CONFIG, HOOKS } from "./config.js";

export function createLogger(hostname) {
    const prefix = `[Bypass][${hostname}]`;

    return {
        error: (...args) => HOOKS.error(prefix, "ERROR:", ...args),
        warn: (...args) => HOOKS.warn(prefix, "WARN:", ...args),

        log: (...args) => CONFIG.DEBUG && HOOKS.log(prefix, ...args),
        info: (...args) => CONFIG.DEBUG && HOOKS.info(prefix, "INFO:", ...args),
        debug: (...args) => CONFIG.DEBUG && HOOKS.debug(prefix, "DEBUG:", ...args),
    };
}

export const logger = createLogger(location.hostname);

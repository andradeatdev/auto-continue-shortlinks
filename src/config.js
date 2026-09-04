export const CONFIG = {
    DEBUG: true,

    DEFAULT_STEP_TIMEOUT: 10_000,
    RULE_MATCH_TIMEOUT: 120_000,
    DEFAULT_REQUEST_TIMEOUT: 60_000,
    POLL_INTERVAL: 250,

    DEFAULT_CLICK_DELAY: 500,
    DEFAULT_SLEEP_MS: 1_000,
};

export const self = unsafeWindow;

export const HOOKS = {
    setTimeout: self.setTimeout.bind(self),
    setInterval: self.setInterval.bind(self),
    clearTimeout: self.clearTimeout.bind(self),
    clearInterval: self.clearInterval.bind(self),

    Date: self.Date,

    log: self.console.log.bind(self.console),
    warn: self.console.warn.bind(self.console),
    error: self.console.error.bind(self.console),
    info: self.console.info.bind(self.console),
    debug: self.console.debug.bind(self.console),
};

export const readers = {
    attribute: (node, name) => node.getAttribute(name),
    property: (node, name) => node[name],
    style: (node, name) => getComputedStyle(node)[name],
    classList: (node, name) => node.classList.contains(name),
};

export const READER_KEYS = Object.keys(readers);

export const handlers = {
    patches: {},
    actions: {},
};

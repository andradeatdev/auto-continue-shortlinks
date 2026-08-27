// ==UserScript==
// @name               Pahe - Auto continue links
// @namespace          https://greasyfork.org/users/821661
// @version            0.0.2
// @description        just another bypass links for pahe
// @author             hdyzen
// 
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
// @run-at             document-start
// @icon               https://www.google.com/s2/favicons?domain=pahe.ink
// @grant              none
// @license            GPL-3.0
// ==/UserScript==

const RULE_TEMPLATE = {
    CLOUDFLARE_AND_GET_LINK: [
        {
            path: "*",
            if: { type: "elementExists", selector: "[name='cf-turnstile-response']" },
            description: "bypass links",
            steps: [
                {
                    action: "waitElement",
                    selector: "[name='cf-turnstile-response']",
                    attribute: "value",
                    attributeValue: "*",
                },
                {
                    action: "click",
                    selector: "button#continue",
                },
            ],
        },
        {
            path: "*",
            if: { type: "elementExists", selector: "a.get-link" },
            description: "bypass links",
            steps: [
                {
                    action: "click",
                    selector: "a.get-link:not(.disabled)",
                    timeout: 20000,
                },
            ],
        },
    ],
    SOME_HOST_AND_GET_LINK: [
        {
            path: "*",
            description: "bypass links",
            steps: [
                {
                    action: "click",
                    selector: "a#startButton",
                },
                {
                    action: "click",
                    selector: "button#getnewlink",
                },
            ],
        },
    ],
    OUO_AND_GET_LINK: [
        {
            path: "*",
            description: "bypass links",
            steps: [
                {
                    action: "click",
                    selector: "#btn-main:not(.disabled)",
                    attribute: "class",
                    attributeValue: "*",
                    timeout: 20000,
                }
            ],
        },
    ]
}

const bypassRules = {
    "tpi.li": RULE_TEMPLATE.CLOUDFLARE_AND_GET_LINK,
    "oii.la": RULE_TEMPLATE.CLOUDFLARE_AND_GET_LINK,
    "ssdhostting.com": RULE_TEMPLATE.SOME_HOST_AND_GET_LINK,
    "selfhostt.com": RULE_TEMPLATE.SOME_HOST_AND_GET_LINK,
    "ouo.io": RULE_TEMPLATE.OUO_AND_GET_LINK,
    "ouo.press": RULE_TEMPLATE.OUO_AND_GET_LINK,
    "intercelestial.com": [
        {
            path: "*",
            description: "bypass links",
            setup: [
                {
                    action: "setAttributes",
                    selector: "body > div",
                    text: "AntiAdBlock",
                    attributes: {
                        "style": "display: none !important;",
                    },
                },
            ],
            steps: [
                {
                    action: "click",
                    selector: "button.myButton",
                    times: 3,
                    delay: 1000,
                },
            ],
        },
    ],
    "pahe.plus": [
        {
            path: "*",
            description: "bypass links",
            setup: [
                {
                    action: "click",
                    selector: "a.get-link:not(.disabled)",
                    timeout: 20000,
                }
            ],
            steps: [
                {
                    action: "waitElement",
                    selector: "#captchaShortlink iframe",
                    attribute: "data-hcaptcha-response",
                    attributeValue: /.+/,
                    timeout: 120_000,
                },
                {
                    action: "click",
                    selector: "button#invisibleCaptchaShortlink:not([disabled])",
                },
            ],
        },
    ],
};

const actionHandlers = {};

// Main

async function executeBypass() {
    const host = location.hostname;
    const getPath = () => location.pathname;

    const domainRules = bypassRules[host];
    if (!domainRules) return;

    const ctx = {
        host,
        getPath,
        lastElement: null,
        aborted: false,
    };

    const findValidRule = () => {
        return domainRules.find(rule => matchPath(rule.path, getPath) && evaluateConditionSync(rule.if));
    };

    let matchedRule = findValidRule();

    if (matchedRule) {
        console.log("[Bypass] Rule matched:", matchedRule);

        if (matchedRule.setup) {
            console.log("[Bypass] Executing setup steps...");
            for (const step of matchedRule.setup) executeBackgroundAction(step, ctx);
        }

        await executeRule(matchedRule, ctx);
        return;
    }

    console.log("[Bypass] Waiting for conditions to be met...");

    await new Promise(resolve => {
        const observer = new MutationObserver(() => {
            matchedRule = findValidRule();

            if (matchedRule) {
                observer.disconnect();
                console.log("[Bypass] Condition met! Executing:", matchedRule);

                if (matchedRule.setup) {
                    console.log("[Bypass] Executing setup steps...");
                    for (const step of matchedRule.setup) executeBackgroundAction(step, ctx);
                }

                executeRule(matchedRule, ctx).finally(resolve);
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });

        setTimeout(() => {
            observer.disconnect();
            console.log(`[Bypass] Timeout: No conditions were met in 15s.`);
            resolve();
        }, 15000);
    });
}

async function executeRule(rule, ctx) {
    try {
        for (const step of rule.steps) {
            if (ctx.aborted) break;

            const handler = actionHandlers[step.action];
            if (!handler) throw new Error(`Action ${step.action} not found`);

            console.log(`[Bypass] > ${step.action}`, step);
            await handler(step, ctx);
        }
        console.log("[Bypass] Done");
    } catch (error) {
        console.error("[Bypass] Error", error);
    }
}

function executeBackgroundAction(step, ctx) {
    const handler = actionHandlers[step.action];
    if (!handler) return;

    handler(step, ctx).catch(err => {
        console.error(`[Bypass] Error executing background action "${step.action}":`, err.message);
    });
}

function evaluateConditionSync(condition) {
    if (!condition) return true;

    switch (condition.type) {
        case "elementExists":
            return document.querySelector(condition.selector) !== null;
        default:
            return false;
    }
}

// Helpers

function click(node) {
    if (!node) return;

    const event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
    });

    node.dispatchEvent(event);
}

function waitElement(selector, options = {}) {
    return new Promise((resolve, reject) => {
        const { timeout = 10000, attribute, attributeValue, text } = options;

        const checkCondition = () => {
            const nodes = document.querySelectorAll(selector);
            for (const node of nodes) {
                let isValid = true;

                if (attribute !== undefined) {
                    const currentValue = node.getAttribute(attribute);
                    if (attributeValue === "*") {
                        if (currentValue === null || currentValue.trim() === "") isValid = false;
                    } else if (attributeValue instanceof RegExp) {
                        if (!attributeValue.test(currentValue)) isValid = false;
                    } else {
                        if (currentValue !== attributeValue) isValid = false;
                    }
                }

                if (isValid && text !== undefined) {
                    const currentText = (node.innerText || node.textContent || "").trim();
                    if (text instanceof RegExp) {
                        if (!text.test(currentText)) isValid = false;
                    } else {
                        if (!currentText.includes(text)) isValid = false;
                    }
                }

                if (isValid) {
                    console.log("[Bypass] Found element:", node);
                    return node;
                }
            }
            return null;
        };

        const node = checkCondition();
        if (node) return resolve(node);

        const observer = new MutationObserver(() => {
            const node = checkCondition();
            if (node) {
                observer.disconnect();
                resolve(node);
            }
        });

        const observerConfig = {
            childList: true,
            subtree: true,
            attributes: attribute !== undefined,
            characterData: text !== undefined,
        };

        if (attribute) observerConfig.attributeFilter = [attribute];

        observer.observe(document.body || document.documentElement, observerConfig);

        setTimeout(() => {
            observer.disconnect();
            const errorMsg = attribute
                ? `Timeout after ${timeout}ms: ${selector} does not have ${attribute}="${attributeValue}"`
                : `Timeout after ${timeout}ms: ${selector} not found`;
            reject(new Error(errorMsg));
        }, timeout);
    });
}

function registerAction(name, handler) {
    actionHandlers[name] = handler;
}

function matchPath(rulePath, currentPath) {
    if (!rulePath || rulePath === "*") return true;
    if (rulePath instanceof RegExp) return rulePath.test(currentPath);
    if (typeof rulePath === "string" && rulePath.endsWith("/*")) {
        const prefix = rulePath.slice(0, -2);
        return currentPath === prefix || currentPath.startsWith(`${prefix}/`);
    }
    return currentPath === rulePath;
}

function getWaitOptions(step) {
    return {
        timeout: step.timeout,
        attribute: step.attribute,
        attributeValue: step.attributeValue,
        text: step.text,
    };
}

function withAutoWait(handler) {
    return async (step, ctx) => {
        let targetNode = ctx.lastElement;

        // console.log("Selector", step.selector, document.querySelector(step.selector));

        if (step.selector) {
            targetNode = await waitElement(step.selector, getWaitOptions(step));
            ctx.lastElement = targetNode;
        }

        if (!targetNode) {
            throw new Error("[Bypass] No target element found. Provide a 'selector' or execute an action before filling 'ctx.lastElement'.");
        }

        return handler(step, ctx, targetNode);
    };
}

// Actions

registerAction("waitElement", withAutoWait(async (step, ctx, node) => {
    // noop
    return node;
}));

registerAction("click", withAutoWait(async (step, ctx, node) => {
    const times = step.times || 1;
    const delay = step.delay || 500;

    if (times === 1) {
        console.log("click", node);
        click(node);
        return node;
    }

    for (let i = 1; i <= times; i++) {
        const currentNode = await waitElement(step.selector, getWaitOptions(step));

        click(currentNode);
        ctx.lastElement = currentNode;

        if (i < times) await new Promise(r => setTimeout(r, delay));
    }

    click(node);
    return node;
}));

registerAction("sleep", async (step, ctx) => {
    const ms = step.ms || 1000;
    console.log(`[Bypass] Sleeping for ${ms}ms...`);

    if (step.logProgress) {
        for (let i = ms; i > 0; i -= 1000) {
            if (ctx.aborted) break;
            console.log(`[Bypass] Looping... ${i}ms left`);
            await new Promise(r => setTimeout(r, 1000));
        }
    } else {
        await new Promise(r => setTimeout(r, ms));
    }

    console.log(`[Bypass] Sleep done.`);
});

registerAction("removeElement", withAutoWait(async (step, ctx, node) => {
    console.log(`[Bypass] Removing element ${node}`);
    node.remove();
    return node;
}));

registerAction("setAttributes", withAutoWait(async (step, ctx, node) => {
    if (typeof step.attributes !== "object") {
        throw new Error("[Bypass] setAttribute: Invalid 'attribute' format. Expected an object with 'name' and 'value' properties.");
    }

    for (const key in step.attributes) {
        node.setAttribute(key, step.attributes[key]);
    }

    return node;
}));

registerAction("scrollIntoView", withAutoWait(async (step, ctx, node) => {
    node.scrollIntoView({ behavior: "smooth" });
    return node;
}));

executeBypass();

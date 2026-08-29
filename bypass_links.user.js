// ==UserScript==
// @name               Pahe - Auto continue links
// @namespace          https://greasyfork.org/users/821661
// @version            0.0.5
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
// @match              https://adfoc.us/*
//
// @run-at             document-start
// @icon               https://www.google.com/s2/favicons?domain=pahe.ink
// @grant              none
// @license            GPL-3.0
// ==/UserScript==

const CONFIG = {
	DEBUG: true
};

const logger = {
	prefix: () => `[Bypass][${location.hostname}]`,
	log: (...args) => CONFIG.DEBUG && console.log(logger.prefix(), ...args),
	warn: (...args) => CONFIG.DEBUG && console.warn(logger.prefix(), ...args),
	error: (...args) => CONFIG.DEBUG && console.error(logger.prefix(), ...args),
	info: (...args) => CONFIG.DEBUG && console.info(logger.prefix(), ...args),
	debug: (...args) => CONFIG.DEBUG && console.debug(logger.prefix(), ...args)
};

const hooks = {
	setTimeout: window.setTimeout.bind(window),
	setInterval: window.setInterval.bind(window),
	clearTimeout: window.clearTimeout.bind(window),
	clearInterval: window.clearInterval.bind(window)
};

const RULE_TEMPLATE = {
	CLOUDFLARE_AND_GET_LINK: [
		{
			match: {
				path: "*",
				if: { type: "elementExists", selector: "[name='cf-turnstile-response']" },
			},

			steps: [
				{
					type: "waitElement",
					selector: "[name='cf-turnstile-response']",
					attribute: "value",
					attributeValue: "*"
				},
				{
					type: "click",
					selector: "button#continue"
				}
			]
		},
		{
			match: {
				path: "*",
				if: { type: "elementExists", selector: "a.get-link" },
			},

			steps: [
				{
					type: "click",
					selector: "a.get-link:not(.disabled)",
					timeout: 20_000
				}
			]
		}
	],
	SOME_HOST_AND_GET_LINK: [
		{
			match: {
				path: "*",
			},

			steps: [
				{
					type: "click",
					selector: "a#startButton"
				},
				{
					type: "click",
					selector: "button#getnewlink"
				}
			]
		}
	],
	OUO_AND_GET_LINK: [
		{
			match: {
				path: "*",
			},

			steps: [
				{
					type: "click",
					selector: "#btn-main:not(.disabled)",
					attribute: "class",
					attributeValue: "*",
					timeout: 20_000
				}
			]
		}
	]
};

const bypassRules = {
	"tpi.li": RULE_TEMPLATE.CLOUDFLARE_AND_GET_LINK,
	"oii.la": RULE_TEMPLATE.CLOUDFLARE_AND_GET_LINK,
	"ssdhostting.com": RULE_TEMPLATE.SOME_HOST_AND_GET_LINK,
	"selfhostt.com": RULE_TEMPLATE.SOME_HOST_AND_GET_LINK,
	"ouo.io": RULE_TEMPLATE.OUO_AND_GET_LINK,
	"ouo.press": RULE_TEMPLATE.OUO_AND_GET_LINK,
	"intercelestial.com": [
		{
			match: {
				path: "*",
			},

			patches: [
				{
					type: "accelerateInterval",
					match: {
						delay: 1000,
					},
					transform: {
						acceleration: 0.01
					}
				}
			],

			steps: [
				{
					type: "click",
					selector: "button.myButton",
					times: 3,
					delay: 1000
				}
			]
		}
	],
	"pahe.plus": [
		{
			match: {
				path: "*",
				if: {
					type: "elementExists",
					selector: "[data-hcaptcha-response]",
				},
			},

			steps: [
				{
					type: "click",
					selector: "button#invisibleCaptchaShortlink:not([disabled])",
					attribute: "disabled",
					attributeValue: null,
					timeout: 120_000
				}
			]
		},
		{
			match: {
				path: "*",
				if: {
					type: "elementExists",
					selector: ".get-link",
				},
			},

			steps: [
				{
					type: "click",
					selector: ".get-link:not(.disabled)",
					attribute: "class",
				}
			]
		}
	],
	"adfoc.us": [
		{
			match: {
				path: "*",
			},

			patches: [
				{
					type: "setConstant",
					chain: "count",
					value: 0
				}
			]
		},
		{
			match: {
				path: "*",
				if: { type: "elementExists", selector: "#showSkip:not([style*='display: none'])" },
			},

			steps: [
				{
					type: "click",
					selector: "a.skip"
				}
			]
		}
	]
};

const action = {};
const patches = {};

// Main

async function executeBypass() {
	const host = location.hostname;
	const getPath = () => location.pathname;

	const domainRules = bypassRules[host];
	if (!domainRules) return;

	const ctx = {
		lastElement: null,
		lastVariable: null,
		aborted: false
	};

	const findValidRule = () => {
		return domainRules.find(({ match }) =>
			matchPath(match.path, getPath) && evaluateConditionSync(match.if));
	};

	let matchedRule = findValidRule();
	if (matchedRule) {
		logger.info("Rule matched:", matchedRule.match);
		await executeRule(matchedRule, ctx);
		return;
	}

	logger.debug("No matching rule yet. Observing DOM for conditions...");

	await new Promise(resolve => {
		let settled = false;

		const observer = new MutationObserver(() => {
			if (settled) return;

			matchedRule = findValidRule();
			if (!matchedRule) return;

			settled = true;
			observer.disconnect();
			cancelTimeout();

			logger.info("Condition met. Executing match:", matchedRule.match);

			executeRule(matchedRule, ctx).finally(resolve);
		});

		observer.observe(document.documentElement, {
			childList: true,
			subtree: true,
			attributes: true
		});

		const cancelTimeout = safeSetTimeout(() => {
			if (settled) return;

			settled = true;
			observer.disconnect();

			logger.warn("Timeout: no conditions met in 15s");
			resolve();
		}, 15000);
	});
}

async function executeRule(rule, ctx) {
	try {
		logger.info("Executing patches:", (rule.patches || []).length);
		await executePatchs(rule.patches, ctx);

		logger.info("Executing steps:", (rule.steps || []).length);
		await executeSteps(rule.steps, ctx);

		logger.info("Rule executed successfully");
	} catch (error) {
		logger.error("Rule execution failed:", error);
	}
}

async function executeSteps(steps, ctx) {
	const stepList = steps || [];

	for (const [index, step] of stepList.entries()) {
		if (ctx.aborted) break;

		const handler = action[step.type];

		if (!handler) {
			throw new Error(`Action ${step.type} not found`);
		}

		logger.info(`Running step [${index + 1}/${stepList.length}]:`, step.type, { selector: step.selector });

		await handler(step, ctx);

		logger.info(`Step [${index + 1}/${stepList.length}] completed:`, step.type);
	}
}

function executePatchs(patchs, ctx) {
	const patchList = patchs || [];

	for (const [index, patch] of patchList.entries()) {
		if (ctx.aborted) break;

		const handler = patches[patch.type];

		if (!handler) {
			throw new Error(`[Bypass] Patch ${patch.type} not found`);
		}

		logger.info(`Running patch [${index + 1}/${patchList.length}]:`, patch.type);

		handler(patch, ctx);

		logger.info(`Patch [${index + 1}/${patchList.length}] completed:`, patch.type);
	}
}

function evaluateConditionSync(condition) {
	if (!condition) return true;

	if (condition.type === "elementExists") {
		return document.querySelector(condition.selector) !== null;
	}
}

// Helpers

function click(node) {
	if (!node) return;

	const event = new MouseEvent("click", {
		bubbles: true,
		cancelable: true,
		view: window
	});

	node.dispatchEvent(event);
}

function waitElement(selector, options = {}) {
	return new Promise((resolve, reject) => {
		const { timeout = 10000, attribute, attributeValue = "*", text } = options;

		let settled = false;
		let timeoutId;

		const finish = (callback, value) => {
			if (settled) return;

			settled = true;
			observer.disconnect();
			clearTimeout(timeoutId);
			callback(value);
		};

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
					return node;
				}
			}

			return null;
		};

		const node = checkCondition();
		if (node) {
			logger.debug("Element already present:", selector);
			resolve(node);
			return;
		}

		const observer = new MutationObserver(() => {
			const node = checkCondition();
			if (node) {
				logger.debug("Element found:", selector);
				finish(resolve, node);
			}
		});

		const observerConfig = {
			childList: true,
			subtree: true,
			attributes: attribute !== undefined,
			characterData: text !== undefined
		};

		if (attribute) observerConfig.attributeFilter = [attribute];

		observer.observe(document.documentElement, observerConfig);

		timeoutId = safeSetTimeout(() => {
			const errorMsg = attribute
				? `Timeout after ${timeout}ms: ${selector} does not have ${attribute}="${attributeValue}"`
				: `Timeout after ${timeout}ms: ${selector} not found`;
			finish(reject, new Error(errorMsg));
		}, timeout);
	});
}

function waitVariable(owner, prop, options = {}) {
	return new Promise((resolve, reject) => {
		const { timeout = 10000 } = options;

		let settled = false;
		let timeoutId;

		const finish = (callback, value) => {
			if (settled) return;

			settled = true;
			clearTimeout(timeoutId);
			callback(value);
		};

		let initialState = owner[prop];
		if (initialState !== undefined) {
			finish(resolve, initialState);
			return;
		}

		Object.defineProperty(owner, prop, {
			configurable: true,
			enumerable: true,
			get() {
				return initialState;
			},
			set(v) {
				initialState = v;
				finish(resolve, v);
			}
		});

		timeoutId = safeSetTimeout(() => {
			finish(reject, new Error(`Timeout after ${timeout}ms: ${prop} not set on owner`));
		}, timeout);
	});
}

function registerAction(name, handler) {
	action[name] = handler;
}

function registerPatch(name, handler) {
	patches[name] = handler;
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

function getWaitElOptions(step) {
	return {
		timeout: step.timeout,
		attribute: step.attribute,
		attributeValue: step.attributeValue,
		text: step.text
	};
}

function withAutoWait(handler) {
	return async (step, ctx) => {
		let targetNode = ctx.lastElement;

		if (step.selector) {
			targetNode = await waitElement(step.selector, getWaitElOptions(step));
			ctx.lastElement = targetNode;
		}

		if (!targetNode) {
			throw new Error("[Bypass] No target element found. Provide a 'selector' or execute an action before filling 'ctx.lastElement'.");
		}

		return handler(step, ctx, targetNode);
	};
}

// Tries prevent unexpected behaviors due to other scripts/extensions interfering with the setTimeout calls.
function safeSetTimeout(callback, delay) {
	const startTime = Date.now();
	let timeoutId;

	const check = () => {
		const elapsed = Date.now() - startTime;

		if (elapsed >= delay) {
			callback();
		} else {
			timeoutId = hooks.setTimeout(check, delay - elapsed);
		}
	};

	timeoutId = hooks.setTimeout(check, delay);

	return () => {
		hooks.clearTimeout(timeoutId);
	};
}

function setConstant(owner, chain, value) {
	const parts = chain.split(".");
	let current = owner;

	for (let i = 0; i < parts.length - 1; i++) {
		const prop = parts[i];
		if (!current[prop] || typeof current[prop] !== "object") current[prop] = {};
		current = current[prop];
	}

	const lastProp = parts[parts.length - 1];

	Object.defineProperty(current, lastProp, {
		configurable: true,
		enumerable: true,
		get() {
			return value;
		},
		set() { }
	});
}

function interceptMethod(owner, methodName, handlers) {
	const target = owner[methodName];

	const proxyHandlers = {};

	for (const [trap, handler] of Object.entries(handlers)) {
		proxyHandlers[trap] = (...args) => {
			const target = args[0];

			const next = (...nextArgs) => Reflect[trap](target, ...nextArgs);

			return handler(...args, next);
		};
	}

	owner[methodName] = new Proxy(target, proxyHandlers);
}

function matchValue(value, matcher) {
	if (matcher === undefined) return true;

	if (typeof matcher === "function") {
		return matcher(value);
	}

	if (matcher instanceof RegExp) {
		return matcher.test(value);
	}

	if (
		typeof matcher === "object" &&
		matcher !== null
	) {
		return matcher.min <= value && value <= matcher.max;
	}

	return value === matcher;
}


function patchTimer(step, methodName) {
	const { delay, callback } = step.match;
	const { factor } = step.transform;

	if (delay === undefined && callback === undefined) {
		throw new Error("[Bypass] At least one of 'delay' or 'callback' must be defined in timer patch.");
	}

	const matchDelay = (value) => matchValue(value, delay);

	const matchCallback = (value) => {
		return matchValue(value.toString(), callback);
	};

	interceptMethod(window, methodName, {
		apply(target, thisArg, args, next) {
			const [fn, timeout] = args;

			if (!matchDelay(timeout)) {
				return next(thisArg, args);
			}

			if (!matchCallback(fn)) {
				return next(thisArg, args);
			}

			args[1] = timeout * factor;

			return next(thisArg, args);
		}
	});
}

// Actions

registerAction("waitElement", withAutoWait(async () => {
	// noop
}));

registerAction("waitVariable", async (step, ctx) => {
	let owner = window;
	if (step.owner) {
		owner = window[step.owner];
	}

	const prop = await waitVariable(owner, step.prop, {
		timeout: step.timeout,
	});

	ctx.lastVariable = prop;
});

registerAction("click", withAutoWait(async (step, ctx, node) => {
	const times = step.times || 1;
	const delay = step.delay || 500;
	const clickTarget = step.selector || "ctx.lastElement";

	logger.debug("Click action:", clickTarget);
	if (times === 1) {
		logger.debug("Clicking", clickTarget);
		click(node);
		return node;
	}

	for (let i = 1; i <= times; i++) {
		const currentNode = await waitElement(step.selector, getWaitElOptions(step));

		logger.debug(`Click ${i}/${times}:`, clickTarget);
		click(currentNode);
		ctx.lastElement = currentNode;

		if (i < times) await new Promise(r => safeSetTimeout(r, delay));
	}
}));

registerAction("sleep", async (step, ctx) => {
	const ms = step.ms || 1000;
	logger.info("Sleeping for", ms, "ms");

	if (step.logProgress) {
		for (let i = ms; i > 0; i -= 1000) {
			if (ctx.aborted) break;
			logger.debug(`Remaining: ${i}ms`);
			await new Promise(r => safeSetTimeout(r, 1000));
		}
	} else {
		await new Promise(r => safeSetTimeout(r, ms));
	}

	logger.debug("Sleep finished");
});

registerAction("removeElement", withAutoWait(async (step, ctx, node) => {
	logger.info("Removing element:", step.selector || "ctx.lastElement");
	node.remove();
}));

registerAction("setAttributes", withAutoWait(async (step, ctx, node) => {
	if (typeof step.attributes !== "object") {
		throw new Error("[Bypass] setAttribute: Invalid 'attribute' format. Expected an object with 'name' and 'value' properties.");
	}

	for (const key in step.attributes) {
		node.setAttribute(key, step.attributes[key]);
	}
}));

registerAction("scrollIntoView", withAutoWait(async (step, ctx, node) => {
	node.scrollIntoView({ behavior: "smooth" });
}));

// Patches

registerPatch("setConstant", async (step) => {
	let chain = step.chain;

	if (step.chain.startsWith("window.")) {
		chain = step.chain.slice(7);
	}

	setConstant(window, chain, step.value);
});

registerPatch("accelerateInterval", (step) => patchTimer(step, "setInterval"));
registerPatch("accelerateTimeout", (step) => patchTimer(step, "setTimeout"));

executeBypass();

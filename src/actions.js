import { CONFIG, self, readers } from "./config.js";
import { logger } from "./logger.js";
import { resolveReader, matchTransform } from "./matching.js";
import { addAction, resolveTarget, safeSetTimeout } from "./engine.js";

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
        view: self,
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
    self.location.href = finalUrl;

    ctx.aborted = true;
});

addAction("submit-via-gm", async (step, ctx) => {
    const { selector, headers = {}, writeRedirect = false, timeout = CONFIG.DEFAULT_REQUEST_TIMEOUT } = step;

    const form = await resolveTarget({ selector }, ctx);
    if (!form || form.tagName !== "FORM") {
        logger.warn("submit-via-gm target must be a form:", selector);
        return;
    }

    logger.info("submit-via-gm: arming intercept on form", selector);

    form.submit = () => {
        let formData = new FormData(form);
        const snapshot = {};
        for (const [k, v] of formData.entries()) snapshot[k] = typeof v === "string" ? v : "[file]";
        logger.info("submit-via-gm: intercepted submit, form data:", JSON.stringify(snapshot));

        formData = new URLSearchParams(formData);
        const headersWith = Object.assign({ "Content-Type": "application/x-www-form-urlencoded" }, headers);

        GM_xmlhttpRequest({
            url: form.action || self.location.href,
            method: form.method || "POST",
            headers: headersWith,
            data: formData,
            timeout,
            onload: (response) => {
                const body = response.responseText || "";
                ctx.lastResponse = {
                    status: response.status,
                    url: form.action || self.location.href,
                    html: body,
                };

                if (response.status !== 200) {
                    logger.error("submit-via-gm failed, status:", response.status, body.slice(0, 600));
                    return;
                }

                logger.info("submit-via-gm status:", response.status, "| body(" + body.length + "):", body.slice(0, 600));

                if (writeRedirect) {
                    logger.info("submit-via-gm: writing redirect response to document");
                    // document.open();
                    document.write(body);
                    // document.close();
                }
            },
            ontimeout: () => {
                logger.error("submit-via-gm timed out");
            },
            onerror: (e) => {
                logger.error("submit-via-gm network error:", e);
            },
        });
    };
});

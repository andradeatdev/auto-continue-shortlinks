import { CONFIG, handlers } from "./config.js";
import { logger } from "./logger.js";
import { matchRule } from "./matching.js";
import { domainRules } from "./domain-rules.js";
import { waitFor, executeRule } from "./engine.js";
import "./actions.js";
import "./patches.js";

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

main();

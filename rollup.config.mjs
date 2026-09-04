import { readFileSync } from "node:fs";

const header = readFileSync("src/header.txt", "utf-8");

export default {
    input: "src/index.js",
    treeshake: false,
    output: {
        file: "dist/script.user.js",
        format: "es",
    },
    plugins: [
        {
            name: "flat-output",
            renderChunk(code) {
                return code
                    .replace(/^import .+ from .+;$/gm, "")
                    .replace(/^export /gm, "");
            },
            banner() {
                return header;
            },
        },
    ],
};

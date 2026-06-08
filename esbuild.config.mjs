import esbuild from "esbuild";

import process from "process";
import { builtinModules } from 'node:module';

const prod = (process.argv[2] === "production");
const context = await esbuild.context({
    bundle: true,
    platform: "node",
    target: "es2018",
    logLevel: "info",
    sourcemap: prod ? false : "inline",
    treeShaking: true,
    minify: prod,

    outdir: "dist",
    entryPoints: ["src/main.ts", "src/styles.css", "src/manifest.json"],
    external: [
        "obsidian",
        ...builtinModules
    ],
    loader: {
        ".json": "copy"
    }
});

if (prod) {
    await context.rebuild();
    process.exit(0);
} else {
    await context.watch();
}
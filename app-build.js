import { cpSync } from "fs";
import { join, resolve } from "path";
const appPath = resolve("./app");
const distPath = resolve("./dist/css");
const cssPath = join(appPath, "css");

cpSync(distPath, cssPath, { recursive: true });

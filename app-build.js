import { cpSync } from "fs";
import { join, resolve } from "path";
const appPath = resolve("./app");
const distAppPath = resolve("./dist/app");
const cssPath = resolve("./dist/css");

cpSync(appPath, distAppPath, { recursive: true });
cpSync(cssPath, distAppPath, { recursive: true });

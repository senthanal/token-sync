import StyleDictionary from 'style-dictionary';
import { join, resolve } from 'node:path';
import process from 'node:process';
import { cpSync } from 'node:fs';
import {execa} from "execa";
import * as core from "@actions/core";

const distTokenLibPath = resolve(process.cwd(), 'dist/token-lib');
const tokenLibPath = resolve(process.cwd(), 'token-lib');
const tokenLibCssPath = join(process.cwd(), 'token-lib', 'css');
const tokenAppPath = resolve(process.cwd(), 'token-app');
const tokensPath = resolve(tokenLibPath, 'tokens');

await build();

async function build() {
  await buildTokens();
  await buildTokenLib();
  await buildApp();
  await commitChanges();
}

async function buildTokens() {
  const sd = new StyleDictionary({
    source: [`${tokensPath}/**/*.json`],
    platforms: {
      scss: {
        transformGroup: "scss",
        buildPath: `${tokenLibPath}/scss/`,
        files: [
          {
            destination: "_variables.scss",
            format: "scss/variables"
          }
        ]
      },
      css: {
        transformGroup: 'css',
        buildPath: `${tokenLibPath}/css/`,
        files: [
          {
            destination: 'variables.css',
            format: 'css/variables',
          },
        ],
      },
      ts: {
        transformGroup: "js",
        buildPath: `${tokenLibPath}/ts/`,
        files: [
          {
            format: "javascript/es6",
            destination: "variables.js"
          },
          {
            format: "typescript/es6-declarations",
            destination: "variables.d.ts"
          }
        ]
      }
    },
  });
  await sd.buildAllPlatforms();
}

async function buildTokenLib(){
  cpSync(tokenLibPath, distTokenLibPath, { recursive: true });
}

async function buildApp(){
  cpSync(tokenLibCssPath, tokenAppPath, { recursive: true });
}

async function commitChanges(){
  // git status
  const { stdout } = await execa`git status --short`;
  core.info(stdout);
  // git add
  await execa`git add .`;
  // git commit
  const commitMessage = 'build: generate styles from token modifications';
  await execa`git commit -m ${commitMessage}`;
  // git push
  await execa`git push`;
}


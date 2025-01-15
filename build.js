import StyleDictionary from 'style-dictionary';
import { join, resolve } from 'node:path';
import process from 'node:process';
import { cpSync } from 'node:fs';

const distTokenLibPath = resolve(process.cwd(), 'dist/token-lib');
const tokenLibPath = resolve(process.cwd(), 'token-lib');
const tokenLibCssPath = join(process.cwd(), 'token-lib', 'css');
const tokenAppPath = resolve(process.cwd(), 'token-app');
const tokensPath = resolve(tokenLibPath, 'tokens');
import core from '@actions/core';

await build();

async function build() {
  await buildTokens();
  await buildTokenLib();
  await buildApp();
}

async function buildTokens() {
  core.info('Building tokens');
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
  core.info('Tokens built');
}

async function buildTokenLib(){
  core.info('Building token lib');
  cpSync(tokenLibPath, distTokenLibPath, { recursive: true });
  core.info('Token lib built');
}

async function buildApp(){
  core.info('Building token app');
  cpSync(tokenLibCssPath, tokenAppPath, { recursive: true });
  core.info('Token app built');
}


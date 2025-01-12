import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({
  source: ['tokens.json'],
  platforms: {
    scss: {
      transformGroup: "scss",
      buildPath: "dist/scss/",
      files: [
        {
          destination: "_variables.scss",
          format: "scss/variables"
        }
      ]
    },
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
        },
      ],
    },
    ts: {
      transformGroup: "js",
      buildPath: 'dist/js/',
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

import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import replace from '@rollup/plugin-replace';
import { visualizer } from "rollup-plugin-visualizer";
import cleaner from 'rollup-plugin-cleaner';


const nodePlugins = [
  typescript(),
  // `browser: false` is required for `fs` and other Node.js core modules to be resolved correctly
  nodeResolve({ browser: false }),
  // To accept commonjs modules and convert them to ES module, since rollup only bundle ES modules by default
  commonjs(),
  // Parse JSON files and make them ES modules. Required when bundling circomlib
  json(),
];


const browserPlugins = [
  typescript(),
  replace({
    // Replace `process.browser` with `true` to avoid `process is not defined` error
    // This is because ffjavascript and snarkjs use `process.browser` to check if it's running in the browser,
    // but process is undefined in the browser and referencing `process.browser` causes an error.
    // Ref: https://github.com/iden3/ffjavascript/blob/e670bfeb17e80b961eab77e15a6b9eca8e31a0be/src/threadman.js#L43
    'process.browser': JSON.stringify(true),
    // To avoid unexpected behavior that the warning suggests.
    'preventAssignment': true,
  }),
  // Resolve the import from node_modules.
  // `browser: true` is required for `window` not to be undefined
  // Ref: https://github.com/iden3/snarkjs/blob/782894ab72b09cfad4dd8b517599d5e7b2340468/src/taskmanager.js#L20-L24
  nodeResolve({browser: true}),
  commonjs(),
  json(),
  // Replace node built-in modules with polyfills
  nodePolyfills(),
];


export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs', // Output format for use in Node.js
    },
    external: [
      "rlnjs",
    ],
    plugins: [
      cleaner({
        targets: [
          './dist/'
        ]
      }),
      ...nodePlugins,
      visualizer(),
    ]
  },
  // Bundle for browser
  {
    input: 'src/index.ts',
    output:{
      file: 'dist/bundle.js',
      format: 'es', // Output format for use in the browser
    },
    plugins: [
      ...browserPlugins,
      visualizer(),
    ]
  }
];

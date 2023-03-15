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
];


const browserPlugins = [
  typescript(),
  nodeResolve({browser: true}),
  commonjs(),
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

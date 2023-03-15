import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
// import nodePolyfill from 'rollup-plugin-node-polyfills';


export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'iife', // Output format for use in the browser
    banner: 'window.process = { browser: true, env: { ENVIRONMENT: "BROWSER" } };',
  },
  plugins: [
    typescript(),
    nodeResolve({browser: true}),
    commonjs(),
    json(),
    nodePolyfills(),
    // nodePolyfill(),
  ],
  watch: {
    include: 'src/**',
  },
};

import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';


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
      typescript(),
      nodeResolve({ browser: false }),
      commonjs(),
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
      typescript(),
      nodeResolve({ browser: true }),
      commonjs(),
    ]
  }
];

import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'es',
    banner: '#!/usr/bin/env node'
  },
  external: [
    'fs',
    'path',
    'url',
    'os',
    'child_process',
    'util',
    'commander',
    'fs-extra',
    'inquirer',
    'chalk',
    'ora',
    'validate-npm-package-name'
  ],
  plugins: [
    json(),
    resolve({
      preferBuiltins: true
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      useTsconfigDeclarationDir: true
    })
  ]
}; 
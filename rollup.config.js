import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    plugins: [typescript()],
    output: [
      {
        file: 'dist/eventin.esm.js',
        format: 'esm',
      },
      {
        file: 'dist/eventin.cjs.js',
        format: 'cjs',
      },
    ],
  },
  {
    input: 'src/index.ts',
    plugins: [dts()],
    output: { file: 'dist/eventin.d.ts', format: 'es' },
  },
];

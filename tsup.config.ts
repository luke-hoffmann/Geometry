import { defineConfig, type Options } from 'tsup';

const shared = {
  entry: ['src/index.ts'],
  splitting: false,
  minify: true,
  target: 'es2022',
  platform: 'browser',
  external: ['usefulfunction', 'colorhandler', 'p5'],
  treeshake: true,
} satisfies Options;

export default defineConfig([
  {
    ...shared,
    clean: true,
    format: ['esm'],
    dts: true,
  },
  {
    ...shared,
    clean: false,
    format: ['iife'],
    dts: false,
    globalName: 'geometry',
    outExtension() {
      return { js: '.global.js' };
    },
  },
]);
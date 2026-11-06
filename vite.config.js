import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import contentPlugin from './scripts/content-plugin.mjs'

// During `npm run dev`, load the two main fonts right away — as the built site does
// (see scripts/prerender.mjs) — so text does not briefly show in a fallback font.
const devFontPreload = {
  name: 'dev-font-preload',
  apply: 'serve',
  transformIndexHtml: () =>
    [
      '/node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
      '/node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2',
    ].map((href) => ({
      tag: 'link',
      attrs: { rel: 'preload', href, as: 'font', type: 'font/woff2', crossorigin: '' },
      injectTo: 'head-prepend',
    })),
}

// The site is served from the root of https://icareathome.eu/.
// If it is ever served from a sub-folder (e.g. https://<user>.github.io/<repo>/),
// change `base` to '/<repo>/' — all links and image paths follow automatically.
export default defineConfig(({ isSsrBuild }) => ({
  base: '/',
  plugins: [react(), tailwindcss(), contentPlugin(), devFontPreload],
  build: {
    // The server bundle (used only to pre-render HTML) must not receive a copy of /public.
    copyPublicDir: !isSsrBuild,
  },
}))

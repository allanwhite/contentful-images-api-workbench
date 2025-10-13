import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const siteUrl = (() => {
  const fallback = 'https://contentful-images-api-workbench.vercel.app';
  const value =
    process.env.VITE_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : fallback);
  return value.endsWith('/') ? value.slice(0, -1) : value;
})();

export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'html-site-url',
      transformIndexHtml(html) {
        return html.replace(/%VITE_SITE_URL%/g, siteUrl);
      }
    }
  ]
});

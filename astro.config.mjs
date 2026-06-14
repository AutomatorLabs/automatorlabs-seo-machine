// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://automatorlabs.co',
	integrations: [
		sitemap({
			filter: (page) => page !== 'https://automatorlabs.co/tools/',
		}),
	],
});

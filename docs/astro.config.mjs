// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://peterbenoit.github.io/SaltyKeys.js',
	integrations: [
		starlight({
			title: 'SaltyKeys.js',
			description: 'A JavaScript library for obfuscating and verifying API keys on CodePen.',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/peterbenoit/SaltyKeys.js' },
			],
			head: [
				// Author & Basic Meta
				{ tag: 'meta', attrs: { name: 'author', content: 'Peter Benoit' } },
				{ tag: 'meta', attrs: { name: 'color-scheme', content: 'light dark' } },

				// Favicons & Icons
				{ tag: 'link', attrs: { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' } },
				{ tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' } },
				{ tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' } },
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' } },
				{ tag: 'link', attrs: { rel: 'manifest', href: '/site.webmanifest' } },

				// Safari Pinned Tab
				{ tag: 'link', attrs: { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#3498db' } },

				// Theme Color
				{ tag: 'meta', attrs: { name: 'theme-color', content: '#3498db' } },
				{ tag: 'meta', attrs: { name: 'msapplication-TileColor', content: '#2c3e50' } },

				// Apple Mobile Web App
				{ tag: 'meta', attrs: { name: 'apple-mobile-web-app-capable', content: 'yes' } },
				{ tag: 'meta', attrs: { name: 'apple-mobile-web-app-status-bar-style', content: 'default' } },

				// Open Graph
				{ tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
				{ tag: 'meta', attrs: { property: 'og:site_name', content: 'SaltyKeys.js' } },
				{ tag: 'meta', attrs: { property: 'og:url', content: 'https://peterbenoit.github.io/SaltyKeys.js' } },
				{ tag: 'meta', attrs: { property: 'og:image', content: 'https://peterbenoit.github.io/SaltyKeys.js/og-image.jpg' } },
				{ tag: 'meta', attrs: { property: 'og:image:alt', content: 'SaltyKeys.js - Client-side API key obfuscation for CodePen' } },

				// Twitter Card
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
				{ tag: 'meta', attrs: { name: 'twitter:creator', content: '@peterbenoit' } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: 'https://peterbenoit.github.io/SaltyKeys.js/og-image.jpg' } },
			],
			editLink: {
				baseUrl: 'https://github.com/peterbenoit/SaltyKeys.js/edit/main/docs/',
			},
			components: {
				Footer: './src/components/Footer.astro',
			},
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Quick Start', slug: 'getting-started/quick-start' },
					],
				},
				{
					label: 'Concepts',
					items: [
						{ label: 'How It Works', slug: 'concepts/how-it-works' },
						{ label: 'Limitations & Security', slug: 'concepts/limitations' },
					],
				},
				{
					label: 'API Reference',
					items: [
						{ label: 'configure()', slug: 'api/configure' },
						{ label: 'getPenId()', slug: 'api/get-pen-id' },
						{ label: 'generateSaltedKey()', slug: 'api/generate-salted-key' },
						{ label: 'getApiKey()', slug: 'api/get-api-key' },
					],
				},
				{
					label: 'Demo',
					items: [
						{ label: 'Interactive Demo', slug: 'demo' },
					],
				},
				{
					label: 'Project',
					items: [
						{ label: 'Changelog', slug: 'project/changelog' },
						{ label: 'Contributing', slug: 'project/contributing' },
					],
				},
			],
		}),
	],
});

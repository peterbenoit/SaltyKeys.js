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
				{ tag: 'meta', attrs: { name: 'author', content: 'Peter Benoit' } },
				{ tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
				{ tag: 'meta', attrs: { property: 'og:site_name', content: 'SaltyKeys.js' } },
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary' } },
				{ tag: 'meta', attrs: { name: 'color-scheme', content: 'light dark' } },
			],
			editLink: {
				baseUrl: 'https://github.com/peterbenoit/SaltyKeys.js/edit/main/docs/',
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

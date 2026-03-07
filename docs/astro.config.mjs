// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://peterbenoit.github.io/SaltyKeys.js/',
	base: '/SaltyKeys.js',
	integrations: [
		starlight({
			title: 'SaltyKeys.js',
			description: 'Client-side API key obfuscation for CodePen and educational environments.',
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
					label: 'Usage Guide',
					items: [
						{ label: 'Configuration', slug: 'usage/configuration' },
						{ label: 'Generating Salted Keys', slug: 'usage/generating-keys' },
						{ label: 'Retrieving API Keys', slug: 'usage/retrieving-keys' },
						{ label: 'Environment Setup', slug: 'usage/environment-setup' },
					],
				},
				{
					label: 'Concepts',
					items: [
						{ label: 'How It Works', slug: 'concepts/how-it-works' },
						{ label: 'Security Considerations', slug: 'concepts/security' },
						{ label: 'Performance', slug: 'concepts/performance' },
					],
				},
				{
					label: 'API Reference',
					items: [
						{ label: 'Configuration', slug: 'api/configuration' },
						{ label: 'Core Methods', slug: 'api/core-methods' },
						{ label: 'Utility Methods', slug: 'api/utility-methods' },
					],
				},
				{
					label: 'Project',
					items: [
						{ label: 'Troubleshooting', slug: 'project/troubleshooting' },
						{ label: 'Deployment', slug: 'project/deployment' },
						{ label: 'Browser Compatibility', slug: 'project/browser-compatibility' },
					],
				},
			],
		}),
	],
});

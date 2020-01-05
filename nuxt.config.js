// const pkg = require('./package')

// Read .env file
require('dotenv').config()

module.exports = {
	mode: 'universal',

	env: {},

	/*
	** Headers of the page
	*/
	head: {
		titleTemplate: titleChunk =>
			titleChunk
				? `${titleChunk} - ${process.env.APP_NAME}`
				: process.env.APP_NAME,
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content:
					'width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover'
			},
			// Verifications
			{
				name: 'google-site-verification',
				content: '5RpnwI3P8jO3RUSEQXOrW-DU00eOti_4VlYFmIkSEFM'
			},
			{
				name: 'msvalidate.01',
				content: '0F83EB755446F01A87E89E5439AB1573'
			}
		],
		link: [
			{
				rel: 'apple-touch-icon',
				href: '/img/favicons/apple-touch-icon.png'
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '32x32',
				href: '/img/favicons/32x32.png'
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '16x16',
				href: '/img/favicons/16x16.png'
			},
			{
				rel: 'mask-icon',
				href: '/img/favicons/safari-pinned-tab.svg',
				color: '#7dd194'
			}
		]
	},

	/*
	** Customize the progress-bar color
	*/
	loading: { color: '#fff' },

	/*
	** Global CSS
	*/
	css: ['@/assets/scss/main'],

	/*
	** Plugins to load before mounting the App
	*/
	plugins: [
		'@/plugins/axios-disable-https-check.js',
		'@/plugins/components.js',
		'@/plugins/constants.js',
		'@/plugins/country-select-options.js',
		'@/plugins/directives.js',
		'@/plugins/i18n.js',
		'@/plugins/maps.js',
		'@/plugins/notifications.js'
	],

	/*
	** Nuxt.js modules
	*/
	modules: [
		// Doc: https://axios.nuxtjs.org/usage
		'@nuxtjs/axios',
		'@nuxtjs/dotenv',
		'@nuxtjs/style-resources',
		'nuxt-svg-loader',
		'vue-geolocation-api/nuxt',
		[
			'@nuxtjs/auth',
			{
				plugins: ['@/plugins/auth-redirect.js'],
				strategies: {
					local: {
						endpoints: {
							login: {
								url: '/auth/login',
								method: 'post',
								propertyName: 'access_token'
							},
							logout: {
								url: '/auth/logout',
								method: 'post'
							},
							user: {
								url: '/user',
								method: 'get'
							}
						}
					}
				}
			}
		],
		[
			'nuxt-i18n',
			{
				lazy: true,
				langDir: 'lang/',
				locales: [
					{ code: 'en', iso: 'en-GB', file: 'en', name: 'English' },
					{ code: 'it', iso: 'it-IT', file: 'it', name: 'Italiano' }
				],
				defaultLocale: 'en'
			}
		],
		[
			'nuxt-mq',
			{
				breakpoints: {
					xs: 576,
					sm: 768,
					md: 992,
					lg: 1200,
					xl: Infinity
				},
				defaultBreakpoint: 'sm' // for SSR
			}
		],
		[
			'@nuxtjs/google-analytics',
			{
				id: process.env.GOOGLE_ANALYTICS_ID,
				dev: false // Disable in dev environment
			}
		]
	],

	router: {
		linkActiveClass: 'active',
		linkExactActiveClass: 'active'
	},

	/*
	** Axios module configuration
	*/
	axios: {
		// See https://github.com/nuxt-community/axios-module#options
	},

	styleResources: {
		scss: [
			'bootstrap/scss/_functions.scss',
			'~/assets/scss/_variables.scss',
			'bootstrap/scss/_variables.scss',
			'bootstrap/scss/_mixins.scss'
		]
	},

	/*
	 ** SVG Loader configuration
	 */
	svgLoader: {
		svgoConfig: {
			plugins: [{ removeDimensions: true }, { prefixIds: false }]
		}
	},

	/*
	** Build configuration
	*/
	build: {
		/*
		** You can extend webpack config here
		*/
		extend(config, ctx) {
			// Run ESLint on save
			if (ctx.isDev && ctx.isClient) {
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					exclude: /(node_modules)/
				})
			}
		},
		transpile: [/^vue2-google-maps($|\/)/],
		templates: [
			{
				src: './templates/robots.txt',
				dst: '../static/robots.txt',
				options: {
					sitemapUrl: `${process.env.BACKEND_URL}/sitemap.xml`
				}
			},
			{
				src: './templates/sitemap.xml',
				dst: '../static/sitemap.xml',
				options: {
					sitemapUrl: `${process.env.BACKEND_URL}/sitemap.xml`
				}
			}
		]
	}
}

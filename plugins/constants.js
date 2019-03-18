export default ({ app, env }, inject) => {
	inject('constants', {
		APP_NAME: env.APP_NAME,
		APP_URL: env.APP_URL,
		APP_HOST: env.APP_HOST,

		COMPANY_NAME: 'PRG s.r.l.',
		COMPANY_VAT_NUMBER: '02554710695',

		EMAIL_GENERIC: `info@${env.APP_HOST}`,
		EMAIL_VENUES: `venues@${env.APP_HOST}`,
		EMAIL_REPORT: `report@${env.APP_HOST}`,

		GOOGLE_MAPS_KEY: env.GOOGLE_MAPS_KEY,

		STRIPE_KEY: env.STRIPE_KEY,

		APP_CURRENCY_GB: 'GBP',
		APP_CURRENCY_IT: 'EUR',

		MAP_DEFAULT_CENTER_GB: { lat: 55.378, lng: -3.4359 },
		MAP_DEFAULT_CENTER_IT: { lat: 41.909, lng: 12.255 },

		MAP_DEFAULT_BOUNDS_GB: {
			ne: { lat: 60.9157, lng: 33.9165 },
			sw: { lat: 34.5614, lng: -8.8988 }
		},
		MAP_DEFAULT_BOUNDS_IT: {
			ne: { lat: 47.375636, lng: 18.710002 },
			sw: { lat: 36.323503, lng: -3.435973 }
		},

		MAP_DEFAULT_ZOOM_GB: 6,
		MAP_DEFAULT_ZOOM_IT: 6
	})
}

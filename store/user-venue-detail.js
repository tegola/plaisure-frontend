export default {
	state() {
		return {
			venue: null,
			saving: false,

			// Overview
			visits: [],
			visitCount: 0,
			favoriteCount: 0,

			// General
			categories: [],
			concessionaires: [],

			// Services
			amenities: [],
			vltPlatforms: [],

			// Photos
			photos: [],

			// Reviews
			reviews: [],

			// Plan/subscription
			paymentIntentSecret: null,
			subscription: null
		}
	},

	mutations: {
		setSaving: (state, saving) => {
			state.saving = saving
		},

		setVenue: (state, venue) => {
			state.venue = venue
		},

		setVisits: (state, visits) => {
			state.visits = visits
		},

		setVisitCount: (state, visitCount) => {
			state.visitCount = visitCount
		},

		setFavoriteCount: (state, favoriteCount) => {
			state.favoriteCount = favoriteCount
		},

		setCategories: (state, categories) => {
			state.categories = categories
		},

		setConcessionaires: (state, concessionaires) => {
			state.concessionaires = concessionaires
		},

		setAmenities: (state, amenities) => {
			state.amenities = amenities
		},

		setVltPlatforms: (state, vltPlatforms) => {
			state.vltPlatforms = vltPlatforms
		},

		setPhotos: (state, photos) => {
			state.photos = photos
		},

		setReviews: (state, reviews) => {
			state.reviews = reviews
		},

		setPaymentIntentSecret: (state, paymentIntentSecret) => {
			state.paymentIntentSecret = paymentIntentSecret
		},

		setSubscription: (state, subscription) => {
			state.subscription = subscription
		}
	}
}

import {
	extend,
	cloneDeep, // FIXME: replace with extend({}, ..., ...)
	isEqual
} from 'lodash'

const initialState = {
	venue: null,
	originalVenue: null,
	amenities: [],
	categories: [],
	concessionaires: [],
	vltPlatforms: []
}

export const state = () => extend({}, initialState)

export const getters = {
	isSaved: state => isEqual(state.venue, state.originalVenue)
}

export const mutations = {
	reset: (state) => {
		extend(state, initialState)
	},

	setVenue: (state, venue) => {
		state.venue = venue
	},

	setOriginalVenue: (state, originalVenue) => {
		state.originalVenue = cloneDeep(originalVenue)
	},

	setAmenities: (state, amenities) => {
		state.amenities = amenities
	},

	setCategories: (state, categories) => {
		state.categories = categories
	},

	setConcessionaires: (state, concessionaires) => {
		state.concessionaires = concessionaires
	},

	setVltPlatforms: (state, vltPlatforms) => {
		state.vltPlatforms = vltPlatforms
	},

	setVenueField: (state, { field, value }) => {
		state.venue[field] = value
	},

	setJackpot: (state, { field, number, value }) => {
		state.venue.jackpots[number][field] =
			field === 'value' ? parseInt(value) : value
	}
}

export default { state, getters, mutations }

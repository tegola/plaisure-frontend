import extend from 'lodash/extend'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'

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
	reset: state => {
		extend(state, initialState)
	},

	setVenue: (state, venue) => {
		state.venue = venue

		// Fill amenities with venue fields
		// FIXME: Move to separate table
		state.amenities = Object.keys(venue.amenities)
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
		if (field === 'amenities') {
			// Avoid changing the entire object or it will trigger a loop
			// FIXME: ...
			extend(state.venue.amenities, value)
		} else {
			state.venue[field] = value
		}
	},

	setJackpot: (state, { field, number, value }) => {
		state.venue.jackpots[number][field] =
			field === 'value' ? parseInt(value) : value
	}
}

export default { state, getters, mutations }

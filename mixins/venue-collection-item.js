import { amenityIconMap, isVenueOpen } from '@/utilities'
import formatDistance from '@/utilities/format-distance'

export default {
	props: {
		venue: {
			type: Object,
			required: true
		}
	},

	filters: {
		formatDistance
	},

	computed: {
		url () {
			return this.localePath({
				name: 'venues-id',
				params: {
					id: this.venue.id
				}
			})
		},

		categories () {
			if (!this.venue.categories || !this.venue.categories.length) {
				return null
			}

			return this.venue.categories
				.slice(0, 2)
				.map(category => this.$t(`data.categories.${category.machine_name}`))
				.join(', ')
		},

		firstCategoryMachineName () {
			if (!this.venue.categories || !this.venue.categories.length) {
				return null
			}

			return this.venue.categories[0].machine_name
		},

		/**
		 * Amenities for the primary category (or for the first one if primary
		 * is not set), selected by category type.
		 *
		 * @return {array}
		 */
		amenities () {
			const categories = this.venue.categories
			const amenities = this.venue.amenities

			// Return empty if no categories or amenities is found
			if (
				!categories ||
				!categories.length ||
				!amenities ||
				!amenities.length
			) {
				return []
			}

			let machineNames

			// Find primary or first category
			const category = categories.find(cat => cat.is_primary) || categories[0]

			// Define amenities to pick
			switch (category.machine_name) {
				case 'betting_shop':
					machineNames = ['pay_per_view', 'bar']
					break

				case 'bingo':
				case 'family_entertainment_center':
					machineNames = ['wifi', 'air_conditioning', 'private_parking']
					break

				case 'adult_gaming_center':
				case 'vlt':
					machineNames = ['smoking_area', 'private_room', 'wifi']
					break

				default:
					machineNames = []
			}

			// Pick amenities and add icon
			const pickedAmenitiesWithIcon = amenities
				.filter(amenity => machineNames.includes(amenity.machine_name))
				.map(amenity => ({
					...amenity,
					icon: amenityIconMap[amenity.machine_name] || null
				}))

			return pickedAmenitiesWithIcon
		},

		iconComponent () {
			const name = this.firstCategoryMachineName.replace(/_/g, '-')

			return require(`@/assets/svg/category-icons/${name}.svg?inline`)
		},

		photo () {
			const photos = this.venue.photos

			return photos && photos.length ? photos[0] : null
		},

		address () {
			const address = this.venue.address

			return [address.line1, address.city].join(', ')
		},

		isOpen () {
			return isVenueOpen(this.venue.business_hours)
		},

		isNew () {
			const created = new Date(this.venue.created_at)
			const now = new Date()
			const days = (now - created) / (1000 * 60 * 60 * 24)

			return days <= 1
		}
	}
}

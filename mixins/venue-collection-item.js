import isVenueOpen from '@/utilities/is-venue-open'
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
		categories() {
			if (!this.venue.categories || !this.venue.categories.length) return null

			return this.venue.categories
				.slice(0, 2)
				.map(category => this.$t(`data.categories.${category.machine_name}`))
				.join(', ')
		},

		firstCategoryMachineName() {
			if (!this.venue.categories || !this.venue.categories.length) return null

			return this.venue.categories[0].machine_name
		},

		iconComponent() {
			const name = this.firstCategoryMachineName.replace(/_/g, '-')

			return () => import(`@/assets/svg/category-icons/${name}.svg?inline`)
		},

		photo() {
			if (!this.venue.photos || !this.venue.photos.length) return null

			return this.venue.photos[0]
		},

		address() {
			const a = this.venue.address

			return [a.line1, a.city].join(', ')
		},

		isOpen() {
			return isVenueOpen(this.venue.business_hours)
		},

		isNew() {
			const created = new Date(this.venue.created_at)
			const now = new Date()
			const days = (now - created) / (1000 * 60 * 60 * 24)

			return days <= 1
		}
	}
}

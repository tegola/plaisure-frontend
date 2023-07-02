<template>
	<div class="pg-venue-reviews-page">
		<pg-navbar variant="dark" />

		<div class="container my-5">
			<div class="row">
				<div class="col-md-10 col-lg-8 mx-auto">
					<h3 class="mb-4">{{ $t('pages.venue_reviews.title') }}</h3>

					<pg-venue-reviews-page-item :venue="venue" />
					<br>

					<!-- Review list -->
					<pg-review-item
						v-for="review in reviews"
						:key="review.id"
						:venue="venue"
						:review="review"
						no-reply
						class="mb-3"
					/>

					<pg-no-items
						v-if="!reviews.length"
						:title="$t('pages.venue_reviews.no_items.title')"
						:subtitle="$t('pages.venue_reviews.no_items.subtitle')"
						class="py-5"
					/>
				</div>
			</div>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
import PgVenueReviewsPageItem from './item'
import PgReviewItem from '@/components/review-item'
import PgNoItems from '@/components/no-items'

export default {
	name: 'PgVenueReviewsPage',

	components: {
		PgReviewItem,
		PgNoItems,
		PgVenueReviewsPageItem
	},

	async asyncData ({ $axios, params }) {
		const data = await $axios.$get(`/venues/${params.id}/reviews`)

		return {
			venue: data.data
		}
	},

	head () {
		if (!this.venue) { return }

		return {
			title: this.$t('pages.venue_reviews.meta_title', {
				name: this.venue.name
			})
		}
	},

	computed: {
		reviews () {
			return this.venue.reviews
		}
	}
}
</script>

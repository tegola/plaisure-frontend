<template>
	<div class="ap-venue-reviews-page">
		<pg-navbar variant="dark" />

		<div class="container my-5">
			<div class="row">
				<div class="col-md-10 col-lg-8 mx-auto">
					<h3 class="mb-4">{{ $t('All reviews') }}</h3>

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
				</div>
			</div>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
import PgReviewItem from '@/components/review-item'
import PgVenueReviewsPageItem from './item'

export default {
	name: 'PgVenueReviewsPage',

	components: {
		PgReviewItem,
		PgVenueReviewsPageItem
	},

	computed: {
		reviews() {
			return this.venue.reviews
		}
	},

	asyncData({ $axios, params }) {
		return $axios.$get(`/venues/${params.id}/reviews`)
	},

	head() {
		if (!this.venue) return

		return {
			title: this.$t('pages.venue_reviews.meta_title', {
				name: this.venue.name
			})
		}
	}
}
</script>

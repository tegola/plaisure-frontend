<template>
	<div>
		<div class="row form-row align-items-center">
			<div class="col-auto">
				<b-form-group :label="$t('View')" class="mb-0">
					<b-form-radio-group
						v-model="params.view"
						:options="viewOptions"
						buttons
					/>
				</b-form-group>
			</div>
			<div class="col-auto">
				<b-form-group :label="$t('Sort by')" class="mb-0">
					<b-form-radio-group
						v-model="params.sort"
						:options="sortOptions"
						buttons
					/>
				</b-form-group>
			</div>
		</div>

		<hr>

		<pg-review-item
			v-for="review in reviews"
			:key="review.id"
			:venue="venue"
			:review="review"
			class="mb-3"
		/>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import { BFormGroup, BFormRadioGroup } from 'bootstrap-vue'
import PgReviewItem from '@/components/review-item'

export default {
	name: 'PgUserVenueDetailPageReviewsSection',

	components: {
		BFormGroup,
		BFormRadioGroup,
		PgReviewItem
	},

	data () {
		return {
			params: {
				view: 'all',
				sort: 'created_at'
			}
		}
	},

	async fetch ({ $axios, params, store }) {
		const { data } = await $axios.$get(`/user/venues/${params.id}/reviews`)

		store.commit('user-venue-detail/setReviews', data)
	},

	computed: {
		...mapState('user-venue-detail', ['venue', 'reviews']),

		viewOptions () {
			return [
				{ value: 'all', text: this.$t('All') },
				{ value: 'unanswered', text: this.$t('Unanswered') }
			]
		},

		sortOptions () {
			return [
				{ value: 'created_at', text: this.$t('Date') },
				{ value: 'replied_at', text: this.$t('Last replied') }
			]
		}
	}
}
</script>

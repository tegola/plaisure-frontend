<template>
	<div>
		<nuxt-link :to="url">
			<pg-image-frame
				:src="photo ? photo.resized_url : null"
				:content-class="photo ? null : 'pg-venue-grid-item__image-content'"
				ratio="21:9"
				class="pg-venue-grid-item__image rounded-0 mb-0">
				<component
					:is="iconComponent"
					v-if="!photo"
					class="pg-venue-grid-item__image-icon"
				/>
			</pg-image-frame>
		</nuxt-link>

		<div class="card-body pt-3">
			<p class="card-text pg-venue-grid-item__name mb-1">
				<nuxt-link :to="url">{{ venue.name }}</nuxt-link>
			</p>
			<p v-if="categories.length || venue.rating.count" class="small mb-0">
				<template v-if="categories.length">{{ categories }}</template>
				<pg-rating
					v-if="venue.rating.count"
					simple
					:value="venue.rating.average"
					:class="['pg-venue-grid-item__rating', categories.length ? 'ml-1' : null]"
				/>
			</p>
			<p class="card-text small">{{ address }}</p>
			<p v-if="venue.distance" class="card-text small text-muted">{{ venue.distance | formatDistance }}</p>
		</div>
	</div>
</template>

<script>
import PgVenueItemMixin from '@/mixins/venue-collection-item'
import PgImageFrame from '@/components/image-frame'
import PgRating from '@/components/rating'

export default {
	components: {
		PgImageFrame,
		PgRating
	},

	mixins: [PgVenueItemMixin]
}
</script>

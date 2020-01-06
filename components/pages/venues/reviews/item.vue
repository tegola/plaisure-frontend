<template>
	<nuxt-link :to="localePath({ name: 'venues-id', params: { id: venue.id }})" class="text-reset">
		<div class="row align-items-center">
			<div class="col-sm-3">
				<pg-image-frame
					:src="photo ? photo.resized_url : null"
					:content-class="photo ? null : 'pg-venue-grid-item__image-content'"
					class="pg-venue-grid-item__image">
					<div
						:is="iconComponent"
						v-if="!photo"
						class="pg-venue-grid-item__image-icon"
					/>
				</pg-image-frame>
			</div>
			<div class="col-sm-9">
				<h5 class="mb-0">{{ venue.name }}</h5>
				<div class="text-muted">{{ address }}</div>
			</div>
		</div>
	</nuxt-link>
</template>

<script>
import PgVenueItemMixin from '@/mixins/venue-collection-item'

export default {
	name: 'PgVenueReviewsPageItem',

	mixins: [PgVenueItemMixin]
}
</script>

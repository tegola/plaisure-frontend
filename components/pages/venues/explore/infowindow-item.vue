<template>
	<div>
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

		<div class="card-body pt-3">
			<p class="card-text mb-0 font-weight-bold">
				<nuxt-link :to="localePath({ name: 'venues-id', params: { id: venue.id }})">{{ venue.name }}</nuxt-link>
			</p>
			<ul v-if="venue.categories.length || venue.distance" class="list-inline card-text small text-muted mb-0">
				<li v-if="venue.categories.length" class="list-inline-item initialism">{{ categories }}</li>
				<li v-if="venue.distance" class="list-inline-item">{{ venue.distance | formatDistance }}</li>
			</ul>
			<p class="card-text small mt-1">{{ address }}</p>
		</div>
	</div>
</template>

<script>
import PgVenueItemMixin from '@/mixins/venue-collection-item'
import PgImageFrame from '@/components/image-frame'

export default {
	components: {
		PgImageFrame
	},

	mixins: [PgVenueItemMixin]
}
</script>

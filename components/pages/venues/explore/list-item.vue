<template>
	<div>
		<div class="row">
			<div class="col-3 pr-0">
				<pg-image-frame
					:src="photo ? photo.resized_url : null"
					:content-class="photo ? null : 'pg-venue-grid-item__image-content'"
					class="pg-venue-grid-item__image">
					<component
						:is="iconComponent"
						v-if="!photo"
						class="pg-venue-grid-item__image-icon"
					/>
				</pg-image-frame>
			</div>
			<div class="col-9">
				<p class="mb-0 font-weight-bold">
					<nuxt-link :to="localePath({ name: 'venues-id', params: { id: venue.id }})">{{ venue.name }}</nuxt-link>
				</p>
				<p v-if="venue.distance" class="text-muted">{{ venue.distance | formatDistance }}</p>
				<p v-if="venue.categories.length" class="small text-uppercase text-muted mb-1">{{ categories }}</p>
				<p class="mb-0">{{ address }}</p>

				<p v-if="truncatedDescription" class="small">{{ truncatedDescription }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import { truncate } from 'lodash'
import PgVenueItemMixin from '@/mixins/venue-collection-item'
import PgImageFrame from '@/components/image-frame'

export default {
	components: {
		PgImageFrame
	},

	mixins: [PgVenueItemMixin],

	computed: {
		truncatedDescription() {
			return truncate(this.venue.description, {
				length: 200,
				separator: ' '
			})
		}
	}
}
</script>

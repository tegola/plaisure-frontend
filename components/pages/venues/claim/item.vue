<template>
	<div class="row align-items-center my-4">
		<div class="col-sm-4">
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
		<div class="col-sm-8">
			<h5 class="mb-0">{{ venue.name }}</h5>
			{{ address }}
		</div>
	</div>
</template>

<script>
import PgVenueItemMixin from '@/mixins/venue-collection-item'

export default {
	name: 'PgVenueClaimPageItem',

	mixins: [PgVenueItemMixin]
}
</script>

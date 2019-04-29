<template>
	<li class="pg-venue-detail-page__nearby-item mb-2">
		<nuxt-link
			:to="localePath({ name: 'venues-id', params: { id: venue.id }})"
			class="text-reset d-flex align-items-start">
			<div
				:is="iconComponent"
				class="pg-venue-detail-page__nearby-item-icon"
			/>
			<div>
				<span class="pg-venue-detail-page__nearby-item-category">{{ categories }}</span><br>
				<strong class="pg-venue-detail-page__nearby-item-name">{{ venue.name }}</strong><br>
				<span class="pg-venue-detail-page__nearby-item-address">{{ address }}</span>
			</div>
		</nuxt-link>
	</li>
</template>

<script>
import PgVenueItemMixin from '@/mixins/venue-collection-item'
export default {
	name: 'PgVenueDetailPageNearbyItem',

	mixins: [PgVenueItemMixin]
}
</script>

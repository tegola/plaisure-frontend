<template>
	<div>
		<div class="row align-items-center">
			<div class="col-sm-3 pr-sm-0 align-self-start">
				<nuxt-link :to="url">
					<pg-image-frame
						:src="photo ? photo.resized_url : null"
						:content-class="photo ? null : 'pg-venue-grid-item__image-content'"
						class="pg-venue-grid-item__image mb-sm-0">
						<component
							:is="iconComponent"
							v-if="!photo"
							class="pg-venue-grid-item__image-icon"
						/>
					</pg-image-frame>
				</nuxt-link>
			</div>
			<div class="col-sm-9">
				<p class="pg-venue-grid-item__name mb-1">
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
				<p class="small">
					{{ address }}
					<span v-if="venue.distance" class="text-muted">&mdash; {{ venue.distance | formatDistance }}</span>
				</p>

				<ul v-if="amenities.length" class="list-inline small" :class="$mq === 'xs' || !truncatedDescription ? 'mb-0' : null">
					<li v-for="amenity in amenities" :key="amenity.machine_name" class="list-inline-item">
						<pg-icon
							v-if="amenity.icon"
							:icon="amenity.icon"
							class="mr-1"
						/>
						{{ $t(`data.amenities.${amenity.machine_name}`) }}
					</li>
				</ul>

				<p v-if="truncatedDescription && $mq !== 'xs'" class="small mb-0">{{ truncatedDescription }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import { truncate } from 'lodash'
import PgVenueItemMixin from '@/mixins/venue-collection-item'

export default {
	mixins: [PgVenueItemMixin],

	computed: {
		truncatedDescription () {
			return truncate(this.venue.description, {
				length: 200,
				separator: ' '
			})
		}
	}
}
</script>

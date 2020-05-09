<template>
	<b-list-group-item
		:to="target === 'item' ? to : null"
		:class="$mq === 'xs' ? 'px-0' : null"
		v-bind="$attrs">
		<div class="row align-items-sm-center">
			<div class="col-sm-5 col-md-4 col-lg-3">
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
			</div>

			<div class="col">
				<p class="mb-0 font-weight-bold">
					<nuxt-link
						v-if="target === 'name'"
						:to="to"
						:class="target === 'item' ? 'text-reset' : null">
						{{ venue.name }}
					</nuxt-link>
					<span v-else>{{ venue.name }}</span>
				</p>
				<p v-if="venue.categories.length" class="small text-uppercase text-muted mb-1">{{ categories }}</p>
				<p class="mb-0">{{ address }}</p>
			</div>
			<div 
				v-if="venue.subscription && venue.subscription.payment_pending"
				class="col-auto text-danger">
				<pg-icon
					icon="exclamation-circle-outline"
					class="pg-user-venues-page__list-item-warning-icon"
				/>
			</div>
			<slot />
		</div>
	</b-list-group-item>
</template>

<script>
import { BListGroupItem } from 'bootstrap-vue'
import PgVenueItemMixin from '@/mixins/venue-collection-item'

export default {
	name: 'PgUserVenueListItem',

	components: {
		BListGroupItem
	},

	mixins: [PgVenueItemMixin],

	props: {
		to: {
			type: [String, Object],
			default: ''
		},

		target: {
			type: String,
			validator: value => ['name', 'item'].indexOf(value) !== -1,
			default: 'name'
		}
	}
}
</script>

<template>
	<div>
		<div class="container text-center">
			<pg-icon icon="exclamation-circle-outline" size="4x" class="text-secondary" />
			<h1 class="display-2 font-weight-normal">{{ $t('pages.errors.venue_closed.title') }}</h1>
			<p class="lead mt-4">
				{{ $t('pages.errors.venue_closed.message_1') }}
				<template v-if="nearbyVenues.length">
					<br>
					{{ $t('pages.errors.venue_closed.message_2') }}
				</template>
			</p>
		</div>

		<!-- Nearby venues -->
		<pg-scrollable-pane v-if="nearbyVenues.length" class="mt-5 pb-5">
			<template #default="{ innerClass }">
				<div class="container">
					<div :class="['row', innerClass]">
						<div
							v-for="nearbyVenue in nearbyVenues"
							:key="nearbyVenue.id"
							class="col-11 col-sm-7 col-md-4 col-xl-3">
							<nuxt-link :to="localePath({ name: 'venues-id', params: { id: nearbyVenue.id }})" class="text-reset">
								<pg-venue-grid-item :venue="nearbyVenue" />
							</nuxt-link>
						</div>
					</div>
				</div>
			</template>
		</pg-scrollable-pane>
	</div>
</template>

<script>
import PgScrollablePane from '@/components/scrollable-pane'
import PgVenueGridItem from '@/components/venue-grid-item'

export default {
	name: 'ApVenueClosedErrorPage',

	components: {
		PgScrollablePane,
		PgVenueGridItem
	},

	props: {
		error: {
			type: Object,
			default: null
		}
	},

	computed: {
		nearbyVenues() {
			if (this.error.nearbyVenues) {
				return this.$mq === 'md' || this.$mq === 'lg'
					? this.error.nearbyVenues.slice(0, 3)
					: this.error.nearbyVenues
			} else {
				return []
			}
		}
	}
}
</script>

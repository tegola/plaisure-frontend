<template>
	<div class="pg-user-favorites-page">
		<template v-if="venues.length">
			<h3 class="h4">{{ $t('pages.user_favorites.title') }}</h3>

			<b-list-group v-if="venues.length" flush class="mt-4">
				<pg-user-venue-list-item
					v-for="venue in venues"
					:key="venue.id"
					:to="localePath({ name: 'venues-id', params: { id: venue.id }})"
					:venue="venue"
					class="pg-user-favorites-page__list-item">
					<pg-button
						class="mt-2 px-2"
						pill
						variant="accent"
						icon="heart"
						:title="$t('common.actions.remove')"
						@click="remove(venue)"
					/>
				</pg-user-venue-list-item>
			</b-list-group>
		</template>

		<pg-no-items 
			v-if="!venues.length"
			icon="heart-outline"
			:title="$t('pages.user_favorites.no_items.title')"
			:subtitle="$t('pages.user_favorites.no_items.subtitle')"
			class="py-5"
		/>
	</div>
</template>

<script>
import { BListGroup } from 'bootstrap-vue'
import PgUserVenueListItem from '@/components/pages/user/venue-list-item'
import PgNoItems from '@/components/no-items'

export default {
	name: 'PgUserFavoritesPage',

	components: {
		BListGroup,
		PgUserVenueListItem,
		PgNoItems
	},

	transition: 'prova',

	head() {
		return {
			title: this.$t('pages.user_favorites.title')
		}
	},

	asyncData({ $axios }) {
		return $axios.$get('/user/favorites')
	},

	methods: {
		async remove(venue) {
			try {
				await this.$axios.post('/user/favorites/remove', {
					id: venue.id
				})
				await this.$auth.fetchUser()

				// Remove venue from local list
				this.venues.splice(this.venues.indexOf(venue), 1)
			} catch (err) {
				this.$bvModal.msgBoxOk(this.$t('common.status.save_error'), {
					centered: true,
					headerTextVariant: 'danger',
					title: this.$t('common.status.error'),
					okTitle: this.$t('common.actions.close'),
					okVariant: 'danger'
				})
			}
		}
	}
}
</script>

<style lang="scss">
.pg-user-favorites-page {
	&__list-item:first-child {
		border-top: 0;
	}
	.pg-no-items__icon {
		color: $palette-fuchsia-500;
	}
}
</style>

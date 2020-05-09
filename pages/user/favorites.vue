<template>
	<div class="pg-user-favorites-page">
		<pg-navbar variant="dark" />

		<div class="container my-5">
			<pg-breadcrumb :items="breadcrumbItems" />

			<div class="row">
				<div class="mx-md-auto col-lg-10">
					<h1 class="h4">{{ $t('pages.user.favorites.title') }}</h1>

					<b-list-group v-if="!venues.length" flush class="mt-4">
						<pg-user-venue-list-item
							v-for="venue in venues"
							:key="venue.id"
							:to="localePath({ name: 'venues-id', params: { id: venue.id }})"
							:venue="venue"
							class="pg-user-favorites-page__list-item">
							<div class="col-auto">
								<pg-button
									class="mt-2 px-2"
									pill
									variant="accent"
									icon="heart"
									:title="$t('common.actions.remove')"
									@click="remove(venue)"
								/>
							</div>
						</pg-user-venue-list-item>
					</b-list-group>

					<pg-no-items 
						v-if="venues.length"
						icon="heart"
						:title="$t('pages.user.favorites.no_items.title')"
						:subtitle="$t('pages.user.favorites.no_items.subtitle')"
						class="py-5"
					/>
				</div>
			</div>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
import { BListGroup } from 'bootstrap-vue'
import PgUserVenueListItem from './-venue-list-item'
import PgNoItems from '@/components/no-items'

export default {
	name: 'PgUserFavoritesPage',

	middleware: 'auth',

	components: {
		BListGroup,
		PgUserVenueListItem,
		PgNoItems
	},

	computed: {
		breadcrumbItems() {
			return [
				{
					text: this.$t('pages.user.index.title'),
					to: this.localePath('user')
				},
				{
					text: this.$t('pages.user.favorites.title'),
					active: true
				}
			]
		}
	},

	head() {
		return {
			title: this.$t('pages.user.favorites.title')
		}
	},

	async asyncData({ $axios }) {
		const data = await $axios.$get('/user/favorites')

		return {
			venues: data.data
		}
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
		background-color: $fuchsia-100;
		color: $fuchsia-500;
		border-radius: 50%;
		padding: 1rem;
	}
}
</style>

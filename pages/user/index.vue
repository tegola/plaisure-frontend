<template>
	<div class="pg-user-page">
		<pg-navbar variant="dark" />

		<div class="container my-5">
			<div class="text-center">
				<h3>{{ $t('pages.user.title', { name: $auth.user.name }) }}</h3>
				<p>{{ $t('pages.user.intro') }}</p>
				<pg-button to="/user/edit" size="sm">{{ $t('pages.user.actions.edit_profile') }}</pg-button>
				<pg-button size="sm" @click="$auth.logout()">{{ $t('pages.user.actions.logout') }}</pg-button>
			</div>

			<div v-if="venues.length" class="row mt-5">
				<div v-for="venue in venues" :key="venue.id" class="col-md-6 col-xl-4 mb-4">
					<nuxt-link :to="`/venues/${venue.id}`" class="text-inherit">
						<pg-venue-grid-item
							:venue="venue"
							:show-highlight="false"
							class="mb-2"
						/>
					</nuxt-link>
					<pg-button
						:to="`/venues/${venue.id}/edit`"
						block
						variant="primary"
						size="sm">
						{{ $t('common.actions.edit') }}
					</pg-button>
				</div>
				<div class="col-md-6 col-xl-4 mb-4">
					<nuxt-link to="/venues/add" class="card pg-user-page__add-card">
						<div class="card-body pg-user-page__add-card-body">
							<pg-icon icon="plus" class="pg-user-page__add-card-icon" />
							{{ $t('pages.user.add_another') }}
						</div>
					</nuxt-link>
				</div>
			</div>

			<pg-no-items v-if="!venues.length" :title="$t('pages.user.no_items.title')" class="py-5 my-5">
				<i18n path="pages.user.no_items.message">
					<nuxt-link to="/venues/add" place="action">
						<strong>{{ $t('pages.user.no_items.message_action') }}</strong>
					</nuxt-link>
				</i18n>
			</pg-no-items>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
import PgButton from '@/components/button'
import PgNoItems from '@/components/no-items'
import PgVenueGridItem from '@/components/venue-grid-item'

export default {
	name: 'PgUserDetailPage',

	components: {
		PgNoItems,
		PgButton,
		PgVenueGridItem
	},

	head() {
		return {
			title: this.$t('pages.user.meta_title')
		}
	},

	asyncData({ $axios }) {
		return $axios.$get('/user/venues')
	}
}
</script>

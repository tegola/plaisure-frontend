<template>
	<div class="pg-user-venues-page">
		<pg-navbar variant="dark" />

		<nuxt-child />

		<div class="container my-5">
			<pg-breadcrumb :items="breadcrumbItems" />

			<div class="row">
				<div class="mx-md-auto col-lg-10">
					<h3 class="h4">{{ $t('pages.user.venues.index.title') }}</h3>
					<p class="text-muted">
						<template v-if="venues.length">{{ $t('pages.user.venues.index.subtitle_edit') }}</template>
						<template v-else>{{ $t('pages.user.venues.index.subtitle_first') }}</template>
					</p>

					<b-list-group v-if="venues.length" flush class="mt-4">
						<pg-user-venue-list-item
							v-for="venue in venues"
							:key="venue.id"
							:to="localePath({ name: 'user-venues-id', params: { id: venue.id }})"
							target="item"
							:venue="venue"
							class="pg-user-venues-page__list-item"
						/>
						<b-list-group-item
							:to="localePath('user-venues-add')"
							class="border-bottom-0 pg-user-venues-page__list-item pg-user-venues-page__add-list-item">
							<div class="row align-items-center">
								<div class="col-4 col-sm-5 col-md-4 col-lg-3">
									<pg-image-frame content-class="pg-user-venues-page__add-list-item-content">
										<pg-icon icon="plus" class="pg-user-venues-page__add-list-item-icon" />
									</pg-image-frame>
								</div>
								<div class="col font-weight-bold">
									<template v-if="venues.length">{{ $t('pages.user.venues.index.add_another') }}</template>
									<template v-else>{{ $t('pages.user.venues.index.add_first') }}</template>
								</div>
							</div>
						</b-list-group-item>
					</b-list-group>
				</div>
			</div>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
import { BListGroup, BListGroupItem } from 'bootstrap-vue'
import PgUserVenueListItem from '../-venue-list-item'

export default {
	name: 'PgUserVenuesPage',

	middleware: 'auth',

	components: {
		BListGroup,
		BListGroupItem,
		PgUserVenueListItem
	},

	async asyncData ({ $axios }) {
		const data = await $axios.$get('/user/venues')

		return {
			venues: data.data
		}
	},

	computed: {
		breadcrumbItems () {
			return [
				{
					text: this.$t('pages.user.index.title'),
					to: this.localePath('user')
				},
				{
					text: this.$t('pages.user.venues.index.title'),
					active: true
				}
			]
		}
	},

	head () {
		return {
			title: this.$t('pages.user.venues.index.title')
		}
	}
}
</script>

<style lang="scss">
.pg-user-venues-page {
	// List item
	&__list-item {
		transition: all 0.15s;
		color: inherit;

		&:first-child {
			border-top: 0;
		}
	}
	&__list-item:hover {
		color: $olive-900;
	}

	&__list-item-warning-icon {
		width: 1.75rem;
		height: 1.75rem;
	}

	// Add another venue
	&__add-list-item-content {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	&__add-list-item-icon {
		width: $spacer * 3;
		height: $spacer * 3;
		padding: $spacer / 2;
		border-radius: 50%;
		margin-bottom: $spacer * 0.25;
		color: $olive-900;
		background-color: $green-100;
		transition: 0.15s;
	}
	&__add-list-item:hover &__add-list-item-icon {
		background-color: $olive-900;
		color: $green-100;
	}
}
</style>

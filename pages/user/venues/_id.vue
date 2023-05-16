<template>
	<div class="pg-user-venue-detail-page">
		<pg-navbar variant="dark" />

		<div class="bg-green-100 py-3">
			<div class="container">
				<pg-breadcrumb :items="breadcrumbItems" />
				<h1 class="display-4 text-olive-900 font-weight-semibold">
					<nuxt-link :to="localePath(`/venues/${venue.id}`)" class="text-reset">{{ venue.name }}</nuxt-link>
				</h1>
				<p class="text-olive-800 mb-0">{{ venue.address.line1 }}, {{ venue.address.city }}</p>
			</div>
		</div>

		<b-navbar sticky class="subheader">
			<div class="container flex-column align-items-stretch" @click="menuOpen = !menuOpen">
				<div v-if="isSmallScreen" class="d-flex justify-content-between align-items-center text-olive-900">
					<pg-icon :icon="currentMenu.icon" class="subheader__icon" />
					<h5 class="mb-0 ml-2 mr-auto">{{ currentMenu.label }}</h5>
					<pg-icon icon="chevron-down" />
				</div>
				<b-collapse :visible="$mq | mq({ xs: menuOpen, lg: true })">
					<b-nav v-bind="navProps" class="subheader__menu">
						<b-nav-item
							v-for="menu in menus"
							:key="menu.id"
							:to="menu.url"
							exact
							link-classes="subheader__menu-link">
							<pg-icon
								v-if="isSmallScreen"
								:icon="menu.icon"
								class="subheader__menu-icon"
							/>
							{{ menu.label }}
						</b-nav-item>
					</b-nav>
				</b-collapse>
			</div>
		</b-navbar>

		<div class="container my-5">
			<nuxt-child @submitted="fetch" />
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
import { mapState } from 'vuex'
import { BNavbar, BNav, BNavItem, BCollapse } from 'bootstrap-vue'

export default {
	name: 'PgUserVenueDetailPage',

	components: {
		BNavbar,
		BNav,
		BNavItem,
		BCollapse
	},

	middleware: 'auth',

	data () {
		return {
			menuOpen: false,
			menus: [
				{
					id: 'overview',
					label: this.$t('pages.user.venues.detail.menus.overview'),
					icon: 'eye',
					url: this.localePath('user-venues-id')
				},
				{
					id: 'info',
					label: this.$t('pages.user.venues.detail.menus.general'),
					icon: 'pin',
					url: this.localePath('user-venues-id-general')
				},
				{
					id: 'services',
					label: this.$t('pages.user.venues.detail.menus.services'),
					icon: 'drink',
					url: this.localePath('user-venues-id-services')
				},
				{
					id: 'photos',
					label: this.$t('pages.user.venues.detail.menus.photos'),
					icon: 'image',
					url: this.localePath('user-venues-id-photos')
				},
				{
					id: 'contacts',
					label: this.$t('pages.user.venues.detail.menus.contacts'),
					icon: 'phone',
					url: this.localePath('user-venues-id-contacts')
				},
				{
					id: 'hours',
					label: this.$t('pages.user.venues.detail.menus.hours'),
					icon: 'clock-outline',
					url: this.localePath('user-venues-id-hours')
				},
				{
					id: 'jackpots',
					label: this.$t('pages.user.venues.detail.menus.jackpots'),
					icon: 'prize',
					url: this.localePath('user-venues-id-jackpots')
				},
				/*
				{
					id: 'reviews',
					label: this.$t('pages.user.venues.detail.menus.reviews'),
					icon: 'bubble-star',
					url: this.localePath('user-venues-id-reviews')
				},
				*/
				{
					id: 'plan',
					label: this.$t('pages.user.venues.detail.menus.plan'),
					icon: 'coins',
					url: this.localePath('user-venues-id-plan')
				}
			]
		}
	},

	async fetch ({ $axios, params, store }) {
		const { data } = await $axios.$get(`/user/venues/${params.id}`)

		store.commit('user-venue-detail/setVenue', data)
	},

	head () {
		return {
			title: this.$t('pages.user.venues.detail.title')
		}
	},

	computed: {
		...mapState('user-venue-detail', ['venue']),

		isSmallScreen () {
			return ['xs', 'sm', 'md'].includes(this.$mq)
		},

		isLargeScreen () {
			return ['lg', 'xl'].includes(this.$mq)
		},

		breadcrumbItems () {
			return [
				{
					text: this.$t('pages.user.index.title'),
					to: this.localePath('user')
				},
				{
					text: this.$t('pages.user.venues.index.title'),
					to: this.localePath('user-venues')
				},
				{
					text: this.$t('pages.user.venues.detail.title'),
					active: true
				}
			]
		},

		navProps () {
			return {
				vertical: this.isSmallScreen,
				pills: this.isSmallScreen,
				tabs: this.isLargeScreen
			}
		},

		currentMenu () {
			return this.menus.find(menu => menu.url === this.$route.path)
		}
	},

	methods: {
		async fetch () {
			const { data } = await this.$axios.$get(
				`/user/venues/${this.$route.params.id}`
			)

			this.$store.commit('user-venue-detail/setVenue', data)
		},

		onClick () {
			console.log('menu open', this.menuOpen);
		}
	}
}
</script>

<style lang="scss" scoped>
.subheader {
	border-bottom: $border-width solid $gray-200;

	&__icon {
		width: 1.5rem;
		height: 1.5rem;
	}

	&__menu-link {
		display: flex;
	}

	@include media-breakpoint-down('md') {
		padding-top: map-get($spacers, 3);
		padding-bottom: map-get($spacers, 3);

		&__menu {
			margin-top: map-get($spacers, 3);
		}
		&__menu-link {
			align-items: center;
			padding-left: map-get($spacers, 2);
		}
		&__menu-icon {
			margin-right: map-get($spacers, 3);
		}
	}
	@include media-breakpoint-up('lg') {
		padding: 0;
	}
}
</style>

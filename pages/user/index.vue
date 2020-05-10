<template>
	<div class="pg-user-page">
		<pg-navbar variant="dark" />

		<div class="container my-5">
			<h1 class="h4">{{ $t('pages.user.index.title') }}</h1>
			<p class="text-muted">
				{{ $auth.user.name }} &mdash; {{ $auth.user.email }}
				<a href="#" class="ml-2" @click="$auth.logout()">{{ $t('pages.user.index.logout') }}</a>
			</p>

			<mq-layout :mq="['xs', 'sm']">
				<b-list-group flush>
					<b-list-group-item
						v-for="menu in menus"
						:key="menu.id"
						:to="menu.url"
						class="d-flex align-items-center pl-2">
						<pg-icon :icon="menu.icon" class="mr-3" />
						<div>
							<div>{{ menu.label }}</div>
							<div v-if="menu.sublabel" class="small text-muted">{{ menu.sublabel }}</div>
						</div>
					</b-list-group-item>
				</b-list-group>
			</mq-layout>

			<mq-layout mq="md+">
				<div class="row mt-5">
					<div
						v-for="menu in menus"
						:key="menu.id"
						class="col-sm-6 col-md-4 mb-4">
						<nuxt-link :to="menu.url" class="text-reset">
							<b-card class="pg-user-page__menu" body-class="d-flex align-items-center">
								<pg-icon
									:icon="menu.icon"
									class="mr-3"
									size="2x"
								/>
								<div>
									<div>{{ menu.label }}</div>
									<div v-if="menu.sublabel" class="small text-muted">{{ menu.sublabel }}</div>
								</div>
							</b-card>
						</nuxt-link>
					</div>
				</div>
			</mq-layout>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
import { BCard, BListGroup, BListGroupItem } from 'bootstrap-vue'

export default {
	components: {
		BCard,
		BListGroup,
		BListGroupItem
	},

	middleware: 'auth',

	computed: {
		menus () {
			const isOwner = this.$auth.user.is_owner
			const menus = []

			if (isOwner) {
				menus.push({
					id: 'venues',
					label: this.$t('pages.user.index.venues_label'),
					sublabel: this.$tc(
						'pages.user.index.venues_count',
						this.$auth.user.venue_ids.length,
						{ count: this.$auth.user.venue_ids.length }
					),
					icon: 'pin',
					url: this.localePath('user-venues')
				})
			}

			menus.push({
				id: 'info',
				label: this.$t('pages.user.index.info_label'),
				sublabel: this.$t('pages.user.index.info_sublabel'),
				icon: 'user',
				url: this.localePath('user-info')
			})

			if (isOwner) {
				menus.push({
					id: 'billing',
					label: this.$t('pages.user.index.billing'),
					icon: 'credit-card',
					url: this.localePath('user-billing')
				})
			}

			menus.push({
				id: 'favorites',
				label: this.$t('pages.user.index.favorites'),
				icon: 'heart',
				url: this.localePath('user-favorites')
			})

			/*
			menus.push({
				id: 'reviews',
				label: this.$t('Recensioni'),
				sublabel: 'Voti e recensioni lasciate',
				icon: 'star',
				url: this.localePath('user-favorites')
			})
			*/

			menus.push({
				id: 'password',
				label: this.$t('pages.user.index.password'),
				icon: 'key',
				url: this.localePath('user-password')
			})

			return menus
		}
	},

	head () {
		return {
			title: this.$t('pages.user.index.title')
		}
	}
}
</script>

<style lang="scss">
.pg-user-page {
	&__menu {
		height: 100%;
		transition: 0.15s;

		&:hover,
		&:focus {
			background-color: $green-100;
			color: $olive-900;
		}
	}
}
</style>

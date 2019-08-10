<template>
	<div class="pg-user-page">
		<pg-navbar variant="dark" />

		<div class="container">
			<div class="row">
				<div class="col-md-4 col-lg-3">
					<b-card no-body class="pg-user-page__menu">
						<b-card-body class="pt-5">
							<h3 class="h5 mb-0">{{ $auth.user.name }}</h3>
							<p class="text-muted text-truncate card-text">{{ $auth.user.email }}</p>
						</b-card-body>

						<b-list-group flush>
							<b-list-group-item
								v-if="$auth.user.is_owner"
								:to="localePath('user')"
								exact
								class="pg-user-page__menu-item">
								{{ $t('pages.user.menu.venues') }}
							</b-list-group-item>

							<b-list-group-item
								:to="localePath('user-info')"
								exact
								class="pg-user-page__menu-item mt-3">
								{{ $t('pages.user.menu.info') }}
							</b-list-group-item>
							<b-list-group-item
								v-if="$auth.user.is_owner"
								:to="localePath('user-billing')"
								exact
								class="pg-user-page__menu-item">
								{{ $t('pages.user.menu.billing') }}
							</b-list-group-item>
							<b-list-group-item
								:to="localePath('user-favorites')"
								exact
								class="pg-user-page__menu-item">
								{{ $t('pages.user.menu.favorites') }}
							</b-list-group-item>
							<!--
							<b-list-group-item
								exact
								class="pg-user-page__menu-item">
								{{ $t('pages.user.menu.reviews') }}
							</b-list-group-item>
							-->
							<b-list-group-item
								:to="localePath('user-password')"
								exact
								class="pg-user-page__menu-item">
								{{ $t('pages.user.menu.password') }}
							</b-list-group-item>

							<b-list-group-item
								href="#"
								class="pg-user-page__menu-item mt-3"
								@click="$auth.logout()">
								{{ $t('pages.user.menu.logout') }}
							</b-list-group-item>
						</b-list-group>
					</b-card>
				</div>
				<div class="col-md-8 offset-lg-1 col-lg-7 pt-5">
					<nuxt-child />
				</div>
			</div>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
import { BCard, BCardBody, BListGroup, BListGroupItem } from 'bootstrap-vue'

export default {
	middleware: 'auth',

	components: {
		BCard,
		BCardBody,
		BListGroup,
		BListGroupItem
	}
}
</script>

<style lang="scss">
.pg-user-page {
	&__menu {
		position: sticky;
		top: 0;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		border-top: 0;
	}
	&__menu-item {
		border: 0;
	}
}
</style>

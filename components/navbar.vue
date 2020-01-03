<template>
	<div>
		<nav :class="classes">
			<div class="container">
				<!-- Small logo, toggles menu -->
				<div
					v-if="['xs', 'sm'].indexOf($mq) >= 0"
					:aria-label="$constants.APP_NAME"
					class="navbar-brand"
					@click="toggleDrawer()">
					<pg-logo
						:flat="variant != 'light' || drawerOpen"
						:text="false"
						class="navbar__logo" />
					<pg-icon icon="chevron-down" class="navbar__logo-arrow" />
				</div>

				<!-- Normal logo, goes to home page -->
				<nuxt-link
					v-if="['md', 'lg', 'xl'].indexOf($mq) >= 0"
					:aria-label="$constants.APP_NAME"
					class="navbar-brand"
					:to="localePath('index')">
					<pg-logo
						:flat="variant != 'light'"
						class="navbar__logo" />
				</nuxt-link>

				<b-navbar-nav>
					<template v-if="!$auth.loggedIn">
						<b-nav-item
							v-if="['md', 'lg', 'xl'].indexOf($mq) >= 0"
							:to="localePath('promote')">
							{{ $t('components.navbar.promote') }}
						</b-nav-item>
						<b-nav-item :to="localePath('register')">{{ $t('components.navbar.register') }}</b-nav-item>
						<b-nav-item :to="localePath('login')">{{ $t('components.navbar.login') }}</b-nav-item>
					</template>
					<b-nav-item v-if="$auth.user" :to="localePath('user')" exact>
						<pg-icon icon="user" />
						{{ $auth.user.name }}
					</b-nav-item>
				</b-navbar-nav>
			</div>
		</nav>

		<transition>
			<div v-if="drawerOpen" class="navbar__drawer" @click.self="toggleDrawer()">
				<b-nav vertical class="navbar__drawer-nav">
					<div class="container px-0">
						<b-nav-item :to="localePath('index')" exact>{{ $t('components.navbar.home') }}</b-nav-item>
						<b-nav-item :to="localePath('venues-explore')">{{ $t('components.navbar.search') }}</b-nav-item>
						<b-nav-item
							v-if="$auth.user"
							:to="localePath('user')"
							link-classes="d-flex justify-content-between align-items-center">
							{{ $auth.user.name }}
							<pg-icon icon="user" />
						</b-nav-item>
						<template v-if="!$auth.loggedIn">
							<b-nav-item :to="localePath('register')">{{ $t('components.navbar.register') }}</b-nav-item>
							<b-nav-item :to="localePath('login')">{{ $t('components.navbar.login') }}</b-nav-item>
						</template>
						<b-nav-item :to="localePath('promote')">{{ $t('components.navbar.promote') }}</b-nav-item>
						<b-nav-item :to="localePath('about')">{{ $t('components.navbar.company') }}</b-nav-item>
						<b-nav-item
							v-if="$i18n.locale == 'it'"
							:to="localePath('play-responsibly')">
							{{ $t('components.navbar.responsible') }}
						</b-nav-item>
					</div>
				</b-nav>
			</div>
		</transition>
	</div>
</template>

<script>
import { BNav, BNavbarNav, BNavItem } from 'bootstrap-vue'
import PgLogo from './logo'
import PgIcon from './icon'

export default {
	name: 'PgNavbar',

	components: {
		BNav,
		BNavbarNav,
		BNavItem,
		PgLogo,
		PgIcon
	},

	props: {
		variant: {
			type: String,
			default: 'light'
		}
	},

	data() {
		return {
			drawerOpen: false
		}
	},

	computed: {
		classes() {
			return [
				'navbar',
				'navbar-expand',
				this.drawerOpen
					? 'navbar-dark navbar--drawer-open'
					: `navbar-${this.variant}`
			]
		}
	},

	destroyed() {
		this.toggleOverflow(false)
	},

	methods: {
		toggleDrawer(force) {
			const open = force !== undefined ? force : !this.drawerOpen

			this.drawerOpen = open
			this.toggleOverflow(open)
		},

		toggleOverflow(open) {
			document.body.classList.toggle('pg--pg-overlay-open', open)
		}
	}
}
</script>

<style lang="scss">
.navbar {
	z-index: $zindex-modal-backdrop; // Stay above fullscreen menu
	transition: background-color $navbar-transition-duration,
		color $navbar-transition-duration;
}

// Fix navbar expand having wrong padding on sm+ sizes
// https://github.com/twbs/bootstrap/issues/22471#issuecomment-338770768
@include media-breakpoint-up('sm') {
	.navbar-expand > .container {
		padding-left: $navbar-padding-x;
		padding-right: $navbar-padding-x;
	}
}

// Notch support with hack
// https://github.com/webpack-contrib/sass-loader/issues/528#issuecomment-362259216
@supports (padding: m#{a}x(0px)) {
	.navbar-expand {
		padding-left: m#{a}x($navbar-padding-x, env(safe-area-inset-left));
		padding-right: m#{a}x($navbar-padding-x, env(safe-area-inset-right));
	}
}
.navbar-brand {
	display: flex;
	align-items: center;
}

// Brand + logo + arrow
.navbar-brand:active {
	opacity: 0.85;
}
.navbar__logo {
	height: 38px;
}
.navbar__logo-arrow {
	margin-left: 0.2rem;
	width: 16px;
	height: 16px;
	transition: $navbar-transition-duration ease-in-out;
	font-size: 0; // Fixes icon misalignment
	opacity: 0.5;

	.navbar--drawer-open & {
		opacity: 1;
		transform: translateY(30%);
	}
}

// Drawer
.navbar__drawer {
	padding-top: 64px;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: $zindex-fixed;
	background-color: rgba($modal-backdrop-bg, $modal-backdrop-opacity);
	overflow: auto;
	-webkit-backdrop-filter: blur(20px);
}
.navbar__drawer-nav {
	background-color: #fff;
	padding-top: $spacer / 2;
	padding-bottom: $spacer / 2;

	.nav-item {
		color: $black;
		position: relative;
		font-size: $font-size-xl;
	}
	.nav-item + .nav-item::after {
		content: '';
		position: absolute;
		top: 0;
		left: $nav-link-padding-x;
		right: $nav-link-padding-x;
		height: 1px;
		background-color: $gray-200;
		pointer-events: none;
	}
	.nav-link {
		font-weight: $font-weight-semibold;
		letter-spacing: -0.01em;
		color: $olive-900;

		&.active {
			color: $primary;
		}
	}
	.pg-icon--user {
		background-color: $green-100;
		padding: 0.2rem;
		border-radius: 50%;
		height: 1.85rem;
		width: 1.85rem;
	}
}
.navbar__drawer {
	&.v-enter-active,
	&.v-leave-active {
		transition: $navbar-transition-duration ease-in-out;

		.navbar__drawer-nav {
			transition: $navbar-transition-duration ease-in-out;
		}
	}

	&.v-enter,
	&.v-leave-to {
		opacity: 0;

		.navbar__drawer-nav {
			transform: translateY(-100%);
		}
	}
}

// Light style
.navbar-light {
	background-color: $white;

	.navbar__logo-arrow {
		color: $gray-500;
	}
}

// Dark style (dark green)
.navbar-dark {
	background-color: $olive-900;
	color: $white;
}
</style>

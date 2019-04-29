<template>
	<div>
		<nav :class="classes">
			<!-- Small logo, toggles menu -->
			<div
				v-if="$mq == 'xs' || $mq == 'constrained'"
				:aria-label="$constants.APP_NAME"
				class="navbar-brand"
				@click="toggleDrawer()">
				<pg-logo :text="false" class="navbar__logo navbar__logo--no-text" />
				<pg-icon icon="chevron-down" class="navbar__logo-arrow" />
			</div>

			<!-- Normal logo, goes to home page -->
			<nuxt-link
				v-if="$mq == 'comfortable'"
				:aria-label="$constants.APP_NAME"
				class="navbar-brand"
				:to="localePath('index')">
				<pg-logo class="navbar__logo" />
			</nuxt-link>

			<b-input-group v-if="search" :class="searchClasses">
				<template #prepend>
					<b-input-group-text class="navbar__search-icon-addon">
						<pg-icon icon="search" />
					</b-input-group-text>
				</template>
				<pg-place-textbox
					:placeholder="placeholder"
					:value="mutableQuery"
					:options="{ types: ['geocode'] }"
					class="form-control navbar__search-input"
					name="query"
					@focus="onSearchFocus"
					@blur="onSearchBlur"
					@place-changed="onPlaceChanged"
				/>
				<b-input-group-append v-if="$slots.searchAppend">
					<slot name="searchAppend" />
				</b-input-group-append>
			</b-input-group>

			<div class="ml-auto d-flex">
				<slot name="right" />
				<b-navbar-nav v-if="$mq == 'comfortable'">
					<template v-if="!$auth.loggedIn">
						<b-nav-item :to="localePath('promote')">{{ $t('components.navbar.promote') }}</b-nav-item>
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
					<b-nav-item :to="localePath('index')" exact>{{ $t('components.navbar.home') }}</b-nav-item>
					<b-nav-item v-if="$auth.user" :to="localePath('user')" exact>
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
				</b-nav>
			</div>
		</transition>
	</div>
</template>

<script>
import BInputGroup from 'bootstrap-vue/es/components/input-group/input-group'
import BInputGroupText from 'bootstrap-vue/es/components/input-group/input-group-text'
import BInputGroupAppend from 'bootstrap-vue/es/components/input-group/input-group-append'
import BNav from 'bootstrap-vue/es/components/nav/nav'
import BNavbarNav from 'bootstrap-vue/es/components/navbar/navbar-nav'
import BNavItem from 'bootstrap-vue/es/components/nav/nav-item'

import PgLogo from './logo'
import PgIcon from './icon'
import PgPlaceTextbox from './place-textbox'

export default {
	name: 'PgNavbar',

	components: {
		BInputGroup,
		BInputGroupText,
		BInputGroupAppend,
		BNav,
		BNavbarNav,
		BNavItem,
		PgLogo,
		PgIcon,
		PgPlaceTextbox
	},

	props: {
		variant: {
			type: String,
			default: 'light'
		},
		search: {
			type: Boolean,
			default: true
		},
		placeholder: {
			type: String,
			default() {
				return this.$t('components.navbar.search')
			}
		},
		query: {
			type: String,
			default: null
		},
		center: {
			type: Object,
			default: () => null
		},
		autoSubmit: {
			type: Boolean,
			default: true
		}
	},

	data() {
		return {
			mutableQuery: this.query,
			mutableCenter: this.center,
			drawerOpen: false,
			searchFocused: false
		}
	},

	computed: {
		classes() {
			return [
				this.drawerOpen
					? 'navbar-dark navbar--drawer-open'
					: `navbar-${this.variant}`,
				'navbar',
				'navbar-expand'
			]
		},

		searchClasses() {
			return {
				navbar__search: true,
				'navbar__search--focused': this.searchFocused
			}
		},

		lat() {
			const center = this.mutableCenter
			return center && center.lat ? center.lat : null
		},

		lng() {
			const center = this.mutableCenter
			return center && center.lng ? center.lng : null
		}
	},

	watch: {
		query() {
			this.mutableQuery = this.query
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
		},

		onSearchFocus() {
			this.searchFocused = true

			this.toggleDrawer(false)
		},

		onSearchBlur() {
			this.searchFocused = false
		},

		onPlaceChanged(place) {
			if (place) {
				const viewport = place.geometry.viewport
				const center = viewport.getCenter()

				// Update center
				this.mutableCenter = {
					lat: center.lat(),
					lng: center.lng()
				}

				// Update query
				if (place.vicinity && place.name !== place.vicinity) {
					this.mutableQuery = `${place.name}, ${place.vicinity}`
				} else {
					this.mutableQuery = place.name
				}

				// Autosubmit if choosen to
				if (this.autoSubmit) {
					this.$router.push(
						this.localePath({
							path: '/venues/explore',
							query: {
								query: this.mutableQuery,
								c_lat: this.lat,
								c_lng: this.lng
							}
						})
					)
				}
			} else {
				this.mutableQuery = null
				this.mutableCenter = null
			}

			this.$emit('place-changed', place)
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
// Notch support with hack
// https://github.com/webpack-contrib/sass-loader/issues/528#issuecomment-362259216
@supports (padding: max(0px)) {
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
	display: block;
	width: 143px;
	height: 42px;
}
.navbar__logo--no-symbol {
	width: 155px;
}
.navbar__logo--no-text {
	width: 29px;
}
.navbar__logo-arrow {
	margin-left: 0.25rem;
	width: 16px;
	height: 16px;
	transition: transform $navbar-transition-duration;
	font-size: 0; // Fixes icon misalignment

	.navbar--drawer-open & {
		transform: rotate(180deg);
	}
}

// Search
.navbar__search {
	flex: 1;
	border-radius: $input-border-radius-lg;
	transition: $navbar-transition-duration;
	margin-right: $navbar-padding-x / 2; // Same spacing between it and the brand
	max-width: 30rem; // Avoid full width search
}
.navbar__search-icon-addon {
	display: none;
}
.navbar__search-input {
	border: 0;
	border-color: transparent !important;
	background-color: transparent !important;
	font-size: $input-font-size !important;

	&::placeholder {
		transition: $navbar-transition-duration;
	}

	&:focus {
		border-color: none;
		box-shadow: none;
	}
}
.navbar__search-btn {
	border: 0;
	padding-left: 0;
	outline: none;
}

@include media-breakpoint-up(md) {
	.navbar__search {
		position: relative;
	}
	.navbar__search-icon-addon {
		background: transparent;
		border: 0;
		padding-right: 0;
		display: flex; // Inverse of display: none on the previous media query
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
		color: #000;
		position: relative;
	}
	.nav-item + .nav-item::after {
		content: '';
		position: absolute;
		top: 0;
		left: $nav-link-padding-x;
		right: 0;
		height: 1px;
		background-color: rgba($palette-dark-green-100, 0.5);
		pointer-events: none;
	}
	.nav-link {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: $palette-dark-green-400;

		&.active {
			color: theme-color('primary');
		}
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
		color: $palette-dark-green-200;
	}

	.navbar__search {
		background-color: $gray-100;
	}
	.navbar__search-icon-addon {
		color: rgba($body-color, 0.5);
		transition-duration: $navbar-transition-duration;
	}
	.navbar__search-input {
		color: rgba($body-color, 0.5);

		&::placeholder {
			color: rgba($body-color, 0.5);
		}
		&:focus {
			color: $body-color;

			&::placeholder {
				color: rgba($body-color, 0.25);
			}
		}
	}
	.navbar__search-btn {
		color: $palette-dark-green-200;

		&:hover {
			color: $palette-dark-green-100;
		}
	}
	.navbar__search--focused {
		background-color: transparent;
		color: rgba($body-color, 0.25);
		box-shadow: inset 0 0 0 2px $palette-green-500;

		.navbar__search-icon-addon {
			color: $palette-green-500;
		}
	}
}

// Dark style (dark green)
.navbar-dark {
	background-color: $palette-dark-green-500;
	color: $white;

	.pg-logo__background {
		display: none;
	}
	.pg-logo__foreground {
		fill: $white;
	}

	.navbar__search {
		background-color: $palette-dark-green-400;
	}
	.navbar__search-icon-addon {
		color: rgba($white, 0.5);
		transition-duration: $navbar-transition-duration;
	}
	.navbar__search-input {
		color: $white;

		&::placeholder {
			color: rgba($white, 0.5);
		}
		&:focus::placeholder {
			color: rgba($white, 0.25);
		}
	}
	.navbar__search-btn {
		color: rgba($white, 0.5);

		&:hover {
			color: rgba($white, 0.75);
		}
	}
	.navbar__search--focused {
		color: rgba($white, 0.25);
		box-shadow: inset 0 0 0 2px $palette-green-500;

		.navbar__search-icon-addon {
			color: $palette-green-500;
		}
	}
}
</style>

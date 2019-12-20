<template>
	<div class="pg-home-page">
		<div class="pg-home-page__hero">
			<div class="pg-home-page__hero-background d-none d-lg-block" role="presentation">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="pg-home-page__hero-background-img">
					<circle cx="50" cy="50" r="50" fill="#CBECD4" />
					<circle cx="50" cy="50" r="28" fill="#B1E3BE" />
					<circle cx="50" cy="50" r="8" fill="#7DD194" />
				</svg>
			</div>

			<pg-navbar :search="false" />

			<div class="pg-home-page__hero-content">
				<div class="container">
					<div class="row">
						<div class="col-md-10 col-lg-7">
							<div class="row">
								<div class="col-md-10 col-lg-11">
									<h1 class="display-3 text-olive-900 mb-4 font-weight-bold">{{ $t('pages.home.search.title') }}</h1>
									<p class="lead text-dark-green-muted font-weight-semibold mb-4">{{ $t('pages.home.search.subtitle', { name: $constants.APP_NAME }) }}</p>
								</div>
							</div>

							<div class="row form-row">
								<div class="col-sm mb-2 mb-0">
									<div class="position-relative">
										<label class="sr-only">{{ $t('pages.home.search.label') }}</label>
										<pg-place-textbox
											:value="query"
											:placeholder="placeholder"
											:options="placeTextboxOptions"
											class="form-control form-control-lg pg-home-page__search-form-control pg-home-page__search-query-control"
											@place-changed="onPlaceChanged"
											@input="onPlaceTextboxInput"
											@keydown.enter="submit"
										/>
										<client-only>
											<div
												v-if="$geolocation.supported"
												v-b-tooltip
												:title="$t('pages.home.search.location')"
												class="pg-home-page__search-locate-btn-wrapper">
												<pg-button
													:icon="useUserLocation ? 'location' : 'location-outline'"
													:loading="locating"
													:disabled="useUserLocation ? true : false"
													variant="naked"
													size="lg"
													class="pg-home-page__search-locate-btn"
													tabindex="-1"
													@click="findUserLocation"
												/>
											</div>
										</client-only>
									</div>
								</div>
								<div class="col-sm-auto">
									<pg-button
										:disabled="!canSubmit"
										variant="accent"
										size="lg"
										class="pg-home-page__search-submit-btn"
										block
										@click="submit">
										{{ $t('pages.home.search.submit') }}
									</pg-button>
								</div>
							</div>
						</div>
						<!--
						<div class="col-md-5 position-relative">
							<div class="pg-home-page__main-venue-container">
								<div class="mb-md-2 text-right small">
									<a href="#">{{ $t('pages.home.venue.hint') }}</a>
								</div>
								<div class="pg-home-page__main-venue" />
							</div>
						</div>
						-->
					</div>
				</div>
			</div>
		</div>

		<div class="my-5 pg-home-page__token-section">
			<div class="container">
				<h5>{{ $t('pages.home.explore.title') }}</h5>
			</div>
			<pg-scrollable-pane>
				<div class="container">
					<pg-token
						v-for="preset in tokenPresets"
						:key="preset.value"
						:icon="preset.icon"
						:type="preset.type"
						:to="preset.route">
						{{ preset.label }}
					</pg-token>
				</div>
			</pg-scrollable-pane>
		</div>

		<div v-if="highlightedVenues.length" class="my-5">
			<div class="container">
				<h5>{{ $t('pages.home.highlights.title') }}</h5>
			</div>
			<pg-scrollable-pane selector=".row">
				<div class="container mb-4">
					<div class="row">
						<div v-for="venue in highlightedVenues" :key="venue.id" class="col-11 col-md-6 mb-4">
							<nuxt-link :to="localePath({ name: 'venues-id', params: { id: venue.id }})" class="text-reset">
								<pg-venue-grid-item :venue="venue" />
							</nuxt-link>
						</div>
					</div>
				</div>
			</pg-scrollable-pane>
		</div>

		<div v-if="newVenues.length" class="my-5">
			<div class="container">
				<h5>{{ $t('pages.home.new.title') }}</h5>
			</div>
			<pg-scrollable-pane selector=".row">
				<div class="container mb-4">
					<div class="row">
						<div
							v-for="(venue, index) in newVenues"
							:key="venue.id"
							:class="index == newVenues.length - 1 ? 'd-xl-none' : null"
							class="col-7 col-md-4 col-xl-3 mb-4">
							<nuxt-link :to="localePath({ name: 'venues-id', params: { id: venue.id }})" class="text-reset">
								<pg-venue-grid-item :venue="venue" />
							</nuxt-link>
						</div>
					</div>
				</div>
			</pg-scrollable-pane>
		</div>

		<div class="my-5 pg-home-page__promote-section">
			<div class="container">
				<div class="row align-items-md-center">
					<div class="col-md-3 mx-auto">
						<div
							:is="svg('illustrations/venue.svg')"
							class="pg-home-page__promote-img"
						/>
					</div>
					<div class="col-md-8 col-xl-7">
						<p class="text-dark-green-muted mb-1">{{ $t('pages.home.promote.intro') }}</p>
						<h3 class="display-4 text-olive-900 mb-3">{{ $t('pages.home.promote.title') }}</h3>
						<p class="lead text-olive-900 mb-4">{{ $t('pages.home.promote.paragraph') }}</p>
						<pg-button
							:to="promoteButton.route"
							:block="$mq === 'xs'"
							variant="primary"
							icon="arrow-right"
							icon-position="right">
							{{ promoteButton.label }}
						</pg-button>
						<pg-button
							:to="localePath('promote')"
							:block="$mq === 'xs'"
							variant="link"
							class="text-olive-900">
							{{ $t('pages.home.promote.more') }}
						</pg-button>
					</div>
				</div>
			</div>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
// import { mapState } from 'vuex'
import extend from 'lodash/extend'
import sortBy from 'lodash/sortBy'
import PgToken from './token'
import searchCities from './search-cities'
import formatResult from '@/utilities/format-google-maps-result'
import PgScrollablePane from '@/components/scrollable-pane'
import PgPlaceTextbox from '@/components/place-textbox'
import PgVenueGridItem from '@/components/venue-grid-item'

export default {
	name: 'PgHomePage',

	components: {
		PgScrollablePane,
		PgPlaceTextbox,
		PgVenueGridItem,
		PgToken
	},

	data() {
		return {
			query: null,
			placeholder: this.$t('pages.home.search.city_placeholder'),
			placeTextboxOptions: {
				types: ['geocode'] // Limit search to cities, addresses, etc.
			},
			locating: false,
			useUserLocation: false,
			searchParams: {
				query: null,
				c_lat: null,
				c_lng: null
			},
			categories: [],
			highlightedVenues: [],
			newVenues: []
		}
	},

	computed: {
		canSubmit() {
			return Boolean(this.searchParams.c_lat && this.searchParams.c_lng)
		},

		tokenPresets() {
			const defaultBoundsKey = `MAP_DEFAULT_BOUNDS_${this.$i18n.region}`
			const defaultZoomKey = `MAP_DEFAULT_ZOOM_${this.$i18n.region}`
			const presets = []

			// Categories
			this.categories.forEach(category => {
				presets.push({
					type: 'category',
					value: category.machine_name,
					icon: category.machine_name.replace(/_/g, '-'),
					label: this.$t(`data.categories.${category.machine_name}`),
					route: this.localePath({
						name: 'venues-explore',
						query: {
							categories: [category.id],
							ne_lat: this.$constants[defaultBoundsKey].ne.lat,
							ne_lng: this.$constants[defaultBoundsKey].ne.lng,
							sw_lat: this.$constants[defaultBoundsKey].sw.lat,
							sw_lng: this.$constants[defaultBoundsKey].sw.lng,
							zoom: this.$constants[defaultZoomKey]
						}
					})
				})
			})

			// Cities
			searchCities[this.$i18n.region].forEach(city => {
				presets.push({
					type: 'city',
					value: city.query,
					icon: 'location',
					label: city.query,
					route: this.localePath({
						name: 'venues-explore',
						query: city
					})
				})
			})

			return sortBy(presets, 'label')
		},

		promoteButton() {
			const user = this.$auth.user

			// Unregistered user or non owner
			if (!user || !user.is_owner) {
				return {
					route: this.localePath('owners-register'),
					label: this.$t('pages.home.promote.register')
				}
			}

			// Logged in user with no venues
			if (!user.venue_ids.length) {
				return {
					route: this.localePath('venues-add'),
					label: this.$t('pages.home.promote.add')
				}
			}

			// Logged in user with at least a venue
			return {
				route: this.localePath('user'),
				label: this.$t('pages.home.promote.manage')
			}
		}
	},

	asyncData({ $axios, app }) {
		return $axios.$get('/home', {
			params: {
				country: app.i18n.region
			}
		})
	},

	methods: {
		svg(path) {
			return require(`@/assets/svg/${path}?inline`).default
		},

		async findUserLocation() {
			this.locating = true
			let position

			try {
				position = await this.$geolocation.getCurrentPosition({
					timeout: 10 * 1000, // 10 secs
					maximumAge: 5 * 60 * 1000 // last 5 minutes
				})
			} catch (err) {
				alert(this.$t('pages.home.search.location_error'))
			} finally {
				this.locating = false
			}

			// Update search params
			extend(this.searchParams, {
				query: null,
				c_lat: position.coords.latitude,
				c_lng: position.coords.longitude
			})

			// Update view
			this.query = null
			this.placeholder = [
				'(',
				this.$t('pages.home.search.location_placeholder'),
				')'
			].join('')
			this.useUserLocation = true

			// Find city name
			if (!this.geocoder) this.geocoder = new google.maps.Geocoder()

			const coords = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			}
			this.geocoder.geocode({ location: coords }, (results, status) => {
				this.searchingMarkerCoords = false

				if (status === 'OK') {
					const result = formatResult(results[0])

					let address = []

					if (result.streetName) address.push(result.streetName)
					address.push(result.administrativeLevels.level3long)
					address = address.join(', ')

					this.query = address
					this.searchParams.query = address
				}
			})
		},

		onPlaceTextboxInput(value) {
			this.useUserLocation = false
			this.placeholder = this.$t('pages.home.search.city_placeholder')
			this.query = value
		},

		onPlaceChanged(place) {
			// Reset user location indicator
			this.useUserLocation = false
			this.placeholder = this.$t('pages.home.search.city_placeholder')

			// Reset search
			if (!place) {
				extend(this.searchParams, {
					query: null,
					c_lat: null,
					c_lng: null
				})
				return
			}

			// Update search params
			const center = place.geometry.viewport.getCenter()

			extend(this.searchParams, {
				query: this.query,
				c_lat: center.lat(),
				c_lng: center.lng()
			})
		},

		submit() {
			if (!this.canSubmit) return

			this.$router.push(
				this.localePath({
					name: 'venues-explore',
					query: this.searchParams
				})
			)
		}
	}
}
</script>

<style lang="scss">
.pg-home-page {
	// Navbar
	.navbar-light {
		background-color: transparent;
	}

	// Hero
	&__hero {
		background-color: $palette-green-100;
		position: relative;
	}
	&__hero-background {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 60%;
		overflow: hidden;
	}
	&__hero-background-img {
		width: 100%;
		position: absolute;
		top: 50%;
		right: -30%;
		margin-top: -50%;
	}
	&__hero-content {
		padding-top: $spacer * 3;
		padding-bottom: $spacer * 3;
	}

	@include media-breakpoint-up(md) {
		&__hero-content {
			margin-bottom: $spacer * 5;
			padding-top: $spacer * 5;
			padding-bottom: $spacer * 5;
		}
	}

	// Search
	&__search-form-control:focus {
		border-color: theme-color('accent');
		box-shadow: inset 0 0 0 1px theme-color('accent');
	}
	&__search-query-control {
		background-color: $white; // Default is gray
		padding-right: ($input-btn-padding-x-lg * 2) + 1rem;
	}
	&__search-locate-btn-wrapper {
		position: absolute;
		top: 0;
		right: 0;
	}
	&__search-locate-btn {
		background-color: transparent;
		color: $gray-600;

		&:not([disabled]):hover,
		&:not([disabled]):focus {
			color: theme-color('accent');
		}
	}

	// Main venue
	&__main-venue-container {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	&__main-venue {
		flex: 1;
		background-color: $palette-dark-green-300;
		border-radius: $border-radius-lg;
		min-height: 5em;
	}

	@include media-breakpoint-up(md) {
		&__main-venue-container {
			position: absolute;
			top: -($spacer * 5);
			bottom: -($spacer * 8);
		}
	}

	// Tokens
	&__token-section {
		line-height: 4;
	}
	&__token {
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 1rem;
		border-radius: 3rem;
		color: $body-color;
		background-color: $white;
		box-shadow: 0 0 0 2px transparent inset, 0 1px 0 rgba($black, 0.08),
			0 1px 3px rgba($black, 0.1);
		transition: 0.15s;
		outline: none;

		// Spacing
		line-height: $line-height-base; // Reset parent line height
		margin-left: -0.5rem;
		margin-right: 1.5rem;

		&:hover,
		&:focus {
			color: inherit;
			text-decoration: none;
		}
	}
	&__token-icon {
		width: 40px;
		height: 40px;
		margin-left: -0.5rem;
		margin-right: 0.5rem;
	}

	&__token--category {
		&:hover,
		&:focus {
			box-shadow: 0 0 0 2px theme-color('primary') inset,
				0 1px 0 rgba($black, 0.08), 0 1px 3px rgba($black, 0.1);
		}

		.pg-home-page__token-icon {
			fill: theme-color('primary');

			.pg-svg__background {
				fill: $palette-green-100;
			}
		}
	}
	&__token--city {
		&:hover,
		&:focus {
			box-shadow: 0 0 0 2px theme-color('accent') inset,
				0 1px 0 rgba($black, 0.08), 0 1px 3px rgba($black, 0.1);
		}

		.pg-home-page__token-icon {
			fill: theme-color('accent');

			.pg-svg__background {
				fill: $palette-fuchsia-100;
			}
		}
	}

	// Promote
	&__promote-section {
		padding-top: $spacer;
		padding-bottom: $spacer;
		background-color: $palette-green-100;
	}

	@include media-breakpoint-down(sm) {
		&__promote-section {
			text-align: center;
			margin-top: $spacer * 4;
			margin-bottom: $spacer * 3;
		}
		&__promote-img {
			width: 7rem;
			margin: -($spacer * 4) auto $spacer;
		}
	}

	@include media-breakpoint-up(md) {
		&__promote-section {
			padding-top: $spacer * 2;
		}
	}
}
</style>

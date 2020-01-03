<template>
	<div class="pg-explore-page" :class="currentView === 'map' ? 'pg-explore-page--with-map' : null">
		<pg-navbar variant="dark" />

		<!-- Filters -->
		<div v-if="currentView === 'list' || isLargeScreen" class="bg-light pt-3 pb-1">
			<div class="container">
				<div class="row">
					<b-form-group
						:label="$t('pages.explore.form.location.label')"
						label-sr-only
						class="col-sm">
						<div class="pg-explore-page__search-field">
							<pg-icon
								icon="search"
								class="pg-explore-page__search-field-icon"
							/>
							<pg-place-textbox
								ref="searchField"
								:placeholder="searchFieldPlaceholder"
								:value="query"
								class="pg-explore-page__search-field-textbox"
								@place-changed="onPlaceChanged"
							/>
							<client-only>
								<pg-button
									v-if="$geolocation.supported"
									:loading="locating"
									:icon="userLocation ? 'location' : 'location-outline'"
									:title="$t('pages.explore.form.location.geolocalization')"
									:aria-label="$t('pages.explore.form.location.geolocalization')"
									variant="naked"
									class="pg-explore-page__search-field-button"
									@click.stop="findUserLocation"
								/>
							</client-only>
						</div>
					</b-form-group>
					<b-form-group
						v-if="showRadiusFilter"
						:label="$t('pages.explore.form.distance')"
						label-sr-only
						class="col-sm-3">
						<b-form-select
							v-model="searchParams.radius"
							:options="radiusOptions"
						/>
					</b-form-group>
				</div>
				<b-form-group
					:label="$t('pages.explore.form.category')"
					label-sr-only
					class="mb-0">
					<b-form-checkbox-group
						:stacked="isSmallScreen"
						:options="categoryOptions"
						:checked="searchParams.categories"
						@change="onCategoryChange"
					/>
				</b-form-group>
				<hr class="mb-1">
				<!--
				<b-form-group :label="$t('pages.explore.form.amenities')">
					<b-form-checkbox-group
						:options="amenityOptions"
						:checked="searchParams.amenities"
						inline
						class="mt-2"
						@input="onAmenityChange"
					/>
				</b-form-group>
				-->
			</div>
		</div>


		<!-- Tabs + results -->
		<div ref="scrollAnchor" />
		<div class="pg-explore-page__view" :class="scrollPast ? 'pg-explore-page__view--stuck' : null">
			<div class="container">
				<b-nav tabs class="align-items-center">
					<b-nav-item :active="currentView === 'list'" @click="currentView = 'list'">
						<pg-icon icon="list" class="mr-1" />
						{{ $t('pages.explore.form.view.list') }}
					</b-nav-item>
					<b-nav-item :active="currentView === 'map'" @click="currentView = 'map'">
						<pg-icon icon="map" class="mr-1" />
						{{ $t('pages.explore.form.view.map') }}
					</b-nav-item>
					<div v-if="venues.length" class="ml-auto small text-muted">
						{{
							$tc('pages.explore.form.results', venues.length, {
								count: hasMorePages ? `${venues.length}+` : venues.length
							})
						}}
					</div>
				</b-nav>
			</div>
		</div>

		<!-- List -->
		<div v-if="currentView === 'list'" class="container">
			<!-- Loader -->
			<div v-if="loading" key="loader" class="list-group-item venue-list-placeholder-item text-muted">
				<pg-icon icon="circle-outline-notch" spinning />
				<p class="mb-0">{{ $t('common.status.loading') }}&hellip;</p>
			</div>
			<template v-else>
				<!-- Empty list -->
				<div v-if="!venues.length" key="no-items" class="list-group-item venue-list-placeholder-item text-muted">
					<pg-icon icon="search" size="3x" />
					<h4 class="mt-3">{{ $t('pages.explore.no_items.title') }}</h4>
					<p>{{ $t('pages.explore.no_items.subtitle') }}</p>
				</div>

				<!-- Venue list -->
				<pg-venue-list-item
					v-for="venue in venues"
					:key="venue.id"
					:venue="venue"
					class="pg-explore-page__list-item"
				/>

				<!-- Limited results -->
				<div v-if="hasMorePages" class="list-group-item text-muted text-center border-0 mt-0 mb-5">
					<div class="h1">&hellip;</div>
					<p>{{ $t('pages.explore.limited_results') }}</p>
				</div>
			</template>
		</div>

		<!-- Map -->
		<pg-map
			v-if="currentView === 'map'"
			ref="map"
			:center="mapCenter"
			:zoom="mapZoom"
			:bounds="mapBounds"
			:options="mapOptions"
			class="pg-explore-page__map"
			@bounds_changed="onMapBoundsChange"
			@click="selectedVenueId = null">
			<pg-map-marker v-if="userLocation" :position="userLocation" icon="/img/map/pin-user.svg" title="La tua posizione" />
			<pg-map-marker v-for="(venue, index) in venues" :key="venue.id" :position="venue.coords" :icon="mapMarkerIcon(venue, index)" @click="select(venue)">
				<pg-map-info-window :opened="venue.id === selectedVenueId" @closeclick="select(null)">
					<pg-venue-infowindow-item
						class="pg-explore-page__map-infowindow-content"
						:venue="venue"
					/>
				</pg-map-info-window>
			</pg-map-marker>
			<template slot="visible">
				<!-- Refresh buttons -->
				<template v-if="isLargeScreen && mapNeedsRefresh">
					<pg-button
						id="desktop-refresh-btn"
						:aria-label="$t('pages.explore.search_area')"
						variant="accent"
						class="pg-explore-page__map-refresh-btn"
						icon="refresh"
						@click="onSearchBoundsClick"
					/>
					<b-tooltip
						target="desktop-refresh-btn"
						placement="left"
						triggers=""
						show>
						{{ $t('pages.explore.search_area') }}
					</b-tooltip>
				</template>
				<div v-if="isSmallScreen && mapNeedsRefresh" class="container pg-explore-page__map-floating-controls">
					<pg-button variant="accent" block @click="onSearchBoundsClick">{{ $t('pages.explore.search_area') }}</pg-button>
				</div>
			</template>
		</pg-map>

		<pg-page-footer v-if="currentView === 'list'" />
	</div>
</template>

<script>
import extend from 'lodash/extend'
import { debounce } from 'lodash'
import {
	Map as PgMap,
	Marker as PgMapMarker,
	InfoWindow as PgMapInfoWindow
} from 'vue2-google-maps'
import {
	BFormGroup,
	BFormSelect,
	BFormCheckboxGroup,
	BNav,
	BNavItem,
	BTooltip
} from 'bootstrap-vue'
import PgVenueListItem from './list-item'
import PgVenueInfowindowItem from './infowindow-item'
import PgPlaceTextbox from '@/components/place-textbox'
import {
	toSearchParams,
	toQueryParams
} from '@/utilities/explore-params-converter'
import { formatGoogleMapsResult } from '@/utilities'

const searchRadiuses = [10, 20, 30, 50, 100]

export default {
	name: 'PgExplorePage',

	components: {
		PgMap,
		PgMapMarker,
		PgMapInfoWindow,
		BFormGroup,
		BFormSelect,
		BFormCheckboxGroup,
		BNav,
		BNavItem,
		BTooltip,
		PgVenueListItem,
		PgVenueInfowindowItem,
		PgPlaceTextbox
	},

	data() {
		let mapZoom = 13
		let mapCenter = extend(
			{},
			this.$constants[`MAP_DEFAULT_CENTER_${this.$i18n.region}`]
		)
		let mapBounds = null
		let searchMode = 'center'
		const queryParams = this.$route.query
		const searchParams = extend(
			{
				country: this.$i18n.region,
				radius: searchRadiuses[0]
			},
			toSearchParams(queryParams)
		)

		// Prepare map zoom
		if (queryParams.zoom) mapZoom = parseInt(queryParams.zoom)

		// Prepare map center
		const gotMapCenter = ['c_lat', 'c_lng'].every(key => key in searchParams)

		if (gotMapCenter) {
			mapCenter = {
				lat: searchParams.c_lat,
				lng: searchParams.c_lng
			}
		}

		// Prepare map bounds (end eventually change search mode)
		const gotMapBounds = ['ne_lat', 'ne_lng', 'sw_lat', 'sw_lng'].every(
			key => key in searchParams
		)

		if (gotMapBounds) {
			mapBounds = {
				north: searchParams.ne_lat,
				east: searchParams.ne_lng,
				south: searchParams.sw_lat,
				west: searchParams.sw_lng
			}
			searchMode = 'bounds'
			extend(searchParams, {
				query: '',
				ne_lat: searchParams.ne_lat,
				ne_lng: searchParams.ne_lng,
				sw_lat: searchParams.sw_lat,
				sw_lng: searchParams.sw_lng
			})
		}

		return {
			// async
			categories: [],
			// amenities: [],

			// local
			loading: false,
			locating: false,
			userLocation: null,
			scrollPast: false,

			searchMode, // bounds, center
			searchParams,
			searchFieldFocused: false,
			query: searchParams.query,
			venues: [],
			currentView: 'list',
			highlightedVenueId: null,
			selectedVenueId: null,

			mapNeedsRefresh: false,
			mapBoundsEventEnabled: false,
			mapCenter,
			mapBounds,
			mapZoom
		}
	},

	computed: {
		isLargeScreen() {
			return ['md', 'lg', 'xl'].indexOf(this.$mq) >= 0
		},

		isSmallScreen() {
			return ['xs', 'sm'].indexOf(this.$mq) >= 0
		},

		country() {
			return this.searchParams.country || this.$i18n.region
		},

		searchFieldPlaceholder() {
			if (this.searchMode === 'bounds') {
				return `(${this.$t('pages.explore.form.location.placeholder.in_map')})`
			} else if (this.searchMode === 'center' && this.userLocation) {
				return `(${this.$t(
					'pages.explore.form.location.placeholder.geolocalization'
				)})`
			} else {
				return this.$t('pages.explore.form.location.placeholder.default')
			}
		},

		mapOptions() {
			return {
				gestureHandling: 'greedy',
				fullscreenControl: false,
				mapTypeControl: false,
				streetViewControl: false,
				zoomControl: this.isLargeScreen,
				zoomControlOptions: {
					position: 3 // google.maps.ControlPosition.TOP_RIGHT
				},
				styles: [
					{
						// Hide points of interest
						featureType: 'poi',
						stylers: [{ visibility: 'off' }]
					},
					{
						// Hide public transit
						featureType: 'transit.station',
						stylers: [{ visibility: 'off' }]
					}
				]
			}
		},

		radiusOptions() {
			return searchRadiuses.map(radius => ({
				value: radius,
				text: `${radius} km`
			}))
		},

		showRadiusFilter() {
			return this.searchMode === 'center'
		},

		categoryOptions() {
			return this.categoriesForCountry(this.searchParams.country)
				.slice() // make immutable
				.sort((a, b) => {
					a = this.$t(`data.categories.${a.machine_name}`)
					b = this.$t(`data.categories.${b.machine_name}`)

					return a > b ? 1 : -1
				})
				.map(category => ({
					value: category.id,
					text: this.$t(`data.categories.${category.machine_name}`)
				}))
		},

		/*
		amenityOptions() {
			return this.amenities.map(amenity => ({
				value: amenity.machine_name,
				text: this.$t(`data.amenities.${amenity.machine_name}`)
			}));
		},
		*/

		hasSearchParams() {
			return !!(this.searchParams.c_lat && this.searchParams.c_lng)
		},

		hasMorePages() {
			return this.venues ? this.venues.length >= 100 : false
		}
	},

	head() {
		return {
			title: this.query || this.$t('pages.explore.meta_title')
		}
	},

	watch: {
		searchParams: {
			deep: true,
			immediate: true,
			handler: 'search'
		}
	},

	asyncData({ $axios }) {
		return $axios.$get('/venues/explore')
	},

	mounted() {
		this.setSearchParams({}) // Init defaults (and search)

		// Add sticky class change for filters
		if (process.client) {
			this.scrollObserver = new IntersectionObserver(entries => {
				this.scrollPast = !entries[0].isIntersecting
			})

			this.scrollObserver.observe(this.$refs.scrollAnchor)
		}
	},

	destroyed() {
		// Destroy sticky class change for filters
		this.scrollObserver.disconnect()
	},

	methods: {
		categoriesForCountry(country) {
			return this.categories.filter(
				category => !category.country || category.country === country
			)
		},

		setSearchParams(params) {
			const searchParams = this.searchParams
			const country = params.country || this.country

			// Set categories
			if (
				country !== searchParams.country ||
				((!searchParams.categories || !searchParams.categories.length) &&
					(!params.categories || !params.categories.length))
			) {
				// Different country or empty categories
				params.categories = this.categoriesForCountry(country).map(
					category => category.id
				)
			} else if (params.categories && params.categories.length) {
				// Limited categories depending on the country
				params.categories = params.categories.filter(categoryId => {
					const cat = this.categoriesForCountry(country).find(
						category => category.id === categoryId
					)

					return !!cat
				})
			}

			// Force set country
			params.country = country

			extend(this.searchParams, params)
		},

		// Location search ----------------------------------------------------
		onPlaceChanged(place) {
			if (!place) return

			const bounds =
				place.geometry && place.geometry.viewport
					? place.geometry.viewport
					: null
			const center = bounds && bounds.getCenter() ? bounds.getCenter() : null

			// Change search mode
			this.searchMode = 'center'

			// Update view
			this.mapNeedsRefresh = false
			this.userLocation = null

			place = formatGoogleMapsResult(place)

			this.query = place.readableAddress

			// Move map, but disable map bounds tracking first
			if (bounds && this.$refs.map) {
				this.mapBoundsEventEnabled = false
				this.$refs.map.fitBounds(bounds)
			}

			// Update search params
			this.setSearchParams({
				query: this.query,
				country: place.countryCode,
				c_lat: center ? center.lat() : null,
				c_lng: center ? center.lng() : null,
				ne_lat: null,
				ne_lng: null,
				sw_lat: null,
				sw_lng: null
			})
		},

		// User location ------------------------------------------------------
		async findUserLocation() {
			this.locating = true
			let position

			try {
				position = await this.$geolocation.getCurrentPosition({
					timeout: 10 * 1000, // 10 secs
					maximumAge: 5 * 60 * 1000 // last 5 minutes
				})
			} catch (err) {
				this.userLocation = null
				alert(this.$t('pages.explore.form.location_error'))
			} finally {
				this.locating = false
			}

			// Stop if there's no position
			if (!position) return

			const { latitude, longitude } = position.coords

			// Change search mode
			this.searchMode = 'center'

			// Update view
			this.mapNeedsRefresh = false
			this.locating = false
			this.userLocation = {
				lat: latitude,
				lng: longitude
			}
			this.query = ''

			// Move map center, but disable map bounds tracking first
			this.mapBoundsEventEnabled = false
			this.mapBounds = null
			this.mapZoom = 13
			this.mapCenter = {
				lat: latitude,
				lng: longitude
			}
			if (this.$refs.map) this.$refs.map.panTo(this.mapCenter)

			// Init search params update
			const searchParams = {
				query: '',
				// country: // See below
				c_lat: latitude,
				c_lng: longitude,
				ne_lat: null,
				ne_lng: null,
				sw_lat: null,
				sw_lng: null
			}

			// Find city name
			if (!this.geocoder) this.geocoder = new google.maps.Geocoder()

			const coords = {
				lat: latitude,
				lng: longitude
			}
			this.geocoder.geocode({ location: coords }, (results, status) => {
				if (status === 'OK') {
					const place = formatGoogleMapsResult(results[0])

					// this.query = place.readableAddress

					// searchParams.query = place.readableAddress
					searchParams.country = place.countryCode
				}

				this.setSearchParams(searchParams)
			})
		},

		// Filters -------------------------------------------------------------
		async onCategoryChange(value) {
			if (!value.length) {
				value = this.categoriesForCountry(this.country).map(
					category => category.id
				)
			}

			await this.$nextTick() // Wait for checkbox to become unchecked

			this.setSearchParams({
				categories: value
			})
		},

		// Map -----------------------------------------------------------------
		// Fat arrow functions do not work with debounce
		onMapBoundsChange: debounce(function(bounds) {
			// Store bounds
			this.mapBounds = bounds

			// Stop if map bounds event is not enabled
			if (!this.mapBoundsEventEnabled) {
				this.mapBoundsEventEnabled = true
				return
			}

			// Mark for map refresh
			this.mapNeedsRefresh = true
		}, 200),

		mapMarkerIcon(venue, index) {
			const variant =
				venue.id === this.selectedVenueId ||
				venue.id === this.highlightedVenueId
					? 'inverse'
					: 'normal'
			const firstCategoryMachineName =
				venue.categories && venue.categories.length
					? venue.categories[0].machine_name
					: null
			const glyph =
				index < 25 && firstCategoryMachineName
					? firstCategoryMachineName
					: 'collapsed'

			return `/img/map/pin-${variant}/${glyph}.svg`
		},

		onSearchBoundsClick() {
			// Change search mode
			this.searchMode = 'bounds'

			// Update view
			this.mapNeedsRefresh = false
			this.query = null

			// Update search params
			const c = this.mapBounds.getCenter()
			const ne = this.mapBounds.getNorthEast()
			const sw = this.mapBounds.getSouthWest()

			this.setSearchParams({
				query: '',
				// country: this.$i18n.region,
				c_lat: c.lat(),
				c_lng: c.lng(),
				ne_lat: ne.lat(),
				ne_lng: ne.lng(),
				sw_lat: sw.lat(),
				sw_lng: sw.lng()
			})
		},

		// Search -------------------------------------------------------------
		async search() {
			// Stop if there is no location for searching
			if (!this.hasSearchParams) return

			// Load venues
			this.loading = true

			try {
				const data = await this.$axios.$post(
					'/venues/explore',
					this.searchParams
				)
				this.venues = data.venues
			} finally {
				this.loading = false
			}

			// Update URL
			this.$router.replace({
				query: toQueryParams(this.searchParams)
			})
		},

		// List support -------------------------------------------------------
		highlight(venue) {
			// Disabled when map is not visible
			if (this.currentView !== 'map') return

			this.highlightedVenueId = venue ? venue.id : null
		},

		select(venue) {
			// Disabled when map is not visible
			if (this.currentView !== 'map') return

			// Always hide if no venue is passed
			if (!venue) {
				this.selectedVenueId = null
				return
			}

			// Select/deselect
			this.selectedVenueId = this.selectedVenueId !== venue.id ? venue.id : null
		}
	}
}
</script>

<style lang="scss">
.pg-explore-page {
	// Search + filters
	&__search-field {
		display: flex;
		position: relative;
	}
	&__search-field-icon {
		position: absolute;
		left: $input-padding-x;
		height: 100%;
		color: $gray-400;
		pointer-events: none;
	}
	&__search-field-textbox {
		padding-left: ($input-padding-x * 2) + $icon-size-base;
		padding-right: ($btn-padding-x * 2) + $icon-size-base;
	}
	&__search-field-button {
		position: absolute;
		right: 0;
	}

	// View type
	&__view {
		position: sticky;
		top: 0;
		z-index: $zindex-dropdown - 1; // Keep it below dropdowns
		background-color: $light;
		border-bottom: 1px solid $gray-200;

		&--stuck {
			background-color: $body-bg;
		}
	}

	// Venue list
	.venue-list-placeholder-item {
		text-align: center;
		border: 0;
		flex: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	&__list-item {
		margin-top: $spacer;
		border-bottom: 1px solid #eee;
	}

	// Map
	&__map {
		flex: 1;
	}
	&__map-infowindow-content {
		min-width: 200px;
		max-width: 280px;
	}
	&__map-refresh-btn {
		position: absolute;
		top: 101px;
		right: 10px;
		width: 40px; // Align with zoom buttons
		height: 40px;
		padding: 0;
		border-radius: $border-radius-sm;
		box-shadow: 0 1px 4px -1px rgba(#000, 0.3);

		.pg-button__icon {
			width: 24px;
			height: 24px;
			vertical-align: -4px;
		}
	}
	&__map-floating-controls {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding-bottom: 1rem;
	}

	&--with-map {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
}
</style>

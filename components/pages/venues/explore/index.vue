<template>
	<div class="pg-explore-page">
		<pg-navbar
			:search="true"
			:placeholder="placeholder"
			:query="query"
			:auto-submit="false"
			variant="dark"
			@place-changed="onPlaceChanged">
			<template slot="searchAppend">
				<client-only>
					<pg-button
						v-if="$geolocation.supported"
						:loading="locating"
						:icon="userLocation ? 'location' : 'location-outline'"
						:title="$t('pages.explore.location')"
						:aria-label="$t('pages.explore.location')"
						variant="naked"
						class="navbar__search-btn"
						@click="findUserLocation"
					/>
				</client-only>
			</template>
		</pg-navbar>

		<!-- Filters -->
		<div class="navbar filter-navbar">
			<div class="d-flex">
				<pg-button
					v-if="$mq === 'xs' || $mq === 'sm'"
					:title="showMap ? $t('pages.explore.view.list') : $t('pages.explore.view.map')"
					variant="link"
					class="filter-button filter-button--toggle"
					@click="currentView = currentView === 'map' ? 'list' : 'map'">
					<pg-icon :icon="showMap ? 'list' : 'map'" />
				</pg-button>
				<pg-filter-button
					v-if="showRadiusFilter"
					:value="searchParams.radius"
					:options="radiusOptions"
					:label="$t('pages.explore.filters.radius_label')"
					@change="onRadiusChange"
				/>
				<pg-filter-button
					:value="searchParams.categories"
					:options="categoryOptions"
					:label="$t('pages.explore.filters.category_label')"
					multiple
					@change="onCategoryChange"
				/>
				<!--
				<pg-filter-button
					:value="searchParams.amenities"
					:options="amenityOptions"
					:label="$t('pages.explore.filters.amenity_label')"
					multiple
					@change="onAmenityChange"
				/>
				-->
			</div>
			<div v-if="venues.length" class="text-muted px-3 align-self-center text-nowrap small">
				{{
					$tc('pages.explore.results', venues.length, {
						count: hasMorePages ? `${venues.length}+` : venues.length
					})
				}}
			</div>
		</div>

		<div class="wrapper">
			<div v-if="showList" class="venue-list px-0 col col-md-7 col-lg-6 col-xl-5">
				<!-- Loader -->
				<div v-if="loading" key="loader" class="list-group-item venue-list-placeholder-item text-muted">
					<pg-icon icon="circle-outline-notch" spinning />
					<p class="mb-0">{{ $t('common.status.loading') }}&hellip;</p>
				</div>
				<template v-else>
					<!-- Empty list -->
					<div v-if="!venues.length" key="no-items" class="list-group-item venue-list-placeholder-item text-muted">
						<pg-icon icon="search" class="pg-icon--3x" />
						<h4 class="mt-3">{{ $t('pages.explore.no_items.title') }}</h4>
						<p>{{ $t('pages.explore.no_items.subtitle') }}</p>
					</div>

					<!-- Venue list -->
					<pg-venue-list-item
						v-for="venue in venues"
						:key="venue.id"
						:venue="venue"
						:highlighted="highlightedVenueId === venue.id"
						:selected="selectedVenueId === venue.id"
						@mouseover="highlight(venue)"
						@mouseout="highlight()"
						@click="select(venue)"
					/>

					<!-- Limited results -->
					<div v-if="hasMorePages" class="list-group-item text-muted text-center border-0 mt-0 mb-5">
						<div class="h1">&hellip;</div>
						<p>{{ $t('pages.explore.limited_results') }}</p>
					</div>
				</template>
			</div>

			<pg-map
				v-if="showMap"
				ref="map"
				:center="mapCenter"
				:zoom="mapZoom"
				:bounds="mapBounds"
				:options="mapOptions"
				class="map"
				@bounds_changed="onMapBoundsChange"
				@click="selectedVenueId = null">
				<pg-map-marker v-if="userLocation" :position="userLocation" icon="/img/map/pin-user.svg" title="La tua posizione" />
				<pg-map-marker v-for="(venue, index) in venues" :key="venue.id" :position="venue.coords" :icon="mapMarkerIcon(venue, index)" @click="select(venue)">
					<pg-map-info-window :opened="venue.id === selectedVenueId" @closeclick="select(null)">
						<pg-venue-infowindow-item
							class="map-infowindow-content"
							:venue="venue"
						/>
					</pg-map-info-window>
				</pg-map-marker>
				<template slot="visible">
					<!-- Refresh buttons -->
					<template v-if="($mq === 'md' || $mq === 'lg' || $mq === 'xl') && mapNeedsRefresh">
						<pg-button
							id="desktop-refresh-btn"
							:aria-label="$t('pages.explore.search_area')"
							variant="accent"
							class="map-refresh-btn"
							icon="refresh"
							@click="onSearchBoundsClick"
						/>
						<b-tooltip
							target="desktop-refresh-btn"
							placement="right"
							triggers=""
							show>
							{{ $t('pages.explore.search_area') }}
						</b-tooltip>
					</template>
					<div v-if="($mq === 'xs' || $mq === 'sm') && mapNeedsRefresh" class="container-fluid map-floating-controls">
						<pg-button variant="accent" block @click="onSearchBoundsClick">{{ $t('pages.explore.search_area') }}</pg-button>
					</div>
				</template>
			</pg-map>
		</div>
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
import { BTooltip } from 'bootstrap-vue'
import PgVenueListItem from './list-item'
import PgVenueInfowindowItem from './infowindow-item'
import PgFilterButton from './filter-button'
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
		BTooltip,
		PgVenueListItem,
		PgVenueInfowindowItem,
		PgFilterButton
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
			{ radius: searchRadiuses[0] },
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
				ne_lat: queryParams.ne_lat,
				ne_lng: queryParams.ne_lng,
				sw_lat: queryParams.sw_lat,
				sw_lng: queryParams.sw_lng
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

			searchMode, // bounds, center
			searchParams,
			query: queryParams.query,
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
		placeholder() {
			if (this.searchMode === 'bounds') {
				return `(${this.$t('pages.explore.placeholder.in_map')})`
			} else if (this.searchMode === 'center' && this.userLocation) {
				return `(${this.$t('pages.explore.placeholder.location')})`
			} else {
				return undefined
			}
		},

		mapOptions() {
			return {
				gestureHandling: 'greedy',
				fullscreenControl: false,
				mapTypeControl: false,
				streetViewControl: false,
				zoomControl: ['md', 'lg', 'xl'].indexOf(this.$mq) !== -1,
				zoomControlOptions: {
					position: 1 // google.maps.ControlPosition.TOP_LEFT
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

		categoriesForCountry() {
			const country = this.searchParams.country

			return this.categories.filter(
				category => !category.country || category.country === country
			)
		},

		radiusOptions() {
			return searchRadiuses.map(radius => ({
				value: radius,
				label: `${radius} km`
			}))
		},

		categoryOptions() {
			return this.categoriesForCountry
				.slice() // make immutable
				.sort((a, b) => {
					a = this.$t(`data.categories.${a.machine_name}`)
					b = this.$t(`data.categories.${b.machine_name}`)

					return a > b ? 1 : -1
				})
				.map(category => ({
					value: category.id,
					label: this.$t(`data.categories.${category.machine_name}`)
				}))
		},

		/*
		amenityOptions() {
			return this.amenities.map(amenity => ({
				value: amenity.machine_name,
				label: this.$t(`data.amenities.${amenity.machine_name}`)
			}));
		},
		*/

		hasMorePages() {
			return this.venues ? this.venues.length >= 100 : false
		},

		showRadiusFilter() {
			return this.searchMode === 'center'
		},

		showList() {
			return (
				['md', 'lg', 'xl'].indexOf(this.$mq) !== -1 ||
				this.currentView === 'list'
			)
		},

		showMap() {
			return (
				['md', 'lg', 'xl'].indexOf(this.$mq) !== -1 ||
				this.currentView === 'map'
			)
		}
	},

	head() {
		return {
			title: this.query || this.$t('pages.explore.meta_title')
		}
	},

	watch: {
		'searchParams.country': {
			immediate: true,
			handler(country) {
				this.searchParams.categories = this.categoriesForCountry.map(
					category => category.id
				)
			}
		}
	},

	asyncData({ $axios }) {
		return $axios.$get('/venues/explore')
	},

	mounted() {
		// Search if there's any parameter set
		if (Object.keys(this.$route.query).length) {
			this.search()
		}
	},

	methods: {
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
			extend(this.searchParams, {
				query: this.query,
				country: place.countryCode,
				c_lat: center ? center.lat() : null,
				c_lng: center ? center.lng() : null,
				ne_lat: null,
				ne_lng: null,
				sw_lat: null,
				sw_lng: null
			})

			// Load venues
			this.search()
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
				alert(this.$t('pages.explore.location_error'))
			} finally {
				this.locating = false
			}

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

			// Update search params
			extend(this.searchParams, {
				query: '',
				c_lat: latitude,
				c_lng: longitude,
				ne_lat: null,
				ne_lng: null,
				sw_lat: null,
				sw_lng: null
			})

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

					extend(this.searchParams, {
						query: place.readableAddress,
						country: place.countryCode
					})
				}
			})

			// Load venues
			this.search()
		},

		// Filters ------------------------------------------------------------
		onRadiusChange(value) {
			this.searchParams.radius = value
			this.search()
		},

		onCategoryChange(value) {
			if (value && value.length) {
				this.searchParams.categories = value.filter(categoryId => {
					const category = this.categoriesForCountry.find(
						currentCategory => currentCategory.id === categoryId
					)

					return Boolean(category)
				})
			} else {
				this.searchParams.categories = this.categoriesForCountry.map(
					category => category.id
				)
			}

			this.search()
		},

		/*
		onAmenityChange(value) {
			this.searchParams.amenities = value.length ? value : this.amenities.map(amenity => amenity.id);
			this.search();
		},
		*/

		// Map ----------------------------------------------------------------
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

			extend(this.searchParams, {
				query: '',
				// country: this.$i18n.region,
				c_lat: c.lat(),
				c_lng: c.lng(),
				ne_lat: ne.lat(),
				ne_lng: ne.lng(),
				sw_lat: sw.lat(),
				sw_lng: sw.lng()
			})

			this.search()
		},

		// Search -------------------------------------------------------------
		async search() {
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
			if (!this.showMap) return

			this.highlightedVenueId = venue ? venue.id : null
		},

		select(venue) {
			// Disabled when map is not visible
			if (!this.showMap) return

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
	display: flex;
	overflow-x: hidden; // Fix scrollbar issues
	flex-direction: column;
	height: 100vh;

	.wrapper {
		flex: 1;
		display: flex;
		height: 100%;
	}

	// Filters
	.filter-navbar {
		padding: 0;
		flex-wrap: nowrap;
		box-shadow: 0 $border-width 0 rgba(#000, 0.08); // FIXME: Replace with var
		// overflow-x: auto;
		// overflow-y: visible;
		// -webkit-overflow-scrolling: touch;
		z-index: 3; // Stay above the content AND above the selected list item
		position: relative; // Stay above the content
	}

	.filter-button {
		// Override bootstrap button
		color: inherit;
		text-decoration: none;
		font-weight: inherit;
		border-radius: 0;
		transition: none;
		border: 0;

		position: relative;
		padding: $input-btn-padding-y-lg $input-btn-padding-x-lg;
		line-height: 1;
		cursor: default;
		user-select: none;
		overflow: hidden;
		white-space: nowrap;
		display: flex;
		flex-direction: column;
		justify-content: center;

		&::after {
			content: '';
			position: absolute;
			top: 0.5rem;
			bottom: 0.5rem;
			right: 0;
			width: $border-width;
			border: 0;
			background-color: $gray-200;
		}
	}
	.filter-button__label {
		text-transform: uppercase;
		font-size: $font-size-xs;
		font-weight: $font-weight-semibold;
		color: $gray-600;
	}
	.filter-button__arrow {
		width: 0.75rem;
		height: 0.75rem;
		vertical-align: -0.08em;
		color: $gray-600;
	}
	.filter-button__text {
		margin-top: 0.125rem;
	}
	.dropdown.show > .filter-button {
		color: $olive-900;
		background-color: $green-200;

		&:after {
			visibility: hidden;
		}
	}
	.filter-button--toggle {
		color: $primary;
	}

	.filter-button-menu__icon {
		width: $icon-size-base;
		color: $primary;
		margin-right: 0.75rem;
	}
	.filter-button-menu__text {
		flex: 1;
	}

	// Venue list
	.venue-list {
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		display: flex;
		flex-direction: column;
	}
	.venue-list-placeholder-item {
		text-align: center;
		border: 0;
		flex: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.venue-list-item {
		border: 0;
		padding-top: map-get($spacers, 3);
		padding-bottom: map-get($spacers, 3);
	}
	.venue-list-item--highlighted {
		background-color: $green-100;
	}
	.venue-list-item.active {
		background-color: $green-100;
		color: inherit;
		margin-top: 0; // Override list-group negative margin
	}

	// Map
	.map {
		flex: auto;
		height: 100%;
	}
	.map-infowindow-content {
		min-width: 200px;
		max-width: 280px;
	}
	.map-refresh-btn {
		position: absolute;
		top: 101px;
		left: 10px;
		width: 40px; // Align with zoom buttons
		height: 40px;
		padding: 0;
		border-radius: $border-radius-sm;
		box-shadow: 0 1px 4px -1px rgba(#000, 0.3);

		.pg-button__icon {
			width: 24px;
			height: 24px;
			vertical-align: -0.3em;
		}
	}
	.map-floating-controls {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding-bottom: 1rem;
	}
}
</style>

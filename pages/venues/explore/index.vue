<template>
	<div class="page">
		<pg-navbar variant="dark" />

		<!-- Filters -->
		<div v-if="currentView === 'list' || isLargeScreen" class="bg-light pt-3 pb-1">
			<div class="container">
				<div class="row form-row">
					<b-form-group
						:label="$t('pages.explore.form.location.label')"
						label-sr-only
						class="mb-2 mb-md-0 col-md">
						<div class="search-field">
							<pg-icon
								icon="search"
								class="search-field__icon"
							/>
							<pg-place-textbox
								ref="searchField"
								:placeholder="searchFieldPlaceholder"
								:value="query"
								class="search-field__textbox"
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
									class="search-field__button"
									@click.stop="findUserLocation"
								/>
							</client-only>
						</div>
					</b-form-group>
					<b-form-group
						:label="$t('pages.explore.form.category.label')"
						label-sr-only
						class="mb-0 col-7 col-md-4 col-lg-3">
						<b-form-select
							:options="categoryOptions"
							:value="searchParams.category"
							@input="onCategoryChange"
						/>
					</b-form-group>
					<b-form-group
						v-if="searchMode === 'center'"
						:label="$t('pages.explore.form.distance')"
						label-sr-only
						class="mb-0 col-5 col-md-2">
						<b-form-select
							:options="radiusOptions"
							:value="searchParams.radius"
							@input="onRadiusChange"
						/>
					</b-form-group>
				</div>
				<hr v-if="hasSearchParams" class="mb-0">
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

		<!-- Tabs + result count -->
		<div ref="tabsAnchor" />
		<div v-if="hasSearchParams" class="view" :class="scrollPastTabs ? 'view--stuck' : null">
			<div class="container">
				<b-nav tabs class="align-items-center">
					<b-nav-item :active="currentView === 'list'" @click="switchView('list')">
						<pg-icon icon="list" class="mr-1" />
						{{ $t('pages.explore.form.view.list') }}
					</b-nav-item>
					<b-nav-item :active="currentView === 'map'" @click="switchView('map')">
						<pg-icon icon="map" class="mr-1" />
						{{ $t('pages.explore.form.view.map') }}
					</b-nav-item>
					<div class="ml-auto small text-muted d-flex align-items-center">
						<pg-icon
							v-if="loading"
							icon="circle-outline-notch"
							spinning
							class="mr-1"
						/>
						{{ $tc('pages.explore.form.results', pagination.total || null) }}
					</div>
				</b-nav>
			</div>
		</div>

		<!-- List -->
		<div v-if="currentView === 'list'" class="container flex-fill d-flex flex-column py-5">
			<!-- Initial loader (outside the button) -->
			<div
				v-if="loading && !venues.length"
				key="loader"
				class="my-auto text-center text-muted">
				<pg-icon icon="circle-outline-notch" spinning />
				<p class="mb-0">{{ $t('common.status.loading') }}&hellip;</p>
			</div>

			<!-- Search to start -->
			<pg-no-items
				v-if="!hasSearchParams"
				key="hint"
				class="my-auto"
				icon="search"
				:title="$t('pages.explore.start.title')"
			/>

			<!-- Empty list -->
			<pg-no-items
				v-if="hasSearchParams && !loading && !venues.length"
				key="no-items"
				class="my-auto"
				:title="$t('pages.explore.no_items.title')"
				:subtitle="$t('pages.explore.no_items.subtitle')"
			/>

			<!-- Venue list (always visible) -->
			<template v-for="(venue, index) in venues">
				<hr v-if="index" :key="`separator-${venue.id}`" class="w-100">
				<pg-venue-list-item
					:key="`venue-${venue.id}`"
					:venue="venue"
					class="list-item"
				/>
			</template>
			<div ref="listAnchor" />

			<!-- Load button -->
			<div v-if="hasMorePages" class="text-center mt-4">
				<pg-button
					variant="primary"
					:loading="loading"
					@click="loadMore">
					{{ $t('pages.explore.list.load_more') }}
				</pg-button>
			</div>
		</div>

		<!-- Map -->
		<pg-map
			v-if="currentView === 'map'"
			ref="map"
			:center="mapCenter"
			:zoom="mapZoom"
			:bounds="mapBounds"
			:options="mapOptions"
			class="flex-fill"
			@zoom_changed="onMapZoomChange"
			@bounds_changed="onMapBoundsChange"
			@click="selectedVenueId = null">
			<pg-map-marker
				v-if="userLocation"
				:position="userLocation"
				icon="/img/map/pin-user.svg"
			/>
			<pg-map-marker
				v-for="(venue, index) in venues"
				:key="venue.id"
				:position="venue.coords"
				:icon="mapMarkerIcon(venue, index)"
				@click="selectMarker(venue)">
				<pg-map-info-window
					:opened="venue.id === selectedVenueId"
					@closeclick="selectMarker(null)">
					<pg-venue-infowindow-item
						class="map__infowindow-content"
						:venue="venue"
					/>
				</pg-map-info-window>
			</pg-map-marker>
			<template #visible>
				<!-- Refresh buttons -->
				<template v-if="isLargeScreen && mapNeedsRefresh">
					<pg-button
						id="desktop-refresh-btn"
						:aria-label="$t('pages.explore.map.search_area')"
						variant="accent"
						class="map__refresh-btn"
						icon="refresh"
						@click="onSearchBoundsClick"
					/>
					<b-tooltip
						target="desktop-refresh-btn"
						placement="left"
						triggers=""
						show>
						{{ $t('pages.explore.map.search_area') }}
					</b-tooltip>
				</template>
				<div v-if="isSmallScreen && mapNeedsRefresh" class="container map__floating-controls">
					<pg-button variant="accent" block @click="onSearchBoundsClick">{{ $t('pages.explore.map.search_area') }}</pg-button>
				</div>
			</template>
		</pg-map>

		<pg-page-footer v-if="currentView === 'list'" />
	</div>
</template>

<script>
import { extend, debounce } from 'lodash'
import {
	Map as PgMap,
	Marker as PgMapMarker,
	InfoWindow as PgMapInfoWindow
} from 'vue2-google-maps'
import {
	BFormGroup,
	BFormSelect,
	// BFormCheckboxGroup,
	BNav,
	BNavItem,
	BTooltip
} from 'bootstrap-vue'
import PgVenueInfowindowItem from './-infowindow-item'
import PgVenueListItem from './-list-item'
import PgPlaceTextbox from '@/components/place-textbox'
import PgNoItems from '@/components/no-items'
import paramsConverter from '@/utilities/explore-params-converter'
import { formatGoogleMapsResult } from '@/utilities'

const searchRadiuses = [10, 20, 30, 50, 100]

export default {
	name: 'PgExploreVenuesPage',

	components: {
		PgMap,
		PgMapMarker,
		PgMapInfoWindow,
		BFormGroup,
		BFormSelect,
		// BFormCheckboxGroup,
		BNav,
		BNavItem,
		BTooltip,
		PgVenueListItem,
		PgVenueInfowindowItem,
		PgPlaceTextbox,
		PgNoItems
	},

	asyncData ({ $axios }) {
		return $axios.$get('/venues/explore')
	},

	data () {
		let mapCenter = extend(
			{},
			this.$constants[`MAP_DEFAULT_CENTER_${this.$i18n.region}`]
		)
		let mapBounds = null
		const queryParams = this.$route.query
		const viewParams = paramsConverter.queryToViewParams(queryParams)
		const searchParams = extend(
			{
				page: 1,
				query: '',
				country: this.$i18n.region,
				// categories: [],
				category: null,
				radius: searchRadiuses[0],
				c_lat: null,
				c_lng: null,
				ne_lat: null,
				ne_lng: null,
				sw_lat: null,
				sw_lng: null
			},
			paramsConverter.queryToSearchParams(queryParams)
		)

		// Prepare view
		const currentView = viewParams.view || 'list'
		const mapZoom = viewParams.zoom || 13

		// Prepare map center
		const gotMapCenter = ['c_lat', 'c_lng'].every(key => searchParams[key])

		if (gotMapCenter) {
			mapCenter = {
				lat: searchParams.c_lat,
				lng: searchParams.c_lng
			}
		}

		// Prepare map bounds (end eventually change search mode)
		const gotMapBounds = ['ne_lat', 'ne_lng', 'sw_lat', 'sw_lng'].every(
			key => searchParams[key]
		)

		if (gotMapBounds) {
			mapBounds = {
				north: searchParams.ne_lat,
				east: searchParams.ne_lng,
				south: searchParams.sw_lat,
				west: searchParams.sw_lng
			}
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
			scrollPastTabs: false,
			searchParams,
			query: searchParams.query,
			venues: [],
			pagination: {},
			currentView,
			selectedVenueId: null,
			mapNeedsRefresh: false,
			mapBoundsEventEnabled: false,
			mapCenter,
			mapBounds,
			mapZoom
		}
	},

	computed: {
		isSmallScreen () {
			return ['xs', 'sm'].includes(this.$mq)
		},

		isLargeScreen () {
			return ['md', 'lg', 'xl'].includes(this.$mq)
		},

		country () {
			return this.searchParams.country || this.$i18n.region
		},

		hasSearchBounds () {
			return ['ne_lat', 'ne_lng', 'sw_lat', 'sw_lng'].every(
				key => this.searchParams[key]
			)
		},

		hasSearchCenter () {
			return ['c_lat', 'c_lng'].every(key => this.searchParams[key])
		},

		hasSearchParams () {
			return this.hasSearchBounds || this.hasSearchCenter
		},

		searchMode () {
			return this.hasSearchBounds ? 'bounds' : 'center'
		},

		searchFieldPlaceholder () {
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

		mapOptions () {
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

		radiusOptions () {
			return searchRadiuses.map(radius => ({
				value: radius,
				text: `${radius} km`
			}))
		},

		categoryOptions () {
			return [
				{
					value: null,
					text: this.$t('pages.explore.form.category.any')
				},
				...this.categoriesForCountry(this.searchParams.country)
					.slice() // make a copy
					.sort((a, b) => { // sort by translated name
						a = this.$t(`data.categories.${a.machine_name}`)
						b = this.$t(`data.categories.${b.machine_name}`)

						return a > b ? 1 : -1
					})
					.map(category => ({ // map to data accepted by the widget
						value: category.id,
						text: this.$t(`data.categories.${category.machine_name}`)
					}))
			]
		},

		/*
		amenityOptions() {
			return this.amenities.map(amenity => ({
				value: amenity.machine_name,
				text: this.$t(`data.amenities.${amenity.machine_name}`)
			}));
		},
		*/

		hasMorePages () {
			return this.pagination
				? this.pagination.current_page !== this.pagination.last_page
				: false
		}
	},

	watch: {
		// Conditionally connect observers, since the initial view could be the
		// map
		currentView: {
			immediate: true,
			async handler () {
				if (!process.client) { return }

				await this.$nextTick()

				const target = this.$refs.listAnchor

				if (target) {
					if (this.currentView === 'list') {
						this.listObserver.observe(target)
					} else if (this.currentView === 'map') {
						this.listObserver.unobserve(target)
					}
				}
			}
		}
	},

	mounted () {
		this.setSearchParams({}) // Init defaults (and search)

		if (process.client) {
			// Add sticky tabs observer
			this.tabsObserver = new IntersectionObserver(([entry]) => {
				this.scrollPastTabs = !entry.isIntersecting
			})
			this.tabsObserver.observe(this.$refs.tabsAnchor)

			// Add infinite loading observer
			this.listObserver = new IntersectionObserver(([entry]) => {
				if (entry.isIntersecting) { this.loadMore() }
			})
		}
	},

	destroyed () {
		// Destroy intersection observers
		this.tabsObserver.disconnect()
		this.listObserver.disconnect()
	},

	methods: {
		categoriesForCountry (country) {
			return this.categories.filter(
				category => !category.country || category.country === country
			)
		},

		setSearchParams (params) {
			// const searchParams = this.searchParams
			const country = params.country || this.country

			// Reset page if not specified otherwise, so any filter change would
			// restart from the first one
			if (!params.page) { params.page = 1 }

			// Set categories
			/*
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
				params.categories = params.categories.filter((categoryId) => {
					const cat = this.categoriesForCountry(country).find(
						category => category.id === categoryId
					)

					return !!cat
				})
			}
			*/

			// Set category (make sure is available for the country)
			if (params.category) {
				const cat = this.categoriesForCountry(country).find(
					category => category.id === params.category
				)

				if (!cat) {
					params.category = null
				}
			}

			// Force set country
			params.country = country

			// Save params and search
			extend(this.searchParams, params)
			this.search()
		},

		// Location search ----------------------------------------------------
		onPlaceChanged (place) {
			// Reset old query if there's no place
			if (!place) {
				this.query = this.searchParams.query
				return
			}

			const bounds =
				place.geometry && place.geometry.viewport
					? place.geometry.viewport
					: null
			const center = bounds && bounds.getCenter() ? bounds.getCenter() : null

			// Update view
			this.mapNeedsRefresh = false
			this.userLocation = null

			// Update map center so view switching will be in sync
			this.mapCenter = {
				lat: center.lat(),
				lng: center.lng()
			}

			// Move map, but disable map bounds tracking first
			if (bounds && this.$refs.map) {
				this.mapBoundsEventEnabled = false
				this.$refs.map.fitBounds(bounds)
			}

			place = formatGoogleMapsResult(place)

			this.query = place.readableAddress

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
		async findUserLocation () {
			this.locating = true
			let position

			try {
				position = await this.$geolocation.getCurrentPosition({
					timeout: 10 * 1000, // 10 secs
					maximumAge: 5 * 60 * 1000 // last 5 minutes
				})
			} catch (err) {
				this.userLocation = null
				alert(this.$t('pages.explore.form.location.geolocalization_error'))
			} finally {
				this.locating = false
			}

			// Stop if there's no position
			if (!position) { return }

			const { latitude, longitude } = position.coords

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
			if (this.$refs.map) { this.$refs.map.panTo(this.mapCenter) }

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
			if (!this.geocoder) { this.geocoder = new google.maps.Geocoder() }

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
		onRadiusChange (value) {
			this.setSearchParams({
				radius: value
			})
		},

		/*
		async onCategoryChange (value) {
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
		*/
		onCategoryChange (value) {
			this.setSearchParams({
				category: value
			})
		},

		// Map -----------------------------------------------------------------
		mapMarkerIcon (venue, index) {
			const type = venue.id === this.selectedVenueId ? 'selected' : 'normal'

			return `/img/map/pin-${type}.svg`
		},

		selectMarker (venue) {
			this.selectedVenueId =
				venue && venue.id !== this.selectedVenueId ? venue.id : null
		},

		onMapZoomChange (value) {
			this.mapZoom = value
			this.updateUrl()
		},

		// Fat arrow functions do not work with debounce
		onMapBoundsChange: debounce(function (bounds) {
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

		onSearchBoundsClick () {
			const c = this.mapBounds.getCenter()
			const ne = this.mapBounds.getNorthEast()
			const sw = this.mapBounds.getSouthWest()

			// Update view
			this.selectedVenueId = null
			this.mapNeedsRefresh = false
			this.query = null

			// Update map center so view switching will be in sync, but disable
			// map bounds tracking first
			this.mapBoundsEventEnabled = false
			this.mapCenter = {
				lat: c.lat(),
				lng: c.lng()
			}

			// Update search params
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
		async search () {
			// Stop if there is no location for searching
			if (!this.hasSearchParams) { return }

			// Load venues
			this.loading = true

			try {
				const data = await this.$axios.$post(
					'/venues/explore',
					this.searchParams
				)
				this.venues =
					this.searchParams.page === 1
						? data.data
						: [...this.venues, ...data.data]
				this.pagination = data.meta
			} finally {
				this.loading = false
			}

			// Update URL
			this.updateUrl()
		},

		loadMore () {
			if (
				this.hasSearchParams &&
				this.hasMorePages &&
				this.currentView === 'list'
			) {
				this.setSearchParams({
					page: this.pagination.current_page + 1
				})
			}
		},

		updateUrl () {
			this.$router.replace({
				query: paramsConverter.toQueryParams({
					...this.searchParams,
					...{
						view: this.currentView,
						zoom: this.currentView === 'map' ? this.mapZoom : null
					}
				})
			})
		},

		switchView (view) {
			this.currentView = view
			this.updateUrl()
		}
	},

	head () {
		return {
			title: this.searchParams.query || this.$t('pages.explore.meta_title')
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

// Search + filters
.search-field {
	display: flex;
	position: relative;

	&__icon {
		position: absolute;
		left: $input-padding-x;
		height: 100%;
		color: $gray-400;
		pointer-events: none;
	}
	&__textbox {
		padding-left: ($input-padding-x * 2) + $icon-size-base;
		padding-right: ($btn-padding-x * 2) + $icon-size-base;
	}
	&__button {
		position: absolute;
		right: 0;
	}
}

// View type
.view {
	position: sticky;
	top: 0;
	z-index: $zindex-dropdown - 1; // Keep it below dropdowns
	background-color: $light;
	border-bottom: 1px solid $gray-200;

	&--stuck {
		background-color: $body-bg;
	}
}

// Map
.map {
	&__infowindow-content {
		min-width: 200px;
		max-width: 280px;
	}
	&__refresh-btn {
		position: absolute;
		top: 101px;
		right: 10px;
		width: 40px; // Align with zoom buttons
		height: 40px;
		padding: 0;
		border-radius: $border-radius-sm;
		box-shadow: 0 1px 4px -1px rgba(#000, 0.3);

		/deep/ .pg-button__icon {
			width: 24px;
			height: 24px;
			vertical-align: -4px;
		}
	}
	&__controls {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding-bottom: 1rem;
	}
}
</style>

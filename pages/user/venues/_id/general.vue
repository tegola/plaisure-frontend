<template>
	<form @submit.prevent="submit">
		<b-form-group
			v-bind="formGroupProps"
			:state="!$v.model.name.$error"
			:label="$t('pages.user.venues.detail.general.name')"
			:invalid-feedback="$t('pages.user.venues.detail.general.name_error')">
			<div class="form-row">
				<div class="col-lg-10">
					<b-form-input
						v-model="model.name"
						:placeholder="$t('pages.user.venues.detail.general.name_placeholder')"
					/>
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:label="$t('pages.user.venues.detail.general.concessionaire')">
			<div class="form-row">
				<div class="col-lg-10">
					<b-form-select v-model="model.concessionaire_id">
						<option :value="null">{{ $t('pages.user.venues.detail.general.concessionaire_none') }}</option>
						<option
							v-for="item in concessionaireOptions"
							:key="item.id"
							:value="item.id">
							{{ item.name }}
						</option>
					</b-form-select>
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:label="$t('pages.user.venues.detail.general.description')">
			<div class="form-row">
				<div class="col-lg-10">
					<b-form-textarea v-model="model.description" rows="5" />
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:state="!$v.model.surface_size.$error"
			:label="$t('pages.user.venues.detail.general.surface_size')"
			:invalid-feedback="$t('pages.user.venues.detail.general.surface_size_error')">
			<div class="form-row">
				<div class="col-5 col-md-4 col-lg-3">
					<b-input-group :append="$t('pages.user.venues.detail.general.surface_size_unit')">
						<b-form-input
							v-model.number="model.surface_size"
							type="number"
							min="1"
						/>
					</b-input-group>
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:state="!$v.model.category_ids.$error"
			:label="$t('pages.user.venues.detail.general.category')"
			:invalid-feedback="$t('pages.user.venues.detail.general.category_error')"
			label-class="pt-0">
			<div class="form-row">
				<div class="col-lg-10">
					<b-form-checkbox-group v-model="model.category_ids" stacked>
						<b-form-checkbox
							v-for="category in categoryOptions"
							:key="category.id"
							:value="category.id">
							{{ $t(`data.categories.${category.machine_name}`) }}
						</b-form-checkbox>
					</b-form-checkbox-group>
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:label="$t('pages.user.venues.detail.general.address')">
			<div class="form-row">
				<div class="col-lg-10 mb-2">
					<b-form-input
						:placeholder="$t('pages.user.venues.detail.general.address_line1_placeholder')"
						:value="model.address_line1"
						@input="onAddressInput('address_line1', $event)"
					/>
				</div>
				<div class="col-lg-10">
					<b-form-input
						:placeholder="$t('pages.user.venues.detail.general.address_line2_placeholder')"
						:value="model.address_line2"
						@input="onAddressInput('address_line2', $event)"
					/>
				</div>
			</div>
		</b-form-group>
		<b-form-group
			v-bind="formGroupProps"
			:label="$t('pages.user.venues.detail.general.city')">
			<div class="form-row">
				<div class="col-lg-10">
					<b-form-input
						:value="model.address_city"
						@input="onAddressInput('address_city', $event)"
					/>
				</div>
			</div>
		</b-form-group>
		<b-form-group
			v-bind="formGroupProps"
			:label="$t('pages.user.venues.detail.general.zipcode_province')">
			<div class="form-row">
				<div class="col-3">
					<b-form-input
						:placeholder="$t('pages.user.venues.detail.general.zipcode_placeholder')"
						:value="model.address_postcode"
						@input="onAddressInput('address_postcode', $event)"
					/>
				</div>
				<div class="col-9 col-lg-7">
					<b-form-input
						:placeholder="$t('pages.user.venues.detail.general.province_placeholder')"
						:value="model.address_province"
						@input="onAddressInput('address_province', $event)"
					/>
				</div>
			</div>
		</b-form-group>
		<b-form-group
			v-bind="formGroupProps"
			:state="!$v.model.address.$error"
			:label="$t('pages.user.venues.detail.general.country')"
			:invalid-feedback="$t('pages.user.venues.detail.general.address_error')">
			<div class="form-row">
				<div class="col-lg-10">
					<b-form-select
						v-model="model.country"
						:options="$countrySelectOptions"
					/>
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-if="showMap"
			v-bind="formGroupProps"
			:label="$t('pages.user.venues.detail.general.location')">
			<div class="form-row">
				<div class="col-lg-10">
					<div class="embed-responsive embed-responsive-3by2 rounded">
						<g-map :center="mapCenter" :zoom="mapZoom" class="embed-responsive-item">
							<g-map-marker
								v-if="markerPosition"
								:position="markerPosition"
								:draggable="canDragMarker"
								@dragend="onMarkerDragEnd"
							/>
						</g-map>
					</div>
				</div>
			</div>
			<b-form-text tag="span">
				<template v-if="searchingMarkerCoords">{{ $t('pages.user.venues.detail.general.location_searching') }}&hellip;</template>
				<template v-else-if="canDragMarker">{{ $t('pages.user.venues.detail.general.location_hint') }}</template>
			</b-form-text>
		</b-form-group>

		<b-form-group v-bind="formGroupProps" class="mt-5">
			<pg-button
				ref="submit"
				type="submit"
				variant="primary"
				:loading="saving"
				:block="$mq | mq({ xs: true, md: false })">
				{{ $t('common.actions.save') }}
			</pg-button>
		</b-form-group>
	</form>
</template>

<script>
import { mapState } from 'vuex'
import { throttle, isEqual } from 'lodash'
import { validationMixin } from 'vuelidate'
import {
	required,
	minValue,
	minLength,
	numeric
} from 'vuelidate/lib/validators'
import {
	BFormGroup,
	BFormText,
	BFormInput,
	BInputGroup,
	BFormTextarea,
	BFormSelect,
	BFormCheckbox,
	BFormCheckboxGroup
} from 'bootstrap-vue'
import { Map as GMap, Marker as GMapMarker } from 'vue2-google-maps'
import formGroupProps from './-form-group-props'

export default {
	name: 'PgUserVenueDetailPageGeneralSection',

	components: {
		BFormGroup,
		BFormText,
		BFormInput,
		BInputGroup,
		BFormTextarea,
		BFormSelect,
		BFormCheckbox,
		BFormCheckboxGroup,
		GMap,
		GMapMarker
	},

	mixins: [validationMixin],

	data () {
		return {
			formGroupProps,
			mapCenter: this.$constants[`MAP_DEFAULT_CENTER_${this.$i18n.region}`],
			mapZoom: 5,
			searchingMarkerCoords: false,
			model: null
		}
	},

	async fetch ({ $axios, params, store }) {
		const data = await $axios.$get(`/user/venues/${params.id}/general`)

		store.commit('user-venue-detail/setCategories', data.categories)
		store.commit('user-venue-detail/setConcessionaires', data.concessionaires)
	},

	computed: {
		...mapState('user-venue-detail', [
			'venue',
			'concessionaires',
			'categories',
			'saving'
		]),

		concessionaireOptions () {
			return this.concessionaires.filter((concessionaire) => {
				return !!(
					concessionaire.country === this.model.country ||
					!concessionaire.country
				)
			})
		},

		categoryOptions () {
			return this.categories.filter((category) => {
				return !!(category.country === this.model.country || !category.country)
			})
		},

		coords () {
			return {
				lat: this.model.geo_latitude,
				lng: this.model.geo_longitude
			}
		},

		markerPosition () {
			if (!this.coords.lat || !this.coords.lng) { return null }

			return {
				lat: this.coords.lat,
				lng: this.coords.lng
			}
		},

		showMap () {
			const a = this.venue.address

			return !!(a.line1 && a.postcode && a.city && a.province)
		},

		canDragMarker () {
			return this.showMap && !this.searchingMarkerCoords
		}
	},

	watch: {
		venue: {
			handler: 'prepareModel',
			immediate: true
		},

		'venue.country' () {
			// Keep only categories for the selected country
			this.model.category_ids = this.model.category_ids.filter((id) => {
				return this.categoryOptions.some(category => category.id === id)
			})

			// Keep concessionaire only if present in the selected country
			const concessionaireFound = this.concessionaireOptions.some(
				concessionaire => concessionaire.id === this.model.concessionaire_id
			)
			if (!concessionaireFound) { this.model.concessionaire_id = null }
		},

		coords: {
			immediate: true,
			handler () {
				const defaultCenterKey = `MAP_DEFAULT_CENTER_${this.$i18n.region}`

				this.mapCenter = this.coords
				this.markerCoords = this.coords
				if (!isEqual(this.coords, this.$constants[defaultCenterKey])) {
					this.mapZoom = 15
				}
			}
		}
	},

	validations: {
		model: {
			name: {
				required
			},
			surface_size: {
				required,
				numeric,
				minValue: minValue(1)
			},
			vlt_machine_count: {
				numeric,
				minValue: minValue(0)
			},
			awp_machine_count: {
				numeric,
				minValue: minValue(0)
			},
			seating_capacity: {
				numeric,
				minValue: minValue(0)
			},
			parking_capacity: {
				numeric,
				minValue: minValue(0)
			},
			category_ids: {
				required,
				minLength: minLength(1)
			},
			address_line1: {
				required
			},
			address_postcode: {
				required
			},
			address_city: {
				required
			},
			address_province: {
				required
			},
			country: {
				required
			},
			geo_latitude: {
				required
			},
			geo_longitude: {
				required
			},
			// Group validation for the address
			address: [
				'model.address_line1',
				'model.address_postcode',
				'model.address_city',
				'model.address_province',
				'model.country'
			]
		}
	},

	methods: {
		prepareModel () {
			const v = this.venue

			this.model = {
				name: v.name,
				concessionaire_id: v.concessionaire_id,
				description: v.description,
				surface_size: v.surface_size,
				vlt_machine_count: v.vlt_machine_count,
				awp_machine_count: v.awp_machine_count,
				seating_capacity: v.seating_capacity,
				parking_capacity: v.parking_capacity,
				category_ids: v.categories.map(category => category.id),
				address_line1: v.address.line1,
				address_line2: v.address.line2,
				address_postcode: v.address.postcode,
				address_city: v.address.city,
				address_province: v.address.province,
				country: v.country,
				geo_latitude: v.coords.lat,
				geo_longitude: v.coords.lng
			}
		},

		onAddressInput (field, value) {
			this.model[field] = value

			// Find marker location
			this.findMarkerCoords()
		},

		findMarkerCoords: throttle(function () {
			const m = this.model

			if (
				!m.address_line1 ||
				!m.address_postcode ||
				!m.address_city ||
				!m.address_province
			) { return }

			const address = [
				m.address_line1,
				m.address_line2,
				m.address_postcode,
				m.address_city,
				m.address_province
			].join(', ')

			this.searchingMarkerCoords = true

			if (!this.geocoder) { this.geocoder = new google.maps.Geocoder() }

			this.geocoder.geocode({ address }, (results, status) => {
				this.searchingMarkerCoords = false

				if (status !== 'OK') { return }

				const location = results[0].geometry.location

				this.mapZoom = 15
				this.mapCenter = {
					lat: location.lat(),
					lng: location.lng()
				}

				m.geo_latitude = location.lat()
				m.geo_longitude = location.lng()
			})
		}, 1000),

		onMarkerDragEnd (location) {
			const markerCoords = location.latLng

			this.model.geo_latitude = markerCoords.lat()
			this.model.geo_longitude = markerCoords.lng()
		},

		async submit () {
			// Validate
			this.$v.model.$touch()

			// Stop on validation errors
			if (this.$v.model.$error) { return }

			this.$store.commit('user-venue-detail/setSaving', true)

			try {
				// Save
				await this.$axios.post(
					`/user/venues/${this.venue.id}/general`,
					this.model
				)

				// Show success on button
				this.$refs.submit.showSuccess()

				// Emit to reload venue
				this.$emit('submitted')
			} catch (err) {
				this.$notify({
					title: this.$t('common.status.error'),
					text: this.$t('common.status.save_error'),
					duration: -1,
					type: 'danger'
				})
			} finally {
				this.$store.commit('user-venue-detail/setSaving', false)
			}
		}
	}
}
</script>

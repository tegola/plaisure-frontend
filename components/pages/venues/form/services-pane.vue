<template>
	<div class="my-5">
		<h5>{{ $t('pages.venue_form.services.title') }}</h5>
		<hr>
		<b-form-group v-bind="formGroupProps">
			<div class="form-row">
				<div class="col-lg-10">
					<div><b-form-checkbox v-model="venueSportsBetting">{{ $t('pages.venue_form.services.sports_betting') }}</b-form-checkbox></div>
					<div><b-form-checkbox v-model="venueVirtualBetting">{{ $t('pages.venue_form.services.virtual_betting') }}</b-form-checkbox></div>
					<div><b-form-checkbox v-model="venueHorseBetting">{{ $t('pages.venue_form.services.horse_betting') }}</b-form-checkbox></div>
					<div><b-form-checkbox v-model="venueArcadeRoulette">{{ $t('pages.venue_form.services.arcade_roulette') }}</b-form-checkbox></div>
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:state="!$v.vlt_machine_count.$error"
			:label="$t('pages.venue_form.services.vlt_machine_count')"
			:invalid-feedback="$t('pages.venue_form.services.invalid_value')">
			<div class="form-row">
				<div class="col-md-3 col-lg-3">
					<b-form-input v-model.number="venueVltMachineCount" type="number" min="0" />
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:state="!$v.awp_machine_count.$error"
			:label="$t('pages.venue_form.services.awp_machine_count')"
			:invalid-feedback="$t('pages.venue_form.services.invalid_value')">
			<div class="form-row">
				<div class="col-md-3 col-lg-3">
					<b-form-input v-model.number="venueAwpMachineCount" type="number" min="0" />
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:state="!$v.seating_capacity.$error"
			:label="$t('pages.venue_form.services.seating_capacity')"
			:invalid-feedback="$t('pages.venue_form.services.invalid_value')">
			<div class="form-row">
				<div class="col-md-3 col-lg-3">
					<b-form-input v-model.number="venueSeatingCapacity" type="number" min="0" />
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:state="!$v.parking_capacity.$error"
			:label="$t('pages.venue_form.services.parking_capacity')"
			:invalid-feedback="$t('pages.venue_form.services.invalid_value')">
			<div class="form-row">
				<div class="col-md-3 col-lg-3">
					<b-form-input v-model.number="venueParkingCapacity" type="number" min="0" />
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:label="$t('pages.venue_form.services.vlt_platforms')"
			label-class="pt-0">
			<div class="form-row">
				<div class="col-lg-10">
					<b-form-checkbox-group v-model="venueVltPlatformIds" stacked>
						<b-form-checkbox
							v-for="item in vltPlatformOptions"
							:key="item.id"
							:value="item.id">
							{{ item.name }}
						</b-form-checkbox>
					</b-form-checkbox-group>
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:label="$t('pages.venue_form.services.amenities')"
			label-class="pt-0">
			<div class="form-row">
				<div class="col-lg-10">
					<b-form-checkbox-group v-model="venueAmenityIds" stacked>
						<b-form-checkbox
							v-for="item in amenityOptions"
							:key="item.id"
							:value="item.id">
							<pg-icon
								:icon="amenityIconMap[item.machine_name]"
								class="mr-1"
							/>
							{{ $t(`data.amenities.${item.machine_name}`) }}
						</b-form-checkbox>
					</b-form-checkbox-group>
				</div>
			</div>
		</b-form-group>
	</div>
</template>

<script>
import { mapState } from 'vuex'
// import extend from 'lodash/extend'
import {
	BFormGroup,
	BFormInput,
	BFormCheckbox,
	BFormCheckboxGroup
} from 'bootstrap-vue'
import formGroupProps from './form-group-props'
import amenityIconMap from '@/utilities/amenity-icon-map'

export default {
	name: 'ServicesPane',

	components: {
		BFormGroup,
		BFormInput,
		BFormCheckbox,
		BFormCheckboxGroup
	},

	data() {
		return {
			formGroupProps
		}
	},

	computed: {
		...mapState('venueForm', ['venue', 'amenities', 'vltPlatforms']),

		venueSportsBetting: {
			get() {
				return this.venue.sports_betting
			},
			set(value) {
				this.$store.commit('venueForm/setVenueField', {
					field: 'sports_betting',
					value
				})
			}
		},

		venueVirtualBetting: {
			get() {
				return this.venue.virtual_betting
			},
			set(value) {
				this.$store.commit('venueForm/setVenueField', {
					field: 'virtual_betting',
					value
				})
			}
		},

		venueHorseBetting: {
			get() {
				return this.venue.horse_betting
			},
			set(value) {
				this.$store.commit('venueForm/setVenueField', {
					field: 'horse_betting',
					value
				})
			}
		},

		venueArcadeRoulette: {
			get() {
				return this.venue.arcade_roulette
			},
			set(value) {
				this.$store.commit('venueForm/setVenueField', {
					field: 'arcade_roulette',
					value
				})
			}
		},

		venueVltMachineCount: {
			get() {
				return this.venue.vlt_machine_count
			},
			set(value) {
				this.$store.commit('venueForm/setVenueField', {
					field: 'vlt_machine_count',
					value
				})
			}
		},

		venueAwpMachineCount: {
			get() {
				return this.venue.awp_machine_count
			},
			set(value) {
				this.$store.commit('venueForm/setVenueField', {
					field: 'awp_machine_count',
					value
				})
			}
		},

		venueSeatingCapacity: {
			get() {
				return this.venue.seating_capacity
			},
			set(value) {
				this.$store.commit('venueForm/setVenueField', {
					field: 'seating_capacity',
					value
				})
			}
		},

		venueParkingCapacity: {
			get() {
				return this.venue.parking_capacity
			},
			set(value) {
				this.$store.commit('venueForm/setVenueField', {
					field: 'parking_capacity',
					value
				})
			}
		},

		vltPlatformOptions() {
			return this.vltPlatforms.filter(vltPlatform => {
				return Boolean(
					vltPlatform.country === this.venue.country || !vltPlatform.country
				)
			})
		},

		venueVltPlatformIds: {
			get() {
				return this.venue.vlt_platform_ids
			},
			set(value) {
				this.$store.commit('venueForm/setVenueField', {
					field: 'vlt_platform_ids',
					value
				})
			}
		},

		amenityOptions() {
			return this.amenities.filter(amenity => {
				return Boolean(
					amenity.country === this.venue.country || !amenity.country
				)
			})
		},

		amenityIconMap() {
			return amenityIconMap
		},

		venueAmenityIds: {
			get() {
				return this.venue.amenity_ids
			},
			set(value) {
				this.$store.commit('venueForm/setVenueField', {
					field: 'amenity_ids',
					value
				})
			}
		},

		$v() {
			return this.$parent.$v.venue
		}
	},

	watch: {
		'venue.country'() {
			this.venueVltPlatformIds = this.venueVltPlatformIds.filter(id => {
				return this.vltPlatformOptions.some(
					vltPlatform => vltPlatform.id === id
				)
			})
			this.venueAmenityIds = this.venueAmenityIds.filter(id => {
				return this.amenityOptions.some(amenity => amenity.id === id)
			})
		}
	}
}
</script>

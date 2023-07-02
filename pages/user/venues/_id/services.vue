<template>
	<form @submit.prevent="submit">
		<b-form-group v-bind="formGroupProps">
			<div class="form-row">
				<div class="col-lg-10">
					<div><b-form-checkbox v-model="model.sports_betting">{{ $t('pages.user.venues.detail.services.sports_betting') }}</b-form-checkbox></div>
					<div><b-form-checkbox v-model="model.virtual_betting">{{ $t('pages.user.venues.detail.services.virtual_betting') }}</b-form-checkbox></div>
					<div><b-form-checkbox v-model="model.horse_betting">{{ $t('pages.user.venues.detail.services.horse_betting') }}</b-form-checkbox></div>
					<div><b-form-checkbox v-model="model.arcade_roulette">{{ $t('pages.user.venues.detail.services.arcade_roulette') }}</b-form-checkbox></div>
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:state="!$v.model.vlt_machine_count.$error"
			:label="$t('pages.user.venues.detail.services.vlt_machine_count')"
			:invalid-feedback="$t('pages.user.venues.detail.services.invalid_value')">
			<div class="form-row">
				<div class="col-md-3 col-lg-3">
					<b-form-input
						v-model.number="model.vlt_machine_count"
						type="number"
						min="0"
					/>
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:state="!$v.model.awp_machine_count.$error"
			:label="$t('pages.user.venues.detail.services.awp_machine_count')"
			:invalid-feedback="$t('pages.user.venues.detail.services.invalid_value')">
			<div class="form-row">
				<div class="col-md-3 col-lg-3">
					<b-form-input
						v-model.number="model.awp_machine_count"
						type="number"
						min="0"
					/>
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:state="!$v.model.seating_capacity.$error"
			:label="$t('pages.user.venues.detail.services.seating_capacity')"
			:invalid-feedback="$t('pages.user.venues.detail.services.invalid_value')">
			<div class="form-row">
				<div class="col-md-3 col-lg-3">
					<b-form-input
						v-model.number="model.seating_capacity"
						type="number"
						min="0"
					/>
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:state="!$v.model.parking_capacity.$error"
			:label="$t('pages.user.venues.detail.services.parking_capacity')"
			:invalid-feedback="$t('pages.user.venues.detail.services.invalid_value')">
			<div class="form-row">
				<div class="col-md-3 col-lg-3">
					<b-form-input
						v-model.number="model.parking_capacity"
						type="number"
						min="0"
					/>
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:label="$t('pages.user.venues.detail.services.vlt_platforms')"
			label-class="pt-0">
			<div class="form-row">
				<div class="col-lg-10">
					<b-form-checkbox-group v-model="model.vlt_platform_ids" stacked>
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
			:label="$t('pages.user.venues.detail.services.amenities')"
			label-class="pt-0">
			<div class="form-row">
				<div class="col-lg-10">
					<b-form-checkbox-group v-model="model.amenity_ids" stacked>
						<b-form-checkbox
							v-for="item in amenityOptions"
							:key="item.id"
							:value="item.id">
							<pg-icon
								v-if="amenityIconMap[item.machine_name]"
								:icon="amenityIconMap[item.machine_name]"
								class="mr-1"
							/>
							{{ $t(`data.amenities.${item.machine_name}`) }}
						</b-form-checkbox>
					</b-form-checkbox-group>
				</div>
			</div>
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
import { validationMixin } from 'vuelidate'
import { minValue, numeric } from 'vuelidate/lib/validators'
import {
	BFormGroup,
	BFormInput,
	BFormCheckbox,
	BFormCheckboxGroup
} from 'bootstrap-vue'
import formGroupProps from './-form-group-props'
import { amenityIconMap } from '@/utilities'

export default {
	name: 'PgUserVenueDetailPageServicesSection',

	components: {
		BFormGroup,
		BFormInput,
		BFormCheckbox,
		BFormCheckboxGroup
	},

	mixins: [validationMixin],

	data () {
		return {
			formGroupProps,
			amenityIconMap,
			model: null
		}
	},

	async fetch ({ $axios, params, store }) {
		const data = await $axios.$get(`/user/venues/${params.id}/services`)

		store.commit('user-venue-detail/setAmenities', data.amenities)
		store.commit('user-venue-detail/setVltPlatforms', data.vltPlatforms)
	},

	computed: {
		...mapState('user-venue-detail', [
			'venue',
			'amenities',
			'vltPlatforms',
			'saving'
		]),

		vltPlatformOptions () {
			return this.vltPlatforms.filter((vltPlatform) => {
				return !!(
					vltPlatform.country === this.venue.country || !vltPlatform.country
				)
			})
		},

		amenityOptions () {
			return this.amenities.filter((amenity) => {
				return !!(amenity.country === this.venue.country || !amenity.country)
			})
		}
	},

	watch: {
		venue: {
			handler: 'prepareModel',
			immediate: true
		},

		'venue.country' () {
			// Keep only VLT platforms for the selected country
			this.model.vlt_platform_ids = this.model.vlt_platform_ids.filter((id) => {
				return this.vltPlatformOptions.some(
					vltPlatform => vltPlatform.id === id
				)
			})

			// Keep only venue amenities for the selected country
			this.model.amenity_ids = this.model.amenity_ids.filter((id) => {
				return this.amenityOptions.some(amenity => amenity.id === id)
			})
		}
	},

	validations: {
		model: {
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
			}
		}
	},

	methods: {
		prepareModel () {
			const v = this.venue

			this.model = {
				sports_betting: v.sports_betting,
				virtual_betting: v.virtual_betting,
				horse_betting: v.horse_betting,
				arcade_roulette: v.arcade_roulette,
				vlt_machine_count: v.vlt_machine_count,
				awp_machine_count: v.awp_machine_count,
				seating_capacity: v.seating_capacity,
				parking_capacity: v.parking_capacity,
				vlt_platform_ids: v.vlt_platforms.map(vltPlatform => vltPlatform.id),
				amenity_ids: v.amenities.map(amenity => amenity.id)
			}
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
					`/user/venues/${this.venue.id}/services`,
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

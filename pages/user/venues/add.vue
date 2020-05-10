<template>
	<div>
		<pg-navbar variant="dark" />

		<div class="my-5">
			<div class="container">
				<pg-breadcrumb :items="breadcrumbItems" />
			</div>

			<form @submit.prevent="next">
				<div class="container">
					<div class="row">
						<div :class="columnClass" class="text-center">
							<h1 class="h4 text-olive-900">{{ $t('pages.user.venues.add.title') }}</h1>
							<div class="d-inline-flex mt-3 mb-5">
								<div
									v-for="n in 4"
									:key="n"
									class="step"
									:class="currentStep === n ? 'step--active' : null"
								/>
							</div>
						</div>
					</div>
				</div>

				<div ref="paneContainer" class="pane-container">
					<transition-group
						tag="div"
						:name="transition"
						@enter="onTransitionEnter"
						@after-enter="onTransitionAfterEnter"
						@leave="onTransitionLeave">
						<!-- Step 1 ------------------------------------ -->
						<div v-if="currentStep === 1" key="pane-1" class="pane">
							<div class="container">
								<div class="row">
									<div :class="columnClass">
										<div class="text-center">
											<h3 class="h5 font-weight-normal mb-1">{{ $t('pages.user.venues.add.step_1.title') }}</h3>
											<p class="text-muted">{{ $t('pages.user.venues.add.step_1.subtitle') }}</p>
										</div>
										<b-form-group
											:state="!$v.model.name.$error"
											:label="$t('pages.user.venues.add.step_1.name')"
											:invalid-feedback="$t('pages.user.venues.add.step_1.name_error')"
											class="mb-0">
											<b-form-input
												v-model="model.name"
												size="lg"
												autofocus
											/>
										</b-form-group>
									</div>
								</div>
							</div>
						</div>

						<!-- Step 2 ------------------------------------ -->
						<div v-if="currentStep === 2" key="pane-2" class="pane">
							<div class="container">
								<div class="row">
									<div :class="columnClass">
										<div class="text-center">
											<h3 class="h5 font-weight-normal mb-1">{{ $t('pages.user.venues.add.step_2.title') }}</h3>
											<p class="text-muted">{{ $t('pages.user.venues.add.step_2.subtitle') }}</p>
										</div>
										<b-form-group :label="$t('pages.user.venues.add.step_2.address')">
											<b-form-input
												v-model="model.address_line1"
												:placeholder="$t('pages.user.venues.add.step_2.address_line1_placeholder')"
												class="mb-2"
												autofocus
											/>
											<b-form-input
												v-model="model.address_line2"
												:placeholder="$t('pages.user.venues.add.step_2.address_line1_placeholder')"
											/>
										</b-form-group>
										<b-form-group :label="$t('pages.user.venues.add.step_2.city')">
											<b-form-input v-model="model.address_city" />
										</b-form-group>
										<b-form-group :label="$t('pages.user.venues.add.step_2.zipcode_province')">
											<div class="form-row">
												<div class="col-3">
													<b-form-input
														v-model="model.address_postcode"
														:placeholder="$t('pages.user.venues.add.step_2.zipcode_placeholder')"
													/>
												</div>
												<div class="col-9">
													<b-form-input
														v-model="model.address_province"
														:placeholder="$t('pages.user.venues.add.step_2.province_placeholder')"
													/>
												</div>
											</div>
										</b-form-group>
										<b-form-group
											:state="!$v.model.address.$error"
											:label="$t('pages.user.venues.add.step_2.country')"
											:invalid-feedback="$t('pages.user.venues.add.step_2.address_error')"
											class="mb-0">
											<b-form-select
												v-model="model.country"
												:options="$countrySelectOptions"
											/>
										</b-form-group>
									</div>
								</div>
							</div>
						</div>

						<!-- Step 3 ------------------------------------ -->
						<div v-if="currentStep === 3" key="pane-3" class="pane">
							<div class="container">
								<div class="row">
									<div :class="columnClass">
										<div class="text-center">
											<h3 class="h5 font-weight-normal mb-1">{{ $t('pages.user.venues.add.step_3.title') }}</h3>
											<p class="text-muted">{{ $t('pages.user.venues.add.step_3.subtitle') }}</p>
										</div>
										<b-form-group
											:label="$t('pages.user.venues.add.step_3.location')"
											label-sr-only
											class="mb-0">
											<b-aspect aspect="3:2" class="map">
												<g-map
													ref="map"
													class="map__widget"
													:center="mapCenter"
													:zoom="15"
													:options="mapOptions"
													@dragend="onMapDragEnd"
												/>
												<div class="map__overlay">
													<pg-icon icon="pin" class="map__pin" />
													<div class="map__pin-shadow" />
												</div>
											</b-aspect>
										</b-form-group>
									</div>
								</div>
							</div>
						</div>

						<!-- Step 4 ------------------------------------ -->
						<div v-if="currentStep === 4" key="pane-4" class="pane">
							<div class="container">
								<div class="row">
									<div :class="columnClass">
										<div class="text-center">
											<h3 class="h5 font-weight-normal mb-1">{{ $t('pages.user.venues.add.step_4.title') }}</h3>
											<p class="text-muted">{{ $t('pages.user.venues.add.step_4.subtitle') }}</p>
										</div>
										<div class="col-md-8 mx-auto">
											<b-form-group
												:state="!$v.model.category_ids.$error"
												:label="$t('pages.user.venues.add.step_4.categories')"
												label-sr-only
												:invalid-feedback="$t('pages.user.venues.add.step_4.categories_error')"
												class="mb-0">
												<b-form-checkbox-group v-model="model.category_ids" stacked>
													<b-form-checkbox
														v-for="(category, index) in categoryOptions"
														:key="category.id"
														:value="category.id"
														:autofocus="index === 0">
														{{ $t(`data.categories.${category.machine_name}`) }}
													</b-form-checkbox>
												</b-form-checkbox-group>
											</b-form-group>
										</div>
									</div>
								</div>
							</div>
						</div>
					</transition-group>
				</div>

				<div class="container mt-4">
					<div class="row">
						<div :class="columnClass">
							<div class="d-flex justify-content-between">
								<transition name="fade">
									<div>
										<pg-button
											v-if="currentStep !== 1"
											type="button"
											variant="secondary"
											:label="$t('common.actions.back')"
											icon="arrow-left"
											@click="previous"
										/>
									</div>
								</transition>
								<pg-button
									type="submit"
									variant="primary"
									:label="currentStep === 4 ? $t('common.actions.done') : $t('common.actions.continue')"
									:icon="currentStep === 4 ? null : 'arrow-right'"
									:class="currentStep === 4 ? 'px-4' : null"
									icon-position="right"
									:loading="saving"
								/>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { extend, debounce } from 'lodash'
import { required, minLength } from 'vuelidate/lib/validators'
import {
	BAspect,
	BFormGroup,
	BFormInput,
	BFormSelect,
	BFormCheckbox,
	BFormCheckboxGroup
} from 'bootstrap-vue'
import { Map as GMap } from 'vue2-google-maps'

export default {
	name: 'PgUserVenueAddPage',

	middleware: 'auth',

	components: {
		BAspect,
		BFormGroup,
		BFormInput,
		BFormSelect,
		BFormCheckbox,
		BFormCheckboxGroup,
		GMap
	},

	mixins: [validationMixin],

	async asyncData ({ $axios }) {
		const data = await $axios.$get('/user/venues/add')

		return {
			categories: data.categories
		}
	},

	data () {
		return {
			currentStep: 1,
			categories: [],
			transition: null,
			searching: false,
			saving: false,
			columnClass: 'col-lg-8 col-xl-7 mx-auto',
			model: {
				name: '',
				address_line1: '',
				address_line2: '',
				address_postcode: '',
				address_city: '',
				address_province: '',
				geo_latitude: null,
				geo_longitude: null,
				country: this.$auth.user.country || this.$i18n.isoCode.split('-')[1],
				category_ids: []
			}
		}
	},

	computed: {
		breadcrumbItems () {
			return [
				{
					text: this.$t('pages.user.index.title'),
					to: this.localePath('user')
				},
				{
					text: this.$t('pages.user.venues.index.title'),
					to: this.localePath('user-venues')
				},
				{
					text: this.$t('pages.user.venues.add.meta_title'),
					active: true
				}
			]
		},

		// Use a reference to the model to make sure it holds both the old and
		// new values.
		// https://github.com/vuejs/vue/issues/2164#issuecomment-432872718
		tempModel () {
			return extend({}, this.model)
		},

		isLargeScreen () {
			return ['md', 'lg', 'xl'].includes(this.$mq)
		},

		mapOptions () {
			return {
				fullscreenControl: false,
				mapTypeControl: false,
				streetViewControl: false,
				zoomControl: this.isLargeScreen,
				clickableIcons: false,
				draggable: !this.searching,
				styles: [
					{
						// Hide public transit
						featureType: 'transit.station',
						stylers: [{ visibility: 'off' }]
					}
				]
			}
		},

		mapCenter () {
			const lat = this.model.geo_latitude
			const lng = this.model.geo_longitude
			const def = this.$constants[`MAP_DEFAULT_CENTER_${this.$i18n.region}`]

			return lat && lng ? { lat, lng } : def
		},

		categoryOptions () {
			return this.categories.filter((category) => {
				return !!(category.country === this.model.country || !category.country)
			})
		}
	},

	watch: {
		// Find coordinates when the address changes
		tempModel: {
			deep: true,
			handler (oldModel, newModel) {
				const fields = [
					'address_line1',
					'address_line2',
					'address_postcode',
					'address_city',
					'address_province',
					'address_country'
				]

				const changed = fields.some((field) => {
					return oldModel[field] !== newModel[field]
				})

				if (changed) {
					this.findCoords()
				}
			}
		},

		// Keep only categories for the selected country
		'model.country' () {
			this.model.category_ids = this.model.category_ids.filter((id) => {
				return this.categoryOptions.some(category => category.id === id)
			})
		}
	},

	validations: {
		model: {
			name: {
				required
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
			],
			category_ids: {
				required,
				minLength: minLength(1)
			}
		},

		// Group validation for easy check within the next() method
		step_1: ['model.name'],
		step_2: ['model.address'],
		step_3: ['model.geo_latitude', 'model.geo_longitude'],
		step_4: ['model.category_ids']
	},

	async created () {
		const google = await this.$gmapApiPromiseLazy()

		this.geocoder = new google.maps.Geocoder()
	},

	methods: {
		next () {
			// Validate current step
			const validation = this.$v[`step_${this.currentStep}`]

			validation.$touch()

			if (validation.$error) { return }

			// Advance step or submit
			if (this.currentStep < 4) {
				this.transition = 'pane-slide-left'
				this.currentStep++
			} else {
				this.submit()
			}
		},

		previous () {
			if (this.currentStep > 1) {
				this.transition = 'pane-slide-right'
				this.currentStep--
			}
		},

		onTransitionEnter (el) {
			this.$refs.paneContainer.style.height = `${el.offsetHeight}px`
		},

		onTransitionAfterEnter (el) {
			this.$refs.paneContainer.style.height = ''
		},

		onTransitionLeave (el) {
			this.$refs.paneContainer.style.height = `${el.offsetHeight}px`
		},

		findCoords: debounce(function () {
			if (
				!this.model.address_line1 ||
				!this.model.address_postcode ||
				!this.model.address_city ||
				!this.model.address_province
			) {
				return
			}

			let coords
			const address = [
				this.model.address_line1,
				this.model.address_line2,
				this.model.address_postcode,
				this.model.address_city,
				this.model.address_province
			].join(', ')

			this.searching = true

			this.geocoder.geocode({ address }, (results, status) => {
				this.searching = false

				if (status === 'OK') {
					const location = results[0].geometry.location

					coords = {
						geo_latitude: location.lat(),
						geo_longitude: location.lng()
					}
				} else {
					coords = {
						geo_latitude: null,
						geo_longitude: null
					}
				}

				this.model = extend({}, this.model, coords)
			})
		}, 1000),

		onMapDragEnd () {
			const coords = this.$refs.map.$mapObject.center

			this.model = extend({}, this.model, {
				geo_latitude: coords.lat(),
				geo_longitude: coords.lng()
			})
		},

		async submit () {
			this.saving = true

			try {
				// Save
				const data = await this.$axios.$post('/user/venues', this.model)
				const venue = data.data

				// Reload the user (with the updated venue ids)
				await this.$auth.fetchUser()

				// Go to the new venue detail page
				this.$router.push(
					this.localePath({
						name: 'user-venues-id',
						params: { id: venue.id }
					})
				)
			} catch (err) {
				this.saving = false
				this.$notify({
					title: this.$t('common.status.error'),
					text: this.$t('common.status.save_error'),
					duration: -1,
					type: 'danger'
				})
			}
		}
	},

	head () {
		return {
			title: this.$t('pages.user.venues.add.meta_title')
		}
	}
}
</script>

<style lang="scss" scoped>
$transition-duration: 250ms;
$transition-easing: ease-in-out;

$custom-control-indicator-size: 1.75rem;
$custom-control-gutter: 1rem;

.step {
	width: 10px;
	height: 10px;
	display: flex;
	border-radius: 50%;
	border: 2px solid $gray-200;
	transition: $transition-duration $transition-easing;

	& + & {
		margin-left: map-get($spacers, 2);
	}

	&--active {
		background-color: $primary;
		border-color: transparent;
	}
}

.pane-container {
	position: relative;
	transition: height $transition-duration $transition-easing;
	overflow: hidden;
}

.pane-slide-left-enter-active,
.pane-slide-left-leave-active,
.pane-slide-right-enter-active,
.pane-slide-right-leave-active {
	position: absolute;
	transition: $transition-duration $transition-easing;
	width: 100%;
}
.pane-slide-left-enter,
.pane-slide-right-leave-to {
	transform: translateX(100px);
	opacity: 0;
}
.pane-slide-left-leave-to,
.pane-slide-right-enter {
	transform: translateX(-100px);
	opacity: 0;
}

.map {
	border-radius: $border-radius;
	position: relative;
	overflow: hidden;

	&__widget {
		width: 100%;
		height: 100%;
	}

	&__overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}
	&__pin {
		width: 2.5rem;
		height: 2.5rem;
		margin-top: -2.5rem;
		color: $fuchsia-500;
		stroke: $fuchsia-600;
		stroke-width: 0.5;
		position: relative;
		z-index: 1;
	}
	&__pin-shadow {
		position: absolute;
		width: 1rem;
		height: 0.35rem;
		border-radius: 50%;
		margin-top: -0.05rem;
		background: radial-gradient(rgba($black, 0.3), rgba($black, 0) 66%);
	}
}

.custom-checkbox {
	min-height: $custom-control-indicator-size;
	line-height: 2;
	padding-left: $custom-control-indicator-size + $custom-control-gutter;
	padding-top: 0.5rem;
	padding-bottom: 0.5rem;

	& + & {
		border-top: 1px solid $gray-100;
	}

	/deep/ .custom-control-label {
		&::before {
			left: -($custom-control-gutter + $custom-control-indicator-size);
			width: $custom-control-indicator-size;
			height: $custom-control-indicator-size;
		}
		&::after {
			left: -($custom-control-gutter + $custom-control-indicator-size);
			width: $custom-control-indicator-size;
			height: $custom-control-indicator-size;
			background: no-repeat 50% / #{$custom-control-indicator-bg-size};
		}
	}
}
</style>

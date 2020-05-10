<template>
	<form>
		<!-- Current subscription -->
		<template v-if="subscription && (subscription.is_valid || subscription.payment_pending)">
			<h4 class="initialism font-weight-normal text-muted">{{ $t('pages.user.venues.detail.plan.current.title') }}</h4>
			<div class="row">
				<div class="col-md-4">
					<h3>{{ $t(`data.subscriptions.${subscription.name}`) }}</h3>
					<p class="lead">
						{{
							$t('pages.user.venues.detail.plan.current.price', {
								price: $n(subscription.price, 'currency')
							})
						}}
					</p>
				</div>
				<div class="col-md-8 col-lg-7">
					<div class="d-flex align-items-start">
						<!-- Pending payment -->
						<template v-if="subscription.payment_pending">
							<pg-icon
								icon="exclamation-circle-outline"
								class="status-icon bg-yellow-200 text-yellow-700"
							/>
							<div>
								<p>
									<strong class="font-weight-semibold text-yellow-700">{{ $t('pages.user.venues.detail.plan.current.payment_pending.title') }}</strong><br>
									{{ $t('pages.user.venues.detail.plan.current.payment_pending.check') }}<br>
									{{ $t('pages.user.venues.detail.plan.current.payment_pending.cancel') }}
								</p>
								<pg-button
									variant="yellow-300"
									:label="$t('pages.user.venues.detail.plan.current.payment_pending.action')"
									@click="cancelPending"
								/>
							</div>
						</template>

						<!-- Ends -->
						<template v-else-if="subscription.ends_at">
							<pg-icon
								icon="clock-outline"
								class="status-icon bg-orange-100 text-orange-500"
							/>
							<div>
								<p>
									<strong class="font-weight-semibold text-orange-600">
										{{
											$t('pages.user.venues.detail.plan.current.ends.title', {
												date: $d(new Date(subscription.ends_at), 'extraLong')
											})
										}}
									</strong><br>
									{{
										$t('pages.user.venues.detail.plan.current.ends.cancelled', {
											date: $d(new Date(subscription.updated_at), 'extraLong')
										})
									}}
								</p>
								<pg-button
									:label="$t('pages.user.venues.detail.plan.current.ends.action')"
									:disabled="selecting"
									@click="select"
								/>
							</div>
						</template>

						<!-- Renews -->
						<template v-else-if="subscription.current_period_ends_at">
							<pg-icon
								icon="clock-outline"
								class="status-icon bg-green-100 text-green-600"
							/>
							<div>
								<p>
									<strong class="font-weight-semibold text-green-600">
										{{
											$t('pages.user.venues.detail.plan.current.renews.title', {
												date: $d(new Date(subscription.current_period_ends_at), 'extraLong')
											})
										}}
									</strong>
								</p>
								<pg-button
									:label="$t('pages.user.venues.detail.plan.current.renews.action')"
									:disabled="selecting"
									@click="select"
								/>
							</div>
						</template>
					</div>
				</div>
			</div>

			<hr v-if="selecting" class="my-5">
		</template>

		<!-- Selection -->
		<div v-if="selecting || !subscription || !subscription.is_valid" ref="subscriptions" class="mb-5">
			<h4 class="initialism font-weight-normal text-muted mb-3">{{ $t('pages.user.venues.detail.plan.pick_new') }}</h4>
			<div class="row">
				<div
					v-for="subscription in subscriptions"
					:key="subscription.name"
					class="col-md-4 d-flex">
					<pg-subscription-card
						class="flex-fill mb-3 mb-md-0"
						v-bind="propsForSubscription(subscription)"
						@select="onSubscriptionSelect(subscription.name)"
					/>
				</div>
			</div>
		</div>

		<!-- Form -->
		<div v-if="model.subscription_name !== null" ref="controls" class="row">
			<div class="col-lg-9 mx-lg-auto">
				<!-- Back to default subscription -->
				<template v-if="model.subscription_name === 'default'">
					<p>
						{{
							$t('pages.user.venues.detail.plan.selected_free', {
								date: $d(new Date(venue.subscription.current_period_ends_at), 'short')
							})
						}}
					</p>

					<!-- Confirm change -->
					<div class="text-right">
						<!-- Default subscription -->
						<pg-button
							v-if="!model.subscription_name"
							:block="$mq === 'xs' || $mq === 'sm'"
							variant="primary"
							:loading="saving"
							:disabled="saving"
							@click="submit">
							{{ $t('pages.user.venues.detail.plan.cancel') }}
						</pg-button>
					</div>
				</template>

				<!-- All other subscriptions -->
				<template v-else>
					<p>
						{{ $t('pages.user.venues.detail.plan.selected_paid') }}
						<template v-if="hasExistingBilling">{{ $t('pages.user.venues.detail.plan.selected_paid_review_data') }}</template>
						<template v-else>{{ $t('pages.user.venues.detail.plan.selected_paid_input_data') }}.</template>
					</p>

					<b-alert v-if="isResuming" show>
						<i18n path="pages.user.venues.detail.plan.resume">
							<strong slot="last_update_date">{{ $d(new Date(venue.subscription.updated_at), 'short') }}</strong>
							<strong slot="end_date">{{ $d(new Date(venue.subscription.ends_at), 'short') }}</strong>
						</i18n>
					</b-alert>

					<!-- Billing -->
					<div class="pt-4">
						<h5>{{ $t('pages.user.venues.detail.plan.billing.title') }}</h5>
						<hr>
					</div>

					<template v-if="hasExistingBilling">
						<b-form-group>
							<b-form-radio v-model="model.new_billing" :value="false">
								{{ $t('pages.user.venues.detail.plan.billing.current') }}
								<b-collapse id="existing-billing-collapse" :visible="!model.new_billing">
									<div class="mt-2 small">
										<div>{{ user.legal_name }}</div>
										<div>{{ user.address_line1 }}</div>
										<div v-if="user.address_line2">{{ user.address_line2 }}</div>
										<div>
											{{ user.address_city }},
											{{ user.address_region }},
											{{ user.address_postcode }},
											{{ user.country }}
										</div>
										<div>{{ $t('pages.user.venues.detail.plan.billing.vat_number') }}: {{ user.vat_number }}</div>
									</div>
								</b-collapse>
							</b-form-radio>
						</b-form-group>
						<b-form-group>
							<b-form-radio v-model="model.new_billing" :value="true">
								{{ $t('pages.user.venues.detail.plan.billing.new') }}
								<b-collapse id="new-billing-collapse" :visible="showNewBillingWarning">
									<div class="pt-2 small">
										<i18n path="pages.user.venues.detail.plan.billing.new_warning.message">
											<strong slot="warning" class="text-danger">{{ $t('pages.user.venues.detail.plan.billing.new_warning.warning') }}</strong>
										</i18n>
									</div>
								</b-collapse>
							</b-form-radio>
						</b-form-group>
					</template>

					<b-collapse id="new-billing-form" :visible="showBillingForm">
						<b-form-group
							:state="!$v.model.legal_name.$error"
							:label="$t('pages.user.venues.detail.plan.billing.legal_name')"
							:invalid-feedback="$t('pages.user.venues.detail.plan.billing.legal_name_error')">
							<b-form-input
								v-model="model.legal_name"
								type="text"
								autocomplete="organization"
								autofocus
							/>
						</b-form-group>
						<b-form-group
							:state="!$v.model.address_line1.$error"
							:label="$t('pages.user.venues.detail.plan.billing.address')"
							:invalid-feedback="$t('pages.user.venues.detail.plan.billing.address_error')">
							<b-form-input v-model="model.address_line1" type="text" autocomplete="address-line1" class="mb-2" />
							<b-form-input v-model="model.address_line2" type="text" autocomplete="address-line2" />
						</b-form-group>
						<div class="form-row">
							<div class="col-sm-4">
								<b-form-group
									:state="!$v.model.address_postcode.$error"
									:label="$t('pages.user.venues.detail.plan.billing.postcode')"
									:invalid-feedback="$t('pages.user.venues.detail.plan.billing.postcode_error')">
									<b-form-input v-model="model.address_postcode" type="text" autocomplete="postal-code" />
								</b-form-group>
							</div>
							<div class="col-sm-8">
								<b-form-group
									:state="!$v.model.address_city.$error"
									:label="$t('pages.user.venues.detail.plan.billing.city')"
									:invalid-feedback="$t('pages.user.venues.detail.plan.billing.city_error')">
									<b-form-input v-model="model.address_city" type="text" autocomplete="address-level2" />
								</b-form-group>
							</div>
						</div>
						<div class="form-row">
							<div class="col-sm">
								<b-form-group
									:state="!$v.model.address_region.$error"
									:label="$t('pages.user.venues.detail.plan.billing.region')"
									:invalid-feedback="$t('pages.user.venues.detail.plan.billing.region_error')">
									<b-form-input v-model="model.address_region" type="text" autocomplete="address-level1" />
								</b-form-group>
							</div>
							<div class="col-sm">
								<b-form-group
									:state="!$v.model.country.$error"
									:label="$t('pages.user.venues.detail.plan.billing.country')"
									:invalid-feedback="$t('pages.user.venues.detail.plan.billing.country_error')">
									<b-form-select v-model="model.country" :options="$countrySelectOptions" />
								</b-form-group>
							</div>
						</div>
						<b-form-group
							:state="!$v.model.vat_number.$error"
							:label="$t('pages.user.venues.detail.plan.billing.vat_number')"
							:invalid-feedback="$t('pages.user.venues.detail.plan.billing.vat_number_error')">
							<b-form-input v-model="model.vat_number" type="text" />
						</b-form-group>
					</b-collapse>

					<!-- Payment -->
					<div class="pt-4">
						<h5>{{ $t('pages.user.venues.detail.plan.payment.title') }}</h5>
						<hr>
					</div>

					<template v-if="hasExistingPayment">
						<b-form-group>
							<b-form-radio v-model="model.new_payment" :value="false">
								{{ $t('pages.user.venues.detail.plan.payment.current') }}
								<b-collapse id="existing-payment-collapse" :visible="!model.new_payment">
									<div class="mt-2 small">
										<div>{{ user.card_brand }} &bull;&bull;&bull;&bull; {{ user.card_last_four }}</div>
										<div>{{ user.card_holder_name }}</div>
										<div>{{ $t('pages.user.venues.detail.plan.payment.card_expiration') }}: {{ user.card_expiry_month }}/{{ user.card_expiry_year }}</div>
									</div>
								</b-collapse>
							</b-form-radio>
						</b-form-group>
						<b-form-group>
							<b-form-radio v-model="model.new_payment" :value="true">
								{{ $t('pages.user.venues.detail.plan.payment.new') }}
								<b-collapse id="new-payment-collapse" :visible="showNewPaymentWarning">
									<div class="pt-2 small">
										<i18n path="pages.user.venues.detail.plan.payment.new_warning.message">
											<strong slot="warning" class="text-danger">{{ $t('pages.user.venues.detail.plan.payment.new_warning.warning') }}</strong>
										</i18n>
									</div>
								</b-collapse>
							</b-form-radio>
						</b-form-group>
					</template>

					<b-collapse id="new-payment-form" :visible="showPaymentForm">
						<b-form-group
							:state="!cardError"
							:label="$t('pages.user.venues.detail.plan.payment.card')"
							:invalid-feedback="cardError">
							<stripe-card
								:stripe="$constants.STRIPE_KEY"
								:options="stripeOptions"
								@change="onCardChange"
							/>
						</b-form-group>
						<b-form-group
							:state="!$v.model.card_holder_name.$error"
							:label="$t('pages.user.venues.detail.plan.payment.card_holder_name')"
							:invalid-feedback="$t('pages.user.venues.detail.plan.payment.card_holder_name_error')">
							<b-form-input v-model="model.card_holder_name" type="text" autocomplete="cc-name" />
						</b-form-group>
					</b-collapse>
				</template>

				<!-- Confirm change -->
				<div class="text-right">
					<pg-button
						:loading="validating"
						:block="$mq === 'xs' || $mq === 'sm'"
						variant="primary"
						@click="validateAndContinue">
						{{ $t('common.actions.continue') }}
					</pg-button>
				</div>
			</div>

			<b-modal
				v-model="confirmModalOpen"
				centered
				hide-header
				no-close-on-backdrop
				@ok.prevent="submit">
				<h5 class="my-3 text-olive-900">{{ $t('pages.user.venues.detail.plan.confirm.title') }}</h5>
				<i18n path="pages.user.venues.detail.plan.confirm.paragraph1" tag="p">
					<span slot="confirm" class="font-weight-bold">{{ $t('pages.user.venues.detail.plan.confirm.submit') }}</span>
					<span slot="name">{{ $constants.APP_NAME }}</span>
					<span slot="price">{{ $n(selectedSubscription.price, 'currency') }}</span>
				</i18n>
				<i18n path="pages.user.venues.detail.plan.confirm.paragraph2" tag="p" class="small text-muted">
					<a slot="tos" href="#">{{ $t('pages.user.venues.detail.plan.confirm.paragraph2_tos') }}</a>
					<a slot="privacy" href="#">{{ $t('pages.user.venues.detail.plan.confirm.paragraph2_privacy') }}</a>
					<span slot="name">{{ $constants.APP_NAME }}</span>
				</i18n>
				<template #modal-footer>
					<pg-button
						:disabled="saving"
						@click="confirmModalOpen = false">
						{{ $t('common.actions.cancel') }}
					</pg-button>
					<pg-button
						variant="primary"
						:loading="saving"
						:disabled="saving"
						@click="submit">
						{{ $t('pages.user.venues.detail.plan.confirm.submit') }}
					</pg-button>
				</template>
			</b-modal>
		</div>
	</form>
</template>

<script>
import { mapState } from 'vuex'
import { validationMixin } from 'vuelidate'
import { requiredIf } from 'vuelidate/lib/validators'
import { extend } from 'lodash'
import {
	BAlert,
	BFormGroup,
	BFormInput,
	BFormSelect,
	BFormRadio,
	BCollapse
} from 'bootstrap-vue'
import { Card as StripeCard, handleCardSetup } from 'vue-stripe-elements-plus'
import { scrollIntoView } from '@/utilities'
import PgSubscriptionCard from '@/components/subscription-card'

export default {
	name: 'PgUserVenueDetailPagePlanSection',

	components: {
		BAlert,
		BFormGroup,
		BFormInput,
		BFormSelect,
		BFormRadio,
		BCollapse,
		StripeCard,
		PgSubscriptionCard
	},

	mixins: [validationMixin],

	async fetch ({ $axios, params, store }) {
		const data = await $axios.$get(`/user/venues/${params.id}/subscription`)

		store.commit(
			'user-venue-detail/setPaymentIntentSecret',
			data.paymentIntentSecret
		)
		store.commit('user-venue-detail/setSubscription', data.subscription)
	},

	data () {
		const manropeFont = {
			family: 'Manrope',
			src: `url(${this.$constants.APP_URL}/fonts/regular.otf)`
		}
		const stripeOptions = {
			elements: {
				locale: this.$i18n.locale,
				// Avoid loading fonts locally, since we have no support for
				// https. Instead, fonts are loaded from the system
				fonts: process.env.NODE_ENV === 'development' ? [] : [manropeFont]
			},
			hidePostalCode: true,
			style: {
				base: {
					fontFamily:
						'Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
					fontSize: '16px'
				}
			}
		}

		return {
			selecting: false, // Don't select if there's a subscription
			validating: false,
			stripeOptions,
			cardError: null,
			confirmModalOpen: false,
			model: null
		}
	},

	computed: {
		...mapState('user-venue-detail', [
			'venue',
			'paymentIntentSecret',
			'subscription',
			'saving'
		]),

		...mapState('auth', ['user']),

		subscriptions () {
			const subscriptions = [
				{
					base: {
						name: 'default',
						currency: 'EUR',
						price: 0,
						lines: [
							this.$t('components.subscription_card.perks.presence'),
							this.$t('components.subscription_card.perks.details'),
							this.$t('components.subscription_card.perks.list')
						]
					},
					GB: {
						currency: 'GBP'
					}
				},
				{
					base: {
						name: 'silver',
						currency: 'EUR',
						price: 39,
						highlight: this.$t('components.subscription_card.highlight'),
						lines: [
							this.$t('components.subscription_card.perks.as_free'),
							this.$t('components.subscription_card.perks.distance_bonus', {
								amount: 10
							}),
							this.$t('components.subscription_card.perks.home_page_presence')
						]
					},
					GB: {
						currency: 'GBP'
					}
				},
				{
					base: {
						name: 'gold',
						currency: 'EUR',
						price: 79,
						lines: [
							this.$t('components.subscription_card.perks.as_free'),
							this.$t('components.subscription_card.perks.distance_bonus', {
								amount: 30
							}),
							this.$t('components.subscription_card.perks.home_page_presence'),
							this.$t('components.subscription_card.perks.hide_nearby_venues')
						]
					},
					GB: {
						currency: 'GBP'
					}
				}
			]

			return subscriptions.map((subscription) => {
				const config = subscription.base

				if (subscription[this.venue.country]) {
					extend(config, subscription[this.venue.country])
				}

				return config
			})
		},

		selectedSubscription () {
			return this.subscriptions.find(
				subscription => subscription.name === this.model.subscription_name
			)
		},

		isResuming () {
			return (
				this.subscription &&
				this.subscription.name === this.model.subscription_name &&
				this.subscription.ends_at &&
				this.subscription.is_valid
			)
		},

		hasExistingBilling () {
			const u = this.user

			return (
				u.legal_name &&
				(u.address_line1 || u.address_line2) &&
				u.address_city &&
				u.address_postcode &&
				u.address_region &&
				u.country &&
				u.vat_number
			)
		},

		hasExistingPayment () {
			return !!this.user.card_brand
		},

		showBillingForm () {
			return !this.hasExistingBilling || this.model.new_billing
		},

		showPaymentForm () {
			return !this.hasExistingPayment || this.model.new_payment
		},

		showNewBillingWarning () {
			return (
				this.model.new_billing &&
				this.hasExistingBilling &&
				this.user.venue_ids.length > 1
			)
		},

		showNewPaymentWarning () {
			return (
				this.model.new_payment &&
				this.hasExistingPayment &&
				this.user.venue_ids.length > 1
			)
		}
	},

	watch: {
		venue: {
			handler: 'prepareModel',
			immediate: true
		},
		user: {
			handler: 'prepareModel',
			immediate: true
		}
	},

	methods: {
		async fetch () {
			const response = await this.$axios.get(
				`/user/venues/${this.venue.id}/subscription`
			)
			const data = response.data

			this.$store.commit(
				'user-venue-detail/setPaymentIntentSecret',
				data.paymentIntentSecret
			)
			this.$store.commit('user-venue-detail/setSubscription', data.subscription)

			return response
		},

		prepareModel () {
			const u = this.user

			this.model = {
				subscription_name: null,
				new_billing: false,
				legal_name: u.legal_name,
				address_line1: u.address_line1,
				address_line2: u.address_line2,
				address_city: u.address_city,
				address_postcode: u.address_postcode,
				address_region: u.address_region,
				country: u.country,
				vat_number: u.vat_number,
				new_payment: false,
				payment_method_id: null,
				card_holder_name: ''
			}
		},

		propsForSubscription (newSubscription) {
			const props = {
				subscription: newSubscription,
				highlight: newSubscription.highlight,
				selected: this.model.subscription_name === newSubscription.name,
				clickable: true,
				disabled: false
			}

			// Disabled
			if (this.subscription && this.subscription.payment_pending) {
				// Current subscription has a payment pending, disable all
				// subscriptions
				props.disabled = true
			} else if (newSubscription.name === 'default') {
				// Default subscription: disabled if there is no subscription
				// or if existing subscription is going to end because it has
				// already been cancelled
				props.disabled = !!(!this.subscription || this.subscription.ends_at)
			} else {
				// Any other subscription
				props.disabled =
					this.subscription &&
					this.subscription.name === newSubscription.name &&
					!this.subscription.ends_at
			}

			// Clickable
			props.clickable = !props.disabled

			return props
		},

		async select () {
			this.selecting = true

			await this.$nextTick()

			// Scroll to subscriptions
			scrollIntoView(this.$refs.subscriptions, {
				offset: -100
			})
		},

		async onSubscriptionSelect (name) {
			// Save selected subscription
			this.model.subscription_name = name

			// Reset need for new billing and payment
			this.model.new_billing = false
			this.model.new_payment = false

			await this.$nextTick()

			// Scroll to controls
			scrollIntoView(this.$refs.controls, {
				offset: -100
			})
		},

		onCardChange ({ error }) {
			this.cardError = error ? error.message : null
		},

		validateAndContinue () {
			if (this.model.subscription_name === 'default') {
				// Default subscription doesn't ask for additional fields, so
				// it just continues
				this.submit()
			} else {
				this.validating = true

				try {
					// Validate
					this.$v.$touch()

					// Stop on validation errors
					if (this.$v.$error) { throw new Error('Validation failed.') }

					// Show confirm modal
					this.confirmModalOpen = true
				} catch (err) {
					this.$bvModal.msgBoxOk(
						this.$t('pages.user.venues.detail.plan.form_error'),
						{
							centered: true,
							headerTextVariant: 'danger',
							title: this.$t('common.status.error'),
							okTitle: this.$t('common.actions.close')
						}
					)
				} finally {
					this.validating = false
				}
			}
		},

		async cancelPending () {
			this.$store.commit('user-venue-detail/setSaving', true)

			try {
				// Cancel subscription
				await this.$axios.$post(`/user/venues/${this.venue.id}/subscription`, {
					subscription_name: null
				})

				// Refetch page data
				await this.fetch()
			} catch (err) {
				this.showSubmitError()
			} finally {
				this.$store.commit('user-venue-detail/setSaving', false)
			}
		},

		async submit () {
			this.$store.commit('user-venue-detail/setSaving', true)

			try {
				// Prepare payment method data in case the user needs a new one
				if (this.showPaymentForm) {
					const { setupIntent, error } = await handleCardSetup(
						this.paymentIntentSecret,
						{
							payment_method_data: {
								billing_details: {
									name: this.model.legal_name,
									address: {
										line1: this.model.address_line1,
										line2: this.model.address_line2,
										city: this.model.address_city,
										postal_code: this.model.address_postcode,
										country: this.model.country
									}
								}
							}
						}
					)

					if (error) { throw error }

					this.model.payment_method_id = setupIntent.payment_method
				}

				// Save
				const sentModel = extend({}, this.model)

				if (sentModel.subscription_name === 'default') {
					sentModel.subscription_name = null
				}

				const data = await this.$axios.$post(
					`/user/venues/${this.venue.id}/subscription`,
					sentModel
				)

				// Prepare notification
				let notifySettings

				if (data.subscription.payment_pending) {
					// Payment confirmation needed
					notifySettings = {
						title: this.$t(
							'pages.user.venues.detail.plan.subscription_confirm.title'
						),
						text: this.$t(
							'pages.user.venues.detail.plan.subscription_confirm.message'
						),
						duration: -1,
						type: 'warning'
					}
				} else if (data.subscription.ends_at) {
					// Subscribed -> Cancellation
					notifySettings = {
						title: this.$t(
							'pages.user.venues.detail.plan.cancellation_success.title'
						),
						text: this.$t(
							'pages.user.venues.detail.plan.cancellation_success.message',
							{
								date: this.$d(new Date(data.subscription.ends_at), 'extraLong')
							}
						),
						duration: -1,
						type: 'success'
					}
				} else {
					// New/modify subscription
					notifySettings = {
						title: this.$t(
							'pages.user.venues.detail.plan.subscription_success.title'
						),
						text: this.$t(
							'pages.user.venues.detail.plan.subscription_success.message',
							{
								date: this.$d(
									new Date(data.subscription.current_period_ends_at),
									'extraLong'
								)
							}
						),
						duration: -1,
						type: 'success'
					}
				}

				this.$notify(notifySettings)

				// Restore selection
				this.selecting = false

				// Refetch page data and user (in case its billing info has
				// changed)
				await this.fetch()
				await this.$auth.fetchUser()

				// Emit to reload venue
				this.$emit('submitted')
			} catch (err) {
				this.confirmModalOpen = false
				this.showSubmitError()
			} finally {
				this.$store.commit('user-venue-detail/setSaving', false)
			}
		},

		showSubmitError () {
			this.$bvModal.msgBoxOk(
				this.$t('pages.user.venues.detail.plan.submit_error'),
				{
					centered: true,
					headerTextVariant: 'danger',
					title: this.$t('common.status.error'),
					okTitle: this.$t('common.actions.close')
				}
			)
		}
	},

	head () {
		// Prevent double loading Stripe lib
		const loadStripe = process.server || (process.client && !window.Stripe)

		return {
			title: this.$t('pages.user.venues.detail.plan.title'),
			script: loadStripe ? [{ src: 'https://js.stripe.com/v3/' }] : null
		}
	},

	validations: {
		model: {
			legal_name: {
				required: requiredIf(function () {
					return !this.hasExistingBilling || this.model.new_billing
				})
			},
			address_line1: {
				required: requiredIf(function () {
					return !this.hasExistingBilling || this.model.new_billing
				})
			},
			address_city: {
				required: requiredIf(function () {
					return !this.hasExistingBilling || this.model.new_billing
				})
			},
			address_postcode: {
				required: requiredIf(function () {
					return !this.hasExistingBilling || this.model.new_billing
				})
			},
			address_region: {
				required: requiredIf(function () {
					return !this.hasExistingBilling || this.model.new_billing
				})
			},
			country: {
				required: requiredIf(function () {
					return !this.hasExistingBilling || this.model.new_billing
				})
			},
			vat_number: {
				required: requiredIf(function () {
					return !this.hasExistingBilling || this.model.new_billing
				})
			},
			/*
			payment_method_id: {
				required: requiredIf(function() {
					return !this.hasExistingPayment || this.model.new_payment
				})
			},
			*/
			card_holder_name: {
				required: requiredIf(function () {
					return !this.hasExistingPayment || this.model.new_payment
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.status-icon {
	border-radius: 50%;
	box-sizing: content-box;
	padding: 0.25rem;
	height: auto;
	margin-top: -0.15rem;
	margin-right: map-get($spacers, 2);
	flex-shrink: 0;
}
</style>

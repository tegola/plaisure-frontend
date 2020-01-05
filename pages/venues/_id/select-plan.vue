<template>
	<div class="pg-select-venue-plan-page">
		<pg-navbar variant="dark" />

		<div class="container my-5">
			<h2 class="h4">{{ $t('pages.venue_plan.title') }}</h2>
			<p>
				<nuxt-link :to="localePath({ name: 'venues-id-edit', params: { id: venue.id }})">
					<pg-icon icon="arrow-left" />
					<strong class="font-weight-bold">{{ venue.name }}</strong>
				</nuxt-link>
				<span class="text-muted">({{ address }})</span>
			</p>

			<!-- Payment alert -->
			<div v-if="needsPayment" class="row">
				<div class="col-lg-9 mx-lg-auto">
					<b-alert variant="warning" show class="mb-0">
						<h5>{{ $t('pages.venue_plan.needs_payment.title') }}</h5>
						<p>{{ $t('pages.venue_plan.needs_payment.line1') }}</p>
						<p>{{ $t('pages.venue_plan.needs_payment.line2') }}</p>
						<div class="text-center">
							<pg-button variant="warning" @click="cancelPending">{{ $t('pages.venue_plan.needs_payment.action') }}</pg-button>
						</div>
					</b-alert>
				</div>
			</div>

			<!-- Selection -->
			<div class="row my-5">
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

			<!-- Form -->
			<div v-if="model.subscription_name !== null" ref="controls" class="row">
				<div class="col-lg-7 mx-lg-auto">
					<!-- Back to default subscription -->
					<template v-if="model.subscription_name === 'default'">
						<p>{{ $t('pages.venue_plan.selected_free', { date: formatDate(venue.subscription.current_period_ends_at) }) }}</p>

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
								{{ $t('pages.venue_plan.cancel') }}
							</pg-button>
						</div>
					</template>

					<!-- All other subscriptions -->
					<template v-else>
						<p>
							{{ $t('pages.venue_plan.selected_paid') }}
							<template v-if="hasExistingBilling">{{ $t('pages.venue_plan.selected_paid_review_data') }}</template>
							<template v-else>{{ $t('pages.venue_plan.selected_paid_input_data') }}.</template>
						</p>

						<b-alert v-if="isResuming" show class="mx-md-n3">
							<i18n path="pages.venue_plan.resume">
								<strong slot="last_update_date">{{ formatDate(venue.subscription.updated_at) }}</strong>
								<strong slot="end_date">{{ formatDate(venue.subscription.ends_at) }}</strong>
							</i18n>
						</b-alert>

						<!-- Billing -->
						<div class="pt-4">
							<h5>{{ $t('pages.venue_plan.billing.title') }}</h5>
							<hr>
						</div>

						<template v-if="hasExistingBilling">
							<b-form-group>
								<b-form-radio v-model="model.new_billing" :value="false">
									{{ $t('pages.venue_plan.billing.current') }}
									<b-collapse id="existing-billing-collapse" :visible="!model.new_billing">
										<div class="pt-2 small">
											<div>{{ user.legal_name }}</div>
											<div>{{ user.address_line1 }}</div>
											<div v-if="user.address_line2">{{ user.address_line2 }}</div>
											<div>
												{{ user.address_city }},
												{{ user.address_region }},
												{{ user.address_postcode }},
												{{ user.country }}
											</div>
											<div>{{ $t('pages.venue_plan.billing.vat_number') }}: {{ user.vat_number }}</div>
										</div>
									</b-collapse>
								</b-form-radio>
							</b-form-group>
							<b-form-group>
								<b-form-radio v-model="model.new_billing" :value="true">
									{{ $t('pages.venue_plan.billing.new') }}
									<b-collapse id="new-billing-collapse" :visible="showNewBillingWarning">
										<div class="pt-2 small">
											<i18n path="pages.venue_plan.billing.new_warning.message">
												<strong slot="warning" class="text-danger">{{ $t('pages.venue_plan.billing.new_warning.warning') }}</strong>
											</i18n>
										</div>
									</b-collapse>
								</b-form-radio>
							</b-form-group>
						</template>

						<b-collapse id="new-billing-form" :visible="showBillingForm">
							<b-form-group
								:state="!$v.model.legal_name.$error"
								:label="$t('pages.venue_plan.billing.legal_name')"
								:invalid-feedback="$t('pages.venue_plan.billing.legal_name_error')">
								<b-form-input
									v-model="model.legal_name"
									type="text"
									autocomplete="organization"
									autofocus
								/>
							</b-form-group>
							<b-form-group
								:state="!$v.model.address_line1.$error"
								:label="$t('pages.venue_plan.billing.address')"
								:invalid-feedback="$t('pages.venue_plan.billing.address_error')">
								<b-form-input v-model="model.address_line1" type="text" autocomplete="address-line1" class="mb-2" />
								<b-form-input v-model="model.address_line2" type="text" autocomplete="address-line2" />
							</b-form-group>
							<div class="form-row">
								<div class="col-sm-4">
									<b-form-group
										:state="!$v.model.address_postcode.$error"
										:label="$t('pages.venue_plan.billing.postcode')"
										:invalid-feedback="$t('pages.venue_plan.billing.postcode_error')">
										<b-form-input v-model="model.address_postcode" type="text" autocomplete="postal-code" />
									</b-form-group>
								</div>
								<div class="col-sm-8">
									<b-form-group
										:state="!$v.model.address_city.$error"
										:label="$t('pages.venue_plan.billing.city')"
										:invalid-feedback="$t('pages.venue_plan.billing.city_error')">
										<b-form-input v-model="model.address_city" type="text" autocomplete="address-level2" />
									</b-form-group>
								</div>
							</div>
							<div class="form-row">
								<div class="col-sm">
									<b-form-group
										:state="!$v.model.address_region.$error"
										:label="$t('pages.venue_plan.billing.region')"
										:invalid-feedback="$t('pages.venue_plan.billing.region_error')">
										<b-form-input v-model="model.address_region" type="text" autocomplete="address-level1" />
									</b-form-group>
								</div>
								<div class="col-sm">
									<b-form-group
										:state="!$v.model.country.$error"
										:label="$t('pages.venue_plan.billing.country')"
										:invalid-feedback="$t('pages.venue_plan.billing.country_error')">
										<b-form-select v-model="model.country" :options="$countrySelectOptions" />
									</b-form-group>
								</div>
							</div>
							<b-form-group
								:state="!$v.model.vat_number.$error"
								:label="$t('pages.venue_plan.billing.vat_number')"
								:invalid-feedback="$t('pages.venue_plan.billing.vat_number_error')">
								<b-form-input v-model="model.vat_number" type="text" />
							</b-form-group>
						</b-collapse>

						<!-- Payment -->
						<div class="pt-4">
							<h5>{{ $t('pages.venue_plan.payment.title') }}</h5>
							<hr>
						</div>

						<template v-if="hasExistingPayment">
							<b-form-group>
								<b-form-radio v-model="model.new_payment" :value="false">
									{{ $t('pages.venue_plan.payment.current') }}
									<b-collapse id="existing-payment-collapse" :visible="!model.new_payment">
										<div class="pt-2 small">
											<div>{{ user.card_brand }} &bull;&bull;&bull;&bull; {{ user.card_last_four }}</div>
											<div>{{ user.card_holder_name }}</div>
											<div>{{ $t('pages.venue_plan.payment.card_expiration') }}: {{ user.card_expiry_month }}/{{ user.card_expiry_year }}</div>
										</div>
									</b-collapse>
								</b-form-radio>
							</b-form-group>
							<b-form-group>
								<b-form-radio v-model="model.new_payment" :value="true">
									{{ $t('pages.venue_plan.payment.new') }}
									<b-collapse id="new-payment-collapse" :visible="showNewPaymentWarning">
										<div class="pt-2 small">
											<i18n path="pages.venue_plan.payment.new_warning.message">
												<strong slot="warning" class="text-danger">{{ $t('pages.venue_plan.payment.new_warning.warning') }}</strong>
											</i18n>
										</div>
									</b-collapse>
								</b-form-radio>
							</b-form-group>
						</template>

						<b-collapse id="new-payment-form" :visible="showPaymentForm">
							<b-form-group
								:state="!cardError"
								:label="$t('pages.venue_plan.payment.card')"
								:invalid-feedback="cardError">
								<stripe-card
									:stripe="$constants.STRIPE_KEY"
									:options="stripeOptions"
									@change="onCardChange"
								/>
							</b-form-group>
							<b-form-group
								:state="!$v.model.card_holder_name.$error"
								:label="$t('pages.venue_plan.payment.card_holder_name')"
								:invalid-feedback="$t('pages.venue_plan.payment.card_holder_name_error')">
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
					hide-header-close
					no-close-on-backdrop
					:title="$t('pages.venue_plan.confirm.title')"
					@ok.prevent="submit">
					<i18n path="pages.venue_plan.confirm.paragraph1" tag="p">
						<span slot="confirm" class="font-weight-bold">{{ $t('pages.venue_plan.confirm.submit') }}</span>
						<span slot="name">{{ $constants.APP_NAME }}</span>
						<span slot="price">{{ selectedSubscription.formattedPrice }}</span>
						<span slot="currency">{{ selectedSubscription.currencySymbol }}</span>
					</i18n>
					<i18n path="pages.venue_plan.confirm.paragraph2" tag="p" class="small">
						<a slot="tos" href="#">{{ $t('pages.venue_plan.confirm.paragraph2_tos') }}</a>
						<a slot="privacy" href="#">{{ $t('pages.venue_plan.confirm.paragraph2_privacy') }}</a>
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
							{{ $t('pages.venue_plan.confirm.submit') }}
						</pg-button>
					</template>
				</b-modal>
			</div>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
import {
	BAlert,
	BFormGroup,
	BFormInput,
	BFormSelect,
	BFormRadio,
	BCollapse
} from 'bootstrap-vue'

import { validationMixin } from 'vuelidate'
import { requiredIf } from 'vuelidate/lib/validators'
import { getParamByParam } from 'iso-country-currency'
import extend from 'lodash/extend'
import { Card as StripeCard, handleCardSetup } from 'vue-stripe-elements-plus'
import { scrollIntoView } from '@/utilities'
import PgSubscriptionCard from '@/components/subscription-card'

export default {
	name: 'PgVenueSelectPlanPage',

	components: {
		BAlert,
		BFormGroup,
		BFormInput,
		BFormSelect,
		BFormRadio,
		BCollapse,
		PgSubscriptionCard,
		StripeCard
	},

	mixins: [validationMixin],

	data() {
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
			venue: null,
			paymentIntentSecret: null,
			validating: false,
			saving: false,
			stripeOptions,
			cardError: null,
			confirmModalOpen: false,
			model: {
				subscription_name: null,
				new_billing: false,
				legal_name: '',
				address_line1: '',
				address_line2: '',
				address_city: '',
				address_postcode: '',
				address_region: '',
				country: '',
				vat_number: '',
				new_payment: false,
				payment_method_id: null,
				card_holder_name: ''
			}
		}
	},

	computed: {
		user() {
			return this.$store.$auth.user
		},

		subscriptions() {
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

			return subscriptions.map(subscription => {
				const config = subscription.base

				if (subscription[this.venue.country]) {
					extend(config, subscription[this.venue.country])
				}

				return config
			})
		},

		needsPayment() {
			return this.venue.subscription && this.venue.subscription.needs_payment
		},

		isResuming() {
			return (
				this.venue.subscription &&
				this.venue.subscription.name === this.model.subscription_name &&
				this.venue.subscription.ends_at
			)
		},

		hasExistingBilling() {
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

		hasExistingPayment() {
			return !!this.user.card_brand
		},

		showBillingForm() {
			return !this.hasExistingBilling || this.model.new_billing
		},

		showPaymentForm() {
			return !this.hasExistingPayment || this.model.new_payment
		},

		showNewBillingWarning() {
			return (
				this.model.new_billing &&
				this.hasExistingBilling &&
				this.user.venue_ids.length > 1
			)
		},

		showNewPaymentWarning() {
			return (
				this.model.new_payment &&
				this.hasExistingPayment &&
				this.user.venue_ids.length > 1
			)
		},

		address() {
			if (!this.venue) return

			const a = this.venue.address

			return [a.line1, a.city].join(', ')
		},

		paymentMethodData() {
			return {
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
		},

		selectedSubscription() {
			let subscription = this.subscriptions.find(
				subscription => subscription.name === this.model.subscription_name
			)

			if (!subscription) return

			subscription = extend({}, subscription, {
				currencySymbol: getParamByParam(
					'currency',
					subscription.currency,
					'symbol'
				),
				// FIXME: usare vue i18n number formatter
				formattedPrice: subscription.price.toFixed(2).replace('.', ',')
			})

			return subscription
		}
	},

	watch: {
		user: {
			immediate: true,
			handler() {
				if (!this.user) return

				extend(this.model, {
					legal_name: this.user.legal_name,
					address_line1: this.user.address_line1,
					address_line2: this.user.address_line2,
					address_city: this.user.address_city,
					address_postcode: this.user.address_postcode,
					address_region: this.user.address_region,
					country: this.user.country,
					vat_number: this.user.vat_number
				})
			}
		}
	},

	asyncData({ $axios, params }) {
		return $axios.$get(`/venues/${params.id}/subscription`)
	},

	head() {
		return {
			title: this.$t('pages.venue_plan.title'),
			script: [{ src: 'https://js.stripe.com/v3/' }]
		}
	},

	validations: {
		model: {
			legal_name: {
				required: requiredIf(function() {
					return !this.hasExistingBilling || this.model.new_billing
				})
			},
			address_line1: {
				required: requiredIf(function() {
					return !this.hasExistingBilling || this.model.new_billing
				})
			},
			address_city: {
				required: requiredIf(function() {
					return !this.hasExistingBilling || this.model.new_billing
				})
			},
			address_postcode: {
				required: requiredIf(function() {
					return !this.hasExistingBilling || this.model.new_billing
				})
			},
			address_region: {
				required: requiredIf(function() {
					return !this.hasExistingBilling || this.model.new_billing
				})
			},
			country: {
				required: requiredIf(function() {
					return !this.hasExistingBilling || this.model.new_billing
				})
			},
			vat_number: {
				required: requiredIf(function() {
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
				required: requiredIf(function() {
					return !this.hasExistingPayment || this.model.new_payment
				})
			}
		}
	},

	methods: {
		formatDate(date) {
			if (!date) return

			// FIXME: usare i18n date formatter
			return new Date(date).toLocaleDateString(this.$i18n.isoCode, {
				day: 'numeric',
				month: '2-digit',
				year: 'numeric'
			})
		},

		propsForSubscription(newSubscription) {
			const currentSubscription = this.venue.subscription
			const props = {
				subscription: newSubscription,
				highlight: newSubscription.highlight,
				selected: this.model.subscription_name === newSubscription.name,
				clickable: true,
				disabled: false
			}

			// Disabled
			if (this.needsPayment) {
				// Current subscription needs payment, disable all subscriptions
				props.disabled = true
			} else if (newSubscription.name === 'default') {
				// Default subscription: disabled if there is no subscription
				// or if existing subscription is going to end because it has
				// already been cancelled
				props.disabled = !!(!currentSubscription || currentSubscription.ends_at)
			} else {
				// Any other subscription
				props.disabled =
					currentSubscription &&
					currentSubscription.name === newSubscription.name &&
					!currentSubscription.ends_at
			}

			// Clickable
			props.clickable = !props.disabled

			return props
		},

		async onSubscriptionSelect(name) {
			// Save selected subscription
			this.model.subscription_name = name

			// Reset need for new billing and payment
			this.model.new_billing = false
			this.model.new_payment = false

			await this.$nextTick()

			// Scroll to controls
			scrollIntoView(this.$refs.controls, {
				offset: -50
			})
		},

		onCardChange({ error }) {
			this.cardError = error ? error.message : null
		},

		validateAndContinue() {
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
					if (this.$v.$error) throw new Error()

					// Show confirm modal
					this.confirmModalOpen = true
				} catch (err) {
					this.$bvModal.msgBoxOk(this.$t('pages.venue_plan.form_error'), {
						centered: true,
						headerTextVariant: 'danger',
						title: this.$t('common.status.error'),
						okTitle: this.$t('common.actions.close')
					})
				} finally {
					this.validating = false
				}
			}
		},

		async cancelPending() {
			const url = `/venues/${this.venue.id}/subscription`

			this.saving = true

			try {
				// Cancel subscription
				await this.$axios.$post(`/venues/${this.venue.id}/subscription`, {
					subscription_name: null
				})

				// Reload page data (we can't call asyncData again)
				const data = await this.$axios.$get(url)

				this.venue = data.venue
				this.paymentIntentSecret = data.paymentIntentSecret
			} catch (err) {
				this.saving = false
				this.showSubmitError()
			}
		},

		async submit() {
			this.saving = true

			try {
				// Prepare payment method data in case the user needs a new one
				if (this.showPaymentForm) {
					const { setupIntent, error } = await handleCardSetup(
						this.paymentIntentSecret,
						this.paymentMethodData
					)

					if (error) throw error

					this.model.payment_method_id = setupIntent.payment_method
				}

				// Save
				const sentModel = extend({}, this.model)

				if (sentModel.subscription_name === 'default') {
					sentModel.subscription_name = null
				}

				const data = await this.$axios.$post(
					`/venues/${this.venue.id}/subscription`,
					sentModel
				)

				// Prepare notification
				let notifySettings
				const dateOptions = {
					weekday: 'long',
					day: 'numeric',
					month: 'long',
					year: 'numeric'
				}

				if (data.subscription.needs_payment) {
					// Payment confirmation needed
					notifySettings = {
						title: this.$t('pages.venue_plan.subscription_confirm.title'),
						text: this.$t('pages.venue_plan.subscription_confirm.message'),
						duration: -1,
						type: 'warning'
					}
				} else if (data.subscription.ends_at) {
					// Subscribed -> Cancellation
					const date = new Date(data.subscription.ends_at).toLocaleDateString(
						this.$i18n.isoCode,
						dateOptions
					)

					notifySettings = {
						title: this.$t('pages.venue_plan.cancellation_success.title'),
						text: this.$t('pages.venue_plan.cancellation_success.message', {
							date
						}),
						duration: -1,
						type: 'success'
					}
				} else {
					// New/modify subscription
					const date = new Date(
						data.subscription.current_period_ends_at
					).toLocaleDateString(this.$i18n.isoCode, dateOptions)

					notifySettings = {
						title: this.$t('pages.venue_plan.subscription_success.title'),
						text: this.$t('pages.venue_plan.subscription_success.message', {
							date
						}),
						duration: -1,
						type: 'success'
					}
				}

				this.$notify(notifySettings)

				// Reload user, in case its billing info has changed
				await this.$auth.fetchUser()

				// Back to venue detail
				this.$router.push(
					this.localePath({
						name: 'venues-id',
						params: { id: this.venue.id }
					})
				)
			} catch (err) {
				this.saving = false
				this.confirmModalOpen = false
				this.showSubmitError()
			}
		},

		showSubmitError() {
			this.$bvModal.msgBoxOk(this.$t('pages.venue_plan.submit_error'), {
				centered: true,
				headerTextVariant: 'danger',
				title: this.$t('common.status.error'),
				okTitle: this.$t('common.actions.close')
			})
		}
	}
}
</script>

<template>
	<div class="pg-select-venue-plan-page">
		<pg-navbar variant="dark" />

		<div v-if="loading || error" class="container d-flex text-muted text-center" style="height: 50vh">
			<div class="m-auto">
				<template v-if="loading">
					<pg-icon icon="circle-outline-notch" spinning />
					<h5 class="m-0">{{ $t('common.status.loading') }}&hellip;</h5>
				</template>
				<h4 v-if="error" class="text-danger mb-0">C'è stato un errore nel caricamento dei dati</h4>
			</div>
		</div>

		<template v-if="!loading && venue">
			<div class="container my-5">
				<h2 class="h4">{{ $t('Scegli abbonamento') }}</h2>
				<p>
					<nuxt-link :to="`/venues/${venue.id}/edit`">
						<pg-icon icon="arrow-left" />
						<strong class="font-weight-bold">{{ venue.name }}</strong>
					</nuxt-link>
					<span class="text-muted">({{ address }})</span>
				</p>

				<!-- Selection -->
				<div class="row my-5">
					<div
						v-for="subscription in subscriptions"
						:key="subscription.name"
						class="col-md-4 d-flex">
						<pg-subscription-card
							:subscription="subscription"
							:selected="isSubscriptionSelected(subscription)"
							:last-update-date="lastUpdateDateForSubscription(subscription)"
							:end-date="endDateForSubscription(subscription)"
							clickable
							class="flex-fill mb-3 mb-md-0"
							@select="onSubscriptionSelect(subscription.name)"
						/>
					</div>
				</div>

				<!-- Form -->
				<div v-if="hasNewSubscription" ref="controls" class="row">
					<div class="col-lg-7 mx-lg-auto">
						<!-- Back to default subscription -->
						<template v-if="model.subscription_name == 'default'">
							<p>Hai scelto l'abbonamento gratuito. Questo annullerà il rinnovo mensile e non ti verrà addebitato nessun altro costo. L'attuale abbonamento rimarrà comunque attivo fino allo scadere del periodo già pagato.</p>
						</template>

						<!-- All other subscriptions -->
						<template v-else>
							<p>
								Hai scelto un abbonamento a pagamento.
								<template v-if="!hasExistingBilling">Inserisci qui di seguito le tue informazioni di fatturazione e pagamento.</template>
								<template v-if="hasExistingBilling">Assicurati che le tue informazioni di fatturazione e pagamento siano corretti.</template>
							</p>

							<!-- Billing -->
							<div class="pt-4">
								<h5>{{ $t('pages.venue_plan.billing.title') }}</h5>
								<hr>
							</div>

							<template v-if="hasExistingBilling">
								<b-form-group>
									<b-radio v-model="model.new_billing" :value="false">
										Indirizzo registrato
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
												<div>P. IVA: {{ user.vat_number }}</div>
											</div>
										</b-collapse>
									</b-radio>
								</b-form-group>
								<b-form-group>
									<b-radio v-model="model.new_billing" :value="true">
										Nuovo indirizzo di fatturazione
										<b-collapse id="new-billing-collapse" :visible="showNewBillingWarning">
											<div class="pt-2 small">
												<strong class="text-danger">Attenzione:</strong> se hai abbonamenti attivi sulle altre attività, esse verranno aggiornate le nuove informazioni di fatturazione.
											</div>
										</b-collapse>
									</b-radio>
								</b-form-group>
							</template>

							<b-collapse id="new-billing-form" :visible="showBillingForm">
								<b-form-group
									:state="!$v.model.legal_name.$error"
									:label="$t('pages.venue_plan.billing.legal_name')"
									:invalid-feedback="$t('pages.venue_plan.billing.legal_name_error')">
									<b-input
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
									<b-input v-model="model.address_line1" type="text" autocomplete="address-line1" class="mb-2" />
									<b-input v-model="model.address_line2" type="text" autocomplete="address-line2" />
								</b-form-group>
								<div class="form-row">
									<div class="col-sm-4">
										<b-form-group
											:state="!$v.model.address_postcode.$error"
											:label="$t('pages.venue_plan.billing.postcode')"
											:invalid-feedback="$t('pages.venue_plan.billing.postcode_error')">
											<b-input v-model="model.address_postcode" type="text" autocomplete="postal-code" />
										</b-form-group>
									</div>
									<div class="col-sm-8">
										<b-form-group
											:state="!$v.model.address_city.$error"
											:label="$t('pages.venue_plan.billing.city')"
											:invalid-feedback="$t('pages.venue_plan.billing.city_error')">
											<b-input v-model="model.address_city" type="text" autocomplete="address-level2" />
										</b-form-group>
									</div>
								</div>
								<div class="form-row">
									<div class="col-sm">
										<b-form-group
											:state="!$v.model.address_region.$error"
											:label="$t('pages.venue_plan.billing.region')"
											:invalid-feedback="$t('pages.venue_plan.billing.region_error')">
											<b-input v-model="model.address_region" type="text" autocomplete="address-level1" />
										</b-form-group>
									</div>
									<div class="col-sm">
										<b-form-group
											:state="!$v.model.country.$error"
											:label="$t('pages.venue_plan.billing.country')"
											:invalid-feedback="$t('pages.venue_plan.billing.country_error')">
											<b-select v-model="model.country" :options="$countrySelectOptions" />
										</b-form-group>
									</div>
								</div>
								<b-form-group
									:state="!$v.model.vat_number.$error"
									:label="$t('pages.venue_plan.billing.vat_number')"
									:invalid-feedback="$t('pages.venue_plan.billing.vat_number_error')">
									<b-input v-model="model.vat_number" type="text" />
								</b-form-group>
							</b-collapse>

							<!-- Payment -->
							<div class="pt-4">
								<h5>Pagamento</h5>
								<hr>
							</div>

							<template v-if="hasExistingPayment">
								<b-form-group>
									<b-radio v-model="model.new_payment" :value="false">
										Carta di credito registrata
										<b-collapse id="existing-payment-collapse" :visible="!model.new_payment">
											<div class="pt-2 small">
												<div>{{ user.card_brand }} &bull;&bull;&bull;&bull; {{ user.card_last_four }}</div>
												<div>{{ user.card_holder_name }}</div>
												<div>Scadenza: {{ user.card_expiry_month }}/{{ user.card_expiry_year }}</div>
											</div>
										</b-collapse>
									</b-radio>
								</b-form-group>
								<b-form-group>
									<b-radio v-model="model.new_payment" :value="true">
										Nuova carta di credito
										<b-collapse id="new-payment-collapse" :visible="showNewPaymentWarning">
											<div class="pt-2 small">
												<strong class="text-danger">Attenzione:</strong> se hai abbonamenti attivi sulle altre attività, esse verranno aggiornate con le nuove informazioni di pagamento.
											</div>
										</b-collapse>
									</b-radio>
								</b-form-group>
							</template>

							<b-collapse id="new-payment-form" :visible="showPaymentForm">
								<b-form-group
									:state="!cardError"
									:label="$t('Carta di credito')"
									:invalid-feedback="cardError">
									<stripe-card
										:stripe="$constants.STRIPE_KEY"
										:options="stripeOptions"
										@change="onCardChange"
									/>
								</b-form-group>
								<b-form-group
									:state="!$v.model.card_holder_name.$error"
									:label="$t('Nome e cognome intestatario')"
									:invalid-feedback="$t('Inserisci il nome dell\'intestatario come mostrato sulla carta')">
									<b-input v-model="model.card_holder_name" type="text" autocomplete="cc-name" />
								</b-form-group>
							</b-collapse>

							<p class="small">Stai per attivare un abbonamento costante. Se fai clic su "Conferma abbonamento", autorizzi {{ $constants.APP_NAME }} ad addebitarti mensilmente il costo dell'abbonamento (attualmente pari a 1,99 €/mese). Puoi annullare l'abbonamento in qualsiasi momento. Ulteriori informazioni.</p>
							<p class="small">Se fai clic su "Conferma abbonamento" accetti i Termini di servizio di {{ $constants.APP_NAME }} l'Informativa sulla privacy. Accetti inoltre che il tuo acquisto sarà subito disponibile e di rinunciare al diritto di recesso previsto dalla legge (ad eccezione dei servizi).</p>
						</template>

						<!-- Confirm change -->
						<div class="text-right">
							<pg-button
								:loading="saving"
								:block="$mq == 'xs' || $mq == 'constrained'"
								variant="primary"
								@click="submit">
								{{ model.subscription_name === 'default' ? $t('Disattiva abbonamento') : $t('Conferma abbonamento') }}
							</pg-button>
						</div>
					</div>
				</div>
			</div>
		</template>

		<pg-page-footer />
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { requiredIf } from 'vuelidate/lib/validators'
import scrollIntoView from '@/utilities/scroll-into-view'
import extend from 'lodash/extend'
import BFormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import BInput from 'bootstrap-vue/es/components/form-input/form-input'
import BSelect from 'bootstrap-vue/es/components/form-select/form-select'
import BRadio from 'bootstrap-vue/es/components/form-radio/form-radio'
import BCollapse from 'bootstrap-vue/es/components/collapse/collapse'
import PgButton from '@/components/button'
import PgSubscriptionCard from '@/components/subscription-card'
import { Card as StripeCard, createToken } from 'vue-stripe-elements-plus'
import subscriptions from './subscriptions'

export default {
	name: 'PgVenueSelectPlanPage',

	components: {
		BFormGroup,
		BInput,
		BSelect,
		BRadio,
		BCollapse,
		PgButton,
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
			loading: false,
			error: false,
			saving: false,
			stripeOptions,
			cardError: null,
			subscriptions: subscriptions[this.$i18n.region],
			model: {
				subscription_name: '',
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
				token_id: null,
				card_holder_name: ''
			}
		}
	},

	computed: {
		user() {
			return this.$store.$auth.user
		},

		hasNewSubscription() {
			return (
				this.model.subscription_name &&
				this.model.subscription_name !== this.venue.subscription.name
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
			return Boolean(this.user.card_brand)
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
				this.user.venue_ids.length === 1
			)
		},

		showNewPaymentWarning() {
			return (
				this.model.new_payment &&
				this.hasExistingPayment &&
				this.user.venue_ids.length === 1
			)
		},

		address() {
			if (!this.venue) return

			const a = this.venue.address

			return [a.line1, a.city].join(', ')
		},

		stripeTokenData() {
			if (!this.user) return

			return {
				name: this.model.card_holder_name,
				address_line1: this.user.address_line1,
				address_line2: this.user.address_line2,
				address_city: this.user.address_city,
				address_postal_code: this.user.address_postcode,
				country: this.user.country
			}
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
		return $axios.$get(`/venues/${params.id}/edit`)
	},

	head() {
		return {
			title:
				this.venue && this.venue.id
					? this.$t('pages.venue_form.title.edit')
					: this.$t('pages.venue_form.title.add')
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
			token_id: {
				required: requiredIf(function() {
					return !this.hasExistingPayment || this.model.new_payment
				})
			},
			card_holder_name: {
				required: requiredIf(function() {
					return !this.hasExistingPayment || this.model.new_payment
				})
			}
		}
	},

	methods: {
		isSubscriptionSelected(subscription) {
			const current = this.venue.subscription

			if (this.model.subscription_name) {
				return subscription.name === this.model.subscription_name
			} else if (current) {
				return subscription.name === current.name
			}
		},

		lastUpdateDateForSubscription(subscription) {
			const current = this.venue.subscription

			return subscription.name !== 'default' &&
				subscription.name === current.name &&
				current.updated_at
				? current.updated_at
				: null
		},

		endDateForSubscription(subscription) {
			const current = this.venue.subscription

			return subscription.name !== 'default' &&
				subscription.name === current.name &&
				current.ends_at
				? current.ends_at
				: null
		},

		async onSubscriptionSelect(name) {
			this.model.subscription_name = name

			// Reset need for new billing and payment
			this.model.new_billing = false
			this.model.new_payment = false

			// Stop if it's not a new subscription
			if (!this.hasNewSubscription) return

			await this.$nextTick()

			// Scroll to controls
			scrollIntoView(this.$refs.controls, {
				offset: -50
			})
		},

		onCardChange({ error }) {
			this.cardError = error ? error.message : null
		},

		prepareToken() {
			return new Promise((resolve, reject) => {
				// No payment form, just return
				if (!this.showPaymentForm) resolve()

				// Billing form visible, create the token for storing the
				// new credit card
				createToken(this.stripeTokenData).then(({ token, error }) => {
					// Error
					if (error) return reject(error)

					// Success, store token id
					this.model.token_id = token.id
					resolve()
				})
			})
		},

		async submit() {
			// FIXME: Tradurre il messaggio d'errore
			const msg =
				"C'è stato un errore nel tentativo di effettuare il pagamento. Ti preghiamo di riprovare più tardi."

			this.saving = true

			// Before checking for errors, we need to be sure that we get the
			// token for registering the new credit card
			try {
				await this.prepareToken()

				// Validate
				this.$v.$touch()

				// Stop on validation errors
				if (this.$v.$error) {
					this.saving = false
					return
				}

				// Save subscription
				try {
					await this.$axios.post(
						`/venues/${this.venue.id}/subscribe`,
						this.model
					)

					// FIXME: Add notification of saved subscription

					// Back to venue detail
					this.$router.push(`/venues/${this.venue.id}`)
				} catch (err) {
					alert(msg)
					this.saving = false
				}
			} catch (err) {
				this.saving = false
				alert(msg)
			}
		}
	}
}
</script>

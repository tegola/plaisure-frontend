<template>
	<div>
		<pg-navbar variant="dark" />

		<div class="container my-5">
			<pg-breadcrumb :items="breadcrumbItems" />

			<div class="row">
				<div class="mx-md-auto col-md-8 col-lg-6">
					<h1 class="h4">{{ $t('pages.user.billing.title') }}</h1>
					<p class="text-muted">{{ $t('pages.user.billing.intro') }}</p>

					<form method="post" class="mt-4" @submit.prevent="submit">
						<b-form-group
							:state="!$v.model.legal_name.$error"
							:label="$t('pages.user.billing.legal_name')"
							:invalid-feedback="$t('pages.user.billing.legal_name_error')">
							<b-form-input v-model="model.legal_name" type="text" autocomplete="organization" />
						</b-form-group>
						<b-form-group
							:state="!$v.model.address_line1.$error"
							:label="$t('pages.user.billing.address')"
							:invalid-feedback="$t('pages.user.billing.address_error')">
							<b-form-input v-model="model.address_line1" type="text" autocomplete="address-line1" class="mb-2" />
							<b-form-input v-model="model.address_line2" type="text" autocomplete="address-line2" />
						</b-form-group>
						<div class="form-row">
							<div class="col-sm-4">
								<b-form-group
									:state="!$v.model.address_postcode.$error"
									:label="$t('pages.user.billing.postcode')"
									:invalid-feedback="$t('pages.user.billing.postcode_error')">
									<b-form-input v-model="model.address_postcode" type="text" autocomplete="postal-code" />
								</b-form-group>
							</div>
							<div class="col-sm-8">
								<b-form-group
									:state="!$v.model.address_city.$error"
									:label="$t('pages.user.billing.city')"
									:invalid-feedback="$t('pages.user.billing.city_error')">
									<b-form-input v-model="model.address_city" type="text" autocomplete="address-level2" />
								</b-form-group>
							</div>
						</div>
						<div class="form-row">
							<div class="col-sm">
								<b-form-group
									:state="!$v.model.address_region.$error"
									:label="$t('pages.user.billing.region')"
									:invalid-feedback="$t('pages.user.billing.region_error')">
									<b-form-input v-model="model.address_region" type="text" autocomplete="address-level1" />
								</b-form-group>
							</div>
							<div class="col-sm">
								<b-form-group
									:state="!$v.model.country.$error"
									:label="$t('pages.user.billing.country')"
									:invalid-feedback="$t('pages.user.billing.country_error')">
									<b-form-select v-model="model.country" :options="$countrySelectOptions" />
								</b-form-group>
							</div>
						</div>
						<b-form-group
							:state="!$v.model.vat_number.$error"
							:label="$t('pages.user.billing.vat_number')"
							:invalid-feedback="$t('pages.user.billing.vat_number_error')">
							<b-form-input v-model="model.vat_number" type="text" />
						</b-form-group>

						<div class="mt-4 text-right">
							<pg-button
								:loading="loading"
								type="submit"
								variant="primary">
								{{ $t('common.actions.save') }}
							</pg-button>
						</div>
					</form>
				</div>
			</div>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
import { BFormGroup, BFormInput, BFormSelect } from 'bootstrap-vue'
import { validationMixin } from 'vuelidate'
import { requiredIf } from 'vuelidate/lib/validators'

export default {
	name: 'PgUserBillingPage',

	components: {
		BFormGroup,
		BFormInput,
		BFormSelect
	},

	middleware: 'auth',

	mixins: [validationMixin],

	data() {
		return {
			loading: false,
			model: {}
		}
	},

	computed: {
		breadcrumbItems() {
			return [
				{
					text: this.$t('pages.user.index.title'),
					to: this.localePath('user')
				},
				{
					text: this.$t('pages.user.billing.title'),
					active: true
				}
			]
		},

		hasAnyLegalField() {
			const m = this.model
			const hasAny = [
				m.legal_name,
				m.address_line1,
				m.address_line2,
				m.address_city,
				m.address_postcode,
				m.address_region,
				m.country,
				m.vat_number
			].some(item => item)

			return hasAny
		}
	},

	async asyncData({ $axios }) {
		const data = await $axios.$get('/user/edit')
		const user = data.data

		return {
			model: {
				locale: user.locale,
				legal_name: user.legal_name,
				address_line1: user.address_line1,
				address_line2: user.address_line2,
				address_city: user.address_city,
				address_postcode: user.address_postcode,
				address_region: user.address_region,
				country: user.country,
				vat_number: user.vat_number
			}
		}
	},

	head() {
		return {
			title: this.$t('pages.user.billing.title')
		}
	},

	validations: {
		model: {
			legal_name: {
				required: requiredIf(function() {
					return this.hasAnyLegalField
				})
			},
			address_line1: {
				required: requiredIf(function() {
					return this.hasAnyLegalField
				})
			},
			address_city: {
				required: requiredIf(function() {
					return this.hasAnyLegalField
				})
			},
			address_postcode: {
				required: requiredIf(function() {
					return this.hasAnyLegalField
				})
			},
			address_region: {
				required: requiredIf(function() {
					return this.hasAnyLegalField
				})
			},
			country: {
				required: requiredIf(function() {
					return this.hasAnyLegalField
				})
			},
			vat_number: {
				required: requiredIf(function() {
					return this.hasAnyLegalField
				})
			}
		}
	},

	methods: {
		async submit() {
			// Validate
			this.$v.$touch()

			// Stop if there are errors
			if (this.$v.$error) return

			this.loading = true

			try {
				await this.$axios.post('/user/billing', this.model)
				await this.$auth.fetchUser()

				// Notify of success
				this.$notify({
					title: this.$t('pages.user.billing.submit_success_title'),
					text: this.$t('pages.user.billing.submit_success_text'),
					type: 'success'
				})

				// Back to user page
				this.$router.push(this.localePath('user'))
			} catch (err) {
				this.$bvModal.msgBoxOk(this.$t('common.status.save_error'), {
					centered: true,
					headerTextVariant: 'danger',
					title: this.$t('common.status.error'),
					okTitle: this.$t('common.actions.close'),
					okVariant: 'danger'
				})
			} finally {
				this.loading = false
			}
		}
	}
}
</script>

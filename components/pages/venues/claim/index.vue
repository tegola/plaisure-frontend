<template>
	<div class="ap-claim-venue-page">
		<pg-navbar variant="dark" />

		<div class="container my-5">
			<div class="row">
				<div class="col-md-8">
					<h3>{{ $t('pages.venue_claim.title') }}</h3>
					<p>{{ $t('pages.venue_claim.intro') }}</p>

					<pg-venue-claim-page-item v-if="venue" :venue="venue" />

					<form v-if="codeRequired" @submit.prevent="submit">
						<p>{{ $t('pages.venue_claim.continue_code') }}</p>

						<div class="row">
							<div class="col-sm">
								<b-form-group
									:state="!$v.model.code.$error"
									:label="$t('pages.venue_claim.code')"
									:invalid-feedback="$t('pages.venue_claim.code_error')"
									label-sr-only>
									<b-form-input
										ref="input"
										v-model.trim="model.code"
										:placeholder="$t('pages.venue_claim.code_placeholder')"
										autocomplete="off"
										autofocus
									/>
								</b-form-group>
							</div>
							<div class="col-sm-auto">
								<pg-button
									:loading="saving"
									type="submit"
									variant="primary"
									icon="arrow-right"
									icon-position="right"
									block>
									{{ $t('pages.venue_claim.submit') }}
								</pg-button>
							</div>
						</div>
					</form>

					<div v-else class="row align-items-center">
						<div class="col-sm">
							<p>{{ $t('pages.venue_claim.continue_nocode') }}</p>
						</div>
						<div class="col-sm-auto">
							<pg-button
								:loading="saving"
								variant="primary"
								icon="arrow-right"
								icon-position="right"
								@click="submit">
								{{ $t('pages.venue_claim.submit') }}
							</pg-button>
						</div>
					</div>

					<hr class="mt-4">

					<nuxt-link :to="localePath({ name: 'venues-id', params: { id: venue.id }})">{{ $t('pages.venue_claim.back') }}</nuxt-link>
				</div>

				<div class="col-md-4 mt-4 mt-md-0">
					<div class="card border-accent">
						<div class="card-body">
							<h5 class="card-title text-accent">{{ $t('pages.venue_claim.infobox.title') }}</h5>
							<p class="card-text">{{ $t('pages.venue_claim.infobox.body') }}</p>
							<p class="card-text font-weight-semibold">
								<nuxt-link :to="localePath('promote')" class="text-accent">
									{{ $t('pages.venue_claim.infobox.action') }}
									<pg-icon icon="arrow-right" />
								</nuxt-link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { requiredIf } from 'vuelidate/lib/validators'
import { BFormGroup, BFormInput } from 'bootstrap-vue'
import PgVenueClaimPageItem from './item'

export default {
	name: 'PgVenueClaimPage',

	middleware: 'auth',

	components: {
		BFormGroup,
		BFormInput,
		PgVenueClaimPageItem
	},

	mixins: [validationMixin],

	data() {
		return {
			saving: false,
			error: false,
			venue: null,
			codeRequired: false,
			model: {
				code: ''
			}
		}
	},

	computed: {
		address() {
			const a = this.venue.address

			return [[a.line1, a.line2].join(', '), a.city].join(', ')
		}
	},

	asyncData({ $axios, params }) {
		return $axios.$get(`/venues/${params.id}/claim`)
	},

	head() {
		if (!this.venue) return

		return {
			title: this.$t('pages.venue_claim.meta_title', {
				name: this.venue.name
			})
		}
	},

	validations: {
		model: {
			code: {
				required: requiredIf(function() {
					return this.codeRequired
				})
			}
		}
	},

	methods: {
		async submit() {
			// Validate
			this.$v.$touch()

			// Stop on validation errors
			if (this.$v.$error) {
				this.$refs.input.focus()
				return
			}

			this.saving = true

			try {
				await this.$axios.post(`/venues/${this.venue.id}/claim`, this.model)

				// Reload user data, including venue count
				await this.$auth.fetchUser()

				// Go to user page
				this.$router.replace(this.localePath('user'))
			} catch (err) {
				this.saving = false
				this.$refs.input.focus()
				alert(this.$t('pages.venue_claim.submit_error'))
			}
		}
	}
}
</script>

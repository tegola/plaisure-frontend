<template>
	<div>
		<pg-navbar />

		<div class="container my-5">
			<div class="text-center mb-5">
				<h2 :class="$mq === 'xs' || $mq === 'sm' ? 'h4' : null">
					{{ $t('pages.reset_password.title') }}
				</h2>
				<p class="text-muted" :class="$mq === 'md' || $mq === 'lg' || $mq === 'xl' ? 'lead' : null">
					{{ $t('pages.reset_password.intro') }}
				</p>
			</div>

			<div class="row">
				<div class="ml-md-auto mr-md-auto col-md-6 col-xl-4">
					<form @submit.prevent="submit">
						<p v-if="error" class="text-danger text-center">{{ $t('pages.reset_password.submit_error') }}</p>

						<b-form-group
							:label="$t('pages.reset_password.email')"
							:state="!$v.model.email.$error"
							:invalid-feedback="$t('pages.reset_password.email_error')">
							<b-form-input :value="model.email" type="email" plaintext readonly />
						</b-form-group>

						<b-form-group
							:label="$t('pages.reset_password.password')"
							:state="!$v.model.password.$error"
							:invalid-feedback="$t('pages.reset_password.password_error')">
							<b-form-input v-model="model.password" :disabled="loading" type="password" autofocus />
						</b-form-group>

						<b-form-group
							:label="$t('pages.reset_password.password_confirmation')"
							:state="!$v.model.password_confirmation.$error"
							:invalid-feedback="$t('pages.reset_password.password_confirmation_error')">
							<b-form-input v-model="model.password_confirmation" :disabled="loading" type="password" />
						</b-form-group>

						<b-form-group>
							<pg-button
								:loading="loading"
								type="submit"
								variant="primary"
								block>
								{{ $t('pages.reset_password.submit') }}
							</pg-button>
						</b-form-group>
					</form>
				</div>
			</div>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
import { BFormGroup, BFormInput } from 'bootstrap-vue'
import { validationMixin } from 'vuelidate'
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'

export default {
	name: 'PgResetPasswordPage',

	middleware: 'guest',

	components: {
		BFormGroup,
		BFormInput
	},

	mixins: [validationMixin],

	asyncData ({ query }) {
		return {
			model: {
				token: query.token,
				email: query.email
			}
		}
	},

	data () {
		return {
			loading: false,
			error: false,
			model: {
				token: '',
				email: '',
				password: '',
				password_confirmation: ''
			}
		}
	},

	validate ({ query }) {
		return query.token && query.email
	},

	validations: {
		model: {
			email: {
				email,
				required
			},
			password: {
				required,
				minLength: minLength(8)
			},
			password_confirmation: {
				sameAsPassword: sameAs('password')
			}
		}
	},

	methods: {
		async submit () {
			// Validate
			this.$v.$touch()

			// Stop on validation errors
			if (this.$v.$error) { return }

			this.loading = true

			try {
				await this.$axios.post('/auth/password/reset', this.model)

				// Login and go back to home
				await this.$auth.loginWith('local', {
					data: {
						email: this.model.email,
						password: this.model.password
					}
				})

				// Go to the next page
				this.$router.push(this.localePath('index'))
			} catch (err) {
				this.error = true
				this.loading = false
			}
		}
	},

	head () {
		return {
			title: this.$t('pages.reset_password.title')
		}
	}
}
</script>

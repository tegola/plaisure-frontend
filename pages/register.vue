<template>
	<div>
		<pg-navbar />

		<div class="container my-5">
			<div class="text-center mb-5">
				<h2>{{ $t('pages.register.title', { name: $constants.APP_NAME }) }}</h2>
				<p class="lead text-muted">{{ $t('pages.register.intro') }}</p>
			</div>

			<div class="row">
				<div class="ml-md-auto mr-md-auto col-md-6 col-xl-4">
					<form @submit.prevent="submit">
						<b-form-group
							:label="$t('pages.register.name')"
							:state="!$v.model.name.$error"
							:invalid-feedback="$t('pages.register.name_error')">
							<b-input v-model="model.name" type="text" autofocus />
						</b-form-group>

						<b-form-group
							:label="$t('pages.register.email')"
							:state="!$v.model.email.$error"
							:invalid-feedback="$t('pages.register.email_error')">
							<b-input ref="emailInput" v-model="model.email" type="email" />
						</b-form-group>

						<b-form-group
							:label="$t('pages.register.password')"
							:state="!$v.model.password.$error"
							:invalid-feedback="$t('pages.register.password_error')">
							<b-input v-model="model.password" type="password" />
						</b-form-group>

						<i18n tag="p" class="small text-muted" path="pages.register.agree1">
							<a href="#" place="terms_link">{{ $t('pages.register.agree2') }}</a>
							<a href="#" place="privacy_link">{{ $t('pages.register.agree3') }}</a>
						</i18n>

						<b-form-group>
							<pg-button
								:loading="loading"
								type="submit"
								variant="primary"
								block>
								{{ $t('pages.register.submit') }}
							</pg-button>
						</b-form-group>

						<p class="text-center">
							<i18n path="pages.register.login1">
								<span place="link">
									<nuxt-link to="/login">{{ $t('pages.register.login2') }}</nuxt-link>
								</span>
							</i18n>
						</p>
					</form>
				</div>
			</div>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
import BFormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import BInput from 'bootstrap-vue/es/components/form-input/form-input'
import PgButton from '@/components/button'
import { validationMixin } from 'vuelidate'
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
	name: 'PgRegisterPage',

	middleware: 'redirect-if-authenticated',

	components: {
		BFormGroup,
		BInput,
		PgButton
	},

	mixins: [validationMixin],

	data() {
		return {
			loading: false,
			model: {
				name: '',
				email: '',
				password: ''
			}
		}
	},

	head() {
		return {
			title: this.$t('pages.register.meta_title')
		}
	},

	validations: {
		model: {
			name: {
				required
			},
			email: {
				email,
				required
			},
			password: {
				required,
				minLength: minLength(8)
			}
		}
	},

	methods: {
		async submit() {
			// Validate
			this.$v.$touch()

			// Stop on validation errors
			if (this.$v.$error) return

			this.loading = true

			try {
				await this.$axios.post('/auth/register', this.model)

				// Login
				await this.$auth.loginWith('local', {
					data: {
						email: this.model.email,
						password: this.model.password
					}
				})

				// Go to the next page
				const redirect = this.$auth.$storage.getUniversal('redirect')
				this.$auth.$storage.setUniversal('redirect', null)

				this.$router.push(redirect || '/')
			} catch (err) {
				const data = err.response.data

				if (data.errors.email) {
					this.$refs.emailInput.focus()
					alert(this.$t('pages.register.submit_error'))
				}
			} finally {
				this.loading = false
			}
		}
	}
}
</script>

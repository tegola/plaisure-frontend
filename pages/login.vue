<template>
	<div>
		<pg-navbar />

		<div class="container my-5">
			<div class="text-center mb-5">
				<h2 :class="$mq === 'xs' || $mq === 'sm' ? 'h4' : null">
					{{ $t('pages.login.title') }}
				</h2>
				<p class="text-muted" :class="$mq === 'md' || $mq === 'lg' || $mq === 'xl' ? 'lead' : null">
					{{ $t('pages.login.intro', { name: $constants.APP_NAME }) }}
				</p>
			</div>

			<div class="row">
				<div class="ml-md-auto mr-md-auto col-md-6 col-xl-4">
					<form @submit.prevent="submit">
						<p v-if="error" class="text-danger text-center">{{ $t('pages.login.submit_error') }}</p>
						<b-form-group
							:label="$t('pages.login.email')"
							:state="!$v.model.email.$error"
							:invalid-feedback="$t('pages.login.email_error')">
							<b-form-input v-model="model.email" :disabled="loading" type="email" autofocus />
						</b-form-group>

						<b-form-group
							:label="$t('pages.login.password')"
							:state="!$v.model.password.$error"
							:invalid-feedback="$t('pages.login.password_error')">
							<b-form-input v-model="model.password" :disabled="loading" type="password" />
						</b-form-group>

						<b-form-group>
							<pg-button
								:loading="loading"
								type="submit"
								variant="primary"
								block>
								{{ $t('pages.login.submit') }}
							</pg-button>
						</b-form-group>

						<p class="text-center">
							<nuxt-link :to="localePath('password-forgot')">{{ $t('pages.login.forgot') }}</nuxt-link><br>
							<i18n path="pages.login.register1">
								<nuxt-link slot="link" :to="localePath('register')">{{ $t('pages.login.register2') }}</nuxt-link>
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
import { BFormGroup, BFormInput } from 'bootstrap-vue'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'

export default {
	name: 'PgLoginPage',

	middleware: 'guest',

	components: {
		BFormGroup,
		BFormInput
	},

	mixins: [validationMixin],

	data() {
		return {
			loading: false,
			error: false,
			model: {
				email: '',
				password: ''
			}
		}
	},

	head() {
		return {
			title: this.$t('pages.login.meta_title')
		}
	},

	validations: {
		model: {
			email: {
				email,
				required
			},
			password: {
				required
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
				await this.$auth.loginWith('local', {
					data: this.model
				})

				// Go to the next page
				const redirect =
					this.$route.query.redirect ||
					this.$auth.$storage.getUniversal('redirect')

				this.$auth.$storage.setUniversal('redirect', null)

				if (redirect) this.$router.push(redirect)
			} catch (err) {
				this.loading = false
				this.error = true
			}
		}
	}
}
</script>

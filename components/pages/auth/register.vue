<template>
	<div>
		<pg-navbar />

		<div class="container my-5">
			<div class="text-center mb-5">
				<h2 :class="$mq === 'xs' || $mq === 'constrained' ? 'h4' : null">
					{{ $t(asOwner ? 'pages.register.owner.title' : 'pages.register.user.title', { name: $constants.APP_NAME }) }}
				</h2>
				<p class="text-muted" :class="$mq === 'comfortable' ? 'lead' : null">
					{{ $t(asOwner ? 'pages.register.owner.intro' : 'pages.register.user.intro') }}
				</p>
			</div>

			<div class="row">
				<div class="ml-md-auto mr-md-auto col-md-6 col-xl-4">
					<form @submit.prevent="submit">
						<b-form-group
							:label="$t('pages.register.name')"
							:state="!$v.model.name.$error"
							:invalid-feedback="$t('pages.register.name_error')">
							<b-form-input v-model="model.name" type="text" autofocus />
						</b-form-group>

						<b-form-group
							:label="$t('pages.register.email')"
							:state="!$v.model.email.$error"
							:invalid-feedback="$t('pages.register.email_error')">
							<b-form-input ref="emailInput" v-model="model.email" type="email" />
						</b-form-group>

						<b-form-group
							:label="$t('pages.register.password')"
							:state="!$v.model.password.$error"
							:invalid-feedback="$t('pages.register.password_error')">
							<b-form-input v-model="model.password" type="password" />
						</b-form-group>

						<i18n tag="p" class="small text-muted" path="pages.register.agree1">
							<a slot="terms_link" href="#">{{ $t('pages.register.agree2') }}</a>
							<a slot="privacy_link" href="#">{{ $t('pages.register.agree3') }}</a>
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
								<nuxt-link slot="link" :to="localePath('login')">{{ $t('pages.register.login2') }}</nuxt-link>
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
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
	name: 'PgRegisterPage',

	middleware: 'redirect-if-authenticated',

	components: {
		BFormGroup,
		BFormInput
	},

	mixins: [validationMixin],

	props: {
		asOwner: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			loading: false,
			model: {
				name: '',
				email: '',
				password: '',
				locale: this.$i18n.isoCode,
				is_owner: this.asOwner
			}
		}
	},

	head() {
		return {
			title: this.$t(
				this.asOwner
					? 'pages.register.owner.meta_title'
					: 'pages.register.user.meta_title'
			)
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
				const redirect =
					this.$route.query.redirect ||
					this.$auth.$storage.getUniversal('redirect')

				this.$auth.$storage.setUniversal('redirect', null)

				this.$router.push(redirect || this.localePath('index'))
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

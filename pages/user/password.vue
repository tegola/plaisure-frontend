<template>
	<div>
		<pg-navbar variant="dark" />

		<div class="container my-5">
			<pg-breadcrumb :items="breadcrumbItems" />

			<div class="row">
				<div class="mx-md-auto col-md-8 col-lg-6">
					<h1 class="h4">{{ $t('pages.user.password.title') }}</h1>
					<p class="text-muted">{{ $t('pages.user.password.intro') }}</p>

					<form method="post" class="mt-4" @submit.prevent="submit">
						<b-form-group
							:state="!$v.model.new_password.$error"
							:label="$t('pages.user.password.password')"
							:invalid-feedback="$t('pages.user.password.password_error')"
							:description="$v.model.new_password.$error ? null : $t('pages.user.password.password_hint')">
							<b-form-input v-model="model.new_password" type="password" autocomplete="new-password" />
						</b-form-group>
						<b-form-group
							:state="!$v.model.new_password_confirmation.$error"
							:label="$t('pages.user.password.password_confirmation')"
							:invalid-feedback="$t('pages.user.password.password_confirmation_error')">
							<b-form-input v-model="model.new_password_confirmation" type="password" autocomplete="new-password" />
						</b-form-group>
						<div class="mt-4 text-right">
							<pg-button
								:loading="loading"
								type="submit"
								variant="primary">
								{{ $t('pages.user.password.submit') }}
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
import { BFormGroup, BFormInput } from 'bootstrap-vue'
import { validationMixin } from 'vuelidate'
import { required, minLength, sameAs } from 'vuelidate/lib/validators'

export default {
	name: 'PgUserFormPage',

	middleware: 'auth',

	components: {
		BFormGroup,
		BFormInput
	},

	mixins: [validationMixin],

	data() {
		return {
			loading: false,
			model: {
				new_password: '',
				new_password_confirmation: ''
			}
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
					text: this.$t('pages.user.password.title'),
					active: true
				}
			]
		}
	},

	head() {
		return {
			title: this.$t('pages.user.password.title')
		}
	},

	validations: {
		model: {
			new_password: {
				required,
				minLength: minLength(8)
			},
			new_password_confirmation: {
				required,
				sameAsPassword: sameAs('new_password')
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
				await this.$axios.post('/user/password', this.model)

				// Notify of success
				this.$notify({
					title: this.$t('pages.user.password.submit_success_title'),
					text: this.$t('pages.user.password.submit_success_text'),
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

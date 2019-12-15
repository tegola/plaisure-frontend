<template>
	<div>
		<h3 class="h4">{{ $t('pages.user_password.title') }}</h3>
		<p class="text-muted">{{ $t('pages.user_password.intro') }}</p>

		<form method="post" class="mt-4" @submit.prevent="submit">
			<b-form-group
				:state="!$v.model.new_password.$error"
				:label="$t('pages.user_password.password')"
				:invalid-feedback="$t('pages.user_password.password_error')"
				:description="$v.model.new_password.$error ? null : $t('pages.user_password.password_hint')">
				<b-form-input v-model="model.new_password" type="password" autocomplete="new-password" />
			</b-form-group>
			<b-form-group
				:state="!$v.model.new_password_confirmation.$error"
				:label="$t('pages.user_password.password_confirmation')"
				:invalid-feedback="$t('pages.user_password.password_confirmation_error')">
				<b-form-input v-model="model.new_password_confirmation" type="password" autocomplete="new-password" />
			</b-form-group>
			<b-form-group class="mt-3 text-right">
				<pg-button
					ref="submit"
					:block="$mq === 'xs' || $mq === 'sm'"
					:loading="loading"
					type="submit"
					variant="primary">
					{{ $t('pages.user_password.submit') }}
				</pg-button>
			</b-form-group>
		</form>
	</div>
</template>

<script>
import { BFormGroup, BFormInput } from 'bootstrap-vue'
import { validationMixin } from 'vuelidate'
import { required, minLength, sameAs } from 'vuelidate/lib/validators'

export default {
	name: 'PgUserFormPage',

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

	head() {
		return {
			title: this.$t('pages.user_password.title')
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

				// Show button as successful
				this.$refs.submit.showSuccess()

				// Notify of success
				this.$notify({
					title: this.$t('pages.user_password.submit_success_title'),
					text: this.$t('pages.user_password.submit_success_text'),
					type: 'success'
				})
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

<template>
	<div>
		<h3 class="h4">{{ $t('pages.user_info.title') }}</h3>

		<form method="post" class="mt-4" @submit.prevent="submit">
			<b-form-group
				:state="!$v.model.name.$error"
				:label="$t('pages.user_info.name')"
				:invalid-feedback="$t('pages.user_info.name_error')"
				:description="$v.model.name.$error ? null : $t('pages.user_info.name_hint', { name: this.$constants.APP_NAME })">
				<b-form-input v-model="model.name" type="text" autocomplete="name" />
			</b-form-group>
			<b-form-group
				:label="$t('pages.user_info.email')">
				<b-form-input v-model="model.email" type="email" autocomplete="email" disabled />
			</b-form-group>
			<b-form-group>
				<b-form-checkbox v-model="model.send_newsletter">{{ $t('pages.user_info.newsletter') }}</b-form-checkbox>
			</b-form-group>
			<b-form-group
				:state="!$v.model.locale.$error"
				:label="$t('pages.user_info.locale')"
				:invalid-feedback="$t('pages.user_info.locale_error')">
				<b-form-select v-model="model.locale" :options="localeOptions" />
			</b-form-group>

			<b-form-group class="mt-3 text-right">
				<pg-button
					ref="submit"
					:block="$mq === 'xs' || $mq === 'sm'"
					:loading="loading"
					type="submit"
					variant="primary">
					{{ $t('common.actions.save') }}
				</pg-button>
			</b-form-group>
		</form>
	</div>
</template>

<script>
import {
	BFormGroup,
	BFormInput,
	BFormSelect,
	BFormCheckbox
} from 'bootstrap-vue'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'

export default {
	name: 'PgUserInfoPage',

	components: {
		BFormGroup,
		BFormInput,
		BFormSelect,
		BFormCheckbox
	},

	mixins: [validationMixin],

	data() {
		return {
			loading: false,
			model: {}
		}
	},

	computed: {
		localeOptions() {
			return [
				{ value: 'en-GB', text: 'English (Great Britain)' },
				{ value: 'it-IT', text: 'Italiano' }
			]
		}
	},

	async asyncData({ $axios }) {
		const data = await $axios.$get('/user/edit')
		const user = data.data

		return {
			model: {
				name: user.name,
				email: user.email,
				send_newsletter: user.send_newsletter,
				locale: user.locale
			}
		}
	},

	head() {
		return {
			title: this.$t('pages.user_info.title')
		}
	},

	validations: {
		model: {
			name: {
				required
			},
			email: {
				required,
				email
			},
			locale: {
				required
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
				await this.$axios.post('/user/info', this.model)
				await this.$auth.fetchUser()

				// Show button as successful
				this.$refs.submit.showSuccess()

				// Switch page language
				const language = this.$auth.user.locale.split(/-|_/)[0]

				this.$router.replace(this.switchLocalePath(language))
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

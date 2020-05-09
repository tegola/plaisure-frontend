<template>
	<div>
		<pg-navbar variant="dark" />

		<div class="container my-5">
			<pg-breadcrumb :items="breadcrumbItems" />

			<div class="row">
				<div class="mx-md-auto col-md-8 col-lg-6">
					<h1 class="h4">{{ $t('pages.user.info.title') }}</h1>

					<form method="post" class="mt-4" @submit.prevent="submit">
						<b-form-group
							:state="!$v.model.name.$error"
							:label="$t('pages.user.info.name')"
							:invalid-feedback="$t('pages.user.info.name_error')"
							:description="$v.model.name.$error ? null : $t('pages.user.info.name_hint', { name: this.$constants.APP_NAME })">
							<b-form-input v-model="model.name" type="text" autocomplete="name" />
						</b-form-group>
						<b-form-group
							:label="$t('pages.user.info.email')">
							<b-form-input v-model="model.email" type="email" autocomplete="email" disabled />
						</b-form-group>
						<b-form-group>
							<b-form-checkbox v-model="model.send_newsletter">{{ $t('pages.user.info.newsletter') }}</b-form-checkbox>
						</b-form-group>
						<b-form-group
							:state="!$v.model.locale.$error"
							:label="$t('pages.user.info.locale')"
							:invalid-feedback="$t('pages.user.info.locale_error')">
							<b-form-select v-model="model.locale" :options="localeOptions" />
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

	middleware: 'auth',

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
		breadcrumbItems() {
			return [
				{
					text: this.$t('pages.user.index.title'),
					to: this.localePath('user')
				},
				{
					text: this.$t('pages.user.info.title'),
					active: true
				}
			]
		},

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
			title: this.$t('pages.user.info.title')
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

				// Load the new language
				const language = this.$auth.user.locale.split(/-|_/)[0]
				await this.$i18n.loadLanguage(language)

				// Notify of success in the new language
				this.$notify({
					title: this.$t('pages.user.info.submit_success_title', language),
					text: this.$t('pages.user.info.submit_success_text', language),
					type: 'success'
				})

				// Back to user page with the new language
				this.$router.push(this.localePath('user', language))
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

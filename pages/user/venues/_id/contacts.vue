<template>
	<form @submit.prevent="submit">
		<b-form-group
			v-bind="formGroupProps"
			:label="$t('pages.user.venues.detail.contacts.phone')">
			<div class="row">
				<div class="col-md-10 col-lg-9">
					<b-form-input
						v-model="model.contact_phone"
						type="tel"
					/>
				</div>
			</div>
		</b-form-group>

		<b-form-group
			:state="!$v.model.contact_email.$error"
			v-bind="formGroupProps"
			:label="$t('pages.user.venues.detail.contacts.email')"
			:invalid-feedback="$t('pages.user.venues.detail.contacts.email_error')">
			<div class="row">
				<div class="col-md-10 col-lg-9">
					<b-form-input
						v-model="model.contact_email"
						type="email"
						:placeholder="$t('pages.user.venues.detail.contacts.email_placeholder' )"
					/>
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			label="Facebook Messenger">
			<div class="row">
				<div class="col-md-10 col-lg-9">
					<b-form-input v-model="model.contact_facebook" />
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			label="Twitter">
			<div class="row">
				<div class="col-md-10 col-lg-9">
					<b-input-group prepend="@">
						<b-form-input v-model=" model.contact_twitter" />
					</b-input-group>
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:state="!$v.model.url_site.$error"
			:label="$t('pages.user.venues.detail.contacts.site')"
			:invalid-feedback="$t('pages.user.venues.detail.contacts.url_error')">
			<div class="row">
				<div class="col-md-10 col-lg-9">
					<b-form-input
						v-model="model.url_site"
						v-auto-https
						type="url"
						:placeholder="$t('pages.user.venues.detail.contacts.url_placeholder')"
					/>
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:state="!$v.model.url_online_casino.$error"
			:label="$t('pages.user.venues.detail.contacts.online_casino')"
			:invalid-feedback="$t('pages.user.venues.detail.contacts.url_error')">
			<div class="row">
				<div class="col-md-10 col-lg-9">
					<b-form-input
						v-model="model.url_online_casino"
						v-auto-https
						type="url"
						:placeholder="$t('pages.user.venues.detail.contacts.url_placeholder')"
					/>
				</div>
			</div>
		</b-form-group>

		<b-form-group
			v-bind="formGroupProps"
			:state="!$v.model.url_facebook.$error"
			:label="$t('pages.user.venues.detail.contacts.facebook')"
			:invalid-feedback="$t('pages.user.venues.detail.contacts.url_error')">
			<div class="row">
				<div class="col-md-10 col-lg-9">
					<b-form-input
						v-model="model.url_facebook"
						v-auto-https
						type="url"
						:placeholder="$t('pages.user.venues.detail.contacts.url_placeholder')"
					/>
				</div>
			</div>
		</b-form-group>

		<b-form-group v-bind="formGroupProps" class="mt-5">
			<pg-button
				ref="submit"
				type="submit"
				variant="primary"
				:loading="saving"
				:block="$mq | mq({ xs: true, md: false })">
				{{ $t('common.actions.save') }}
			</pg-button>
		</b-form-group>
	</form>
</template>

<script>
import { mapState } from 'vuex'
import { validationMixin } from 'vuelidate'
import { email, url } from 'vuelidate/lib/validators'
import { BFormGroup, BFormInput, BInputGroup } from 'bootstrap-vue'
import formGroupProps from './-form-group-props'

export default {
	name: 'PgUserVenueDetailPageContactsSection',

	components: {
		BFormGroup,
		BFormInput,
		BInputGroup
	},

	directives: {
		autoHttps: {
			bind (el, binding, vnode) {
				const prefix = 'https://'
				const re = /^http(s?):\/\//i

				const handler = function (e) {
					const value = e.target.value

					if (value.length > prefix.length && !re.test(value)) {
						e.target.value = prefix + value
						vnode.elm.dispatchEvent(new CustomEvent('input'))
					}
				}

				el.addEventListener('input', handler)
			}
		}
	},

	mixins: [validationMixin],

	data () {
		return {
			formGroupProps,
			model: null
		}
	},

	computed: {
		...mapState('user-venue-detail', ['venue', 'saving'])
	},

	watch: {
		venue: {
			handler: 'prepareModel',
			immediate: true
		}
	},

	validations: {
		model: {
			contact_email: { email },
			url_site: { url },
			url_online_casino: { url },
			url_facebook: { url }
		}
	},

	methods: {
		prepareModel () {
			const v = this.venue

			this.model = {
				contact_phone: v.contacts.phone,
				contact_email: v.contacts.email,
				contact_facebook: v.contacts.facebook,
				contact_twitter: v.contacts.twitter,
				url_site: v.urls.site,
				url_online_casino: v.urls.online_casino,
				url_facebook: v.urls.facebook
			}
		},

		async submit () {
			// Validate
			this.$v.$touch()

			// Stop on validation errors
			if (this.$v.$error) { return }

			this.$store.commit('user-venue-detail/setSaving', true)

			try {
				// Save
				await this.$axios.post(
					`/user/venues/${this.venue.id}/contacts`,
					this.model
				)

				// Show success on button
				this.$refs.submit.showSuccess()

				// Emit to reload venue
				this.$emit('submitted')
			} catch (err) {
				this.$notify({
					title: this.$t('common.status.error'),
					text: this.$t('common.status.save_error'),
					duration: -1,
					type: 'danger'
				})
			} finally {
				this.$store.commit('user-venue-detail/setSaving', false)
			}
		}
	}
}
</script>

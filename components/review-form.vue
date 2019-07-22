<template>
	<form class="card pg-review-form" @reset="cancel" @submit.prevent="submit">
		<div class="card-body">
			<h5 class="mb-0 font-weight-normal">{{ $t('components.review_form.title') }}</h5>
		</div>
		<hr class="my-0">
		<div class="card-body">
			<b-form-group
				:label="$t('components.review_form.rating')"
				:state="!$v.model.rating.$error"
				:invalid-feedback="$t('components.review_form.rating_error')">
				<pg-rating
					v-model="model.rating"
					class="pg-review-form__rating"
				/>
			</b-form-group>
			<b-form-group
				:label="$t('components.review_form.summary')"
				:state="!$v.model.title.$error"
				:invalid-feedback="$t('components.review_form.summary_error')">
				<b-form-input
					v-model="model.title"
					:placeholder="$t('components.review_form.summary_placeholder')"
					autofocus
				/>
			</b-form-group>
			<b-form-group
				:label="$t('components.review_form.body')"
				:state="!$v.model.body.$error"
				:invalid-feedback="$t('components.review_form.body_error')">
				<b-form-textarea
					v-model="model.body"
					:placeholder="$t('components.review_form.body_placeholder')"
					rows="5"
				/>
			</b-form-group>
			<b-form-group class="text-right mb-0">
				<pg-button type="reset">{{ $t('common.actions.cancel') }}</pg-button>
				<pg-button type="submit" variant="primary" :loading="saving">{{ $t('components.review_form.submit') }}</pg-button>
			</b-form-group>
		</div>
	</form>
</template>

<script>
import { extend } from 'lodash'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { BFormGroup, BFormInput, BFormTextarea } from 'bootstrap-vue'

export default {
	name: 'PgReviewForm',

	components: {
		BFormGroup,
		BFormInput,
		BFormTextarea
	},

	mixins: [validationMixin],

	props: {
		venue: {
			type: Object,
			required: true
		},

		review: {
			type: Object,
			required: true
		}
	},

	data() {
		return {
			saving: false,
			model: {
				rating: 0,
				title: '',
				body: ''
			}
		}
	},

	watch: {
		review: {
			immediate: true,
			handler(r) {
				extend(this.model, {
					rating: r.rating,
					title: r.title,
					body: r.body,
					language: this.$i18n.locale
				})
			}
		}
	},

	validations: {
		model: {
			rating: {
				required
			},
			title: {
				required
			},
			body: {
				required
			}
		}
	},

	methods: {
		cancel() {
			this.$emit('cancel')
		},

		async submit(value) {
			// Validate
			this.$v.$touch()

			// Stop on validation errors
			if (this.$v.$error) return

			this.saving = true

			try {
				// Store rating
				await this.$axios.post(`/venues/${this.venue.id}/reviews`, this.model)

				// Show confirmation / thanks
				this.$notify({
					text: this.$t('components.review_form.submit_success')
				})

				// Reload venue
				const data = await this.$axios.$get(`/venues/${this.venue.id}`)

				extend(this.$data, data)

				this.$emit('submit')
			} catch (error) {
				this.$notify({
					title: this('common.status.error'),
					text: this.$t('common.status.save_error'),
					type: 'danger'
				})
			} finally {
				this.saving = false
			}
		}
	}
}
</script>

<style lang="scss">
.pg-review-form {
	&__rating {
		margin-left: -3px;

		.pg-rating__icon {
			width: 24px;
			height: 24px;
		}
	}
}
</style>

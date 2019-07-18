<template>
	<div class="card pg-review-item">
		<!-- User content (title, rating, name, date, body) -->
		<div class="card-body">
			<p class="mb-1"><strong class="font-weight-bold">{{ review.title }}</strong></p>
			<ul class="list-inline card-text">
				<li class="list-inline-item mr-2">
					<pg-rating
						:value="review.rating"
						class="pg-review-item__rating"
						size="sm"
						readonly
					/>
				</li>
				<li class="list-inline-item font-weight-semibold">{{ review.user.name }}</li>
				<li class="list-inline-item text-muted">{{ formatDate(review.created_at) }}</li>
			</ul>
			<p class="card-text pg-review-item__copy">{{ review.body }}</p>
		</div>

		<b-collapse :id="`content-collapse-${review.id}`" :visible="!showReplyForm">
			<!-- Owner content (Title, date, body) -->
			<div v-if="review.reply" class="card-body px-3 pt-0 pb-3">
				<ul class="list-inline card-text">
					<li class="list-inline-item font-weight-semibold">{{ $t('Owner response') }}</li>
					<li class="list-inline-item text-muted">{{ formatDate(review.replied_at) }}</li>
				</ul>
				<p class="card-text pg-review-item__copy">{{ review.reply }}</p>
			</div>

			<!-- Actions -->
			<div class="card-body px-3 pt-0 pb-3">
				<hr class="pg-review-item__separator">
				<pg-button
					v-if="canReply"
					class="pg-review-item__button mr-2"
					variant="naked"
					size="xs"
					icon="reply"
					@click="reply">
					{{ review.reply ? $t('Edit reply') : $t('Reply') }}
				</pg-button>
				<pg-button
					class="pg-review-item__button"
					variant="naked"
					size="xs"
					icon="exclamation-circle-outline"
					:loading="reporting"
					:disabled="reported"
					@click="report">
					{{ reported ? this.$t('Reported') : this.$t('Report') }}
				</pg-button>
			</div>
		</b-collapse>

		<!-- Reply form -->
		<b-collapse :id="`form-collapse-${review.id}`" :visible="showReplyForm">
			<form class="card-body pg-review-item__reply-form" @reset="cancelReply" @submit.prevent="submitReply">
				<b-form-group :label="$t('Reply to this review')">
					<b-form-textarea
						ref="textarea"
						v-model="replyText"
						rows="5"
					/>
				</b-form-group>
				<b-form-group class="text-right mb-0">
					<pg-button type="reset">{{ $t('Cancel') }}</pg-button>
					<pg-button
						type="submit"
						:loading="replying"
						v-bind="submitButtonProps"
					/>
				</b-form-group>
			</form>
		</b-collapse>
	</div>
</template>

<script>
import { BCollapse, BFormGroup, BFormTextarea } from 'bootstrap-vue'

export default {
	name: 'PgVenueDetailPageReviewItem',

	components: {
		BCollapse,
		BFormGroup,
		BFormTextarea
	},

	props: {
		venue: {
			type: Object,
			required: true
		},

		review: {
			type: Object,
			required: true
		},

		/**
		 * Hides the reply button.
		 *
		 * @type {Object}
		 */
		noReply: {
			type: Boolean,
			defalt: false
		}
	},

	data() {
		return {
			reporting: false,
			reported: false,
			replying: false,
			showReplyForm: false,
			replyText: ''
		}
	},

	computed: {
		canReply() {
			const user = this.$auth.user
			const venueIsMine =
				user && user.venue_ids && user.venue_ids.indexOf(this.venue.id) !== -1

			return venueIsMine && !this.noReply
		},

		submitButtonProps() {
			if (!this.review.reply) {
				return {
					label: this.$t('Post'),
					variant: 'primary'
				}
			} else {
				const text = this.replyText.trim()

				return {
					label: text ? this.$t('Update reply') : this.$t('Delete reply'),
					variant: text ? 'primary' : 'danger'
				}
			}
		}
	},

	methods: {
		formatDate(date) {
			// FIXME: usare i18n date formatter
			return new Date(date).toLocaleDateString(this.$i18n.isoCode, {
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			})
		},

		async reply() {
			this.replyText = this.review.reply
			this.showReplyForm = true

			await this.$nextTick()

			this.$refs.textarea.focus()
		},

		cancelReply() {
			this.showReplyForm = false
		},

		async submitReply() {
			const url = `/venues/${this.venue.id}/reviews/${this.review.id}/reply`

			this.replying = true

			try {
				await this.$axios.post(url, {
					reply: this.replyText
				})

				this.showReplyForm = false

				this.$emit('replied')
			} catch (error) {
				this.$notify({
					title: this('common.status.error'),
					text: this.$t('common.status.save_error'),
					type: 'danger'
				})
			} finally {
				this.replying = false
			}
		},

		async report() {
			const answer = await this.$bvModal.msgBoxConfirm(
				this.$t(
					'Report this comment as offensive, inappropriate, upsetting or spam?'
				),
				{
					title: this.$t('Report review'),
					headerTextVariant: 'danger',
					centered: true,
					noFade: true,
					okTitle: this.$t('Report this review'),
					okVariant: 'danger'
				}
			)

			if (answer) {
				this.reporting = true

				const url = `/venues/${this.venue.id}/reviews/${this.review.id}/report`

				try {
					await this.$axios.post(url)

					this.reported = true
				} finally {
					this.reporting = false
				}
			}
		}
	}
}
</script>

<style lang="scss">
.pg-review-item {
	background-color: $gray-100;
	border: 0;
	font-size: $font-size-sm;

	&__copy {
		white-space: pre-wrap;
	}
	&__rating {
		margin-left: -3px;
		vertical-align: 1px;
	}
	&__separator {
		border-top-color: $gray-200;
		margin-top: 0;
		margin-bottom: 0.5rem;
	}
	&__button {
		color: $gray-500;
		padding-left: 0;
		padding-right: 0;

		@include hover-focus {
			color: darken($gray-500, 15%);

			&:disabled {
				color: darken($gray-500, 15%);
			}
		}
	}

	&__reply-form {
		background-color: $white;
		border-bottom-left-radius: $card-border-radius;
		border-bottom-right-radius: $card-border-radius;
		border: $border-width solid $gray-100;
	}
}
</style>

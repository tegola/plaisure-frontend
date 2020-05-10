<template>
	<form @submit.prevent="submit">
		<b-form-group
			v-for="n in 3"
			:key="n"
			:label="$t('pages.user.venues.detail.jackpots.name', { number: n })"
			v-bind="formGroupProps">
			<div class="form-row">
				<div class="col-md col-lg-5">
					<b-form-input
						v-model="model[`jackpot${n}_label`]"
						:placeholder="$t('pages.user.venues.detail.jackpots.name_placeholder')"
						class="mb-2 mb-md-0"
					/>
				</div>
				<div class="col-md col-lg-4">
					<b-input-group :prepend="currencySymbol">
						<b-form-input
							v-model="model[`jackpot${n}_value`]"
							:placeholder="$t('pages.user.venues.detail.jackpots.amount_placeholder')"
							type="number"
							class="text-right"
							min="0"
							step="0.01"
						/>
					</b-input-group>
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
import { BFormGroup, BFormInput, BInputGroup } from 'bootstrap-vue'
import { getAllInfoByISO } from 'iso-country-currency'
import formGroupProps from './-form-group-props'

export default {
	name: 'PgUserVenueDetailPageJackpotsSection',

	components: {
		BFormGroup,
		BFormInput,
		BInputGroup
	},

	data () {
		return {
			formGroupProps,
			model: null
		}
	},

	computed: {
		...mapState('user-venue-detail', ['venue', 'saving']),

		currencySymbol () {
			if (!this.venue.country) { return null }

			const { symbol } = getAllInfoByISO(this.venue.country)

			return symbol
		}
	},

	watch: {
		venue: {
			handler: 'prepareModel',
			immediate: true
		}
	},

	methods: {
		prepareModel () {
			const v = this.venue

			this.model = {
				jackpot1_value: v.jackpots[0].value,
				jackpot1_label: v.jackpots[0].label,
				jackpot2_value: v.jackpots[1].value,
				jackpot2_label: v.jackpots[1].label,
				jackpot3_value: v.jackpots[2].value,
				jackpot3_label: v.jackpots[2].label
			}
		},

		async submit () {
			this.$store.commit('user-venue-detail/setSaving', true)

			try {
				// Save
				await this.$axios.post(
					`/user/venues/${this.venue.id}/jackpots`,
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

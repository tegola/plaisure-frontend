<template>
	<form @submit.prevent="submit">
		<b-form-group
			v-for="day in days"
			:key="day.index"
			:label="day.name"
			v-bind="formGroupProps">
			<div class="form-row">
				<div class="col-lg-10">
					<pg-hour-fieldset
						v-model="model.business_hours[day.index]"
						:label="day.name"
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
import { BFormGroup } from 'bootstrap-vue'
import formGroupProps from './-form-group-props'
import PgHourFieldset from './-hour-fieldset'

export default {
	name: 'PgUserVenueDetailPageHoursSection',

	components: {
		BFormGroup,
		PgHourFieldset
	},

	data () {
		return {
			formGroupProps,
			days: [
				{ index: 1, name: this.$t('common.weekdays.monday') },
				{ index: 2, name: this.$t('common.weekdays.tuesday') },
				{ index: 3, name: this.$t('common.weekdays.wednesday') },
				{ index: 4, name: this.$t('common.weekdays.thursday') },
				{ index: 5, name: this.$t('common.weekdays.friday') },
				{ index: 6, name: this.$t('common.weekdays.saturday') },
				{ index: 0, name: this.$t('common.weekdays.sunday') }
			],
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

	methods: {
		prepareModel () {
			this.model = {
				business_hours: this.venue.business_hours.slice()
			}
		},

		async submit () {
			this.$store.commit('user-venue-detail/setSaving', true)

			try {
				// Save
				await this.$axios.post(
					`/user/venues/${this.venue.id}/hours`,
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

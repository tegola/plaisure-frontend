<template>
	<div>
		<b-form-group :class="showControls ? 'mb-2' : 'mb-0'">
			<b-form-select v-model="mode">
				<option value="always">{{ $t('pages.user.venues.detail.hours.always') }}</option>
				<option value="full">{{ $t('pages.user.venues.detail.hours.full') }}</option>
				<option value="split">{{ $t('pages.user.venues.detail.hours.split') }}</option>
				<option value="closed">{{ $t('pages.user.venues.detail.hours.closed') }}</option>
			</b-form-select>
		</b-form-group>

		<div v-if="showControls" class="form-row">
			<b-form-group
				:label="showSecondaryControls ? $t('pages.user.venues.detail.hours.morning') : $t('pages.user.venues.detail.hours.from_to')"
				class="col-sm-6">
				<b-input-group>
					<b-form-select
						:value="value[0]"
						@change="onTimeChange(0, $event)">
						<option v-for="(option, index) in options" :key="index">{{ option }}</option>
					</b-form-select>
					<b-form-select
						:value="value[1]"
						@change="onTimeChange(1, $event)">
						<option v-for="(option, index) in options" :key="index">{{ option }}</option>
					</b-form-select>
				</b-input-group>
			</b-form-group>
			<b-form-group
				v-if="showSecondaryControls"
				:label="$t('pages.user.venues.detail.hours.afternoon')"
				class="col-sm-6">
				<b-input-group>
					<b-form-select
						:value="value[2]"
						@change="onTimeChange(2, $event)">
						<option v-for="(option, index) in options" :key="index">{{ option }}</option>
					</b-form-select>
					<b-form-select
						:value="value[3]"
						@change="onTimeChange(3, $event)">
						<option v-for="(option, index) in options" :key="index">{{ option }}</option>
					</b-form-select>
				</b-input-group>
			</b-form-group>
		</div>
	</div>
</template>

<script>
import { BFormGroup, BInputGroup, BFormSelect } from 'bootstrap-vue'

// Generate options
const options = []

for (let h = 0; h <= 24; h++) {
	const hours = h < 10 ? `0${h}` : `${h}`

	const halfs = ['00', '30']

	halfs.forEach(minutes => {
		if (h === 24 && minutes === '30') return // No 24:30
		options.push(`${hours}:${minutes}`)
	})
}

export default {
	components: {
		BFormGroup,
		BInputGroup,
		BFormSelect
	},

	props: {
		value: {
			type: Array,
			default: () => []
		}
	},

	data() {
		return {
			mutableValue: this.value,
			options: options
		}
	},

	computed: {
		mode: {
			get() {
				const v = this.value

				if (!v.length) return 'closed'
				if (v.length > 2) return 'split'
				if (v.length === 2 && v[0] === '00:00' && v[1] === '24:00')
					return 'always'
				if (v.length === 2) return 'full'
				return null
			},
			set(value) {
				switch (value) {
					case 'closed':
						this.mutableValue = []
						break

					case 'split':
						this.mutableValue = ['09:00', '13:00', '14:00', '20:00']
						break

					case 'full':
						this.mutableValue = ['09:00', '20:00']
						break

					case 'always':
						this.mutableValue = ['00:00', '24:00']
				}

				this.$emit('input', this.mutableValue)
			}
		},

		showControls() {
			return ['full', 'split'].indexOf(this.mode) !== -1
		},

		showSecondaryControls() {
			return this.mode === 'split'
		}
	},

	watch: {
		value() {
			this.mutableValue = this.value
		}
	},

	methods: {
		onTimeChange(index, value) {
			this.mutableValue = this.mutableValue.slice(0)
			this.mutableValue[index] = value
			this.$emit('input', this.mutableValue)
		}
	}
}
</script>

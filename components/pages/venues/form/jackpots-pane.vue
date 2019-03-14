<template>
	<div class="my-5">
		<h5>{{ $t('pages.venue_form.jackpots.title') }}</h5>
		<hr>
		<b-form-group
			v-for="n in 3"
			:key="n"
			:label="$t('pages.venue_form.jackpots.name', { number: n })"
			v-bind="formGroupProps">
			<div class="form-row">
				<div class="col-md col-lg-5">
					<b-input
						:placeholder="$t('pages.venue_form.jackpots.name_placeholder')"
						:value="venue.jackpots[n].label"
						class="mb-2 mb-md-0"
						@input="onLabelInput(n, $event)"
					/>
				</div>
				<div class="col-md col-lg-5">
					<b-input-group :prepend="currencySymbol">
						<b-input
							:placeholder="$t('pages.venue_form.jackpots.amount_placeholder')"
							:value="venue.jackpots[n].value"
							type="number"
							class="text-right"
							min="0"
							step="0.01"
							@input="onValueInput(n, $event)"
						/>
					</b-input-group>
				</div>
			</div>
		</b-form-group>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import getSymbolFromCurrency from 'currency-symbol-map'

import BFormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import BInput from 'bootstrap-vue/es/components/form-input/form-input'
import BInputGroup from 'bootstrap-vue/es/components/input-group/input-group'

import formGroupProps from './form-group-props'

export default {
	name: 'JackpotsPane',

	components: {
		BFormGroup,
		BInput,
		BInputGroup
	},

	data() {
		return {
			formGroupProps
		}
	},

	computed: {
		...mapState('venueForm', ['venue']),

		currencySymbol() {
			const currencyKey = `APP_CURRENCY_${this.$i18n.region}`
			return getSymbolFromCurrency(this.$constants[currencyKey])
		}
	},

	methods: {
		onLabelInput(number, value) {
			this.$store.commit('venueForm/setJackpot', {
				field: 'label',
				number,
				value
			})
		},

		onValueInput(number, value) {
			this.$store.commit('venueForm/setJackpot', {
				field: 'value',
				number,
				value
			})
		}
	}
}
</script>

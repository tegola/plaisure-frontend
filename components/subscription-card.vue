<template>
	<div :class="classes" @click="onClick">
		<div class="card-body">
			<span v-if="highlightText" class="badge badge-primary initialism">{{ highlightText }}</span>
			<h3 class="card-title">{{ $t(`data.subscriptions.${subscription.name}`) }}</h3>
			<p class="card-text lead">{{ currencySymbol }}{{ price }}/mese</p>
			<ul class="list-unstyled card-text">
				<li v-for="(line, index) in subscription.lines" :key="index">{{ line }}</li>
			</ul>
		</div>
		<template v-if="lastUpdateDate && endDate" class="card-body">
			<hr class="my-0">
			<div class="card-body">
				<div class="d-flex align-items-center">
					<pg-icon icon="info" class="mr-3 text-info" />
					<p class="mb-0 small flex-fill">
						Hai disattivato il {{ formatDate(lastUpdateDate) }}.<br>
						Sarà funzionante fino al {{ formatDate(endDate) }}
					</p>
				</div>
			</div>
		</template>
		<slot />
	</div>
</template>

<script>
import { getAllInfoByISO } from 'iso-country-currency'

export default {
	name: 'PgSubscriptionCard',

	props: {
		subscription: {
			type: Object,
			required: true
		},
		lastUpdateDate: {
			type: String,
			default: null
		},
		endDate: {
			type: String,
			default: null
		},
		highlight: {
			type: String,
			default: null
		},
		clickable: {
			type: Boolean,
			default: false
		},
		selected: {
			type: Boolean,
			default: false
		}
	},

	computed: {
		classes() {
			return {
				card: true,
				'pg-subscription-card--clickable': this.clickable,
				'pg-subscription-card--selected': this.selected
			}
		},

		currencySymbol() {
			const { symbol } = getAllInfoByISO(this.$i18n.region)

			return symbol
		},

		price() {
			// FIXME: usare vue i18n number formatter
			return this.subscription.price.toFixed(2).replace('.', ',')
		},

		highlightText() {
			return this.highlight || this.subscription.highlight
		}
	},

	methods: {
		formatDate(date) {
			if (!date) return

			// FIXME: usare i18n date formatter
			return new Date(date).toLocaleDateString(this.$i18n.isoCode, {
				day: 'numeric',
				month: '2-digit',
				year: 'numeric'
			})
		},

		onClick() {
			if (!this.clickable) return

			this.$emit('select')
		}
	}
}
</script>

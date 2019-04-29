<template>
	<div :class="classes" @click="onClick">
		<div class="card-body">
			<span v-if="highlight" class="badge badge-primary initialism">{{ highlight }}</span>
			<h3 class="card-title">{{ $t(`data.subscriptions.${subscription.name}`) }}</h3>
			<p class="card-text lead">{{ price }}</p>
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
import { getParamByParam } from 'iso-country-currency'

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
			return getParamByParam('currency', this.subscription.currency, 'symbol')
		},

		price() {
			const currency = getParamByParam(
				'currency',
				this.subscription.currency,
				'symbol'
			)
			// FIXME: usare vue i18n number formatter
			const price = this.subscription.price.toFixed(2).replace('.', ',')

			return this.$t('components.subscription_card.price', {
				currency,
				price
			})
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

<style lang="scss">
.pg-subscription-card {
	&--clickable {
		cursor: pointer;
		transition: 200ms;
	}

	&--clickable:hover {
		transform: scale(1.02);
		border-color: theme-color('primary');
		box-shadow: inset 0 0 0 $border-width theme-color('primary'),
			0 3px 20px rgba(theme-color('primary'), 0.25);
	}
	&--selected {
		border-color: theme-color('primary');
		box-shadow: inset 0 0 0 $border-width theme-color('primary');
	}
}
</style>

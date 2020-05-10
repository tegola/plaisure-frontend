<template>
	<div :class="classes" @click="onClick">
		<div class="card-body">
			<span v-if="highlight" class="badge badge-primary initialism mb-2">{{ highlight }}</span>
			<h3 class="card-title">{{ $t(`data.subscriptions.${subscription.name}`) }}</h3>
			<p class="card-text lead">{{ price }}</p>
			<ul class="list-unstyled card-text">
				<li v-for="(line, index) in subscription.lines" :key="index">{{ line }}</li>
			</ul>
		</div>
		<template v-if="subscription.payment_pending">
			<hr class="my-0">
			<div class="card-body text-danger d-flex align-items-center">
				{{ this.$t('components.subscription_card.error.payment') }}
				<div>
					<pg-icon
						icon="exclamation-circle-outline"
						class="pg-subscription-card__warning-icon"
					/>
				</div>
			</div>
		</template>
		<template v-else-if="lastUpdateDate && endDate" class="card-body">
			<hr class="my-0">
			<div class="card-body">
				<div class="d-flex align-items-center">
					<pg-icon icon="info" class="mr-3 text-info" />
					<p class="mb-0 small flex-fill">
						{{ this.$t('components.subscription_card.cancelled.line1', { cancelDate: formatDate(lastUpdateDate) }) }}<br>
						{{ this.$t('components.subscription_card.cancelled.line2', { endDate: formatDate(endDate) }) }}
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
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},

	computed: {
		classes () {
			return {
				card: true,
				'pg-subscription-card--clickable': this.clickable && !this.disabled,
				'pg-subscription-card--selected': this.selected,
				'pg-subscription-card--disabled': this.disabled
			}
		},

		price () {
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
		formatDate (date) {
			if (!date) { return }

			// FIXME: usare i18n date formatter
			return new Date(date).toLocaleDateString(this.$i18n.isoCode, {
				day: 'numeric',
				month: '2-digit',
				year: 'numeric'
			})
		},

		onClick () {
			if (!this.clickable || this.disabled) { return }

			this.$emit('select')
		}
	}
}
</script>

<style lang="scss">
.pg-subscription-card {
	&__warning-icon {
		width: 1.5rem;
		height: 1.5rem;
	}
	&--clickable {
		cursor: pointer;
		transition: 200ms;
	}
	&--clickable:hover,
	&--selected {
		border-color: $primary;
		box-shadow: inset 0 0 0 $border-width $primary;
	}
	&--clickable:active {
		transform: scale(0.98);
	}
	&--disabled {
		background-color: $gray-100;
	}
}
</style>

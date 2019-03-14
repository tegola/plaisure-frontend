<template>
	<div class="card">
		<div class="card-body d-flex flex-column">
			<div>
				<span v-if="highlightText" class="badge badge-primary initialism">{{ highlightText }}</span>
				<h3 class="card-title">{{ $t(`data.subscriptions.${subscription.name}`) }}</h3>
				<p class="card-text lead">€ {{ price }}/mese</p>
				<p v-if="endDate" class="text-info">Attivo fino al {{ endDate }}</p>
				<ul class="list-unstyled">
					<li v-for="(line, index) in subscription.lines" :key="index">{{ line }}</li>
				</ul>
			</div>
			<div class="mt-auto text-center">
				<pg-button
					v-bind="buttonProps"
					block
					class="mt-auto"
					@click="$emit('select')"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import PgButton from './button'

export default {
	name: 'PgSubscriptionCard',

	components: {
		PgButton
	},

	props: {
		subscription: {
			type: Object,
			required: true
		},
		currentSubscription: {
			type: Object,
			default: null
		},
		selectedSubscription: {
			type: Object,
			default: null
		},
		highlight: {
			type: String,
			default: null
		},
		asDisplay: {
			type: Boolean,
			default: false
		}
	},

	computed: {
		isCurrent() {
			const current = this.currentSubscription

			if (current) {
				// Venue has subscription data
				if (current.ends_at) {
					// It's the default one since it will end soon
					return this.subscription.name === 'default'
				} else {
					// It's the current one
					return this.subscription.name === current.name
				}
			} else {
				// Venue has no subscription, so it's the default one
				return this.subscription.name === 'default'
			}
		},

		isSelected() {
			const selected = this.selectedSubscription
			return selected ? selected.name === this.subscription.name : false
		},

		isOnGracePeriod() {
			const current = this.currentSubscription

			if (!current) return false
			if (current.name === this.subscription.name) return false
			return Boolean(current.ends_at)
		},

		price() {
			// FIXME: usare vue i18n number formatter
			return this.subscription.price.toFixed(2).replace('.', ',')
		},

		endDate() {
			const endDate = this.isOnGracePeriod
				? this.currentSubscription.ends_at.date
				: null

			// No end date available
			if (!endDate) return null

			// FIXME: usare i18n date formatter
			return new Date(endDate).toLocaleDateString(this.$i18n.locale, {
				day: 'numeric',
				month: '2-digit',
				year: 'numeric'
			})
		},

		highlightText() {
			return this.highlight || this.subscription.highlight
		},

		buttonProps() {
			if (this.asDisplay) {
				return {
					variant: 'secondary',
					label: this.$t('Cambia')
				}
			} else if (this.isCurrent) {
				return {
					disabled: true,
					variant: 'neutral',
					label: this.$t('Piano corrente')
				}
			} else if (this.isSelected) {
				return {
					variant: 'secondary',
					label: this.$t('Cambia')
				}
			} else {
				return {
					variant: 'primary',
					label: this.$t('Scegli')
				}
			}
		}
	}
}
</script>

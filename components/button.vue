<template>
	<b-button
		:disabled="isDisabled"
		:class="classes"
		v-bind="$attrs"
		v-on="$listeners">
		<!-- Content (when not loading and not showing success) -->
		<div class="pg-button__content">
			<!-- Left icon -->
			<pg-icon
				v-if="icon && iconPosition === 'left'"
				:icon="icon"
				class="pg-button__icon"
			/>

			<!-- Content -->
			<slot>{{ label }}</slot>

			<!-- Right icon -->
			<pg-icon
				v-if="icon && iconPosition === 'right'"
				:icon="icon"
				class="pg-button__icon"
			/>
		</div>

		<!-- Loading or success icon -->
		<div v-if="loading || successful" class="pg-button__overlay">
			<pg-icon
				v-if="loading"
				icon="circle-outline-notch"
				spinning
				class="pg-button__overlay-icon"
			/>
			<pg-icon
				v-else-if="successful"
				icon="checkmark"
				class="pg-button__overlay-icon"
			/>
		</div>
	</b-button>
</template>

<script>
import { BButton } from 'bootstrap-vue'
import PgIcon from '@/components/icon'

export default {
	name: 'PgButton',

	components: {
		BButton,
		PgIcon
	},

	inheritAttrs: false,

	props: {
		label: {
			type: String,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		},
		loading: {
			type: Boolean,
			default: false
		},
		icon: {
			type: String,
			default: ''
		},
		iconPosition: {
			type: String,
			default: 'left',
			validator: value => ['left', 'right'].indexOf(value) !== -1
		}
	},

	data() {
		return {
			successful: false
		}
	},

	computed: {
		classes() {
			const hasContent = this.label || this.$slots.default

			return {
				'pg-button': true,
				'pg-button--loading': this.loading,
				'pg-button--successful': this.successful,
				'pg-button--icon-left': hasContent && this.iconPosition === 'left',
				'pg-button--icon-right': hasContent && this.iconPosition === 'right'
			}
		},

		isDisabled() {
			return this.disabled || this.loading
		}
	},

	methods: {
		showSuccess(time = 1500) {
			this.successful = true
			setTimeout(() => {
				this.successful = false
			}, time)
		}
	}
}
</script>

<style lang="scss">
.pg-button {
	position: relative;

	&__content {
		transition: opacity 0.2s;
	}
	&__overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&--loading &,
	&--successful & {
		&__content {
			opacity: 0;
		}
	}

	&--icon-left &__icon {
		margin-right: 0.25em;
	}
	&--icon-right &__icon {
		margin-left: 0.25em;
	}
}
</style>

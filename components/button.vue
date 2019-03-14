<template>
	<b-button v-bind="$attrs" :disabled="isDisabled" v-on="$listeners">
		<!-- Left icon (used also as loader) -->
		<pg-icon
			v-if="(icon && iconPosition === 'left') || loading"
			:icon="loading ? 'circle-outline-notch' : icon"
			:spinning="loading"
			class="pg-button__icon"
		/>

		<!-- Content -->
		<slot v-if="!loading">
			{{ label }}
		</slot>

		<!-- Right icon -->
		<pg-icon
			v-if="(icon && iconPosition === 'right') && !loading"
			:icon="icon"
			class="pg-button__icon"
		/>
	</b-button>
</template>

<script>
import BButton from 'bootstrap-vue/es/components/button/button'
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

	computed: {
		isDisabled() {
			return this.disabled || this.loading
		}
	},

	watch: {
		loading() {
			// Keep width when loading
			const el = this.$el

			el.style.width = this.loading ? `${el.offsetWidth}px` : null
		}
	}
}
</script>

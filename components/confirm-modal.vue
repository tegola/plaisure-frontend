<template>
	<b-modal
		:header-text-variant="variant"
		:ok-variant="variant"
		:cancel-title="cancelTitle"
		v-bind="$attrs"
		lazy
		centered
		hide-header-close
		cancel-variant="light"
		:value="value"
		@input="$emit('input', $event)"
		v-on="$listeners">
		<p v-if="$slots.message" class="mb-0">
			<slot name="message" />
		</p>
		<slot />
	</b-modal>
</template>

<script>
import BModal from 'bootstrap-vue/es/components/modal/modal'

export default {
	name: 'PgConfirmModal',

	components: {
		BModal
	},

	inheritAttrs: false,

	props: {
		value: {
			type: Boolean,
			default: false
		},
		variant: {
			type: String,
			default: ''
		},
		cancelTitle: {
			type: String,
			default: function() {
				return this.$t('common.actions.cancel')
			}
		}
	}
}
</script>

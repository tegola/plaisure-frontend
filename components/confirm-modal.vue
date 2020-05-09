<template>
	<b-modal
		:header-text-variant="variant"
		:ok-variant="okVariant || variant"
		:cancel-title="cancelTitle"
		v-bind="$attrs"
		centered
		hide-header-close
		:visible="value"
		@change="$emit('input', $event)"
		v-on="$listeners">
		<p v-if="$slots.message" class="mb-0">
			<slot name="message" />
		</p>
		<slot v-for="(_, name) in $slots" :slot="name" :name="name" />
	</b-modal>
</template>

<script>
import { BModal } from 'bootstrap-vue'

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
		okVariant: {
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

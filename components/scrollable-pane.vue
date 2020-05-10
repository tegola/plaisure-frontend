<template>
	<div :class="classes">
		<slot :inner-class="innerClasses" />
	</div>
</template>

<script>
export default {
	name: 'PgScrollablePane',

	props: {
		disabled: Boolean,
		breakpoints: {
			type: Array,
			default: () => ['xs', 'sm']
		}
	},

	computed: {
		classes () {
			return {
				'pg-scrollable-pane': this.isScrollable,
				'pg-scrollable-pane--disabled': this.disabled
			}
		},

		innerClasses () {
			return this.isScrollable ? 'pg-scrollable-pane__content' : null
		},

		isScrollable () {
			return (
				!this.breakpoints.length || this.breakpoints.includes(this.$mq)
			)
		}
	}
}
</script>

<style lang="scss" scoped>
.pg-scrollable-pane {
	overflow-x: auto;
	-webkit-overflow-scrolling: touch;

	&--disabled {
		overflow-x: hidden;
	}

	&__content {
		white-space: nowrap;
		flex-wrap: nowrap;

		> * {
			white-space: normal;
		}
	}
}
</style>

<template>
	<div :class="isScrollable ? 'pg-scrollable-pane' : null">
		<slot :inner-class="isScrollable ? 'pg-scrollable-pane__content' : null" />
	</div>
</template>

<script>
export default {
	name: 'PgScrollablePane',

	props: {
		breakpoints: {
			type: Array,
			default: () => ['xs', 'sm']
		}
	},

	computed: {
		isScrollable() {
			return (
				!this.breakpoints.length || this.breakpoints.indexOf(this.$mq) !== -1
			)
		}
	}
}
</script>

<style lang="scss" scoped>
.pg-scrollable-pane {
	overflow-x: auto;
	-webkit-overflow-scrolling: touch;

	&__content {
		white-space: nowrap;
		flex-wrap: nowrap;

		> * {
			white-space: normal;
		}
	}
}
</style>

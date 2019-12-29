<template>
	<div class="pg-scrollable-pane">
		<slot />
	</div>
</template>

<script>
export default {
	name: 'PgScrollablePane',

	props: {
		selector: {
			type: String,
			default: '*'
		}
	},

	async mounted() {
		await this.$nextTick()

		this.$el
			.querySelector(this.selector)
			.classList.add('pg-scrollable-pane__content')
	}
}
</script>

<style lang="scss" scoped>
.pg-scrollable-pane {
	@include media-breakpoint-down(sm) {
		& {
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
		}
		&__content {
			white-space: nowrap;
			flex-wrap: nowrap;

			> * {
				white-space: normal;
			}
		}
	}
}
</style>

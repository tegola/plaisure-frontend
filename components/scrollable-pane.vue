<template>
	<div :class="isScrollable ? 'pg-scrollable-pane' : null">
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
		},
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
	},

	watch: {
		$mq: 'setContentClass'
	},

	async mounted() {
		await this.$nextTick()

		this.contentNode = this.$el.querySelector(this.selector)
		this.setContentClass()
	},

	methods: {
		setContentClass() {
			const classList = this.contentNode.classList
			const contentClass = 'pg-scrollable-pane__content'

			if (this.isScrollable) {
				classList.add(contentClass)
			} else {
				classList.remove(contentClass)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.pg-scrollable-pane {
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
</style>

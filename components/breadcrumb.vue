<template>
	<b-breadcrumb class="align-items-center">
		<b-breadcrumb-item
			v-for="(item, index) in visibleItems"
			:key="`item-${index}`"
			v-bind="item">
			<pg-button
				v-if="short && index === 0"
				class="pg-breadcrumb__back"
				icon="arrow-left"
				size="sm"
				variant="olive-800"
			/>
			<template v-else>{{ item.text }}</template>
		</b-breadcrumb-item>
	</b-breadcrumb>
</template>

<script>
import { BBreadcrumb, BBreadcrumbItem } from 'bootstrap-vue'

export default {
	name: 'PgBreadcrumb',

	components: {
		BBreadcrumb,
		BBreadcrumbItem
	},

	props: {
		items: {
			type: Array,
			default: null
		}
	},

	computed: {
		short() {
			return ['xs', 'sm'].includes(this.$mq)
		},

		visibleItems() {
			return this.short ? this.items.slice(-2) : this.items
		}
	}
}
</script>

<style lang="scss">
.pg-breadcrumb__back {
	border-radius: 50%;
	padding: 0.2rem;
	line-height: 1;

	.pg-button__icon {
		width: 1rem;
		height: 1rem;
	}
}
</style>

<script>
export default {
	name: 'PgHomePageToken',

	props: {
		icon: {
			type: String,
			default: null
		},
		type: {
			type: String,
			default: 'category'
		},
		to: {
			type: [String, Object],
			required: true
		}
	},

	computed: {
		classes() {
			return ['pg-home-page__token', `pg-home-page__token--${this.type}`]
		},
		svg() {
			return require(`@/assets/svg/category-icons/${this.icon}.svg?inline`)
				.default
		}
	}
}
</script>

<template>
	<nuxt-link :to="to" :class="classes">
		<component
			:is="svg"
			v-if="icon"
			class="pg-home-page__token-icon"
		/>
		<slot class="pg-home-page__token-label" />
	</nuxt-link>
</template>

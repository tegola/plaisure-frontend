<template>
	<div class="pg-no-items">
		<pg-icon
			v-if="icon"
			:icon="icon"
			class="pg-no-items__icon"
		/>

		<h5 class="pg-no-items__title">{{ title }}</h5>
		<p v-if="subtitle" class="pg-no-items__subtitle">{{ subtitle }}</p>

		<slot />
	</div>
</template>

<script>
export default {
	name: 'PgNoItems',

	props: {
		icon: {
			type: String,
			default: null
		},
		title: {
			type: String,
			default: function() {
				return this.$t('components.no_items.title')
			}
		},
		subtitle: {
			type: String,
			default: null
		}
	}
}
</script>

<style lang="scss">
.pg-no-items {
	color: $gray-400;
	text-align: center;

	&__icon {
		width: $icon-size-base * 4;
		height: $icon-size-base * 4;
		margin-bottom: $spacer / 2;
	}
	&__title,
	&__subtitle {
		margin-bottom: 0;
	}
	&__title + &__subtitle {
		margin-top: $headings-margin-bottom;
	}
}
</style>

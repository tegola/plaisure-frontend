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
		classes () {
			return ['pg-home-page__token', `pg-home-page__token--${this.type}`]
		},
		svg () {
			return () => import(`@/assets/svg/category-icons/${this.icon}.svg?inline`)
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

<style lang="scss">
.pg-home-page {
	&__token {
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 1rem;
		border-radius: 3rem;
		color: $body-color;
		background-color: $white;
		box-shadow: 0 0 0 2px transparent inset, 0 1px 0 rgba($black, 0.08),
			0 1px 3px rgba($black, 0.1);
		transition: 0.15s;
		outline: none;

		// Spacing
		line-height: $line-height-base; // Reset parent line height
		margin-left: -0.5rem;
		margin-right: 1.5rem;

		&:hover,
		&:focus {
			color: inherit;
			text-decoration: none;
		}
	}
	&__token-icon {
		width: 40px;
		height: 40px;
		margin-left: -0.5rem;
		margin-right: 0.5rem;
	}

	&__token--category {
		&:hover,
		&:focus {
			box-shadow: 0 0 0 2px $green-500 inset, 0 1px 0 rgba($black, 0.08),
				0 1px 3px rgba($black, 0.1);
		}

		.pg-home-page__token-icon {
			fill: $green-500;

			.pg-svg__background {
				fill: $green-100;
			}
		}
	}
	&__token--city {
		&:hover,
		&:focus {
			box-shadow: 0 0 0 2px $fuchsia-500 inset, 0 1px 0 rgba($black, 0.08),
				0 1px 3px rgba($black, 0.1);
		}

		.pg-home-page__token-icon {
			fill: $fuchsia-500;

			.pg-svg__background {
				fill: $fuchsia-200;
			}
		}
	}
}
</style>

<template>
	<component :is="svg" :class="classes" v-on="$listeners" />
</template>

<script>
export default {
	name: 'PgIcon',

	props: {
		icon: {
			type: String,
			required: true
		},
		size: {
			type: String,
			default: null,
			validator: value => ['2x', '3x', '4x'].includes(value)
		},
		spinning: {
			type: Boolean,
			default: false
		}
	},

	computed: {
		classes () {
			return [
				'pg-icon',
				`pg-icon--${this.icon}`,
				this.size ? `pg-icon--${this.size}` : null,
				this.spinning ? 'pg-icon--spinning' : null
			]
		},
		svg () {
			return () => import(`@/assets/svg/icons/${this.icon}.svg?inline`)
		}
	}
}
</script>

<style lang="scss">
.pg-icon {
	display: inline-block;
	width: $icon-size-base;
	height: $icon-size-base;
	fill: currentColor;
	vertical-align: -0.25em;

	> svg {
		vertical-align: 0;
	}

	// Sizes
	&--2x {
		width: $icon-size-base * 2;
		height: $icon-size-base * 2;
	}
	&--3x {
		width: $icon-size-base * 3;
		height: $icon-size-base * 3;
	}
	&--4x {
		width: $icon-size-base * 4;
		height: $icon-size-base * 4;
	}

	// Spinning icon
	&--spinning {
		animation: pg-icon__spin 1s infinite linear;
	}
}

@keyframes pg-icon__spin {
	100% {
		transform: rotate(360deg);
	}
}
</style>

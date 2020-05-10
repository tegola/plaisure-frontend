<template>
	<div :class="classes">
		<div class="pg-notification__inner">
			<pg-button
				v-if="dismissible"
				class="pg-notification__close"
				variant="naked"
				@click="$emit('dismiss')">
				<pg-icon icon="close" />
			</pg-button>
			<h6 v-if="title" class="pg-notification__title">{{ title }}</h6>
			<div class="pg-notification__text">
				<slot />
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'PgNotification',

	props: {
		variant: {
			type: String,
			default: 'success'
		},

		title: {
			type: String,
			default: ''
		},

		dismissible: {
			type: Boolean,
			default: false
		}
	},

	computed: {
		classes () {
			return ['pg-notification', 'pg-notification--' + this.variant]
		}
	}
}
</script>

<style lang="scss">
.pg-notification {
	margin: 1rem;
	background-color: rgba(#fff, 0.85);
	border-radius: $border-radius-sm;
	backdrop-filter: blur(20px) saturate(180%);
	box-shadow: 0 0 1px rgba($black, 0.2), $box-shadow;
	overflow: auto;

	&__inner {
		border-left: 2px solid transparent;
		padding: 0.5rem 1rem;
		font-size: $font-size-sm;
		line-height: $line-height-sm;
	}
	&__close {
		float: right;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		margin-top: -0.5rem;
		margin-right: -1rem;
		cursor: pointer;
		opacity: 0.5;
		transition: 0.2s;
		color: inherit !important;

		&:hover {
			opacity: 1;
		}
	}
	&__title {
		font-size: 90%;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-top: 0.35em;
		margin-bottom: 0;
	}
	&__title + &__text {
		margin-top: 0.5rem;
	}

	// Variants
	&--success & {
		&__inner {
			border-left-color: $success;
		}
		&__title {
			color: $success;
		}
	}

	&--warning & {
		&__inner {
			border-left-color: $warning;
		}
		&__title {
			color: darken($warning, 8%);
		}
	}

	&--danger & {
		&__inner {
			border-left-color: $danger;
		}
		&__title {
			color: $danger;
		}
	}

	// Animation
	&__slide-enter-active,
	&__slide-leave-active,
	&__slide-move {
		transition: 0.15s ease-in-out;
		top: 0;
	}
	&__slide-enter,
	&__slide-leave-to {
		opacity: 0;
		transform: translateY(-100%);
	}
}
</style>

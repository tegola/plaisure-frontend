<template>
	<transition appear>
		<div :class="classes">
			<div class="pg-standout-alert__inner">
				<div class="pg-standout-alert__content">
					<slot />
				</div>
				<pg-button
					v-if="dismissible"
					class="pg-standout-alert__close"
					variant="naked"
					@click="$emit('dismiss')">
					<pg-icon icon="close" />
				</pg-button>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'PgStandoutAlert',

	props: {
		position: {
			type: String,
			default: 'top'
		},

		dismissible: {
			type: Boolean,
			default: false
		}
	},

	computed: {
		classes () {
			return {
				'pg-standout-alert': true,
				'pg-standout-alert--top': this.position === 'top',
				'pg-standout-alert--bottom': this.position === 'bottom'
			}
		}
	}
}
</script>

<style lang="scss">
.pg-standout-alert {
	position: fixed;
	left: 0;
	right: 0;
	z-index: $zindex-modal-backdrop;
	display: flex;
	justify-content: center;

	&__inner {
		display: flex;
		align-items: stretch;
		margin: 1rem;
		background-color: rgba(#fff, 0.85);
		border-radius: $border-radius-sm;
		backdrop-filter: blur(20px) saturate(180%);
		box-shadow: 0 0 1px rgba($black, 0.2), $box-shadow;
	}

	&__content {
		padding: 0.5rem 1rem;
		font-size: $font-size-sm;
		line-height: $line-height-sm;
	}

	&__close {
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		cursor: pointer;
		opacity: 0.5;
		transition: 0.2s;

		&:hover {
			opacity: 1;
		}
	}

	&.v-enter-active,
	&.v-leave-active {
		transition: 0.15s ease-in-out;
	}

	&.v-enter,
	&.v-leave-to {
		opacity: 0;
	}

	&--top {
		top: 0;

		&.v-enter,
		&.v-leave-to {
			transform: translateY(-100%);
		}
	}
	&--bottom {
		bottom: 0;

		&.v-enter,
		&.v-leave-to {
			transform: translateY(100%);
		}
	}
}
</style>

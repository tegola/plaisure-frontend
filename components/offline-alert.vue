<template>
	<transition appear>
		<div v-if="$nuxt.isOffline" class="pg-offline-alert">
			<div class="pg-offline-alert__inner">
				{{ $t('components.offline_alert.offline') }}
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'PgOfflineAlert'
}
</script>

<style lang="scss">
.pg-offline-alert {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: $zindex-modal-backdrop;
	display: flex;
	justify-content: center;

	&__inner {
		margin: 1rem auto;
		background-color: rgba(#fff, 0.85);
		color: theme-color(danger);
		font-size: $font-size-sm;
		padding: 0.3rem 0.75rem;
		border-radius: $border-radius;
		backdrop-filter: blur(20px) saturate(180%);
		background-clip: padding-box;
		box-shadow: 0 0 1px rgba($black, 0.1), $box-shadow;
	}

	&.v-enter-active,
	&.v-leave-active {
		transition: 0.15s ease-in-out;
	}

	&.v-enter,
	&.v-leave-to {
		opacity: 0;
		transform: translateY(-100%);
	}
}
</style>

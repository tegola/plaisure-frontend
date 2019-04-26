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

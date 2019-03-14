<template>
	<transition appear>
		<b-alert v-if="$nuxt.isOffline" show variant="danger" class="pg-offline-alert">
			{{ $t('components.offline_alert.offline') }}
		</b-alert>
	</transition>
</template>

<script>
import BAlert from 'bootstrap-vue/es/components/alert/alert'

export default {
	name: 'PgOfflineAlert',

	components: {
		BAlert
	}
}
</script>

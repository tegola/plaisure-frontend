<template>
	<div>
		<nuxt />
		<pg-offline-alert />
	</div>
</template>

<script>
import PgOfflineAlert from '@/components/offline-alert'

export default {
	components: {
		PgOfflineAlert
	}
}
</script>

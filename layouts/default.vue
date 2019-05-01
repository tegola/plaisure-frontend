<template>
	<div>
		<nuxt />

		<pg-standout-alert v-if="$nuxt.isOffline" class="text-danger">
			{{ $t('common.status.offline') }}
		</pg-standout-alert>

		<!--
		<pg-standout-alert position="bottom" dismissable @dismiss="acceptCookies">
			<i18n path="common.cookie.agree">
				<a href="#" place="policy_link" class="text-accent">{{ $t('common.cookie.link') }}</a>
			</i18n>
		</pg-standout-alert>
	-->
	</div>
</template>

<script>
import PgStandoutAlert from '@/components/standout-alert'

export default {
	components: {
		PgStandoutAlert
	},

	methods: {
		acceptCookies() {
			// eslint-disable-next-line
			console.log('acceptCookies')
		}
	}
}
</script>

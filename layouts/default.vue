<template>
	<div>
		<nuxt />

		<pg-standout-alert v-if="$nuxt.isOffline" class="text-danger">
			{{ $t('common.status.offline') }}
		</pg-standout-alert>

		<notifications
			:position="['top', 'center']"
			animation-name="pg-notification__slide"
			class="pg-notification-list">
			<template #body="props">
				<pg-notification
					dismissible
					:variant="props.item.type"
					:title="props.item.title"
					@dismiss="props.close()">
					{{ props.item.text }}
				</pg-notification>
			</template>
		</notifications>


		<!--
		<pg-standout-alert position="bottom" dismissible @dismiss="acceptCookies">
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

<template>
	<div class="pg-error-page">
		<pg-navbar />

		<div>
			<div class="my-5">
				<component :is="component" :error="error" />
			</div>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
import PgBasicErrorPage from '@/components/pages/errors/basic'
import PgVenueClosedErrorPage from '@/components/pages/errors/venue-closed'

export default {
	components: {
		PgBasicErrorPage,
		PgVenueClosedErrorPage
	},

	props: {
		error: {
			type: Object,
			default: null
		}
	},

	computed: {
		component () {
			const routeName = this.$route.name

			return routeName &&
				routeName.startsWith('venues-id___') &&
				this.error.statusCode === 404
				? 'pg-venue-closed-error-page'
				: 'pg-basic-error-page'
		}
	},

	head () {
		// https://nuxt-community.github.io/nuxt-i18n/seo.html#improving-performance
		return this.$nuxtI18nSeo()
	}
}
</script>

<style lang="scss">
.pg-error-page {
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
</style>

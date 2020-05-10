<template>
	<div class="container text-center">
		<h1 class="display-1 font-weight-normal">{{ code }}</h1>
		<p class="lead">{{ message }}</p>
		<nuxt-link :to="localePath('index')">
			<pg-icon icon="arrow-left" />
			{{ $t('pages.errors.basic.back') }}
		</nuxt-link>
	</div>
</template>

<script>
export default {
	name: 'ApBasicErrorPage',

	props: {
		error: {
			type: Object,
			default: null
		}
	},

	computed: {
		code () {
			return (this.error && this.error.statusCode) || 500
		},

		message () {
			switch (this.code) {
				case 404:
					return this.$t('pages.errors.basic.not_found')
				case 500:
					return this.$t('pages.errors.basic.server_error')
				default:
					return this.error.message || this.$t('pages.errors.basic.not_found')
			}
		}
	}
}
</script>

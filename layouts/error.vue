<template>
	<div>
		<pg-navbar />

		<div class="container my-5 text-center">
			<h1 class="display-1 font-weight-normal">{{ code }}</h1>
			<p class="lead">{{ message }}</p>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
export default {
	props: {
		error: {
			type: Object,
			default: null
		}
	},

	head: {
		bodyAttrs: {
			class: 'pg-error-page'
		}
	},

	computed: {
		code() {
			return (this.error && this.error.statusCode) || 500
		},
		message() {
			switch (this.code) {
				case 404:
					return this.$t('pages.error.not_found')
				case 500:
					return this.$t('pages.error.server_error')
				default:
					return this.error.message || this.$t('pages.error.not_found')
			}
		}
	}
}
</script>

<style lang="scss">
@import 'assets/scss/variables';

.pg-error-page {
	background-color: $gray-100;

	.navbar-light {
		background-color: transparent;
	}
}
</style>

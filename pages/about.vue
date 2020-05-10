<template>
	<div>
		<pg-navbar />

		<div class="container my-5">
			<div class="row section">
				<div class="col-md-10 mx-md-auto col-lg-8">
					<h2 class="display-4 mb-4 font-weight-semibold text-center">{{ $t('pages.about.company.title', { name: $constants.APP_NAME }) }}</h2>
					<p>{{ $t('pages.about.company.paragraph1', { name: $constants.APP_NAME }) }}</p>
					<p>{{ $t('pages.about.company.paragraph2', { name: $constants.APP_NAME }) }}</p>
					<p>{{ $t('pages.about.company.paragraph3') }}</p>
					<p>{{ $t('pages.about.company.paragraph4', { name: $constants.APP_NAME }) }}</p>
					<p>{{ $t('pages.about.company.paragraph5', { name: $constants.APP_NAME }) }}</p>

					<div class="text-center mt-5">
						<h3 id="contact" class="font-weight-semibold mb-3">{{ $t('pages.about.contact.title') }}</h3>
						<p>{{ $t('pages.about.contact.intro') }}</p>
						<p>
							{{ $t('pages.about.contact.info') }}<br>
							<a :href="`mailto:${$constants.EMAIL_GENERIC}`"><strong>{{ $constants.EMAIL_GENERIC }}</strong></a>
						</p>
						<p>
							{{ $t('pages.about.contact.help') }}<br>
							<a :href="`mailto:${$constants.EMAIL_HELP}`"><strong>{{ $constants.EMAIL_HELP }}</strong></a>
						</p>
						<p>
							{{ $t('pages.about.contact.report') }}<br>
							<a :href="`mailto:${$constants.EMAIL_REPORT}`"><strong>{{ $constants.EMAIL_REPORT }}</strong></a>
						</p>
					</div>
				</div>
			</div>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
export default {
	name: 'PgAboutPage',

	head () {
		return {
			title: this.$t('pages.about.meta_title')
		}
	}
}
</script>

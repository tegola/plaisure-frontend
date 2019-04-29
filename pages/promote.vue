<template>
	<div class="pg-promote-page">
		<pg-navbar />

		<div class="jumbotron jumbotron-fluid mb-0">
			<div class="container text-center">
				<div class="row">
					<div class="col-10 col-lg-9 mx-auto">
						<h1 class="jumbotron-title">{{ $t('pages.promote.hero.title') }}</h1>
						<i18n tag="p" class="jumbotron-text" path="pages.promote.hero.paragraph">
							<span place="name">{{ $constants.APP_NAME }}</span>
							<strong place="strong">{{ $t('pages.promote.hero.paragraph_strong') }}</strong>
						</i18n>
					</div>
				</div>
			</div>
		</div>

		<div class="container">
			<div class="section">
				<div class="row my-5">
					<div class="col-md-10 mx-md-auto col-lg-9">
						<p class="mb-0">{{ $t('pages.promote.example.paragraph1') }}</p>
					</div>
				</div>

				<figure class="figure">
					<img src="/img/promote/example.png" class="figure-img img-fluid rounded">
				</figure>

				<div class="row">
					<div class="col-md-10 mx-md-auto col-lg-9">
						<i18n tag="p" path="pages.promote.example.paragraph2">
							<span v-for="n in 4" :key="n" :place="n" class="badge badge-pill badge-accent">{{ n }}</span>
						</i18n>
					</div>
				</div>

				<div class="row mb-5">
					<div class="col-md-10 mx-md-auto col-lg-9">
						<p>{{ $t('pages.promote.example.paragraph3') }}</p>
						<p>{{ $t('pages.promote.example.paragraph4', { name: $constants.APP_NAME }) }}</p>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-md-10 mx-md-auto col-lg-9">
					<div class="section mb-5">
						<h2 class="section-title text-center">{{ $t('pages.promote.cost.title') }}</h2>
						<i18n tag="p" path="pages.promote.cost.paragraph1">
							<span place="name">{{ $constants.APP_NAME }}</span>
							<strong place="strong">{{ $t('pages.promote.cost.paragraph1_strong') }}</strong>
						</i18n>
						<p>{{ $t('pages.promote.cost.paragraph2', { name: $constants.APP_NAME }) }}</p>
					</div>

					<div class="section my-5">
						<h2 class="section-title text-center">{{ $t('pages.promote.start.title') }}</h2>
						<p>{{ $t('pages.promote.start.paragraph1', { name: $constants.APP_NAME }) }}</p>
						<i18n tag="p" path="pages.promote.start.paragraph2">
							<span place="name">{{ $constants.APP_NAME }}</span>
							<strong place="strong">{{ $t('pages.promote.start.paragraph2_strong') }}</strong>
						</i18n>
						<p class="text-center my-5">
							<nuxt-link v-if="$auth.user" :to="localePath('user')" class="btn btn-lg btn-primary">{{ $t('pages.promote.manage') }}</nuxt-link>
							<nuxt-link v-else :to="localePath('register')" class="btn btn-lg btn-primary">{{ $t('pages.promote.register') }}</nuxt-link>
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
	name: 'PgPromotePage',

	head() {
		return {
			title: this.$t('pages.promote.meta_title')
		}
	}
}
</script>

<style lang="scss">
.pg-promote-page {
	.jumbotron {
		background-color: $palette-green-100;
		color: $palette-dark-green-500;
	}
	.jumbotron-title {
		font-size: $h2-font-size;
		font-weight: $font-weight-bold;
	}
	.section-title {
		margin-bottom: $spacer;
	}

	@include media-breakpoint-up(md) {
		.jumbotron-title {
			font-size: $display3-size;
			margin-bottom: $spacer * 2;
		}
		.jumbotron-text {
			font-size: $font-size-lg;
		}
		.section-title {
			font-size: $h3-font-size;
		}
	}
}
</style>

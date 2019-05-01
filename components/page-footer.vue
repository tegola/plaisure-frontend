<template>
	<footer class="pg-footer">
		<div class="container">
			<ul v-if="$mq == 'comfortable'" class="list-inline">
				<li class="list-inline-item">
					<nuxt-link :to="localePath('venues-explore')">{{ $t('components.footer.search') }}</nuxt-link>
				</li>
				<li class="list-inline-item">
					<nuxt-link :to="localePath('promote')">{{ $t('components.footer.promote') }}</nuxt-link>
				</li>
				<li class="list-inline-item">
					<nuxt-link :to="localePath('about')">{{ $t('components.footer.about') }}</nuxt-link>
				</li>
				<li v-if="$i18n.locale == 'it'" class="list-inline-item">
					<nuxt-link :to="localePath('play-responsibly')">{{ $t('components.footer.responsible_gaming') }}</nuxt-link>
				</li>
			</ul>

			<div v-if="$i18n.locale == 'it'" class="my-5">
				<ul class="list-inline mb-0">
					<li class="list-inline-item mb-3">
						<a href="https://www.agenziadoganemonopoli.gov.it/">
							<img class="pg-footer__aams-img" src="/img/footer-aams-1.svg">
						</a>
					</li>
					<li class="list-inline-item">
						<a href="https://www.agenziadoganemonopoli.gov.it/portale/monopoli">
							<img class="pg-footer__aams-img" src="/img/footer-aams-2.svg">
						</a>
					</li>
					<li class="list-inline-item">
						<span class="badge pg-footer__age-badge" aria-hidden="true">18+</span>
						<span class="pg-footer__age-text">
							Il gioco è vietato<br>
							ai minori di 18 anni
						</span>
					</li>
				</ul>
				<p class="small">Informati sulle probabilità di vincita e sul regolamento di gioco sul sito <a href="https://www.agenziadoganemonopoli.gov.it">agenziadoganemonopoli.gov.it</a></p>
			</div>

			<pg-logo flat no-text class="pg-footer__logo" />
			<p class="small">
				{{ $t('components.footer.copyright', { year, company: $constants.COMPANY_NAME }) }}<br>
				{{ $t('components.footer.vat', { number: $constants.COMPANY_VAT_NUMBER }) }}
			</p>

			<ul class="list-inline small mb-0">
				<li class="list-inline-item mr-4">
					<a href="https://www.iubenda.com/privacy-policy/79118168" target="_blank">Privacy policy</a>
				</li>
				<li v-for="locale in $i18n.locales" :key="locale.code" class="list-inline-item">
					<nuxt-link v-if="locale.code != $i18n.locale" :to="switchLocalePath(locale.code)">{{ locale.name }}</nuxt-link>
					<strong v-else>{{ locale.name }}</strong>
				</li>
			</ul>
		</div>
	</footer>
</template>

<script>
export default {
	name: 'PgPageFooter',

	computed: {
		year() {
			return new Date().getFullYear()
		}
	}
}
</script>

<style lang="scss">
.pg-footer {
	margin-top: map-get($spacers, 5);
	margin-bottom: map-get($spacers, 5);
	color: $text-muted;
	font-size: $font-size-sm;
	text-align: center;

	// Link color
	a {
		&:not(:hover) {
			color: inherit;
		}
		&:hover {
			color: theme-color('primary');
		}
	}

	// Logos and warning badge
	&__aams-img {
		height: 54px;
	}
	&__age-badge {
		background-color: gray('600');
		color: $white;
		padding: 0.6em 0.4em 0.6em 0.6em;
		margin-right: map-get($spacers, 1);
	}
	&__age-text {
		font-size: $font-size-xs;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		display: inline-block;
		vertical-align: -0.4rem;
		line-height: 1.1;
	}

	// Logo
	&__logo {
		height: 32px;
		color: $gray-500;
		margin-bottom: 0.25rem;
	}
}
</style>

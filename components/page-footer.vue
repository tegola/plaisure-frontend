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
				<li class="list-inline-item">
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

			<pg-logo :text="false" class="pg-footer__logo" />
			<p class="mb-0">
				{{ $t('components.footer.copyright', { year, company: $constants.COMPANY_NAME }) }}<br>
				{{ $t('components.footer.vat', { number: $constants.COMPANY_VAT_NUMBER }) }}
			</p>
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

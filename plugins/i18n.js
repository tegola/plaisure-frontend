export default ({ app }) => {
	const i18n = app.i18n

	// Add iso code and region ------------------------------------------------
	const setIsoCodeAndRegion = language => {
		const locale = i18n.locales.find(locale => locale.code === language)
		const isoCode = locale.iso
		const region = locale.iso.split(/-|_/)[1]

		Object.assign(i18n, { isoCode, region })
	}

	// Initial value
	setIsoCodeAndRegion(i18n.locale)

	// Updated value on language switch
	i18n.onLanguageSwitched = (oldLocale, newLocale) => {
		setIsoCodeAndRegion(newLocale)
	}

	// Language setup with lazy loading ---------------------------------------
	i18n.loadLanguage = language => {
		if (i18n.locale !== language && !i18n.loadedLanguages.includes(language)) {
			return import(`@/lang/${language}`).then(messages => {
				i18n.setLocaleMessage(language, messages.default)
				i18n.loadedLanguages.push(language)
				return language
			})
		}
		return Promise.resolve(language)
	}
}

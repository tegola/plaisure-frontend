export default ({ app }) => {
	const getIsoCodeAndRegion = language => {
		const locale = app.i18n.locales.find(locale => locale.code === language)
		const isoCode = locale.iso
		const region = locale.iso.split(/-|_/)[1]

		return { isoCode, region }
	}

	// Initial value
	Object.assign(app.i18n, getIsoCodeAndRegion(app.i18n.locale))

	// Updated value on language switch
	app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
		Object.assign(app.i18n, getIsoCodeAndRegion(newLocale))
	}
}

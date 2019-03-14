export default ({ app }) => {
	const findRegion = language => {
		return app.i18n.locales
			.find(locale => locale.code === language)
			.iso.split(/-|_/)[1]
	}

	// Initial value
	app.i18n.region = findRegion(app.i18n.locale)

	// Updated value on language switch
	app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
		app.i18n.region = findRegion(newLocale)
	}
}

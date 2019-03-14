// Load all supported languages, we can't load them dynamically in a build
import countriesIt from '@umpirsky/country-list/data/it/country.json'
import countriesEn from '@umpirsky/country-list/data/en/country.json'

export default ({ app }, inject) => {
	const region = app.i18n.region

	let countries
	const options = []

	switch (app.i18n.locale) {
		case 'it':
			countries = countriesIt
			break
		case 'en':
			countries = countriesEn
			break
	}

	Object.keys(countries).forEach(code => {
		const obj = {
			value: code,
			text: countries[code]
		}

		// Add current country + separator to top of the list
		if (code === region) {
			options.unshift(obj, {
				value: '-',
				text: '–',
				disabled: true
			})
		}

		// Country in current loop
		options.push(obj)
	})

	// Add empty value
	options.unshift({
		value: '', // Default value in db
		text: app.i18n.t('common.actions.select') + '...'
	})

	inject('countrySelectOptions', options)
}

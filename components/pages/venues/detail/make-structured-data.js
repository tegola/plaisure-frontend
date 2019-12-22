import extend from 'lodash/extend'

export default venue => {
	// General
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'EntertainmentBusiness',
		name: venue.name,
		url: `${process.env.APP_URL}/venues/${venue.id}`,
		address: {
			'@type': 'PostalAddress',
			streetAddress: venue.address_line1,
			addressLocality: [venue.address_line2, venue.address.city].join(', '),
			postalCode: venue.address.postcode,
			addressCountry: venue.country
		},
		geo: {
			'@type': 'GeoCoordinates',
			latitude: venue.coords.lat,
			longitude: venue.coords.lng
		},
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingCount: venue.rating.count,
			ratingValue: venue.rating.average,
			reviewCount: venue.review_count
		}
	}

	// Conditional fields
	if (venue.description) structuredData.description = venue.description
	if (venue.contacts.phone) structuredData.telephone = venue.contacts.phone
	if (venue.contacts.email) structuredData.email = venue.contacts.email

	// Photos
	if (venue.photos.length) {
		structuredData.image = venue.photos[0].thumbnail_url
	} else {
		const sizes = ['16x9', '4x3', '1x1']

		structuredData.image = sizes.map(
			size => `${process.env.APP_URL}/img/schema/${size}.png`
		)
	}

	// Business hours
	const openingHours = []

	venue.business_hours.forEach((hours, dayIndex) => {
		// Subtracting today index from the specified day index
		const date = new Date()
		const today = date.getDay()
		const distance = dayIndex - today

		date.setDate(date.getDate() + distance)

		// Get the two letter day name in en, as per openingHours
		// specification
		const dayName = date
			.toLocaleDateString('en', { weekday: 'short' })
			.substring(0, 2)

		// Prepare a template, in case we have a split hour day (need
		// to pass them as two rows)
		const template = {
			'@type': 'OpeningHoursSpecification',
			dayOfWeek: dayName,
			opens: '',
			closes: ''
		}

		openingHours.push(
			extend({}, template, {
				opens: hours[0],
				closes: hours[1]
			})
		)

		if (hours.length > 2) {
			openingHours.push(
				extend({}, template, {
					opens: hours[2],
					closes: hours[3]
				})
			)
		}
	})

	structuredData.openingHoursSpecification = openingHours

	return structuredData
}

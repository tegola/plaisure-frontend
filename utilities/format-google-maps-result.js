export default (result) => {
	const googleConfidenceLookup = {
		ROOFTOP: 1,
		RANGE_INTERPOLATED: 0.9,
		GEOMETRIC_CENTER: 0.7,
		APPROXIMATE: 0.5
	}

	const extractedObj = {
		readableAddress: null,
		formattedAddress: result.formatted_address || null,
		latitude: result.geometry.location.lat(),
		longitude: result.geometry.location.lng(),
		extra: {
			googlePlaceId: result.place_id || null,
			confidence: googleConfidenceLookup[result.geometry.location_type] || 0,
			premise: null,
			subpremise: null,
			neighborhood: null,
			establishment: null
		},
		administrativeLevels: {}
	}

	for (let i = 0; i < result.address_components.length; i++) {
		const components = result.address_components[i]
		const type = components.types[0]

		switch (type) {
			// Country
			case 'country':
				extractedObj.country = components.long_name
				extractedObj.countryCode = components.short_name
				break
			// Administrative Level 1
			case 'administrative_area_level_1':
				extractedObj.administrativeLevels.level1long = components.long_name
				extractedObj.administrativeLevels.level1short = components.short_name
				break
			// Administrative Level 2
			case 'administrative_area_level_2':
				extractedObj.administrativeLevels.level2long = components.long_name
				extractedObj.administrativeLevels.level2short = components.short_name
				break
			// Administrative Level 3
			case 'administrative_area_level_3':
				extractedObj.administrativeLevels.level3long = components.long_name
				extractedObj.administrativeLevels.level3short = components.short_name
				break
			// Administrative Level 4
			case 'administrative_area_level_4':
				extractedObj.administrativeLevels.level4long = components.long_name
				extractedObj.administrativeLevels.level4short = components.short_name
				break
			// Administrative Level 5
			case 'administrative_area_level_5':
				extractedObj.administrativeLevels.level5long = components.long_name
				extractedObj.administrativeLevels.level5short = components.short_name
				break
			// City
			case 'locality':
				extractedObj.city = components.long_name
				break
			// Address
			case 'postal_code':
				extractedObj.zipcode = components.long_name
				break
			case 'route':
				extractedObj.streetName = components.long_name
				break
			case 'street_number':
				extractedObj.streetNumber = components.long_name
				break
			case 'premise':
				extractedObj.extra.premise = components.long_name
				break
			case 'subpremise':
				extractedObj.extra.subpremise = components.long_name
				break
			case 'establishment':
				extractedObj.extra.establishment = components.long_name
				break
			case 'sublocality_level_1':
			case 'political':
			case 'sublocality':
			case 'neighborhood':
				if (!extractedObj.extra.neighborhood) {
					extractedObj.extra.neighborhood = components.long_name
				}
				break
		}
	}

	// Readable address from name and result or from inferred street name and
	// administrative level 3
	if (result.name) {
		extractedObj.readableAddress =
			result.vicinity && result.name !== result.vicinity
				? [result.name, result.vicinity].join(', ')
				: result.name
	} else {
		extractedObj.readableAddress = [
			extractedObj.streetName,
			extractedObj.administrativeLevels.level3long
		]
			.filter(Boolean)
			.join(', ')
	}

	return extractedObj
}

export const toSearchParams = input => {
	const output = {}

	// q = query
	// e.g.: q=London
	if (input.q) {
		output.query = input.q
	}

	// geo = country
	// e.g. = geo=IT
	if (input.geo) {
		output.country = input.geo
	}

	// c = center
	// e.g.: c=42.076,12.216
	if (input.c) {
		const [centerLat, centerLng] = input.c.split(',').map(i => parseFloat(i))

		output.c_lat = centerLat
		output.c_lng = centerLng
	}

	// b = bounds
	// e.g.: b=42.519,15.293,41.634,13.138
	if (input.b) {
		const [neLat, neLng, swLat, swLng] = input.b
			.split(',')
			.map(i => parseFloat(i))

		output.ne_lat = neLat
		output.ne_lng = neLng
		output.sw_lat = swLat
		output.sw_lng = swLng
	}

	// r = radius
	// e.g.: r=10
	if (input.r) {
		output.radius = parseInt(input.r)
	}

	// t = types = categories
	// e.g. t=1,2,3
	if (input.t) {
		output.categories = input.t.split(',').map(i => parseInt(i))
	}

	return output
}

export const toQueryParams = input => {
	const output = {}

	// query = q
	if (input.query) {
		output.q = input.query
	}

	// country = geo
	if (input.country) {
		output.geo = input.country
	}

	// center = c
	if (input.c_lat && input.c_lng) {
		output.c = [input.c_lat, input.c_lng].join(',')
	}

	// bounds = b
	if (input.ne_lat && input.ne_lng && input.sw_lat && input.sw_lng) {
		output.b = [input.ne_lat, input.ne_lng, input.sw_lat, input.sw_lng].join(
			','
		)
	}

	// radius = r
	if (input.radius) {
		output.r = input.radius
	}

	// categories = types = t
	if (input.categories && input.categories.length) {
		output.t = input.categories.join(',')
	}

	return output
}

export default { toSearchParams, toQueryParams }

export default function ({ $axios, app, redirect }) {
	const auth = app.$auth
	const router = app.router
	const i18n = app.i18n

	// Redirect to login on axios error ---------------------------------------
	$axios.onError((error) => {
		const code = parseInt(error.response && error.response.status)

		if (code === 401) {
			auth.logout()
			redirect('/login')
		}

		return Promise.reject(error)
	})

	// Go to localized redirect page after login or logout --------------------
	// We disabled watchLoggedIn since it would always redirect to the english
	// version
	auth.$storage.watchState('loggedIn', (loggedIn) => {
		const language = loggedIn
			? auth.user.locale.split(/-|_/)[0] // get it from user
			: i18n.locale // get it from current language

		// Find localized redirect path
		const path = auth.$storage.getUniversal('redirect') || auth.options.redirect.home
		const route = router.match(path)
		const routeName = app.getRouteBaseName(route)

		// Remove current redirect
		auth.$storage.setUniversal('redirect', null)

		// Redirect to localized path
		router.push(app.localePath(routeName, language))
	})
}

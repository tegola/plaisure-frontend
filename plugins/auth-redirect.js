export default function({ $axios, app, redirect }) {
	const auth = app.$auth
	// const router = app.router
	// const i18n = app.i18n

	// Redirect to login on axios error ---------------------------------------
	$axios.onError(error => {
		const code = parseInt(error.response && error.response.status)

		if ([401, 403].includes(code)) {
			auth.logout()
			redirect('/login')
		}

		return Promise.reject(error)
	})

	// Go to localized redirect page after login or logout --------------------
	/*
	auth.$storage.watchState('loggedIn', async loggedIn => {
		const language = loggedIn
			? auth.user.locale.split(/-|_/)[0] // get it from user
			: i18n.locale // get it from current language

		// Load language files for the user language
		await i18n.loadLanguage(language)

		// Redirect to redirect path
		const path =
			auth.$storage.getUniversal('redirect') || auth.options.redirect.home
		const route = router.match(path)
		const routeName = app.getRouteBaseName(route)

		// eslint-disable-next-line
		console.log('redirect precedente', auth.$storage.getUniversal('redirect'))

		// auth.$storage.setUniversal('redirect', null)

		// eslint-disable-next-line
		console.log('redirect in lingua', routeName, language)

		// router.push(app.localePath(routeName, language))
	})
	*/
}

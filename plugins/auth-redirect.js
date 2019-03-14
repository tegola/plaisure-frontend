export default function({ $axios, $router, app }) {
	$axios.onError(error => {
		const code = parseInt(error.response && error.response.status)

		if ([401, 403].includes(code)) {
			app.$auth.logout()
			$router.replace('/login')
		}

		return Promise.reject(error)
	})
}

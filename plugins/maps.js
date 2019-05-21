import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

export default ({ app, env }) => {
	Vue.use(VueGoogleMaps, {
		load: {
			key: env.GOOGLE_MAPS_KEY,
			language: app.i18n.locale,
			region: app.i18n.region,
			libraries: 'places'
		},
		installComponents: false
	})
}

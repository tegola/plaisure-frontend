import { load } from 'vue2-google-maps'

export default ({ app, env }) => {
	load({
		key: env.GOOGLE_MAPS_KEY,
		language: app.i18n.locale,
		region: app.i18n.region,
		libraries: 'places'
	})
}

import Vue from 'vue'
import { VBTooltip, VBScrollspy } from 'bootstrap-vue'

Vue.directive('b-tooltip', VBTooltip)
Vue.directive('b-scrollspy', VBScrollspy)

// Track outbound links with google analytics
Vue.directive('track-link', {
	bind(el, binding, vnode) {
		const ga = vnode.context.$ga

		if (!ga) return

		el.addEventListener('click', e => {
			const url = e.target.href
			const newWindow = e.target.target

			e.preventDefault()

			ga.event('outbound', 'link', url, {
				transport: 'beacon',
				hitCallback() {
					if (newWindow) {
						window.open(url)
					} else {
						document.location = url
					}
				}
			})
		})
	}
})

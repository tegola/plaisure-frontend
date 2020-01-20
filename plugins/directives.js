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
			ga.event('outbound', 'link', e.target.href, {
				transport: 'beacon'
			})
		})
	}
})

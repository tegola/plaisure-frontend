import anime from 'animejs'
import extend from 'lodash/extend'

const defaultOptions = {
	offset: 0,
	duration: 400,
	easing: 'easeInOutQuad'
}

export default (element, options = defaultOptions) => {
	options = extend({}, defaultOptions, options)
	const container =
		document.scrollingElement || document.body || document.documentElement

	if (!element || !container) return

	anime({
		targets: container,
		scrollTop: element.offsetTop + options.offset,
		duration: options.duration,
		easing: options.easing
	})
}

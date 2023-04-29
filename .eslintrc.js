module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	globals: {
		google: true
	},
	extends: ['@nuxtjs/eslint-config'],
	// add your custom rules here
	rules: {
		indent: ['error', 'tab', {
			SwitchCase: 1
		}],
		'no-console': ['warn'],
		'no-tabs': 0,
		'vue/html-indent': ['error', 'tab'],
		'vue/html-closing-bracket-newline': 0,
		'vue/singleline-html-element-content-newline': 0
	}
}

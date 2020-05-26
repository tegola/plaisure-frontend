module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	globals: {
		google: true
	},
	parserOptions: {
		parser: 'babel-eslint'
	},
	extends: [
		'@nuxtjs',
		'plugin:vue/recommended'
	],
	plugins: [
		'vue'
	],
	// add your custom rules here
	rules: {
		indent: ['error', 'tab', {
			SwitchCase: 1
		}],
		'no-console': ['warn'],
		'no-tabs': 0,
		'vue/html-indent': ['error', 'tab'],
		'vue/html-closing-bracket-newline': 0,
		'vue/singleline-html-element-content-newline': 0,
		'vue/no-v-html': 0
	}
}

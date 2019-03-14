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
    'plugin:prettier/recommended'
  ],
  plugins: [
    'prettier'
  ],
  // add your custom rules here
  rules: {
    'indent': ['error', 'tab', {
      'SwitchCase': 1
    }],
    'vue/html-indent': ['error', 'tab'],
    'vue/html-closing-bracket-newline': false,
    'vue/singleline-html-element-content-newline': false,
    'vue/no-v-html': false
  }
}

const express = require('express')
const { Nuxt } = require('nuxt')
const config = require('./nuxt.config.js')

// Disable dev mode / enable production mode
config.dev = false

// Create new express app
const app = express()

// Listen to port 3000 or PORT env if provided
app.listen(process.env.PORT || 3000)

// Create instance of nuxt
const nuxt = new Nuxt(config)
nuxt.ready().then(function() {
	app.use(nuxt.render)
})

import { resolve } from 'path'
import test from 'ava'
import { Nuxt, Builder } from 'nuxt'

const port = 4000
const host = 'localhost'
const url = `http://${host}:${port}/`

// Init nuxt on localhost:4000
test.before('Init Nuxt.js', async (t) => {
	// Prepare config
	let config = {}
	const rootDir = resolve(__dirname, '..')
	try {
		config = require(resolve(rootDir, 'nuxt.config.js'))
	} catch (e) {}
	config.dev = false
	config.rootDir = rootDir

	const nuxt = new Nuxt(config)
	t.context.nuxt = nuxt // keep a reference for all tests

	await new Builder(nuxt).build()
	await nuxt.listen(port, host)
})

test('Home / Renders new venues', async (t) => {
	const { nuxt } = t.context
	const window = await nuxt.renderAndGetWindow(url)
	const newItems = window.document.querySelectorAll('.pg-venue-grid-item')

	t.is(newItems.length >= 4, true)
})

// Close the Nuxt server
test.after('Closing server', (t) => {
	const { nuxt } = t.context

	nuxt.close()
})

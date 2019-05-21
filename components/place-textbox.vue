<template>
	<autocomplete
		ref="input"
		v-bind="$attrs"
		:value="value"
		:select-first-on-enter="selectFirstOnEnter"
		@place_changed="onPlaceChanged"
		@focus="onFocus"
		@blur="onBlur"
		@input="onInput"
		@keydown.esc="onEscKey"
		@keydown.enter="onEnterKey"
	/>
</template>

<script>
import { Autocomplete } from 'vue2-google-maps'

export default {
	name: 'PgPlaceTextbox',

	components: {
		Autocomplete
	},

	props: {
		value: {
			type: String,
			default: null
		},
		selectFirstOnEnter: {
			type: Boolean,
			default: true
		}
	},

	data() {
		return {
			place: null
		}
	},

	methods: {
		isMenuOpen() {
			// Get menus as array
			const menus = [].slice.call(document.querySelectorAll('.pac-container'))

			const anyMenuOpen = menus.some(menu => {
				return (
					menu.offsetWidth || menu.offsetHeight || menu.getClientRects().length
				)
			})

			return anyMenuOpen
		},

		onFocus(e) {
			// Auto select text
			e.target.select()

			this.$emit('focus', e)
		},

		onBlur(e) {
			this.$emit('blur', e)
		},

		onInput(e) {
			this.$emit('input', e.target.value)

			// Remove place if present
			if (this.place) {
				this.place = null
				this.$emit('place-changed', this.place)
			}
		},

		onEscKey(e) {
			if (this.isMenuOpen()) return

			this.$emit('input', '')

			this.place = null
			this.$emit('place-changed', this.place)
		},

		onEnterKey(e) {
			// Prevent enter key if menu is open
			if (this.isMenuOpen()) {
				e.preventDefault()
			} else {
				this.$emit(e.type, e)
			}
		},

		onPlaceChanged(place) {
			// Store place locally
			this.place = place
			this.$emit('place-changed', this.place)

			// Emit clean place name as input
			let value = place.name
			if (place.vicinity && place.name !== place.vicinity) {
				value = `${place.name}, ${place.vicinity}`
			}

			this.$emit('input', value)
		}
	}
}
</script>

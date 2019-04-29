<template>
	<transition name="pg-lightbox--visible" @before-leave="beforeLeave" @after-leave="afterLeave">
		<div
			class="pg-lightbox"
			tabindex="0"
			@click="close"
			@keydown.esc="close"
			@keydown.left="prev"
			@keydown.right="next">
			<div class="pg-lightbox__header">
				<div class="pg-lightbox__title-container">
					<h4 class="pg-lightbox__title">{{ title }}</h4>
					<p class="pg-lightbox__subtitle">
						{{ counter }}
						<template v-if="caption">&ndash; {{ caption }}</template>
					</p>
				</div>
				<button
					:title="$t('components.lightbox.close')"
					:aria-label="$t('components.lightbox.close')"
					type="button"
					class="pg-lightbox__close"
					@click="close">
					<pg-icon icon="close" class="pg-lightbox__close-icon" />
				</button>
			</div>

			<div ref="display" class="pg-lightbox__display" @click.stop>
				<div v-for="(image, i) in images" :key="i" class="pg-lightbox__slide">
					<img :src="image.url" class="pg-lightbox__image">
				</div>
				<button
					v-if="showArrows"
					:title="$t('components.lightbox.previous')"
					:aria-label="$t('components.lightbox.previous')"
					type="button"
					class="pg-lightbox__arrow pg-lightbox__prev-arrow"
					@click="prev">
					<pg-icon icon="chevron-left" class="pg-lightbox__arrow-icon" />
				</button>
				<button
					v-if="showArrows"
					:title="$t('components.lightbox.next')"
					:aria-label="$t('components.lightbox.next')"
					type="button"
					class="pg-lightbox__arrow pg-lightbox__next-arrow"
					@click="next">
					<pg-icon icon="chevron-right" class="pg-lightbox__arrow-icon" />
				</button>
			</div>

			<div v-if="showThumbnails" ref="thumbnails" class="pg-lightbox__thumbnail-list">
				<div
					v-for="(image, i) in images"
					:key="i"
					:style="thumbnailStyle(image)"
					:class="thumbnailClass(image)"
					:title="image.caption"
					class="pg-lightbox__thumbnail"
					@click.stop="select(i)"
				/>
			</div>
		</div>
	</transition>
</template>

<script>
// import 'classlist-polyfill'
import PgIcon from './icon'

// Flicky uses window, hence doesn't work on the server
const Flickity = process.client ? require('flickity') : {}

export default {
	name: 'PgLightbox',

	components: {
		PgIcon
	},

	props: {
		title: {
			type: String,
			required: true
		},
		images: {
			type: Array,
			required: true,
			default: () => []
		},
		arrows: {
			type: Boolean,
			default: true
		},
		thumbnails: {
			type: Boolean,
			default: true
		},
		index: {
			type: Number,
			default: 0
		}
	},

	data() {
		return {
			mutableIndex: this.index
		}
	},

	computed: {
		counter() {
			return this.$t('components.lightbox.counter', {
				current: this.mutableIndex + 1,
				total: this.images.length
			})
		},
		caption() {
			return this.images[this.mutableIndex].caption
		},
		showArrows() {
			return this.arrows && this.images.length > 1
		},
		showThumbnails() {
			return this.thumbnails && this.images.length > 1
		}
	},

	watch: {
		index() {
			this.select(this.index, true)
		}
	},

	mounted() {
		this.flickity = new Flickity(this.$refs.display, {
			cellSelector: '.pg-lightbox__slide',
			wrapAround: true,
			prevNextButtons: false,
			pageDots: false,
			setGallerySize: false,
			accessibility: false, // We handle the keyboard keys by ourselves
			initialIndex: this.index
		})

		// Enable cells to get focus:
		// https://github.com/metafizzy/flickity/issues/565#issuecomment-304754578
		this.flickity.canPreventDefaultOnPointerDown = () => false

		// Update current index on cell change
		this.flickity.on('select', () => {
			this.mutableIndex = this.flickity.selectedIndex

			if (this.showThumbnails) {
				const thumb = this.$refs.thumbnails.childNodes[this.mutableIndex]
				thumb.scrollIntoView()
			}
		})

		// Focus
		this.$el.focus()

		// Add body class to prevent mouse scrolling
		document.body.classList.add('pg--pg-overlay-open')
	},

	methods: {
		thumbnailStyle(image) {
			return {
				'background-image': `url(${image.thumbnail_url})`
			}
		},

		thumbnailClass(image) {
			return {
				'pg-lightbox__thumbnail--selected':
					this.images.indexOf(image) === this.mutableIndex
			}
		},

		prev() {
			this.flickity.previous(true)
		},

		next() {
			this.flickity.next(true)
		},

		select(index, instant = false) {
			this.flickity.select(index, true, instant)
		},

		close() {
			this.$emit('close')
		},

		beforeLeave() {
			// Remove body class
			document.body.classList.remove('pg--pg-overlay-open')
		},

		afterLeave() {
			// Destroy slider
			this.flickity.destroy()
			this.flickity = null
		}
	}
}
</script>

<style lang="scss">
.pg-lightbox {
	background-color: rgba($black, 0.85);
	color: $white;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: $zindex-modal-backdrop; // Use bootstrap's zindexes
	transition: opacity 200ms;
	display: flex;
	flex-direction: column;
}

// Header
.pg-lightbox__header {
	display: flex;
	padding: 1rem;
	align-items: center;
}
.pg-lightbox__title-container {
	flex: 1;
	min-width: 0; // Allow text-overflow to work
}
.pg-lightbox__title {
	color: inherit;
	margin: 0;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.pg-lightbox__subtitle {
	color: rgba($white, 0.5);
	margin-bottom: 0;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.pg-lightbox__close {
	margin-left: 1rem;
	cursor: pointer;
	border: 0;
	background-color: transparent;
	color: inherit;
	outline: none !important;
	cursor: pointer;
	opacity: 0.75;
	transition: 100ms;

	&:hover,
	&:focus,
	&:active {
		opacity: 1;
	}
	&:active {
		transform: scale(0.9);
	}
}
.pg-lightbox__close-icon {
	width: 32px;
	height: 32px;
}

// Slider + images
.pg-lightbox__display {
	flex: 1;
	display: flex;
	flex-direction: column;

	.flickity-viewport {
		overflow: visible;
	}
}
.pg-lightbox__slide {
	height: 100%;
	width: 80%;
	margin-left: 2.5%;
	margin-right: 2.5%;
	display: flex;
	align-items: center;
	justify-content: center;
}
.pg-lightbox__image {
	box-shadow: 0 5px 40px rgba(#000, 0.25);
	border-radius: $border-radius-lg;
	max-width: 100%;
	max-height: 100%;
	pointer-events: none;
}

// Arrows
.pg-lightbox__arrow {
	width: 80px;
	height: 100%;
	position: absolute;
	background-color: transparent;
	border-radius: 50%;
	border: $border-width solid transparent;
	z-index: 1;
	opacity: 0.5;
	padding-left: 1rem;
	padding-right: 1rem;
	color: inherit;
	outline: none !important;
	cursor: pointer;
	transition: 100ms;

	&:hover,
	&:focus,
	&:active {
		opacity: 0.75;
	}
	&:active {
		transform: scale(0.9);
	}
}
.pg-lightbox__prev-arrow {
	left: 0;
}
.pg-lightbox__next-arrow {
	right: 0;
}
.pg-lightbox__arrow-icon {
	width: 48px;
	height: 48px;
}

// Thumbnails
.pg-lightbox__thumbnail-list {
	padding: 2rem;
	display: flex;
	justify-content: center;
	overflow-x: auto;
}
.pg-lightbox__thumbnail {
	flex: 0 0 auto;
	width: 80px;
	height: 60px;
	background-size: cover;
	background-position: center center;
	background-repeat: no-repeat;
	border-radius: $border-radius-sm;
	opacity: 0.5;
	border: $border-width solid rgba($white, 0.1);
	cursor: pointer;
	transition: 200ms, transform 100ms;

	& + & {
		margin-left: 1rem;
	}

	&:hover,
	&:focus {
		opacity: 1;
	}
	&:active {
		transform: scale(0.95);
	}
	&#{&}--selected {
		border-color: theme-color('secondary');
		box-shadow: inset 0 0 0 $border-width theme-color('secondary');
		opacity: 1;
	}
}

.pg-lightbox--visible-enter-active,
.pg-lightbox--visible-leave-active {
	transition: opacity 200ms;
}
.pg-lightbox--visible-enter,
.pg-lightbox--visible-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}
</style>

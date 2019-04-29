<template>
	<div :class="classes" :style="styles">
		<div :style="sizerStyles" />
		<div v-if="$slots.default" :class="['pg-image-frame__content', contentClass]">
			<slot />
		</div>
	</div>
</template>

<script>
export default {
	name: 'PgImageFrame',

	props: {
		src: {
			type: String,
			default: ''
		},
		ratio: {
			type: String,
			default: '3:2',
			validator: value => value.match(/^(\d+):(\d+)$/)
		},
		contentClass: {
			type: String,
			default: null
		},
		sizing: {
			type: String,
			default: 'cover',
			validator: value => ['cover', 'contain'].indexOf(value) !== -1
		}
	},

	computed: {
		classes() {
			return [
				'pg-image-frame',
				this.sizing ? `pg-image-frame--${this.sizing}` : null
			]
		},

		styles() {
			return {
				backgroundImage: this.src ? `url(${this.src})` : null
			}
		},

		sizerStyles() {
			const ratio = this.ratio.split(':')
			const padding = (ratio[1] / ratio[0]) * 100

			return {
				paddingTop: `${padding}%`
			}
		}
	}
}
</script>

<style lang="scss">
.pg-image-frame {
	position: relative;
	display: block;
	width: 100%;
	padding: 0;
	overflow: hidden;

	background-position: center center;
	background-repeat: no-repeat;

	&__content {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}

	&--cover {
		background-size: cover;
	}
	&--contain {
		background-size: contain;
	}
}
</style>

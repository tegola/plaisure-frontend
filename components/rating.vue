<template>
	<div
		:class="classes"
		:title="title"
		:aria-label="title">
		<!-- Simple: one star and value -->
		<template v-if="simple">
			<pg-icon
				:icon="value > 0 ? 'star' : 'star-outline'"
				class="pg-rating__icon"
			/>
			<div class="pg-rating__label">{{ value }}</div>
		</template>

		<!-- All stars -->
		<template v-else>
			<div class="pg-rating__base" @mouseleave="onMouseLeave">
				<pg-icon
					v-for="n in max"
					:key="n"
					icon="star-outline"
					class="pg-rating__icon"
					@mouseenter="onMouseOver(n)"
					@click="onClick(n)"
				/>
				<div class="pg-rating__fill" :style="fillStyle">
					<pg-icon
						v-for="n in max"
						:key="n"
						icon="star"
						class="pg-rating__icon"
					/>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
export default {
	name: 'PgRating',

	props: {
		size: {
			type: String,
			validator: value => ['sm', 'md'].includes(value),
			default: 'md'
		},
		value: {
			type: [String, Number],
			default: 0
		},
		max: {
			type: [String, Number],
			default: 5
		},
		readonly: Boolean,
		simple: Boolean
	},

	data () {
		return {
			hoverValue: 0
		}
	},

	computed: {
		classes () {
			return {
				'pg-rating': true,
				'pg-rating--clickable': !this.readonly && !this.simple,
				[`pg-rating--${this.size}`]: this.size !== 'md'
			}
		},

		displayedValue () {
			return this.hoverValue || this.value
		},

		title () {
			return this.$t('components.rating.tooltip', {
				value: this.displayedValue,
				max: this.max
			})
		},

		fillStyle () {
			const width = (this.displayedValue / this.max) * 100

			return {
				width: `${width}%`
			}
		}
	},

	methods: {
		onMouseOver (value) {
			if (!this.readonly) { this.hoverValue = value }
		},

		onMouseLeave (value) {
			if (!this.readonly) { this.hoverValue = null }
		},

		onClick (value) {
			if (!this.readonly && this.value !== value) { this.$emit('input', value) }
		}
	}
}
</script>

<style lang="scss">
.pg-rating {
	color: $orange-500;
	display: inline-flex;
	align-items: center;
	line-height: 1;
	vertical-align: middle;
	white-space: nowrap;

	&__label {
		margin-left: 0.25rem;
		margin-right: 0.25rem;
	}
	&__base {
		position: relative;
	}
	&__fill {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		overflow: hidden;
		white-space: nowrap;
		pointer-events: none; // Let the base get the events
	}

	// Clickable (not readonly)
	&--clickable {
		cursor: pointer;
	}

	// Small size
	&--sm {
		font-size: $font-size-sm;
	}
	&--sm & {
		&__icon {
			width: 1rem;
			height: 1rem;
		}
	}
}
</style>

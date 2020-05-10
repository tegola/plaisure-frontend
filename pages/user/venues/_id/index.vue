<template>
	<div>
		<div class="row text-center">
			<div class="col-sm mb-3 mb-md-0">
				<pg-rating :value="venue.rating.average" simple class="rating" /><br>
				{{ $tc('pages.user.venues.detail.overview.stats.ratings', venue.rating.count) }}
			</div>
			<div class="col-sm mb-3 mb-md-0">
				<pg-icon icon="bubble-star" class="icon" /><br>
				{{ $tc('pages.user.venues.detail.overview.stats.reviews', venue.review_count) }}
			</div>
			<div class="col-sm">
				<pg-icon icon="heart" class="icon" /><br>
				{{ $tc('pages.user.venues.detail.overview.stats.favorites', favoriteCount) }}
			</div>
		</div>

		<!-- Chart -->
		<div class="chart mt-5">
			<div class="d-flex align-items-baseline justify-content-between">
				<h5 class="font-weight-normal mb-0">{{ $t('pages.user.venues.detail.overview.visits.title') }}</h5>
				<span class="text-muted ml-2 mr-auto">
					{{ formatChartDate(chartDates.start) }} &rarr; {{ formatChartDate(chartDates.end) }}
				</span>
				<span class="text-muted">{{ $tc('pages.user.venues.detail.overview.visits.total', visitCount) }}</span>
			</div>
			<hr>
			<transition-group
				appear
				tag="div"
				class="chart__content"
				:css="false"
				@before-enter="chartItemBeforeEnter"
				@enter="chartItemEnter">
				<div
					v-for="(day, index) in chartData"
					:key="day.date"
					v-b-tooltip="chartItemTooltipProps(day)"
					:data-index="index"
					class="chart-item">
					<div class="chart-item__label d-none d-md-inline">{{ day.count }}</div>
					<div class="chart-item__fill" :style="chartItemFillStyle(day)" />
				</div>
			</transition-group>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import { subDays } from 'date-fns'
import anime from 'animejs'
import { sortBy, map } from 'lodash'

export default {
	name: 'PgUserVenueDetailPageOverviewSection',

	async fetch ({ $axios, params, store }) {
		const data = await $axios.$get(`/user/venues/${params.id}/overview`)

		store.commit('user-venue-detail/setVisits', data.visits)
		store.commit('user-venue-detail/setVisitCount', data.visitCount)
		store.commit('user-venue-detail/setFavoriteCount', data.favoriteCount)
	},

	computed: {
		...mapState('user-venue-detail', [
			'venue',
			'visits',
			'visitCount',
			'favoriteCount'
		]),

		chartDates () {
			// Today with UTC conversion
			const today = new Date()
			today.setTime(today.getTime() + today.getTimezoneOffset() * 60 * 1000)

			// Yesterday
			const yesterday = subDays(today, 1)

			// Four weeks ago (starting from yesterday)
			const fourWeeksAgo = subDays(yesterday, 28)

			return {
				start: fourWeeksAgo,
				end: yesterday
			}
		},

		chartData () {
			// Prepare data
			const data = {}

			this.visits.forEach((day) => {
				data[day.date] = day
			})

			// Fill missing dates with 0 count visits
			let loopDate = this.chartDates.start

			while (loopDate <= this.chartDates.end) {
				const dateString = loopDate.toISOString().slice(0, 10)

				if (!data[dateString]) {
					data[dateString] = {
						date: dateString,
						count: 0
					}
				}

				loopDate = new Date(loopDate.setDate(loopDate.getDate() + 1))
			}

			// Return sorted by date
			return sortBy(data, 'date')
		},

		chartMax () {
			const counts = map(this.chartData, 'count')
			const max = Math.max.apply(null, counts)

			return max * 1.2
		}
	},

	methods: {
		formatChartDate (date) {
			// FIXME: Use vue-i18n $d
			if (!(date instanceof Date)) { date = new Date(date) }

			return date.toLocaleDateString(this.$i18n.isoCode, {
				day: 'numeric',
				month: 'short'
			})
		},

		chartItemFillStyle (day) {
			const height = (day.count / this.chartMax) * 100
			const max = Math.max(height, 1)

			return {
				height: `${max}%`
			}
		},

		chartItemTooltipProps (day) {
			const date = this.formatChartDate(day.date)
			const visits = this.$tc(
				'pages.user.venues.detail.overview.visits.count',
				day.count
			)

			return {
				title: `
					<span class="small">${date}</span><br>
					<strong>${visits}</strong>
				`,
				html: true
			}
		},

		chartItemBeforeEnter (el) {
			const label = el.querySelector('.chart-item__label')
			const fill = el.querySelector('.chart-item__fill')

			label.style.opacity = 0

			fill.style.opacity = 0
			fill.style.transform = 'scaleY(0)'
			fill.style.transformOrigin = 'bottom center'
		},

		chartItemEnter (el, done) {
			anime({
				targets: el.querySelector('.chart-item__fill'),
				delay: el.dataset.index * 20,
				opacity: 1,
				scaleY: 1
			})
			anime({
				targets: el.querySelector('.chart-item__label'),
				delay: el.dataset.index * 30,
				opacity: 1
			})
		}
	}
}
</script>

<style lang="scss">
.rating .pg-rating__icon {
	width: 1.5rem;
	height: 1.5rem;
}
</style>
<style lang="scss" scoped>
.rating {
	font-size: $font-size-xl;
}
.icon {
	width: 1.5rem;
	height: 1.5rem;
}

.chart {
	background-color: $light;
	padding: $spacer;
	border-radius: $border-radius;

	&__content {
		height: 200px;
		display: flex;
		justify-content: space-between;
	}

	&-item {
		flex: 1;
		padding: 0.1rem;
		border-radius: $border-radius;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		overflow: hidden; // Don't let text grow the element

		&__label {
			text-align: center;
			font-size: $font-size-xs;
			color: $gray-500;
			align-self: center; // Center when bigger than the container
		}

		&__fill {
			background-color: $primary;
			border-radius: $border-radius-sm;
			background: linear-gradient($green-500, $olive-500);
		}

		&:hover {
			background: $gray-200;
		}
	}

	@include media-breakpoint-up(md) {
		&-item {
			padding: 0.2rem;
		}
	}
}
</style>

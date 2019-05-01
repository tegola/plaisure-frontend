<template>
	<div class="pg-venue-detail-page">
		<pg-navbar variant="dark" />

		<template v-if="venue">
			<!-- Header -->
			<div class="header">
				<div class="container">
					<!-- Gallery -->
					<div ref="gallery" class="header-gallery">
						<div class="header-gallery-bg">
							<div v-for="i in 6" :key="i" class="header-photo header-photo-placeholder" />
						</div>
						<nuxt-link v-if="showEditAction" :to="editRoute" class="header-photo header-photo-add">
							<pg-icon icon="plus" />
							<div>{{ $t('pages.venue_detail.gallery.add') }}</div>
						</nuxt-link>
						<template v-for="(file, index) in venue.photos">
							<a
								v-if="index < 10"
								:key="index"
								:href="file.resized_url"
								class="header-photo"
								@click.prevent="showLightbox(index)">
								<div
									:style="'background-image: url(' + file.thumbnail_url + ')'"
									class="embed-responsive embed-responsive-1by1 header-photo-img"
								/>
							</a>
							<a
								v-if="index == 10"
								:key="index"
								:href="file.resized_url"
								class="header-photo"
								@click.prevent="showLightbox(index)">
								<div :style="'background-image: url(' + file.thumbnail_url + ')'" class="embed-responsive embed-responsive-1by1 header-photo-img">
									<div class="header-photo-zoom">
										<pg-icon icon="search" class="mb-1" />
										{{ $t('pages.venue_detail.gallery.all') }}
									</div>
								</div>
							</a>
						</template>
					</div>

					<!-- Title -->
					<h2 class="header-title">{{ venue.name }}</h2>
					<ul class="list-inline text-dark-green-muted mb-0">
						<li class="list-inline-item">{{ subtitle }}</li>
						<li v-if="venue.business_hours.length" class="list-inline-item">
							<span v-if="isOpen" class="text-success">{{ $t('pages.venue_detail.card.open_now') }}</span>
							<strong v-else class="text-danger">{{ $t('pages.venue_detail.card.closed_now') }}</strong>
						</li>
					</ul>
				</div>
			</div>

			<div class="container">
				<div class="row">
					<div class="col-lg-8">
						<!-- Contact card for small screens -->
						<pg-venue-detail-page-contact-card
							:venue="venue"
							:show-edit-action="showEditAction"
							:edit-route="editRoute"
							class="d-lg-none"
						/>

						<!-- Jackpots -->
						<template v-if="!venue.has_owner || hasJackpots">
							<div class="row my-5 pt-2">
								<div v-for="(jackpot, index) in venue.jackpots" :key="index" class="col-md-4">
									<div v-if="jackpot.label && jackpot.value" :class="['jackpot', index < 3 ? 'mb-3 mb-md-0' : null]">
										<img :src="`/img/detail/jackpot-${index}.svg`" class="jackpot-icon">
										<div>
											<div class="jackpot-name">{{ jackpot.label && jackpot.value ? jackpot.label : `Jackpot ${index}` }}</div>
											<div class="jackpot-value">{{ formatCurrency(jackpot.value) }}</div>
											<div v-if="showEditAction"><nuxt-link :to="editRoute">{{ $t('pages.venue_detail.common.edit') }}</nuxt-link></div>
										</div>
									</div>
								</div>
							</div>
							<hr>
						</template>

						<!-- Description -->
						<template v-if="venue.description">
							<div class="my-5">
								<h5>{{ $t('pages.venue_detail.description') }}</h5>
								<p>{{ venue.description }}</p>
							</div>
							<hr>
						</template>

						<!-- Details -->
						<div class="my-5">
							<h5>
								{{ $t('pages.venue_detail.details.title') }}
								<nuxt-link v-if="showEditAction" :to="editRoute" class="small ml-2">{{ $t('pages.venue_detail.common.edit') }}</nuxt-link>
							</h5>
							<div class="row">
								<div class="col-md">
									<ul class="list-unstyled mb-0 mb-md-3">
										<li class="detail-list-item">
											{{ $t('pages.venue_detail.details.concessionaire') }}:
											<strong v-if="venue.concessionaire">{{ venue.concessionaire.name }}</strong>
											<span v-else class="text-muted">{{ $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="detail-list-item">
											{{ $t('pages.venue_detail.details.surface_size') }}:
											<strong v-if="venue.surface_size">{{ venue.surface_size }} {{ $t('pages.venue_form.general.surface_size_unit') }}</strong>
											<span v-else class="text-muted">{{ $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="detail-list-item">
											{{ $t('pages.venue_detail.details.vlt_machine_count') }}:
											<strong v-if="venue.vlt_machine_count">{{ venue.vlt_machine_count }}</strong>
											<span v-else class="text-muted">{{ $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="detail-list-item">
											{{ $t('pages.venue_detail.details.vlt_platforms') }}:
											<strong v-if="venue.vlt_platforms.length">{{ vltPlatformNames }}</strong>
											<span v-else class="text-muted">{{ $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="detail-list-item">
											{{ $t('pages.venue_detail.details.awp_machine_count') }}:
											<strong v-if="venue.awp_machine_count">{{ venue.awp_machine_count }}</strong>
											<span v-else class="text-muted">{{ $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="detail-list-item">
											{{ $t('pages.venue_detail.details.arcade_roulette') }}:
											<strong v-if="venue.arcade_roulette" class="text-success">{{ $t('pages.venue_detail.common.yes') }}</strong>
											<span v-else class="text-muted">{{ venue.has_owner ? $t('pages.venue_detail.common.no') : $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="detail-list-item">
											{{ $t('pages.venue_detail.details.online_casino') }}:
											<a v-if="venue.urls.online_casino" :href="venue.urls.online_casino" target="_blank">{{ venue.urls.online_casino }}</a>
											<span v-else class="text-muted">{{ $t('pages.venue_detail.common.unknown') }}</span>
										</li>
									</ul>
								</div>
								<div class="col-md">
									<ul class="list-unstyled">
										<template v-if="isInCategory('betting_agency')">
											<li class="detail-list-item">
												{{ $t('pages.venue_detail.details.sports_betting') }}:
												<strong v-if="venue.sports_betting" class="text-success">{{ $t('pages.venue_detail.common.yes') }}</strong>
												<span v-else class="text-muted">{{ venue.has_owner ? $t('pages.venue_detail.common.no') : $t('pages.venue_detail.common.unknown') }}</span>
											</li>
											<li class="detail-list-item">
												{{ $t('pages.venue_detail.details.virtual_betting') }}:
												<strong v-if="venue.virtual_betting" class="text-success">{{ $t('pages.venue_detail.common.yes') }}</strong>
												<span v-else class="text-muted">{{ venue.has_owner ? $t('pages.venue_detail.common.no') : $t('pages.venue_detail.common.unknown') }}</span>
											</li>
											<li class="detail-list-item">
												{{ $t('pages.venue_detail.details.horse_betting') }}:
												<strong v-if="venue.horse_betting" class="text-success">{{ $t('pages.venue_detail.common.yes') }}</strong>
												<span v-else class="text-muted">{{ venue.has_owner ? $t('pages.venue_detail.common.no') : $t('pages.venue_detail.common.unknown') }}</span>
											</li>
										</template>
										<li class="detail-list-item">
											{{ $t('pages.venue_detail.details.parking_capacity') }}:
											<strong v-if="venue.parking_capacity">{{ venue.parking_capacity }}</strong>
											<span v-else class="text-muted">{{ $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li v-if="isInCategory('betting_agency')" class="detail-list-item">
											{{ $t('pages.venue_detail.details.seating_capacity') }}:
											<strong v-if="venue.seating_capacity">{{ venue.seating_capacity }}</strong>
											<span v-else class="text-muted">{{ $t('pages.venue_detail.common.unknown') }}</span>
										</li>
									</ul>
								</div>
							</div>
						</div>

						<hr>

						<!-- Amenities -->
						<div class="my-5">
							<h5>
								{{ $t('pages.venue_detail.amenities.title') }}
								<nuxt-link v-if="showEditAction" :to="editRoute" class="small ml-2">{{ $t('pages.venue_detail.common.edit') }}</nuxt-link>
							</h5>
							<div class="row">
								<div class="col-md">
									<ul class="list-unstyled mb-0 mb-md-3">
										<li class="detail-list-item">
											{{ $t('pages.venue_detail.amenities.atm') }}:
											<strong v-if="venue.amenities.atm" class="text-success">{{ $t('pages.venue_detail.common.yes') }}</strong>
											<span v-else class="text-muted">{{ venue.has_owner ? $t('pages.venue_detail.common.no') : $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="detail-list-item">
											{{ $t('pages.venue_detail.amenities.bar') }}:
											<strong v-if="venue.amenities.bar" class="text-success">{{ $t('pages.venue_detail.common.yes') }}</strong>
											<span v-else class="text-muted">{{ venue.has_owner ? $t('pages.venue_detail.common.no') : $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="detail-list-item">
											{{ $t('pages.venue_detail.amenities.pay_per_view') }}:
											<strong v-if="venue.amenities.pay_per_view" class="text-success">{{ $t('pages.venue_detail.common.yes') }}</strong>
											<span v-else class="text-muted">{{ venue.has_owner ? $t('pages.venue_detail.common.no') : $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="detail-list-item">
											{{ $t('pages.venue_detail.amenities.pos') }}:
											<strong v-if="venue.amenities.pos" class="text-success">{{ $t('pages.venue_detail.common.yes') }}</strong>
											<span v-else class="text-muted">{{ venue.has_owner ? $t('pages.venue_detail.common.no') : $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="detail-list-item">
											{{ $t('pages.venue_detail.amenities.private_parking') }}:
											<strong v-if="venue.amenities.private_parking" class="text-success">{{ $t('pages.venue_detail.common.yes') }}</strong>
											<span v-else class="text-muted">{{ venue.has_owner ? $t('pages.venue_detail.common.no') : $t('pages.venue_detail.common.unknown') }}</span>
										</li>
									</ul>
								</div>
								<div class="col-md">
									<ul class="list-unstyled">
										<li class="detail-list-item">
											{{ $t('pages.venue_detail.amenities.restaurant') }}:
											<strong v-if="venue.amenities.restaurant" class="text-success">{{ $t('pages.venue_detail.common.yes') }}</strong>
											<span v-else class="text-muted">{{ venue.has_owner ? $t('pages.venue_detail.common.no') : $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="detail-list-item">
											{{ $t('pages.venue_detail.amenities.security') }}:
											<strong v-if="venue.amenities.security" class="text-success">{{ $t('pages.venue_detail.common.yes') }}</strong>
											<span v-else class="text-muted">{{ venue.has_owner ? $t('pages.venue_detail.common.no') : $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="detail-list-item">
											{{ $t('pages.venue_detail.amenities.smoking_area') }}:
											<strong v-if="venue.amenities.smoking_area" class="text-success">{{ $t('pages.venue_detail.common.yes') }}</strong>
											<span v-else class="text-muted">{{ venue.has_owner ? $t('pages.venue_detail.common.no') : $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="detail-list-item">
											{{ $t('pages.venue_detail.amenities.wifi') }}:
											<strong v-if="venue.amenities.wifi" class="text-success">{{ $t('pages.venue_detail.common.yes') }}</strong>
											<span v-else class="text-muted">{{ venue.has_owner ? $t('pages.venue_detail.common.no') : $t('pages.venue_detail.common.unknown') }}</span>
										</li>
									</ul>
								</div>
							</div>
						</div>

						<!-- Promote -->
						<div v-if="!venue.has_owner" class="card bg-light my-4 text-center">
							<div class="card-body">
								<h4 class="card-title">{{ $t('pages.venue_detail.claim.title') }}</h4>
								<p class="card-text">{{ $t('pages.venue_detail.claim.intro') }} <nuxt-link :to="localePath('promote')">{{ $t('pages.venue_detail.claim.more') }}&hellip;</nuxt-link></p>
								<pg-button :to="localePath({ name: 'venues-id-claim', params: { id: venue.id }})" variant="primary">{{ $t('pages.venue_detail.claim.action') }}</pg-button>
							</div>
						</div>
					</div>
					<div class="col-lg-4">
						<!-- Contact card for big screens -->
						<pg-venue-detail-page-contact-card
							:venue="venue"
							:show-edit-action="showEditAction"
							:edit-route="editRoute"
							class="d-none d-lg-block"
						/>

						<!-- Nearby venues -->
						<div v-if="nearbyVenues.length" class="my-5">
							<h5 class="mb-3">{{ $t('pages.venue_detail.nearby') }}</h5>
							<ul class="list-unstyled">
								<pg-venue-detail-page-nearby-item v-for="nearbyVenue in nearbyVenues" :key="nearbyVenue.id" :venue="nearbyVenue" />
							</ul>
						</div>

						<!-- Report -->
						<div class="my-4">
							<h5>{{ $t('pages.venue_detail.issues.title') }}</h5>
							<i18n tag="p" path="pages.venue_detail.issues.intro">
								<a :href="prepareEmailLink(this.$constants.EMAIL_REPORT, $t('pages.venue_detail.issues.subject', { name: venue.name, id: venue.id }))" place="report">{{ $t('pages.venue_detail.issues.report') }}</a>
							</i18n>
						</div>
					</div>
				</div>
			</div>

			<pg-lightbox
				v-if="lightboxOpen"
				:title="venue.name"
				:images="lightboxImages"
				:index="lightboxIndex"
				:arrows="$mq == 'comfortable'"
				:thumbnails="$mq == 'comfortable'"
				@close="closeLightbox"
			/>
		</template>

		<pg-page-footer />
	</div>
</template>

<script>
import extend from 'lodash/extend'
import { getAllInfoByISO } from 'iso-country-currency'
import isVenueOpen from '@/utilities/is-venue-open'

import PgLightbox from '@/components/lightbox'
import PgVenueDetailPageContactCard from './contact-card'
import PgVenueDetailPageNearbyItem from './nearby-item'

export default {
	name: 'PgVenueDetailPage',

	components: {
		PgLightbox,
		PgVenueDetailPageContactCard,
		PgVenueDetailPageNearbyItem
	},

	data() {
		return {
			venue: null,
			nearbyVenues: [],
			lightboxIndex: 0,
			lightboxOpen: false,
			hoursExpanded: false
		}
	},

	head() {
		const venue = this.venue
		const metadata = {}

		// Title
		metadata.title = `${venue.name} - ${this.subtitle}`

		// Description
		if (venue.description) {
			metadata.meta = [
				{
					hid: 'description',
					name: 'description',
					content: venue.description
				}
			]
		}

		// Structured data - general
		const structuredData = {
			'@context': 'http://schema.org',
			'@type': 'EntertainmentBusiness',
			name: venue.name,
			url: `${process.env.APP_URL}/venues/${venue.id}`,
			address: {
				'@type': 'PostalAddress',
				streetAddress: venue.address_line1,
				addressLocality: [venue.address_line2, venue.address.city].join(', '),
				postalCode: venue.address.postcode,
				addressCountry: venue.country
			},
			geo: {
				'@type': 'GeoCoordinates',
				latitude: venue.coords.lat,
				longitude: venue.coords.lng
			}
		}

		// Structured data - conditional fields
		if (venue.description) structuredData.description = venue.description
		if (venue.contacts.phone) structuredData.telephone = venue.contacts.phone
		if (venue.contacts.email) structuredData.email = venue.contacts.email

		// Structured data - photos
		if (venue.photos.length) {
			structuredData.image = venue.photos[0].thumbnail_url
		} else {
			const sizes = ['16x9', '4x3', '1x1']

			structuredData.image = sizes.map(
				size => `${process.env.APP_URL}/img/schema/${size}.png`
			)
		}

		// Structured data - business hours
		const openingHours = []

		venue.business_hours.forEach((hours, dayIndex) => {
			// Subtracting today index from the specified day index
			const date = new Date()
			const today = date.getDay()
			const distance = dayIndex - today

			date.setDate(date.getDate() + distance)

			// Get the two letter day name in en, as per openingHours
			// specification
			const dayName = date
				.toLocaleDateString('en', { weekday: 'short' })
				.substring(0, 2)

			// Prepare a template, in case we have a split hour day (need
			// to pass them as two rows)
			const template = {
				'@type': 'OpeningHoursSpecification',
				dayOfWeek: dayName,
				opens: '',
				closes: ''
			}

			openingHours.push(
				extend({}, template, {
					opens: hours[0],
					closes: hours[1]
				})
			)

			if (hours.length > 2) {
				openingHours.push(
					extend({}, template, {
						opens: hours[2],
						closes: hours[3]
					})
				)
			}
		})

		structuredData.openingHoursSpecification = openingHours

		metadata.script = [
			{
				type: 'application/ld+json',
				innerHTML: JSON.stringify(structuredData)
			}
		]

		return metadata
	},

	computed: {
		subtitle() {
			const categories = this.venue.categories
			const city = this.venue.address.city

			if (categories.length) {
				return this.$t('pages.venue_detail.subtitle', {
					category: this.$t(`data.categories.${categories[0].machine_name}`),
					city
				})
			} else {
				return city
			}
		},

		lightboxImages() {
			const photos = this.venue.photos

			if (!photos || !photos.length) return null

			return photos.map(file => ({
				caption: file.caption,
				url: file.resized_url,
				thumbnail_url: file.thumbnail_url
			}))
		},

		isMine() {
			const u = this.$auth.user

			return u && u.venue_ids && u.venue_ids.indexOf(this.venue.id) !== -1
		},

		showEditAction() {
			return Boolean(this.isMine || !this.venue.has_owner)
		},

		editRoute() {
			if (this.isMine) {
				return this.localePath({
					name: 'venues-id-edit',
					params: { id: this.venue.id }
				})
			} else if (this.$auth.user) {
				return this.localePath({
					name: 'venues-id-claim',
					params: { id: this.venue.id }
				})
			} else {
				return this.localePath('promote')
			}
		},

		isOpen() {
			return isVenueOpen(this.venue.business_hours)
		},

		vltPlatformNames() {
			return this.venue.vlt_platforms.map(platform => platform.name).join(', ')
		},

		currencySymbol() {
			if (!this.venue.country) return null

			const { symbol } = getAllInfoByISO(this.venue.country)

			return symbol
		},

		hasJackpots() {
			const j = this.venue.jackpots

			return j[1].value || j[2].value || j[3].value
		}
	},

	asyncData({ $axios, params }) {
		return $axios.$get(`/venues/${params.id}`)
	},

	methods: {
		isInCategory(categoryMachineName) {
			return Boolean(
				this.venue.categories.find(
					category => category.machine_name === categoryMachineName
				)
			)
		},

		showLightbox(index) {
			this.lightboxIndex = index
			this.lightboxOpen = true
		},

		closeLightbox() {
			this.lightboxOpen = false
		},

		formatCurrency(number) {
			const { currency } = getAllInfoByISO(this.venue.country)

			// FIXME: usare vue18n number formatter
			return number.toLocaleString(undefined, {
				style: 'currency',
				currency,
				minimumFractionDigits: 2
			})
		},

		prepareEmailLink(address, subject) {
			return `mailto:${address}?subject=${encodeURIComponent(subject)}`
		}
	}
}
</script>


<style lang="scss">
.pg-venue-detail-page {
	// Header
	.header {
		background-color: $palette-green-100;
		padding-top: $spacer;
		padding-bottom: $spacer * 6; // Space for the contact card
	}
	.header-gallery {
		display: flex;
		overflow: auto;
		position: relative;
		margin-bottom: $spacer * 2;
	}
	.header-gallery-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
		z-index: 0;
		display: flex;
		pointer-events: none;
	}
	.header-gallery-fade {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: $grid-gutter-width;
		background: linear-gradient(
			to right,
			rgba($palette-green-100, 0),
			$palette-green-100
		);
		pointer-events: none;
	}
	.header-photo {
		position: relative; // Stay above the background boxes
		width: 100px;
		height: 100px;
		background-color: $body-bg;
		border: $border-width solid $palette-green-200;
		border-radius: $border-radius;
		display: flex;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		padding: 0.25rem;
		transition: $transition-base, padding 0ms, width 0ms, height 0ms;

		&:hover,
		&:focus {
			color: theme-color('primary');
			border-color: theme-color('primary');
			box-shadow: inset 0 0 0 1px theme-color('primary');
		}
	}
	.header-photo + .header-photo {
		margin-left: map-get($spacers, 2);
	}
	.header-photo-img {
		background-position: center center;
		background-size: cover;
	}
	.header-photo-add {
		flex-direction: column;
		text-decoration: none;
		color: gray('500');
		text-align: center;
	}
	.header-photo-zoom {
		background-color: rgba(#000, 0.33);
		color: #fff;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.header-title {
		color: $palette-dark-green-500;
		font-size: $h5-font-size;
	}

	// Contact card
	.contact-card {
		border: 0;
		margin-top: -($spacer * 5);
		font-size: $font-size-sm;
	}
	.contact-card-map {
		border-radius: $card-border-radius;
		background-size: 200%;
	}
	.contact-card-map-content {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.contact-card-map-marker {
		transform: translateY(-50%); // Use bottom part to point to center
	}
	.contact-card-list-item {
		margin-left: $grid-gutter-width;
		padding: 1rem 0;
		position: relative;

		&:first-child {
			border-top: 0;
		}

		&:hover {
			z-index: 0; // Override bootstrap default zindex that hides borders
		}
	}
	.contact-card-list-item-icon {
		position: absolute;
		left: -($grid-gutter-width);
	}
	.contact-card-chevron-icon {
		height: 0.75rem;
		width: 0.75rem;
		vertical-align: -0.125rem;
	}

	// Jackpots
	.jackpot {
		display: flex;
		align-items: flex-start;
	}
	.jackpot-name {
		text-transform: uppercase;
		font-size: $font-size-sm;
		letter-spacing: 0.1em;
	}
	.jackpot-icon {
		margin-right: map-get($spacers, 2);
		margin-top: -4px;
	}
	.jackpot-value {
		font-size: $font-size-xl;
		line-height: 1.25;
		font-weight: $font-weight-bold;
		margin-top: map-get($spacers, 1);
	}

	// Details
	.detail-list-item {
		margin-top: map-get($spacers, 2);
	}

	// Nearby venues
	&__nearby-item-icon {
		width: 24px;
		height: 24px;
		fill: $white;
		margin-right: $grid-gutter-width / 2;

		.pg-svg__background {
			fill: $palette-fuchsia-400;
		}
	}
	&__nearby-item-category {
		text-transform: uppercase;
		letter-spacing: 0.025rem;
		color: $gray-700;
		font-size: $font-size-xs;
		font-weight: $font-weight-semibold;
	}
	&__nearby-item-name {
		font-weight: $font-weight-semibold;
	}
	&__nearby-item-address {
		color: $text-muted;
		font-size: $font-size-xs;
	}

	&__nearby-item:hover &__nearby-item-name {
		color: $link-hover-color;
	}

	@include media-breakpoint-up(sm) {
		.contact-card-map {
			background-size: 150%;
		}
	}

	@include media-breakpoint-up(md) {
		.header-gallery {
			margin-top: $spacer * 2;
			margin-bottom: $spacer * 4.5;
			overflow: hidden;
		}
		.header-photo {
			width: 200px;
			height: 200px;
			padding: 0.5rem;
		}
		.header-title {
			font-size: $h4-font-size;
		}
		.contact-card-map {
			background-size: 100%;
		}
	}

	@include media-breakpoint-up(lg) {
		.header {
			padding-bottom: $spacer;
		}
		.contact-card {
			margin-top: -($spacer * 7.5);

			&:after {
				display: block;
				position: absolute;
				content: '';
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				border: $card-border-width solid $card-border-color;
				border-radius: $card-border-radius;
				pointer-events: none;
			}
		}
		.contact-card-map {
			background-size: 200%;
			@include border-bottom-radius(0);
		}
		.contact-card-list-item {
			margin-left: $grid-gutter-width * 1.5;
			padding-right: 1.25rem;
		}
	}
}
</style>

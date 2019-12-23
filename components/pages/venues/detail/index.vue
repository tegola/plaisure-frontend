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
						<nuxt-link v-if="showEditAction" :to="editRoute" rel="nofollow" class="header-photo header-photo-add">
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
					<div class="row">
						<div class="col-lg-8">
							<div class="d-flex align-items-center">
								<div class="flex-grow-1">
									<h2 class="h4 text-olive-900">{{ venue.name }}</h2>
									<ul class="list-inline text-dark-green-muted mb-0">
										<li class="list-inline-item">{{ subtitle }}</li>
										<li v-if="venue.business_hours.length" class="list-inline-item">
											<span v-if="isOpen" class="text-success">{{ $t('pages.venue_detail.card.open_now') }}</span>
											<strong v-else class="text-danger">{{ $t('pages.venue_detail.card.closed_now') }}</strong>
										</li>
									</ul>
								</div>
								<div>
									<pg-button
										v-b-tooltip.hover
										v-bind="favoriteButtonProps"
										@click="toggleFavorite"
									/>
								</div>
							</div>
						</div>
					</div>
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
									<div v-if="!venue.has_owner || (jackpot.label && jackpot.value)" :class="['jackpot', index < 3 ? 'mb-3 mb-md-0' : null]">
										<img :src="`/img/detail/jackpot-${index}.svg`" class="jackpot-icon">
										<div>
											<div class="jackpot-name">{{ jackpot.label && jackpot.value ? jackpot.label : `Jackpot ${index}` }}</div>
											<div class="jackpot-value">{{ formatCurrency(jackpot.value) }}</div>
											<div v-if="showEditAction"><nuxt-link :to="editRoute" rel="nofollow">{{ $t('pages.venue_detail.common.edit') }}</nuxt-link></div>
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
								<nuxt-link v-if="showEditAction" :to="editRoute" rel="nofollow" class="small ml-2">{{ $t('pages.venue_detail.common.edit') }}</nuxt-link>
							</h5>
							<div class="row">
								<div class="col-md">
									<ul class="list-unstyled mb-0 mb-md-3">
										<li class="mt-2">
											{{ $t('pages.venue_detail.details.concessionaire') }}:
											<strong v-if="venue.concessionaire">{{ venue.concessionaire.name }}</strong>
											<span v-else class="text-muted">{{ $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="mt-2">
											{{ $t('pages.venue_detail.details.surface_size') }}:
											<strong v-if="venue.surface_size">{{ venue.surface_size }} {{ $t('pages.venue_form.general.surface_size_unit') }}</strong>
											<span v-else class="text-muted">{{ $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="mt-2">
											{{ $t('pages.venue_detail.details.vlt_machine_count') }}:
											<strong v-if="venue.vlt_machine_count">{{ venue.vlt_machine_count }}</strong>
											<span v-else class="text-muted">{{ $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="mt-2">
											{{ $t('pages.venue_detail.details.vlt_platforms') }}:
											<strong v-if="venue.vlt_platforms.length">{{ vltPlatformNames }}</strong>
											<span v-else class="text-muted">{{ $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="mt-2">
											{{ $t('pages.venue_detail.details.awp_machine_count') }}:
											<strong v-if="venue.awp_machine_count">{{ venue.awp_machine_count }}</strong>
											<span v-else class="text-muted">{{ $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="mt-2">
											{{ $t('pages.venue_detail.details.arcade_roulette') }}:
											<strong v-if="venue.arcade_roulette" class="text-success">{{ $t('pages.venue_detail.common.yes') }}</strong>
											<span v-else class="text-muted">{{ venue.has_owner ? $t('pages.venue_detail.common.no') : $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li class="mt-2">
											{{ $t('pages.venue_detail.details.online_casino') }}:
											<a v-if="venue.urls.online_casino" :href="venue.urls.online_casino" target="_blank">{{ venue.urls.online_casino }}</a>
											<span v-else class="text-muted">{{ $t('pages.venue_detail.common.unknown') }}</span>
										</li>
									</ul>
								</div>
								<div class="col-md">
									<ul class="list-unstyled">
										<template v-if="isInCategory('betting_agency')">
											<li class="mt-2">
												{{ $t('pages.venue_detail.details.sports_betting') }}:
												<strong v-if="venue.sports_betting" class="text-success">{{ $t('pages.venue_detail.common.yes') }}</strong>
												<span v-else class="text-muted">{{ venue.has_owner ? $t('pages.venue_detail.common.no') : $t('pages.venue_detail.common.unknown') }}</span>
											</li>
											<li class="mt-2">
												{{ $t('pages.venue_detail.details.virtual_betting') }}:
												<strong v-if="venue.virtual_betting" class="text-success">{{ $t('pages.venue_detail.common.yes') }}</strong>
												<span v-else class="text-muted">{{ venue.has_owner ? $t('pages.venue_detail.common.no') : $t('pages.venue_detail.common.unknown') }}</span>
											</li>
											<li class="mt-2">
												{{ $t('pages.venue_detail.details.horse_betting') }}:
												<strong v-if="venue.horse_betting" class="text-success">{{ $t('pages.venue_detail.common.yes') }}</strong>
												<span v-else class="text-muted">{{ venue.has_owner ? $t('pages.venue_detail.common.no') : $t('pages.venue_detail.common.unknown') }}</span>
											</li>
										</template>
										<li class="mt-2">
											{{ $t('pages.venue_detail.details.parking_capacity') }}:
											<strong v-if="venue.parking_capacity">{{ venue.parking_capacity }}</strong>
											<span v-else class="text-muted">{{ $t('pages.venue_detail.common.unknown') }}</span>
										</li>
										<li v-if="isInCategory('betting_agency')" class="mt-2">
											{{ $t('pages.venue_detail.details.seating_capacity') }}:
											<strong v-if="venue.seating_capacity">{{ venue.seating_capacity }}</strong>
											<span v-else class="text-muted">{{ $t('pages.venue_detail.common.unknown') }}</span>
										</li>
									</ul>
								</div>
							</div>
						</div>

						<!-- Amenities -->
						<template v-if="venue.amenities.length">
							<hr>

							<div class="my-5">
								<h5>
									{{ $t('pages.venue_detail.amenities') }}
									<nuxt-link v-if="showEditAction" :to="editRoute" rel="nofollow" class="small ml-2">{{ $t('pages.venue_detail.common.edit') }}</nuxt-link>
								</h5>
								<ul class="list-unstyled row">
									<li
										v-for="amenity in venue.amenities"
										:key="amenity.machine_name"
										class="col-sm-6 col-md-4 mt-2">
										<pg-icon
											v-if="amenityIconMap[amenity.machine_name]"
											:icon="amenityIconMap[amenity.machine_name]"
											class="mr-2"
										/>
										{{ $t(`data.amenities.${amenity.machine_name}`) }}
									</li>
								</ul>
							</div>
						</template>

						<hr>

						<!-- Reviews -->
						<div class="mt-5">
							<div class="d-flex align-items justify-content-between">
								<h5 class="mb-4">{{ $t('pages.venue_detail.reviews.title') }}</h5>
								<nuxt-link v-if="venue.reviews.count" :to="localePath({ name: 'venues-id-reviews', params: { id: venue.id }})">
									{{ $t('pages.venue_detail.reviews.all') }}
									<pg-icon icon="arrow-right" />
								</nuxt-link>
							</div>

							<!-- Rating summary and division -->
							<div v-if="venue.rating.count" class="row">
								<div class="col-sm-5 mb-3 mb-sm-0">
									<pg-rating simple :value="venue.rating.average.toFixed(1)" class="pg-venue-detail-page__rating-summary" />
									<span class="text-muted ml-2 small">{{ $tc('pages.venue_detail.reviews.count', venue.rating.count, { count: venue.rating.count }) }}</span>
								</div>
								<div class="col-sm-7 d-flex flex-column-reverse">
									<div v-for="n in 5" :key="`rating-division-${n}`" class="pg-venue-detail-page__rating-division">
										<div class="pg-venue-detail-page__rating-division-stars">
											<pg-icon
												v-for="s in n"
												:key="`review-division-${s}`"
												icon="star"
												class="pg-venue-detail-page__rating-division-star"
											/>
										</div>
										<div class="progress pg-venue-detail-page__rating-division-progress">
											<div class="progress-bar" :style="{ width: (venue.rating[`${n}_count`] / venue.rating.count * 100) + '%' }" />
										</div>
									</div>
								</div>
							</div>

							<!-- Review list -->
							<pg-review-item
								v-for="review in venue.reviews"
								:key="review.id"
								:venue="venue"
								:review="review"
								class="mt-3"
								@replied="loadData"
							/>

							<!-- Rate / review -->
							<template v-if="$auth.loggedIn">
								<div v-if="!isMine && !reviewFormOpen" class="row mt-5">
									<div class="col-md-7">
										<div class="pg-venue-detail-page__rating-action mb-2 mb-md-0">
											{{ $t('pages.venue_detail.reviews.rate') }}
											<pg-rating
												:value="userReview ? userReview.rating : null"
												@input="onRatingInput"
											/>
										</div>
									</div>
									<div class="col-md-5">
										<pg-button variant="primary" block @click="reviewFormOpen = true">{{ $t('pages.venue_detail.reviews.write') }}</pg-button>
									</div>
								</div>
							</template>
							<p v-else class="text-muted text-center">
								<i18n path="pages.venue_detail.reviews.login">
									<nuxt-link slot="action" :to="localePath({ name: 'login', query: { redirect: $route.path }})">{{ $t('pages.venue_detail.reviews.login_action') }}</nuxt-link>
								</i18n>
							</p>

							<pg-review-form
								v-if="reviewFormOpen"
								:venue="venue"
								:review="userReview"
								@cancel="reviewFormOpen = false"
								@submit="onReviewFormSubmit"
							/>
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
					</div>
				</div>
			</div>

			<div class="bg-light mt-5 pt-5">
				<div class="container text-center text-md-left">
					<div class="row">
						<!-- Claim -->
						<div v-if="!venue.has_owner" class="col-md mb-4">
							<div class="row">
								<div class="col-md-auto text-muted">
									<pg-icon
										icon="pencil"
										class="mb-2 mb-md-none"
										size="2x"
									/>
								</div>
								<div class="col-md">
									<h6 class="mb-1">{{ $t('pages.venue_detail.claim.title') }}</h6>
									<p>{{ $t('pages.venue_detail.claim.intro') }}</p>
									<pg-button
										:to="localePath({ name: 'venues-id-claim', params: { id: venue.id }})"
										variant="primary"
										rel="nofollow">
										{{ $t('pages.venue_detail.claim.action') }}
									</pg-button>
									<pg-button
										:to="localePath('promote')"
										variant="link">
										{{ $t('pages.venue_detail.claim.more') }}
									</pg-button>
								</div>
							</div>
						</div>

						<!-- Report -->
						<div class="mb-4" :class="venue.has_owner ? 'col-md-10 col-lg-8 mx-md-auto' : 'col-md'">
							<div class="row">
								<div class="col-md-auto text-muted">
									<pg-icon
										icon="exclamation-circle-outline"
										class="mb-2 mb-md-none"
										size="2x"
									/>
								</div>
								<div class="col-md">
									<h6 class="mb-1">{{ $t('pages.venue_detail.report.title') }}</h6>
									<p>{{ $t('pages.venue_detail.report.intro') }}</p>
									<pg-button
										:href="prepareEmailLink(this.$constants.EMAIL_REPORT, $t('pages.venue_detail.report.subject', { name: venue.name, id: venue.id }))"
										variant="gray-300">
										{{ $t('pages.venue_detail.report.action') }}
									</pg-button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Nearby venues -->
				<div v-if="nearbyVenues.length">
					<div class="container">
						<hr class="mt-3 mb-5">
						<h5 class="mb-3">{{ $t('pages.venue_detail.nearby') }}</h5>
					</div>
					<pg-scrollable-pane selector=".row" class="pb-5">
						<div class="container">
							<div class="row">
								<div
									v-for="nearbyVenue in nearbyVenuesForSize"
									:key="nearbyVenue.id"
									class="col-11 col-sm-7 col-md-4 col-xl-3">
									<nuxt-link :to="localePath({ name: 'venues-id', params: { id: nearbyVenue.id }})" class="text-reset">
										<pg-venue-grid-item
											:venue="nearbyVenue"
											class="pg-venue-detail-page__nearby-venue-item"
										/>
									</nuxt-link>
								</div>
							</div>
						</div>
					</pg-scrollable-pane>
				</div>
			</div>

			<pg-lightbox
				v-if="lightboxOpen"
				:title="venue.name"
				:images="lightboxImages"
				:index="lightboxIndex"
				:arrows="$mq === 'md' || $mq === 'lg' || $mq === 'xl'"
				:thumbnails="$mq === 'md' || $mq === 'lg' || $mq === 'xl'"
				@close="closeLightbox"
			/>
		</template>

		<pg-page-footer />
	</div>
</template>

<script>
import extend from 'lodash/extend'
import { getAllInfoByISO } from 'iso-country-currency'
import makeStructuredData from './make-structured-data'
import PgVenueDetailPageContactCard from './contact-card'
import PgScrollablePane from '@/components/scrollable-pane'
import PgVenueGridItem from '@/components/venue-grid-item'
import PgReviewItem from '@/components/review-item'
import PgReviewForm from '@/components/review-form'
import PgLightbox from '@/components/lightbox'
import amenityIconMap from '@/utilities/amenity-icon-map'
import isVenueOpen from '@/utilities/is-venue-open'

export default {
	name: 'PgVenueDetailPage',

	components: {
		PgLightbox,
		PgReviewForm,
		PgReviewItem,
		PgScrollablePane,
		PgVenueDetailPageContactCard,
		PgVenueGridItem
	},

	data() {
		return {
			// Async
			venue: null,
			userReview: null,
			nearbyVenues: [],

			// Local
			mutableFavorite: null,
			lightboxIndex: 0,
			lightboxOpen: false,
			hoursExpanded: false,
			reviewFormOpen: false
		}
	},

	head() {
		const venue = this.venue
		const metadata = {
			// Don't encode json ld
			// https://medium.com/@mhagemann/how-to-add-structured-json-ld-data-to-nuxt-js-8bb5f7c8a2d
			__dangerouslyDisableSanitizers: ['script']
		}

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

		// Structured data
		metadata.script = [
			{
				type: 'application/ld+json',
				innerHTML: JSON.stringify(makeStructuredData(venue))
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

		favoriteButtonProps() {
			return {
				class: 'px-2',
				pill: true,
				variant: this.isFavorite ? 'accent' : 'outline-olive-800',
				icon: this.isFavorite ? 'heart' : 'heart-outline',
				title: this.isFavorite
					? this.$t('pages.venue_detail.favorites.remove')
					: this.$t('pages.venue_detail.favorites.add')
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

		isFavorite() {
			if (this.$auth.loggedIn) {
				return this.mutableFavorite !== null
					? this.mutableFavorite
					: this.$auth.user.favorite_ids.indexOf(this.venue.id) !== -1
			} else {
				return false
			}
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
		},

		amenityIconMap() {
			return amenityIconMap
		},

		nearbyVenuesForSize() {
			return this.$mq === 'md' || this.$mq === 'lg'
				? this.nearbyVenues.slice(0, 3)
				: this.nearbyVenues
		}
	},

	asyncData({ $axios, params }) {
		return $axios.$get(`/venues/${params.id}`)
	},

	methods: {
		async loadData() {
			const data = await this.$axios.$get(`/venues/${this.$route.params.id}`)

			extend(this, data)
		},

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

		async toggleFavorite() {
			// Send to login
			if (!this.$auth.loggedIn) {
				this.$router.push(this.localePath('login'))
				return
			}

			// Fill mutableFavorite with current real value
			this.mutableFavorite = this.isFavorite

			// Keep old status and define server action
			const old = this.mutableFavorite
			const action = this.isFavorite ? 'remove' : 'add'

			// Toggle status locally
			this.mutableFavorite = !this.mutableFavorite

			try {
				// Change status remotely and reload user
				await this.$axios.post(`/user/favorites/${action}`, {
					id: this.venue.id
				})
				await this.$auth.fetchUser()
			} catch {
				// Error, restore status locally
				this.mutableFavorite = old
			}
		},

		prepareEmailLink(address, subject) {
			return `mailto:${address}?subject=${encodeURIComponent(subject)}`
		},

		async onRatingInput(value) {
			// Store rating
			await this.$axios.post(`/venues/${this.venue.id}/reviews`, {
				rating: value
			})

			// Show confirmation / thanks
			this.$notify({
				text: this.$t('pages.venue_detail.reviews.rate_success')
			})

			// Reload venue
			this.loadData()
		},

		onReviewFormSubmit() {
			this.reviewFormOpen = false
			this.loadData()
		}
	}
}
</script>


<style lang="scss">
.pg-venue-detail-page {
	// Header
	.header {
		background-color: $green-100;
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
	.header-photo {
		position: relative; // Stay above the background boxes
		width: 100px;
		height: 100px;
		background-color: $body-bg;
		border: $border-width solid $olive-200;
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
			color: $primary;
			border-color: $primary;
			box-shadow: inset 0 0 0 1px $primary;
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
		color: $gray-500;
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

	// Rating summary
	&__rating-summary {
		border-radius: 50rem;
		background-color: $orange-100;
		padding: 0.4rem 0.75rem;
		vertical-align: baseline;

		.pg-rating__icon {
			width: 30px;
			height: 30px;
		}
		.pg-rating__label {
			font-size: 2.25rem;
			font-weight: $font-weight-normal;
		}
	}

	// Rating division
	&__rating-division {
		display: flex;
		align-items: center;
	}
	&__rating-division-stars {
		height: 10px;
		width: 50px;
		text-align: right;
		line-height: 0;
		margin-right: ($spacer / 2);
	}
	&__rating-division-star {
		width: 10px !important;
		height: 10px !important;
		color: $gray-600;
	}
	&__rating-division-progress {
		height: 3px;
		flex: 1;

		.progress-bar {
			background-color: $gray-500;
		}
	}

	// Rating action
	&__rating-action {
		background: $orange-100;
		color: $orange-600;
		border-radius: $border-radius;
		padding: $btn-padding-y $btn-padding-x;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.pg-rating__icon {
			width: 26px;
			height: 26px;
		}
	}

	// Nearby items
	&__nearby-venue-item {
		.pg-venue-grid-item__image-content {
			background-color: $gray-300;
		}
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
			position: sticky;
			top: $spacer;

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

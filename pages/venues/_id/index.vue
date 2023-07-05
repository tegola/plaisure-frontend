<template>
	<div>
		<pg-navbar variant="dark" />

		<!-- Header -->
		<div class="header">
			<!-- Image strip -->
			<pg-scrollable-pane :breakpoints="[]" :disabled="!stripImages.length" class="strip-container">
				<template #default="{ innerClass }">
					<div class="container">
						<div :class="['strip', innerClass]">
							<div class="strip__bg">
								<pg-image-frame
									v-for="index in 6"
									:key="index"
									ratio="1:1"
									class="strip__image"
								/>
							</div>
							<nuxt-link v-if="showEditAction" :to="editRoute" rel="nofollow">
								<pg-image-frame
									ratio="1:1"
									class="strip__image"
									content-class="strip__image-content">
									<pg-icon icon="plus" />
									<div>{{ $t('pages.venue_detail.gallery.add') }}</div>
								</pg-image-frame>
							</nuxt-link>
							<template v-for="(photo, index) in stripImages">
								<a
									v-if="index < stripImages.length"
									:key="photo.id"
									:href="photo.resized_url"
									@click.prevent="showLightbox(index)">
									<pg-image-frame
										:src="photo.resized_url"
										ratio="1:1"
										class="strip__image"
									/>
								</a>
							</template>
							<pg-image-frame
								v-if="venue.photos.length > stripImages.length"
								ratio="1:1"
								class="strip__image"
								content-class="strip__image-content"
								@click.prevent="showLightbox(stripImages.length)">
								<pg-icon icon="search" class="mb-1" />
								<div>{{ $t('pages.venue_detail.gallery.all') }}</div>
							</pg-image-frame>
						</div>
					</div>
				</template>
			</pg-scrollable-pane>

			<div class="container">
				<!-- Title -->
				<div class="row">
					<div class="col-lg-8">
						<div class="d-flex align-items-center">
							<div class="flex-grow-1">
								<h2 class="h4 text-olive-900">{{ venue.name }}</h2>
								<ul class="list-inline text-olive-800 mb-0">
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

		<!-- Main content -->

		<!-- Contact card for small screens -->
		<div v-if="['xs', 'sm', 'md'].includes($mq)" class="container">
			<div class="row">
				<div class="col-lg-8">
					<pg-contact-card
						class="contact-card"
						:venue="venue"
						:show-edit-action="showEditAction"
						:edit-route="editRoute"
					/>
				</div>
			</div>
		</div>

		<!-- Casino cards for small screens -->
		<div v-if="['xs', 'sm', 'md'].includes($mq)" class="bg-fuchsia-100 py-5">
			<div class="container">
				<div class="row">
					<div class="col-lg-8">
						<div class="row align-items-center mb-4">
							<div class="col-auto">
								<h5 class="initialism casino-ranking__title">{{ $t('pages.venue_detail.casino_ranking.title') }}</h5>
							</div>
							<div class="col">
								<hr class="casino-ranking__separator">
							</div>
						</div>
					</div>
				</div>
			</div>
			<pg-scrollable-pane>
				<template #default="{ innerClass }">
					<div class="container">
						<div :class="['row', innerClass]">
							<div v-for="(casino, index) in casinos" :key="index" class="col-10 col-sm-9 col-md-6 col-lg-4">
								<pg-casino-card
									v-bind="casino"
									:position="index + 1"
								/>
							</div>
						</div>
					</div>
				</template>
			</pg-scrollable-pane>
		</div>

		<div class="container">
			<div class="row">
				<div class="col-lg 8">
					<!-- Jackpots -->
					<template v-if="!venue.has_owner || hasJackpots">
						<div class="row my-5 pt-2">
							<div v-for="(jackpot, index) in venue.jackpots" :key="index" class="col-md-4">
								<div v-if="!venue.has_owner || (jackpot.label && jackpot.value)" :class="['jackpot', index < 3 ? 'mb-3 mb-md-0' : null]">
									<img :src="`/img/detail/jackpot-${index}.svg`" class="jackpot__icon">
									<div>
										<div class="jackpot__name">{{ jackpot.label && jackpot.value ? jackpot.label : `Jackpot ${index}` }}</div>
										<div class="jackpot__value">{{ formatCurrency(jackpot.value) }}</div>
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
										<strong v-if="venue.surface_size">{{ venue.surface_size }} {{ $t('pages.venue_detail.details.surface_size_unit') }}</strong>
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
										<a v-if="venue.urls.online_casino" v-track-link :href="venue.urls.online_casino" target="_blank">{{ venue.urls.online_casino }}</a>
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
							<div class="col-7 col-md-5">
								<pg-rating simple :value="venue.rating.average.toFixed(1)" class="rating-summary" />
								<span class="text-muted ml-2 small">{{ $tc('pages.venue_detail.reviews.count', venue.rating.count, { count: venue.rating.count }) }}</span>
							</div>
							<div class="col-5 col-md-7 d-flex flex-column-reverse">
								<div v-for="n in 5" :key="`rating-division-${n}`" class="rating-division">
									<div class="rating-division__stars">
										<pg-icon
											v-for="s in n"
											:key="`review-division-${s}`"
											icon="star"
											class="rating-division__star"
										/>
									</div>
									<div class="progress rating-division__progress">
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
									<div class="rating-action mb-2 mb-md-0">
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
						<p v-else class="text-muted text-center mt-3">
							<i18n path="pages.venue_detail.reviews.login">
								<nuxt-link slot="action" :to="loginAndRedirectUrl">{{ $t('pages.venue_detail.reviews.login_action') }}</nuxt-link>
							</i18n>
						</p>

						<pg-review-form
							v-if="reviewFormOpen"
							class="mt-3"
							:venue="venue"
							:review="userReview"
							@cancel="reviewFormOpen = false"
							@submit="onReviewFormSubmit"
						/>
					</div>
				</div>
				<div class="col-lg-4">
					<!-- Contact card for big screens -->
					<pg-contact-card
						v-if="['lg', 'xl'].includes($mq)"
						class="contact-card"
						:venue="venue"
						:show-edit-action="showEditAction"
						:edit-route="editRoute"
					/>
				</div>
			</div>
		</div>

		<!-- Claim / Report -->
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
									:href="prepareEmailLink($constants.EMAIL_REPORT, $t('pages.venue_detail.report.subject', { name: venue.name, id: venue.id }))"
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
				<pg-scrollable-pane class="pb-5">
					<template #default="{ innerClass }">
						<div class="container">
							<div :class="['row', innerClass]">
								<div
									v-for="nearbyVenue in nearbyVenuesForSize"
									:key="nearbyVenue.id"
									class="col-11 col-sm-7 col-md-4 col-xl-3">
									<nuxt-link :to="localePath({ name: 'venues-id', params: { id: nearbyVenue.id }})" class="text-reset">
										<pg-venue-grid-item
											:venue="nearbyVenue"
											class="nearby-venue-item"
										/>
									</nuxt-link>
								</div>
							</div>
						</div>
					</template>
				</pg-scrollable-pane>
			</div>
		</div>

		<!-- Lightbox -->
		<pg-lightbox
			v-if="lightboxOpen"
			:title="venue.name"
			:images="lightboxImages"
			:index="lightboxIndex"
			:arrows="['md', 'lg', 'xl'].indexOf($mq) !== -1"
			:thumbnails="['md', 'lg', 'xl'].indexOf($mq) !== -1"
			@close="closeLightbox"
		/>

		<!-- Footer -->
		<pg-page-footer />
	</div>
</template>

<script>
import { extend } from 'lodash'
import { getAllInfoByISO } from 'iso-country-currency'
import PgCasinoCard from './-casino-card'
import PgContactCard from './-contact-card'
import makeStructuredData from './-make-structured-data'
import PgVenueGridItem from '@/components/venue-grid-item'
import PgReviewItem from '@/components/review-item'
import PgReviewForm from '@/components/review-form'
import PgLightbox from '@/components/lightbox'
import { amenityIconMap, isVenueOpen } from '@/utilities'

export default {
	name: 'PgVenueDetailPage',

	components: {
		PgLightbox,
		PgReviewForm,
		PgReviewItem,
		PgCasinoCard,
		PgContactCard,
		PgVenueGridItem
	},

	async asyncData ({ $axios, params, error }) {
		try {
			return await $axios.$get(`/venues/${params.id}`)
		} catch (e) {
			const response = e.response

			// Go to error page with nearby venues
			error({
				statusCode: response.status,
				message: response.statusText,
				nearbyVenues: response.data && response.data.nearbyVenues
			})
		}
	},

	data () {
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
			reviewFormOpen: false,

			// Static
			casinos: [
				{
					bgColor: '#0d2953',
					imgSrc: '/img/casino-cards/quigioco-logo.png',
					name: 'QuiGioco',
					welcome: 'Bonus Registrazione 750€ senza deposito',
					description: 'Esse deserunt proident commodo qui ullamco voluptate minim consequat. Ex do occaecat Lorem amet sint minim eiusmod.',
					cta: 'https://www.quigioco.it/signup?codAffiliato=R1646'
				},
				{
					bgColor: '#231f20',
					imgSrc: '/img/casino-cards/le-palme-logo.png',
					name: 'Casinò Le Palme',
					welcome: 'Bonus Registrazione 100 Freespin + 100€ Bonus',
					description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
					cta: 'https://casinolepalme.it/registrati'
				}
			]
		}
	},

	head () {
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
				json: makeStructuredData(venue)
			}
		]

		return metadata
	},

	computed: {
		loginAndRedirectUrl () {
			return this.localePath({
				name: 'login',
				query: {
					redirect: this.switchLocalePath('en') // en -> prefixless url
				}
			})
		},

		subtitle () {
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

		favoriteButtonProps () {
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

		stripImages () {
			const photos = this.venue.photos

			return photos ? photos.slice(0, 7) : []
		},

		lightboxImages () {
			const photos = this.venue.photos

			if (!photos || !photos.length) { return null }

			return photos.map(file => ({
				caption: file.caption,
				url: file.resized_url,
				thumbnail_url: file.thumbnail_url
			}))
		},

		isFavorite () {
			if (this.$auth.loggedIn) {
				return this.mutableFavorite !== null
					? this.mutableFavorite
					: this.$auth.user.favorite_ids.includes(this.venue.id)
			} else {
				return false
			}
		},

		isMine () {
			const u = this.$auth.user

			return u && u.venue_ids && u.venue_ids.includes(this.venue.id)
		},

		showEditAction () {
			return !!(this.isMine || !this.venue.has_owner)
		},

		editRoute () {
			if (this.isMine) {
				return this.localePath({
					name: 'user-venues-id',
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

		isOpen () {
			return isVenueOpen(this.venue.business_hours)
		},

		vltPlatformNames () {
			return this.venue.vlt_platforms.map(platform => platform.name).join(', ')
		},

		currencySymbol () {
			if (!this.venue.country) { return null }

			const { symbol } = getAllInfoByISO(this.venue.country)

			return symbol
		},

		hasJackpots () {
			const j = this.venue.jackpots

			return j[1].value || j[2].value || j[3].value
		},

		amenityIconMap () {
			return amenityIconMap
		},

		nearbyVenuesForSize () {
			return this.$mq === 'md' || this.$mq === 'lg'
				? this.nearbyVenues.slice(0, 3)
				: this.nearbyVenues
		}
	},

	methods: {
		async loadData () {
			const data = await this.$axios.$get(`/venues/${this.$route.params.id}`)

			extend(this, data)
		},

		isInCategory (categoryMachineName) {
			return !!this.venue.categories.find(
				category => category.machine_name === categoryMachineName
			)
		},

		showLightbox (index) {
			this.lightboxIndex = index
			this.lightboxOpen = true
		},

		closeLightbox () {
			this.lightboxOpen = false
		},

		formatCurrency (number) {
			const { currency } = getAllInfoByISO(this.venue.country)

			// FIXME: usare vue18n number formatter
			return number.toLocaleString(undefined, {
				style: 'currency',
				currency,
				minimumFractionDigits: 2
			})
		},

		async toggleFavorite () {
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

		prepareEmailLink (address, subject) {
			return `mailto:${address}?subject=${encodeURIComponent(subject)}`
		},

		async onRatingInput (value) {
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

		onReviewFormSubmit () {
			this.reviewFormOpen = false
			this.loadData()
		}
	}
}
</script>

<style lang="scss" scoped>
.header {
	background-color: $green-100;
	padding-top: $spacer;
	padding-bottom: $spacer * 6; // Space for the contact card
}

// Image strip
.strip-container {
	margin-bottom: $spacer * 2;
}
.strip {
	display: flex;
	position: relative;

	&__bg {
		position: absolute;
		overflow: hidden;
		z-index: 0;
		display: flex;
		pointer-events: none;
	}
	&__image {
		background-color: $body-bg;
		width: 40vw;
		flex-shrink: 0;
		color: $gray-500;
		border: $border-width solid transparent;
		border-radius: $border-radius;
		margin-right: $grid-gutter-width / 2;
	}
	/deep/ &__image-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		text-align: center;
	}
}

// Contact card
.contact-card {
	margin-top: -($spacer * 5);
}

// Casino ranking
.casino-ranking {
	&__title {
		font-size: $font-size-xs;
		color: $fuchsia-500;
		margin: 0;
	}

	&__separator {
		border-top-width: 0;
		height: $border-width;
		background-image: repeating-linear-gradient(to right, $fuchsia-500 0%, $fuchsia-500 20%, transparent 20%, transparent 100%);
		background-repeat: repeat-x;
		background-size: 11px;
		margin: 0;
	}
}

// Jackpots
.jackpot {
	display: flex;
	align-items: flex-start;

	&__name {
		text-transform: uppercase;
		font-size: $font-size-sm;
		letter-spacing: 0.1em;
	}
	&__icon {
		margin-right: map-get($spacers, 2);
		margin-top: -4px;
	}
	&__value {
		font-size: $font-size-xl;
		line-height: 1.25;
		font-weight: $font-weight-bold;
		margin-top: map-get($spacers, 1);
	}
}

// Rating summary
.rating-summary {
	border-radius: 50rem;
	background-color: $orange-100;
	padding: 0.4rem 0.75rem;
	vertical-align: baseline;

	/deep/ .pg-rating__icon {
		width: 30px;
		height: 30px;
	}
	/deep/ .pg-rating__label {
		font-size: 2.25rem;
		font-weight: $font-weight-normal;
	}
}

// Rating division
.rating-division {
	display: flex;
	align-items: center;

	&__stars {
		height: 10px;
		width: 50px;
		text-align: right;
		line-height: 0;
		margin-right: ($spacer / 2);
	}
	&__star {
		width: 10px;
		height: 10px;
		color: $gray-600;
	}
	&__progress {
		height: 3px;
		flex: 1;

		/deep/ .progress-bar {
			background-color: $gray-500;
		}
	}
}

// Rating action
.rating-action {
	background: $orange-100;
	color: $orange-600;
	border-radius: $border-radius;
	padding: $btn-padding-y $btn-padding-x;
	display: flex;
	align-items: center;
	justify-content: space-between;

	/deep/ .pg-rating__icon {
		width: 26px;
		height: 26px;
	}
}

// Nearby items
.nearby-venue-item {
	/deep/ .pg-venue-grid-item__image-content {
		background-color: $gray-300;
	}
}

@include media-breakpoint-up(sm) {
	.strip__image {
		width: 33vw;
	}
}

@include media-breakpoint-up(md) {
	.strip__image {
		cursor: pointer;
		width: 200px;
		transition: $transition-base, padding 0ms, width 0ms, height 0ms;

		&:hover,
		&:focus {
			color: $primary;
			border-color: $primary;
			box-shadow: inset 0 0 0 1px $primary;
		}
	}
}

@include media-breakpoint-up(lg) {
	.header {
		padding-bottom: $spacer;
	}
	.strip-container {
		margin-bottom: $spacer * 4.5;
	}
	.contact-card {
		margin-top: -($spacer * 7.5);
		position: sticky;
		top: $spacer;
	}
}
</style>

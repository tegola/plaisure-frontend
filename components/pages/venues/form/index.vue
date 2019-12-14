<template>
	<div class="pg-venue-form-page">
		<pg-navbar variant="dark" />

		<div v-if="error" class="container d-flex text-muted text-center" style="height: 50vh">
			<div class="m-auto">
				<p class="lead text-muted mb-0">{{ $t('common.status.load_error') }}</p>
			</div>
		</div>

		<template v-if="venue">
			<div class="secondary-nav">
				<div class="title-wrapper">
					<div class="container">
						<div class="row align-items-center">
							<div class="col">
								<h2 class="h5 mb-0">{{ venue.id ? $t('pages.venue_form.title.edit') : $t('pages.venue_form.title.add') }}</h2>
							</div>
							<div class="col-auto ml-auto">
								<pg-button
									:disabled="isSaved"
									:loading="saving"
									variant="primary"
									@click="submit">
									{{ $t('common.actions.save') }}
								</pg-button>
							</div>
						</div>
					</div>
				</div>
				<div ref="sectionNavWrapper" class="section-nav-wrapper">
					<div class="container">
						<b-nav v-b-scrollspy="123" class="section-nav">
							<b-nav-item
								v-for="pane in panes"
								:key="pane"
								:href="`#${pane}`"
								@click="scrollIntoView">
								{{ $t(`pages.venue_form.${pane}.title`) }}
							</b-nav-item>
						</b-nav>
					</div>
				</div>
			</div>

			<div class="container">
				<div class="row">
					<div class="col-lg-8 mx-lg-auto">
						<component
							:is="`pg-venue-form-${pane}-pane`"
							v-for="pane in panes"
							:id="pane"
							:key="pane"
						/>
					</div>
					<div class="col-lg-4">
						<pg-subscription-card
							v-if="venue.id"
							:subscription="venueSubscription"
							:highlight="$t('pages.venue_form.subscription.title')"
							:last-update-date="venueSubscription.updated_at"
							:end-date="venueSubscription.ends_at"
							class="my-5">
							<hr class="my-0">
							<div class="card-body">
								<pg-button
									:variant="venueSubscription.name === 'gold' ? 'light' : 'primary'"
									block
									:to="localePath({ name: 'venues-id-select-plan', params: { id: venue.id }})">
									{{ $t('common.actions.change') }}
								</pg-button>
							</div>
						</pg-subscription-card>
					</div>
				</div>
			</div>
		</template>

		<pg-page-footer />
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'

import { BNav, BNavItem, BListGroup, BListGroupItem } from 'bootstrap-vue'

import PgVenueFormGeneralPane from './general-pane'
import PgVenueFormServicesPane from './services-pane'
import PgVenueFormContactsPane from './contacts-pane'
import PgVenueFormHoursPane from './hours-pane'
import PgVenueFormPhotosPane from './photos-pane'
import PgVenueFormJackpotsPane from './jackpots-pane'

import validations from './validations'
import scrollIntoView from '@/utilities/scroll-into-view'

import PgSubscriptionCard from '@/components/subscription-card'

export default {
	name: 'PgVenueFormPage',

	middleware: 'auth',

	components: {
		BNav,
		BNavItem,
		BListGroup,
		BListGroupItem,
		PgSubscriptionCard,
		PgVenueFormGeneralPane,
		PgVenueFormServicesPane,
		PgVenueFormContactsPane,
		PgVenueFormHoursPane,
		PgVenueFormPhotosPane,
		PgVenueFormJackpotsPane
	},

	mixins: [validationMixin],

	data() {
		return {
			error: false,
			saving: false,
			panes: ['general', 'services', 'contacts', 'hours', 'photos', 'jackpots']
		}
	},

	computed: {
		...mapState('venueForm', ['venue']),
		...mapGetters('venueForm', ['isSaved']),

		venueSubscription() {
			return (
				this.venue.subscription || {
					name: 'default',
					currency: 'EUR',
					price: 0
				}
			)
		}
	},

	async asyncData({ $axios, params, store }) {
		// Reset the store
		store.commit('venueForm/reset')

		// Prepare the url
		const url = ['/venues', params.id ? `/${params.id}/edit` : '/add'].join('')

		try {
			const data = await $axios.$get(url)

			store.commit('venueForm/setVenue', data.venue)
			store.commit('venueForm/setOriginalVenue', data.venue)
			store.commit('venueForm/setAmenities', data.amenities)
			store.commit('venueForm/setCategories', data.categories)
			store.commit('venueForm/setConcessionaires', data.concessionaires)
			store.commit('venueForm/setVltPlatforms', data.vltPlatforms)
		} catch (err) {
			return {
				error: true
			}
		}
	},

	head() {
		return {
			title:
				this.venue && this.venue.id
					? this.$t('pages.venue_form.title.edit')
					: this.$t('pages.venue_form.title.add')
		}
	},

	validations,

	methods: {
		scrollIntoView(e) {
			const href = e.target.getAttribute('href')
			const el = href ? document.querySelector(href) : null
			const offset = this.$refs.sectionNavWrapper.offsetHeight

			if (!el) return

			e.preventDefault()

			scrollIntoView(el, { offset })
		},

		async submit() {
			// Validate
			this.$v.$touch()

			// Stop on validation errors
			if (this.$v.$error) return

			this.saving = true

			// Prepare url
			let url = '/venues'
			if (this.venue.id) url += `/${this.venue.id}`

			try {
				// Save
				await this.$axios.post(url, this.venue)

				// Keep the original copy so it will appear as saved
				this.$store.commit('venueForm/setOriginalVenue', this.venue)

				// Reload user data, including venues
				await this.$auth.fetchUser()

				// Go back to the user profile
				this.$router.push(this.localePath('user'))
			} catch (err) {
				this.$notify({
					title: this.$t('common.status.error'),
					text: this.$t('common.status.save_error'),
					duration: -1,
					type: 'danger'
				})
			} finally {
				this.saving = false
			}
		}
	}
}
</script>

<style lang="scss">
.pg-venue-form-page {
	.secondary-nav {
		position: sticky;
		top: 0;
		z-index: $zindex-dropdown - 1; // Keep it below dropdowns
		background-color: $white;
		border-bottom: 1px solid rgba($black, 0.08);
	}
	.title-wrapper {
		padding: $navbar-padding-y 0;
	}
	.section-nav-wrapper {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		padding-top: 0;
		padding-bottom: 0;
	}
	.section-nav {
		flex-wrap: nowrap;
		white-space: nowrap;

		.nav-item {
			position: relative;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			font-size: $font-size-sm;

			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				height: 2px;
				transform: scaleX(0);
				opacity: 0;
				background-color: theme-color('primary');
				transition: transform 150ms ease-in-out, opacity 100ms 50ms ease-in-out;
				pointer-events: none;
			}
		}
		.nav-item {
			margin-left: $nav-link-padding-x;
			margin-right: $nav-link-padding-x;
		}
		.nav-item:first-child {
			margin-left: 0;
		}
		.nav-link {
			transition: color 150ms;
			color: $gray-600;
			padding-left: 0;
			padding-right: 0;
		}
		.nav-item.active {
			&::after {
				transform: scaleX(1);
				opacity: 1;
			}
			.nav-link {
				color: inherit;
			}
		}
	}
}
</style>

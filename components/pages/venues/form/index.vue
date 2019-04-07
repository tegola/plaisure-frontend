<template>
	<div class="pg-venue-form-page">
		<pg-navbar variant="dark" />

		<div v-if="loading || error" class="container d-flex text-muted text-center" style="height: 50vh">
			<div class="m-auto">
				<template v-if="loading">
					<pg-icon icon="circle-outline-notch" spinning />
					<h5 class="m-0">{{ $t('common.status.loading') }}&hellip;</h5>
				</template>
				<p v-if="error" class="lead text-muted mb-0">C'è stato un errore nel caricamento dei dati.</p>
			</div>
		</div>

		<div v-if="!loading && venue">
			<div class="secondary-nav">
				<div class="title-wrapper">
					<div class="container d-flex align-items-center justify-content-between">
						<h2 class="h5 mb-0">{{ venue.id ? $t('pages.venue_form.title.edit') : $t('pages.venue_form.title.add') }}</h2>
						<pg-button
							:disabled="isSaved"
							:loading="saving"
							variant="primary"
							@click="submit">
							{{ $t('common.actions.save') }}
						</pg-button>
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
							:subscription="venue.subscription"
							:highlight="$t('Abbonamento corrente')"
							:last-update-date="venue.subscription.updated_at"
							:end-date="venue.subscription.ends_at"
							class="my-5">
							<hr class="my-0">
							<div class="card-body">
								<!-- FIXME: Non dare troppa evidenze se è già all'abbonamento più costoso -->
								<pg-button
									variant="primary"
									block
									:to="`/venues/${venue.id}/select-plan`">
									Cambia
								</pg-button>
							</div>
						</pg-subscription-card>
					</div>
				</div>
			</div>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'
import scrollIntoView from '@/utilities/scroll-into-view'

import BNav from 'bootstrap-vue/es/components/nav/nav'
import BNavItem from 'bootstrap-vue/es/components/nav/nav-item'
import BListGroup from 'bootstrap-vue/es/components/list-group/list-group'
import BListGroupItem from 'bootstrap-vue/es/components/list-group/list-group-item'

import PgButton from '@/components/button'
import PgSubscriptionCard from '@/components/subscription-card'

import PgVenueFormGeneralPane from './general-pane'
import PgVenueFormServicesPane from './services-pane'
import PgVenueFormContactsPane from './contacts-pane'
import PgVenueFormHoursPane from './hours-pane'
import PgVenueFormPhotosPane from './photos-pane'
import PgVenueFormJackpotsPane from './jackpots-pane'

import validations from './validations'

export default {
	name: 'PgVenueFormPage',

	middleware: 'auth',

	components: {
		BNav,
		BNavItem,
		BListGroup,
		BListGroupItem,
		PgButton,
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
			loading: false,
			error: false,
			saving: false,
			panes: ['general', 'services', 'contacts', 'hours', 'photos', 'jackpots']
		}
	},

	computed: {
		...mapState('venueForm', ['venue']),
		...mapGetters('venueForm', ['isSaved'])
	},

	async fetch({ $axios, params, store }) {
		// Reset the store
		store.commit('venueForm/reset')

		// Prepare the url
		const url = ['/venues', params.id ? `/${params.id}/edit` : '/add'].join('')

		try {
			const data = await $axios.$get(url)

			store.commit('venueForm/setVenue', data.venue)
			store.commit('venueForm/setOriginalVenue', data.venue)
			// store.commit('venueForm/setAmenities', data.amenities) // Taken out of venue object for now
			store.commit('venueForm/setCategories', data.categories)
			store.commit('venueForm/setConcessionaires', data.concessionaires)
			store.commit('venueForm/setPayPerViewPlatforms', data.payPerViewPlatforms)
			store.commit('venueForm/setVltPlatforms', data.vltPlatforms)
		} catch (err) {
			this.error = true
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
			} catch (err) {
				this.error = true
			} finally {
				this.saving = false
			}

			// Go back to the user profile
			this.$router.push('/user')
		}
	}
}
</script>

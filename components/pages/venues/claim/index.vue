<template>
	<div class="ap-claim-venue-page">
		<pg-navbar variant="dark" />

		<div class="container my-5">
			<div class="row">
				<div class="col-md-8">
					<h3>{{ $t('pages.venue_claim.title') }}</h3>
					<p>{{ $t('pages.venue_claim.intro') }}</p>

					<pg-venue-claim-page-item v-if="venue" :venue="venue" />

					<div class="row align-items-center">
						<div class="col-sm">
							<p>{{ $t('pages.venue_claim.continue') }}</p>
						</div>
						<div class="col-sm-auto">
							<pg-button
								:loading="saving"
								variant="primary"
								icon="arrow-right"
								icon-position="right"
								@click="submit">
								{{ $t('pages.venue_claim.submit') }}
							</pg-button>
						</div>
					</div>

					<hr class="mt-4">

					<nuxt-link :to="localePath({ name: 'venues-id', params: { id: venue.id }})">{{ $t('pages.venue_claim.back') }}</nuxt-link>
				</div>

				<div class="col-md-4 mt-4 mt-md-0">
					<div class="card border-accent">
						<div class="card-body">
							<h5 class="card-title text-accent">{{ $t('pages.venue_claim.infobox.title') }}</h5>
							<p class="card-text">{{ $t('pages.venue_claim.infobox.body') }}</p>
							<p class="card-text font-weight-semibold">
								<nuxt-link :to="localePath('promote')" class="text-accent">
									{{ $t('pages.venue_claim.infobox.action') }}
									<pg-icon icon="arrow-right" />
								</nuxt-link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<pg-page-footer />
	</div>
</template>

<script>
import PgVenueClaimPageItem from './item'

export default {
	name: 'PgVenueClaimPage',

	middleware: 'auth',

	components: {
		PgVenueClaimPageItem
	},

	async asyncData ({ $axios, params }) {
		const data = await $axios.$get(`/venues/${params.id}/claim`)

		return {
			venue: data.data
		}
	},

	data () {
		return {
			saving: false,
			error: false,
			venue: null
		}
	},

	methods: {
		async submit () {
			this.saving = true

			try {
				await this.$axios.post(`/venues/${this.venue.id}/claim`, this.model)

				// Reload user data, including venue count
				await this.$auth.fetchUser()

				// Go to user venues page
				this.$router.replace(this.localePath('user-venues'))
			} catch (err) {
				this.saving = false
				alert(this.$t('common.status.save_error'))
			}
		}
	},

	head () {
		if (!this.venue) { return }

		return {
			title: this.$t('pages.venue_claim.meta_title', {
				name: this.venue.name
			})
		}
	}
}
</script>

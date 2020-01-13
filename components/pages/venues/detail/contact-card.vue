<template>
	<div class="card contact-card">
		<pg-image-frame
			:src="mapImgUrl"
			ratio="16:9"
			class="contact-card-map"
			content-class="contact-card-map-content">
			<img
				:src="`/img/map/pin-normal/${venue.categories[0].machine_name}.svg`"
				class="contact-card-map-marker">
		</pg-image-frame>

		<div class="list-group list-group-flush">
			<!-- Address -->
			<div class="list-group-item contact-card-list-item">
				<nuxt-link v-if="showEditAction" :to="editRoute" rel="nofollow" class="float-right">{{ $t('pages.venue_detail.common.edit') }}</nuxt-link>

				<pg-icon icon="directions" class="contact-card-list-item-icon" />
				<div class="mb-2">
					<strong>{{ venue.name }}</strong>
					<div v-for="(line, index) in addressLines" :key="index">{{ line }}</div>
				</div>
				<p class="mb-0"><a v-track-link :href="googleMapsUrl" target="_blank">{{ $t('pages.venue_detail.card.directions') }}</a></p>
			</div>

			<!-- Business hours -->
			<div class="list-group-item contact-card-list-item">
				<nuxt-link v-if="showEditAction" :to="editRoute" class="float-right">{{ $t('pages.venue_detail.common.edit') }}</nuxt-link>
				<pg-icon :class="['contact-card-list-item-icon', venue.business_hours.length ? null : 'text-muted']" icon="clock-outline" />

				<template v-if="venue.business_hours.length">
					<a :class="isOpen ? 'text-success' : 'text-danger'" href="#" @click.prevent="toggleHours">
						{{ isOpen ? $t('pages.venue_detail.card.open_now') : $t('pages.venue_detail.card.closed_now') }}<pg-icon :icon="hoursExpanded ? 'chevron-up' : 'chevron-down'" class="ml-1 contact-card-chevron-icon" />
					</a>
					<table v-if="hoursExpanded">
						<tr v-for="row in businessHoursRows" :key="row.day">
							<td class="align-top pr-3">{{ row.day }}</td>
							<td>
								<div v-if="!row.hours.length" class="text-muted">{{ $t('pages.venue_detail.card.closed') }}</div>
								<div v-if="row.hours.length == 2">{{ row.hours[0] }}&ndash;{{ row.hours[1] }}</div>
								<div v-if="row.hours.length == 4">{{ row.hours[2] }}&ndash;{{ row.hours[3] }}</div>
							</td>
						</tr>
					</table>
				</template>
				<p v-else class="mb-0 text-muted">{{ $t('pages.venue_detail.card.no_hours') }}</p>
			</div>

			<!-- Contacts -->
			<div class="list-group-item contact-card-list-item">
				<nuxt-link v-if="showEditAction" :to="editRoute" class="float-right">{{ $t('pages.venue_detail.common.edit') }}</nuxt-link>
				<pg-icon :class="['contact-card-list-item-icon', hasContacts ? null : 'text-muted']" icon="phone" />

				<ul v-if="hasContacts" class="list-unstyled mb-0">
					<li v-if="venue.contacts.phone"><a :href="`tel://${venue.contacts.phone}`">{{ venue.contacts.phone }}</a></li>
					<li v-if="venue.contacts.email"><a :href="`mailto:${venue.contacts.email}`">{{ venue.contacts.email }}</a></li>
					<li v-if="facebookMessengerUrl"><a v-track-link :href="facebookMessengerUrl" target="_blank">Facebook Messenger</a></li>
					<li v-if="twitterUrl"><a v-track-link :href="twitterUrl" target="_blank">@{{ venue.contacts.twitter }}</a> <span class="text-muted">(Twitter)</span></li>
				</ul>
				<p v-else class="mb-0 text-muted">{{ $t('pages.venue_detail.card.no_contact') }}</p>
			</div>

			<!-- URLs -->
			<div class="list-group-item contact-card-list-item">
				<nuxt-link v-if="showEditAction" :to="editRoute" class="float-right">{{ $t('pages.venue_detail.common.edit') }}</nuxt-link>
				<pg-icon :class="['contact-card-list-item-icon', hasUrls ? null : 'text-muted']" icon="globe" />
				<ul v-if="hasUrls" class="list-unstyled mb-0">
					<li v-if="venue.urls.site"><a v-track-link :href="venue.urls.site" target="_blank">{{ readableSiteUrl }}</a></li>
					<li v-if="venue.urls.facebook"><a v-track-link :href="venue.urls.facebook" target="_blank">Facebook</a></li>
				</ul>
				<p v-else class="mb-0 text-muted">{{ $t('pages.venue_detail.card.no_urls') }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import capitalize from 'lodash/capitalize'
import { isVenueOpen } from '@/utilities'

const indexToDayName = (index, locale) => {
	// Create any date but se the right day of the week
	const date = new Date()
	date.setDate(date.getDate() - date.getDay() + index)

	const name = date.toLocaleDateString(locale, { weekday: 'long' })

	return capitalize(name)
}

export default {
	name: 'PgVenueDetailPageContactCard',

	props: {
		venue: {
			type: Object,
			required: true
		},
		showEditAction: {
			type: Boolean,
			default: false
		},
		editRoute: {
			type: [String, Object],
			default: null
		}
	},

	data() {
		return {
			mapOptions: {
				styles: [
					{
						// No labels on POI
						featureType: 'poi',
						elementType: 'labels.text',
						stylers: [{ visibility: 'off' }]
					}
				]
			},
			hoursExpanded: false
		}
	},

	computed: {
		mapImgUrl() {
			return [
				'https://maps.googleapis.com/maps/api/staticmap',
				`?center=${this.venue.coords.lat},${this.venue.coords.lng}`,
				'&zoom=15',
				'&size=700x395',
				'&scale=2',
				'&style=feature:poi|element:labels.text|visibility:off',
				`&key=${this.$constants.GOOGLE_MAPS_KEY}`
			].join('')
		},

		addressLines() {
			const a = this.venue.address
			return [
				[a.line1, a.line2].join(', '),
				a.city,
				`${a.postcode} ${a.province}`.trim()
			]
		},

		isOpen() {
			return isVenueOpen(this.venue.business_hours)
		},

		businessHoursRows() {
			return this.venue.business_hours.map((hours, index) => ({
				day: indexToDayName(index, this.$i18n.locale),
				hours: hours
			}))
		},

		hasContacts() {
			const c = this.venue.contacts

			return c.phone || c.email || c.facebook || c.twitter
		},

		hasUrls() {
			const u = this.venue.urls

			return u.site || u.facebook
		},

		googleMapsUrl() {
			const baseUrl =
				'https://www.google.com/maps/dir/?api=1&map_action=map&destination='
			let address = this.venue.address
			address = Object.keys(address).map(e => address[e])
			address = encodeURIComponent(address)

			return `${baseUrl}${address}`
		},

		facebookMessengerUrl() {
			// Get handle from the specfied contact
			let handle = this.venue.contacts.facebook

			// Fallback to handle inferred from url
			if (!handle && this.venue.urls.facebook) {
				const re = /^.*\.facebook\.com\/.*-(\d{5,})\/?$/i
				const matches = this.venue.urls.facebook.match(re)

				if (matches.length > 1) handle = matches[matches.length - 1]
			}

			return handle ? `https://www.messenger.com/t/${handle}` : null
		},

		twitterUrl() {
			const handle = this.venue.contacts.twitter

			return handle ? `https://www.twitter.com/${handle}` : null
		},

		readableSiteUrl() {
			const url = this.venue.urls.site

			// Stop if there's no url
			if (!url) return null

			// Return the full url on SSR
			if (process.server) return url

			// Return clean url on client
			const parser = document.createElement('a') // cannot use new URL() on ie11
			parser.href = url

			return parser.hostname.replace('www.', '')
		}
	},

	methods: {
		toggleHours() {
			this.hoursExpanded = !this.hoursExpanded
		}
	}
}
</script>

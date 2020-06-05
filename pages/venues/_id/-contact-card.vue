<template>
	<b-card no-body>
		<pg-image-frame
			:src="mapImgUrl"
			ratio="16:9"
			class="map"
			content-class="map__content">
			<pg-icon icon="pin" class="map__pin" />
			<div class="map__pin-shadow" />
		</pg-image-frame>

		<b-list-group flush>
			<!-- Address -->
			<b-list-group-item class="list-item">
				<nuxt-link v-if="showEditAction" :to="editRoute" rel="nofollow" class="float-right">{{ $t('pages.venue_detail.common.edit') }}</nuxt-link>

				<pg-icon icon="directions" class="list-item__icon" />
				<div class="mb-2">
					<strong>{{ venue.name }}</strong>
					<div v-for="(line, index) in addressLines" :key="index">{{ line }}</div>
				</div>
				<p class="mb-0"><a v-track-link :href="googleMapsUrl" target="_blank">{{ $t('pages.venue_detail.card.directions') }}</a></p>
			</b-list-group-item>

			<!-- Business hours -->
			<b-list-group-item class="list-item">
				<nuxt-link v-if="showEditAction" :to="editRoute" class="float-right">{{ $t('pages.venue_detail.common.edit') }}</nuxt-link>
				<pg-icon :class="['list-item__icon', venue.business_hours.length ? null : 'text-muted']" icon="clock-outline" />

				<template v-if="venue.business_hours.length">
					<a :class="isOpen ? 'text-success' : 'text-danger'" href="#" @click.prevent="hoursExpanded = !hoursExpanded">
						{{ isOpen ? $t('pages.venue_detail.card.open_now') : $t('pages.venue_detail.card.closed_now') }}<pg-icon :icon="hoursExpanded ? 'chevron-up' : 'chevron-down'" class="ml-1 list-item__chevron-icon" />
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
			</b-list-group-item>

			<!-- Contacts -->
			<b-list-group-item class="list-item">
				<nuxt-link v-if="showEditAction" :to="editRoute" class="float-right">{{ $t('pages.venue_detail.common.edit') }}</nuxt-link>
				<pg-icon :class="['list-item__icon', hasContacts ? null : 'text-muted']" icon="phone" />

				<ul v-if="hasContacts" class="list-unstyled mb-0">
					<li v-if="venue.contacts.phone"><a :href="`tel://${venue.contacts.phone}`">{{ venue.contacts.phone }}</a></li>
					<li v-if="venue.contacts.email"><a :href="`mailto:${venue.contacts.email}`">{{ venue.contacts.email }}</a></li>
					<li v-if="facebookMessengerUrl"><a v-track-link :href="facebookMessengerUrl" target="_blank">Facebook Messenger</a></li>
					<li v-if="twitterUrl"><a v-track-link :href="twitterUrl" target="_blank">@{{ venue.contacts.twitter }}</a> <span class="text-muted">(Twitter)</span></li>
				</ul>
				<p v-else class="mb-0 text-muted">{{ $t('pages.venue_detail.card.no_contact') }}</p>
			</b-list-group-item>

			<!-- URLs -->
			<b-list-group-item class="list-item">
				<nuxt-link v-if="showEditAction" :to="editRoute" class="float-right">{{ $t('pages.venue_detail.common.edit') }}</nuxt-link>
				<pg-icon :class="['list-item__icon', hasUrls ? null : 'text-muted']" icon="globe" />
				<ul v-if="hasUrls" class="list-unstyled mb-0">
					<li v-if="venue.urls.site"><a v-track-link :href="venue.urls.site" target="_blank">{{ readableSiteUrl }}</a></li>
					<li v-if="venue.urls.facebook"><a v-track-link :href="venue.urls.facebook" target="_blank">Facebook</a></li>
				</ul>
				<p v-else class="mb-0 text-muted">{{ $t('pages.venue_detail.card.no_urls') }}</p>
			</b-list-group-item>
		</b-list-group>
	</b-card>
</template>

<script>
import { capitalize } from 'lodash'
import { BCard, BListGroup, BListGroupItem } from 'bootstrap-vue'
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

	components: {
		BCard,
		BListGroup,
		BListGroupItem
	},

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

	data () {
		return {
			hoursExpanded: false
		}
	},

	computed: {
		mapImgUrl () {
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

		addressLines () {
			const a = this.venue.address
			return [
				[a.line1, a.line2].join(', '),
				a.city,
				`${a.postcode} ${a.province}`.trim()
			]
		},

		isOpen () {
			return isVenueOpen(this.venue.business_hours)
		},

		businessHoursRows () {
			return this.venue.business_hours.map((hours, index) => ({
				day: indexToDayName(index, this.$i18n.locale),
				hours
			}))
		},

		hasContacts () {
			const c = this.venue.contacts

			return c.phone || c.email || c.facebook || c.twitter
		},

		hasUrls () {
			const u = this.venue.urls

			return u.site || u.facebook
		},

		googleMapsUrl () {
			const baseUrl =
				'https://www.google.com/maps/dir/?api=1&map_action=map&destination='
			let address = this.venue.address
			address = Object.keys(address).map(e => address[e])
			address = encodeURIComponent(address)

			return `${baseUrl}${address}`
		},

		facebookMessengerUrl () {
			// Get handle from the specfied contact
			let handle = this.venue.contacts.facebook

			// Fallback to handle inferred from url
			if (!handle && this.venue.urls.facebook) {
				const re = /^.*\.facebook\.com\/.*-(\d{5,})\/?$/i
				const matches = this.venue.urls.facebook.match(re)

				if (matches.length > 1) { handle = matches[matches.length - 1] }
			}

			return handle ? `https://www.messenger.com/t/${handle}` : null
		},

		twitterUrl () {
			const handle = this.venue.contacts.twitter

			return handle ? `https://www.twitter.com/${handle}` : null
		},

		readableSiteUrl () {
			const url = this.venue.urls.site

			// Stop if there's no url
			if (!url) { return null }

			// Return the full url on SSR
			if (process.server) { return url }

			// Return clean url on client
			const parser = document.createElement('a') // cannot use new URL() on ie11
			parser.href = url

			return parser.hostname.replace('www.', '')
		}
	}
}
</script>

<style lang="scss" scoped>
// Contact card
.card {
	border: 0;
	font-size: $font-size-sm;
}
.map {
	border-radius: $card-border-radius;
	background-size: 200%;

	/deep/ &__content {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	&__pin {
		width: 2.5rem;
		height: 2.5rem;
		margin-top: -2rem;
		color: $fuchsia-500;
		stroke: $fuchsia-600;
		stroke-width: 0.5;
		z-index: 1;
	}
	&__pin-shadow {
		position: absolute;
		width: 1rem;
		height: 0.35rem;
		border-radius: 50%;
		margin-top: 0.05rem;
		background: radial-gradient(rgba($black, 0.3), rgba($black, 0) 66%);
	}
}
.list-item {
	margin-left: 2rem;
	padding: 1rem 0;
	position: relative;

	&:first-child {
		border-top: 0;
	}

	&:hover {
		z-index: 0; // Override bootstrap default zindex that hides borders
	}

	&__icon {
		position: absolute;
		left: -1.75rem;
	}
	&__chevron-icon {
		height: 0.75rem;
		width: 0.75rem;
		vertical-align: -0.125rem;
	}
}
@include media-breakpoint-up(sm) {
	.map {
		background-size: 150%;
	}
}
@include media-breakpoint-up(md) {
	.map {
		background-size: 100%;
	}
}
@include media-breakpoint-up(lg) {
	.card {
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
	.map {
		background-size: 200%;
		@include border-bottom-radius(0);
	}
	.list-item {
		margin-left: $grid-gutter-width * 1.75;
		padding-right: 1.25rem;
	}
}
</style>

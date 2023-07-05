<template>
	<b-card no-body class="h-100 text-center">
		<b-card-body class="header flex-grow-0" :style="`background-color: ${bgColor}`">
			<h3 class="header__title">
				<span class="header__position">{{ position }} <span class="sr-only">&deg;</span></span>
				<img class="header__logo" :src="imgSrc" :title="name" :alt="`${name}'s logo`">
			</h3>
		</b-card-body>
		<b-card-body class="flex-fill">
			<h3 class="welcome__heading">{{ $t('pages.venue_detail.casino_ranking.card.welcome') }}</h3>
			<p class="welcome__value" v-html="forceWrap(welcome)" />
			<p class="description">{{ description }}</p>
		</b-card-body>
		<b-card-body class="pt-0 flex-grow-0">
			<pg-button variant="accent" block :href="cta" target="_blank">
				{{ $t('pages.venue_detail.casino_ranking.card.register') }}
			</pg-button>
		</b-card-body>
	</b-card>
</template>

<script>
import { BCard, BCardBody } from 'bootstrap-vue'

export default {
	name: 'PgVenueDetailPageCasinoCard',

	components: {
		BCard,
		BCardBody
	},

	props: {
		bgColor: {
			type: String,
			default: 'transparent'
		},
		position: {
			type: [String, Number],
			required: true
		},
		name: {
			type: String,
			required: true
		},
		imgSrc: {
			type: String,
			required: true
		},
		welcome: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		cta: {
			type: String,
			required: true
		}
	},

	methods: {
		forceWrap (text) {
			return text.trim().replace(/(\S+)\s+(\S+)$/, '$1&nbsp;$2')
		}
	}
}
</script>

<style lang="scss" scoped>
.header {
	padding-top: map-get($spacers, 2);
	padding-bottom: map-get($spacers, 2);
	border-top-left-radius: $card-border-radius;
	border-top-right-radius: $card-border-radius;

	&__title {
		font-size: $font-size-lg;
		position: relative;
		margin: 0;
	}

	&__position {
		align-items: center;
		background-color: $fuchsia-500;
		border-radius: 50%;
		color: $white;
		display: inline-flex;
		font-size: $font-size-lg;
		font-weight: $font-weight-semibold;
		height: 1.5rem;
		justify-content: center;
		left: 0;
		line-height: 1;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 1.5rem;
	}

	&__logo {
		margin: 0;
		flex: auto;
		max-width: clamp(0px, 60%, 180px);
		max-height: 40px;
	}
}

.welcome {
	&__heading {
		font-size: $font-size-xs;
		font-weight: $font-weight-bold;
		text-transform: uppercase;
		color: $text-muted;
	}
	&__value {
		color: $fuchsia-500;
		font-size: $font-size-md;
		line-height: 1.2;
	}
}

.description {
	font-size: $font-size-sm;
	margin-bottom: 0;
}

@include media-breakpoint-up(lg) {
	.header {
		&__position {
			font-size: $font-size-xl;
			height: 2rem;
			width: 2rem;
		}
	}
}
</style>

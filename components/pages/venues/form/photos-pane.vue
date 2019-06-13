<template>
	<div class="my-5">
		<h5>{{ $t('pages.venue_form.photos.title') }}</h5>
		<hr>

		<draggable
			v-model="venuePhotos"
			draggable=".draggable"
			:class="{ 'bg-light': $refs.uploader && $refs.uploader.dropActive }"
			class="row">
			<!-- Current photos -->
			<div v-for="photo in venuePhotos" :key="photo.id" :class="photoItemClass" class="draggable">
				<a :href="photo.resized_url" target="_blank">
					<pg-image-frame
						:src="photo.thumbnail_url"
						ratio="1:1"
						class="rounded"
						content-class="d-flex align-items-end justify-content-end">
						<pg-button
							v-b-tooltip.hover.bottom
							size="sm"
							variant="danger"
							class="mr-1 mb-1"
							icon="trash"
							:title="$t('common.actions.delete')"
							@click.prevent="deletePhoto(photo)"
						/>
					</pg-image-frame>
				</a>
			</div>

			<!-- Current uploads -->
			<template #footer>
				<div v-for="(file, index) in uploaderFiles" :key="index" :class="photoItemClass">
					<div class="embed-responsive embed-responsive-1by1 rounded border">
						<div class="embed-responsive-item d-flex flex-column align-items-center justify-content-center text-center">
							<template v-if="file.error">
								<div class="text-danger small">
									<strong>{{ $t('common.status.error') }}</strong><br>
									{{ file.error }}
								</div>
								<pg-button
									v-b-tooltip.hover.bottom
									size="sm"
									variant="danger"
									class="mt-2"
									icon="trash"
									:title="$t('common.actions.delete')"
									@click.prevent="$refs.uploader.remove(file)"
								/>
							</template>
							<template v-else>
								{{ $t('common.status.loading') }}
								<b-progress :value="parseFloat(file.progress)" class="w-75 my-2" style="height: 2px" />
								{{ file.progress }}%
							</template>
						</div>
					</div>
				</div>

				<!-- Force footer with just the uploader to render on client -->
				<span style="width: 0px; overflow: hidden;">&nbsp;</span>

				<!-- Uploader -->
				<no-ssr>
					<div v-if="(venuePhotos.length + uploaderFiles.length) <= 50" :class="photoItemClass">
						<vue-uploader
							ref="uploader"
							v-model="uploaderFiles"
							:drop="true"
							:headers="uploaderHeaders"
							class="embed-responsive embed-responsive-1by1 rounded"
							accept="image/*"
							multiple
							:post-action="uploaderUrl"
							@input-file="onUploaderFileInput">
							<a class="embed-responsive-item text-primary border d-flex flex-column align-items-center justify-content-center">
								<pg-icon icon="plus" />
								{{ $t('pages.venue_form.photos.upload') }}
							</a>
						</vue-uploader>
					</div>
				</no-ssr>
			</template>
		</draggable>

		<pg-confirm-modal
			v-model="confirmDeleteOpen"
			:title="$t('pages.venue_form.photos.delete.title')"
			:ok-title="$t('common.actions.delete')"
			variant="danger"
			@ok="confirmDeletePhoto">
			<i18n tag="p" path="pages.venue_form.photos.delete.intro">
				<strong class="text-danger" place="action">{{ $t('pages.venue_form.photos.delete.intro_action') }}</strong>
			</i18n>
			<div v-if="currentPhoto" class="text-center">
				<img :src="currentPhoto.thumbnail_url" class="img-fluid rounded">
			</div>
		</pg-confirm-modal>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'
import { BProgress } from 'bootstrap-vue'
import VueUploader from 'vue-upload-component' // FIXME: Make custom component

import PgImageFrame from '@/components/image-frame'

export default {
	name: 'PhotosPane',

	components: {
		draggable,
		BProgress,
		PgImageFrame,
		VueUploader
	},

	data() {
		return {
			uploaderFiles: [],
			photoItemClass: 'col-6 col-md-4 col-xl-3 mb-3',
			confirmDeleteOpen: false,
			currentPhoto: null
		}
	},

	computed: {
		...mapState('venueForm', ['venue']),

		venuePhotos: {
			get() {
				return this.venue.photos
			},
			set(value) {
				this.$store.commit('venueForm/setVenueField', {
					field: 'photos',
					value
				})
			}
		},

		subscription() {
			return this.venue.subscription
		},

		uploaderUrl() {
			return `${process.env.API_URL}/files`
		},

		uploaderHeaders() {
			return {
				Authorization: this.$auth.$storage.getUniversal('_token.local'),
				'X-Requested-With': 'XMLHttpRequest'
			}
		}
	},

	methods: {
		onUploaderFileInput(newFile, oldFile) {
			// Update
			if (newFile && oldFile) {
				// FIXME: Qui dovremmo controllare l'errore del server e
				// scriverlo nell'istanza del file, quindi mostrarlo
				if (newFile.response && newFile.response.file) {
					newFile.error = newFile.response.file[0]
					// newFile = this.$refs.uploader.update(newFile, { error: newFile.response.file });
				}

				// Upload successful
				if (newFile.success !== oldFile.success) {
					const photos = this.venuePhotos.slice()
					photos.push(newFile.response)
					this.venuePhotos = photos

					this.$refs.uploader.remove(newFile)
				}
			}

			// Automatic upload
			if (
				Boolean(newFile) !== Boolean(oldFile) ||
				oldFile.error !== newFile.error
			) {
				if (!this.$refs.uploader.active) {
					this.$refs.uploader.active = true
				}
			}
		},

		deletePhoto(photo) {
			this.currentPhoto = photo
			this.confirmDeleteOpen = true
		},

		confirmDeletePhoto() {
			const photos = this.venuePhotos.slice()
			photos.splice(photos.indexOf(this.currentPhoto), 1)
			this.venuePhotos = photos
		}
	}
}
</script>

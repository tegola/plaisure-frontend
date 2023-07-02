<template>
	<form @submit.prevent="submit">
		<div class="row form-row align-items-center justify-content-between">
			<template v-if="!dragEnabled">
				<div class="col-auto">
					<!-- Uploader -->
					<vue-uploader
						v-if="totalPhotoCount <= 50"
						ref="uploader"
						v-model="uploaderFiles"
						class="d-block"
						:headers="uploaderHeaders"
						accept="image/*"
						multiple
						:maximum="50"
						:post-action="uploaderUrl"
						@input-file="onUploaderFileInput">
						<pg-button
							:label="$t('common.actions.upload')"
							icon="plus"
						/>
					</vue-uploader>
				</div>
				<div class="col">
					<pg-button
						:label="$t('common.actions.sort')"
						:disabled="!photos.length"
						@click="dragEnabled = true"
					/>
				</div>
				<div class="col-auto">
					<pg-button
						ref="submit"
						type="submit"
						variant="primary"
						:loading="saving"
						:block="$mq | mq({ xs: true, md: false })"
						:label="$t('common.actions.save')"
						:disabled="!photos.length"
					/>
				</div>
			</template>
			<template v-else>
				<div class="col">
					<small class="text-muted">{{ $t('pages.user.venues.detail.photos.reorder') }}</small>
				</div>
				<div class="col-auto">
					<pg-button
						variant="dark"
						:label="$t('common.actions.done')"
						@click="dragEnabled = false"
					/>
				</div>
			</template>
		</div>

		<hr>

		<draggable
			v-model="model.photos"
			draggable=".draggable"
			:force-fallback="true"
			:disabled="!dragEnabled"
			class="row">
			<!-- Current photos -->
			<div v-for="photo in model.photos" :key="photo.id" :class="photoItemClass" class="draggable">
				<a :href="photo.resized_url" target="_blank">
					<pg-image-frame
						:src="photo.thumbnail_url"
						ratio="1:1"
						class="rounded bg-light"
					/>
				</a>
				<pg-button
					variant="outline-light"
					size="sm"
					block
					class="mt-2 text-danger"
					icon="trash"
					:label="$t('common.actions.delete')"
					:disabled="dragEnabled"
					@click.prevent="deletePhoto(photo)"
				/>
			</div>

			<!-- Current uploads -->
			<template #footer>
				<div
					v-for="(file, index) in uploaderFiles"
					v-show="!dragEnabled"
					:key="index"
					:class="photoItemClass">
					<pg-image-frame
						ratio="1:1"
						class="rounded border"
						content-class="d-flex flex-column align-items-center justify-content-center text-center">
						<div v-if="file.error" class="text-danger small">
							<strong>{{ $t('common.status.error') }}</strong><br>
							{{ file.error }}
						</div>
						<template v-else>
							{{ $t('common.status.loading') }}
							<b-progress :value="parseFloat(file.progress)" class="w-75 my-2" style="height: 2px" />
							{{ file.progress }}%
						</template>
					</pg-image-frame>
					<pg-button
						v-if="file.error"
						variant="outline-light"
						size="sm"
						block
						class="mt-2 text-danger"
						icon="trash"
						:label="$t('common.actions.delete')"
						@click.prevent="$refs.uploader.remove(file)"
					/>
				</div>
			</template>
		</draggable>

		<pg-no-items
			v-if="!totalPhotoCount"
			:title="$t('pages.user.venues.detail.photos.no_items.title')"
			:subtitle="$t('pages.user.venues.detail.photos.no_items.subtitle')"
			class="py-5"
		/>

		<pg-confirm-modal
			v-model="confirmDeleteOpen"
			:title="$t('pages.user.venues.detail.photos.delete.title')"
			:ok-title="$t('common.actions.delete')"
			variant="danger"
			@ok="confirmDeletePhoto">
			<i18n tag="p" path="pages.user.venues.detail.photos.delete.intro" class="mb-0">
				<strong slot="action" class="text-danger">{{ $t('pages.user.venues.detail.photos.delete.intro_action') }}</strong>
			</i18n>
		</pg-confirm-modal>
	</form>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'
import { BProgress } from 'bootstrap-vue'
import VueUploader from 'vue-upload-component/dist/vue-upload-component.part.js' // FIXME: Make custom component
import PgNoItems from '@/components/no-items'

export default {
	name: 'PgUserVenueDetailPagePhotosSection',

	components: {
		draggable,
		BProgress,
		VueUploader,
		PgNoItems
	},

	data () {
		return {
			uploaderFiles: [],
			photoItemClass: 'col-6 col-sm-4 col-md-3 col-lg-2 mb-3',
			confirmDeleteOpen: false,
			currentPhoto: null,
			dragEnabled: false,
			model: null
		}
	},

	async fetch ({ $axios, params, store }) {
		const { data } = await $axios.$get(`/user/venues/${params.id}/photos`)

		store.commit('user-venue-detail/setPhotos', data)
	},

	computed: {
		...mapState('user-venue-detail', ['venue', 'photos', 'saving']),

		uploaderUrl () {
			return `${process.env.API_URL}/files`
		},

		uploaderHeaders () {
			return {
				Authorization: this.$auth.$storage.getUniversal('_token.local'),
				'X-Requested-With': 'XMLHttpRequest'
			}
		},

		totalPhotoCount () {
			return this.photos.length + this.uploaderFiles.length
		}
	},

	watch: {
		photos: {
			handler: 'prepareModel',
			immediate: true
		}
	},

	methods: {
		prepareModel () {
			this.model = {
				photos: this.photos.slice()
			}
		},

		onUploaderFileInput (newFile, oldFile) {
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
					const photos = this.model.photos.slice()
					photos.push(newFile.response.data)

					// FIXME: questo rimpiazza gli eventuali testi di ogni foto
					// visto che commit -> watch -> model
					this.$store.commit('user-venue-detail/setPhotos', photos)

					this.$refs.uploader.remove(newFile)
				}
			}

			// Automatic upload
			if (!!newFile !== !!oldFile || oldFile.error !== newFile.error) {
				if (!this.$refs.uploader.active) {
					this.$refs.uploader.active = true
				}
			}
		},

		deletePhoto (photo) {
			this.currentPhoto = photo
			this.confirmDeleteOpen = true
		},

		confirmDeletePhoto () {
			this.model.photos.splice(this.model.photos.indexOf(this.currentPhoto), 1)
		},

		async submit () {
			this.$store.commit('user-venue-detail/setSaving', true)

			try {
				// Save
				await this.$axios.post(
					`/user/venues/${this.venue.id}/photos`,
					this.model
				)

				// Show success on button
				this.$refs.submit.showSuccess()

				// Emit to reload venue
				this.$emit('submitted')
			} catch (err) {
				this.$notify({
					title: this.$t('common.status.error'),
					text: this.$t('common.status.save_error'),
					duration: -1,
					type: 'danger'
				})
			} finally {
				this.$store.commit('user-venue-detail/setSaving', false)
			}
		}
	}
}
</script>

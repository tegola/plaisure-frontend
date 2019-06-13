<script>
import { BDropdown } from 'bootstrap-vue'

export default {
	name: 'PgExplorePageDropdown',

	mixins: [BDropdown],

	props: {
		autoHide: {
			type: Boolean,
			default: true
		}
	},

	methods: {
		rootCloseListener(vm) {
			// Prevent close when dropdown item is clicked
			if (vm instanceof MouseEvent && !this.autoHide) return

			// close when other dropdown on page is opened
			BDropdown.mixins[1].methods.rootCloseListener.call(this, vm)
		}
	}
}
</script>

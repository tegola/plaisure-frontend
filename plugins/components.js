import Vue from 'vue'

import Modal from 'bootstrap-vue/es/components/modal'

import PgLogo from '@/components/logo'
import PgNavbar from '@/components/navbar'
import PgNotification from '@/components/notification'
import PgIcon from '@/components/icon'
import PgPageFooter from '@/components/page-footer'
import PgButton from '@/components/button'
import PgConfirmModal from '@/components/confirm-modal'

Vue.use(Modal, {
	centered: true
})

Vue.component('pg-logo', PgLogo)
Vue.component('pg-navbar', PgNavbar)
Vue.component('pg-notification', PgNotification)
Vue.component('pg-icon', PgIcon)
Vue.component('pg-page-footer', PgPageFooter)
Vue.component('pg-button', PgButton)
Vue.component('pg-confirm-modal', PgConfirmModal)

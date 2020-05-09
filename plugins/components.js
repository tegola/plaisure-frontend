import Vue from 'vue'

import { ModalPlugin } from 'bootstrap-vue'

import PgLogo from '@/components/logo'
import PgNavbar from '@/components/navbar'
import PgNotification from '@/components/notification'
import PgIcon from '@/components/icon'
import PgImageFrame from '@/components/image-frame'
import PgPageFooter from '@/components/page-footer'
import PgButton from '@/components/button'
import PgConfirmModal from '@/components/confirm-modal'
import PgRating from '@/components/rating'
import PgScrollablePane from '@/components/scrollable-pane'
import PgBreadcrumb from '@/components/breadcrumb'

Vue.use(ModalPlugin)

Vue.component('pg-logo', PgLogo)
Vue.component('pg-navbar', PgNavbar)
Vue.component('pg-notification', PgNotification)
Vue.component('pg-icon', PgIcon)
Vue.component('pg-image-frame', PgImageFrame)
Vue.component('pg-page-footer', PgPageFooter)
Vue.component('pg-button', PgButton)
Vue.component('pg-confirm-modal', PgConfirmModal)
Vue.component('pg-rating', PgRating)
Vue.component('pg-scrollable-pane', PgScrollablePane)
Vue.component('pg-breadcrumb', PgBreadcrumb)

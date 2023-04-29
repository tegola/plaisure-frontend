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

Vue.component('PgLogo', PgLogo)
Vue.component('PgNavbar', PgNavbar)
Vue.component('PgNotification', PgNotification)
Vue.component('PgIcon', PgIcon)
Vue.component('PgImageFrame', PgImageFrame)
Vue.component('PgPageFooter', PgPageFooter)
Vue.component('PgButton', PgButton)
Vue.component('PgConfirmModal', PgConfirmModal)
Vue.component('PgRating', PgRating)
Vue.component('PgScrollablePane', PgScrollablePane)
Vue.component('PgBreadcrumb', PgBreadcrumb)

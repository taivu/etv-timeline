import Vue from 'vue'
import Timeline from './Timeline.vue'
import { VueHammer } from 'vue2-hammer'
import VModal from 'vue-js-modal'
import VueYoutube from 'vue-youtube'

Vue.config.productionTip = false

Vue.use(VueHammer)
Vue.use(VueYoutube)
Vue.use(VModal, { dynamic: true })

new Vue({
  render: h => h(Timeline)
}).$mount('#timeline')

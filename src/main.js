import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Notifications from 'vue-notification'



import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay, faSquare, faCheck, faKey, faSignOutAlt, faCog, faUser, faHome, faChevronUp, faChevronDown, faQuestionCircle, faInfoCircle, faNetworkWired} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueNativeSock from 'vue-native-websocket'

library.add(faPlay, faSquare, faCheck, faKey, faSignOutAlt, faCog, faUser, faHome, faChevronUp, faChevronDown, faQuestionCircle, faInfoCircle, faNetworkWired)

Vue.component('font-awesome-icon', FontAwesomeIcon)

let ipAddress = "192.168.0.1";
if(localStorage.getItem('params')){
  let s = JSON.parse(localStorage.getItem('params'));
  ipAddress = s.ipAddress;
} 

Vue.use(VueNativeSock, "wss://" + ipAddress + "/websocket/socket/websocket", { store: store, reconnection: true, reconnectionAttempts: Infinity, reconnectionDelay: 3000})

Vue.use(Notifications)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  beforeCreate() {
    this.$store.commit('initialiseStore');
    this.$store.dispatch('setPressureScaling'); //temp workaround
	},

  render: h => h(App)
}).$mount('#app')




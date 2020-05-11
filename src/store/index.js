import Vuex from 'vuex';
import Vue from 'vue';
import global from './modules/global';
import parameters from './modules/parameters';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    global,
    parameters
  },
  mutations: {
    SOCKET_ONOPEN(state, event) {
      Vue.prototype.$socket = event.currentTarget
      state.global.socket.isConnected = true
    },
    SOCKET_ONCLOSE(state, event) {
      console.log(state, event)
      state.global.socket.isConnected = false
    },
    SOCKET_ONERROR(state, event) {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE(state, message) {
      state.global.socket.message = message
      console.log(state, message)
      this.commit("PARSE_SOCKET_MESSAGE", message)
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.global.socket.reconnectError = true;
    },
  }

});




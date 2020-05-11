import Vue from "vue";
import VueSocketIO from "vue-socket.io";
import VueResource from "vue-resource";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import { url } from "./utils/config";

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: `${url}/socket-video-chat`,
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_",
    },
  })
);

// Vue resource for http
Vue.use(VueResource);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

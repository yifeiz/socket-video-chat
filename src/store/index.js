import Vue from "vue";
import Vuex from "vuex";
import { STATUS_OPTIONS } from "./utils/config";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    room: undefined,
    username: undefined,
    status: STATUS_OPTIONS.available,
    rooms: [],
    // chatroom, username, user status, and available rooms for chat
  },
  mutations: {
    // mutations per action (joinRoom, changeRoom, setRooms, leaveChat, changeStatus)
  },
  actions: {
    // All actions triggered
  },
  modules: {},
});

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userName: localStorage.getItem("userName") || "",
    userRole: JSON.parse(localStorage.getItem("userRole") || "[]"),
    token: localStorage.getItem("token") || "",
    userType: localStorage.getItem("userType") || "",
  },
  getters: {},
  mutations: {
    set_token(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    set_userName(state, userName) {
      state.userName = userName;
      localStorage.setItem("userName", userName);
    },
    set_userRole(state, userRole) {
      state.userRole = userRole;
      localStorage.setItem("userRole", JSON.stringify(userRole));
    },
    set_userType(state, userType) {
      state.userType = userType;
      localStorage.setItem("userType", JSON.stringify(userType));
    },
  },
  actions: {},
  modules: {},
});

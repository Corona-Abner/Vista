import Vue from 'vue'
import Vuex from 'vuex'
import decode from "jwt-decode";
import router from "./router";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Loading:{
      titulo:'',
      estado:''
    },
    Snack:{
      titulo:'',
      estado:'',
      tiempo:0,
      color:'',
      modo:'',
      x:'',
      y:''
    },
    Login: { token: '', usuario: '',tipo:'' },
  },
  mutations: {
    mostrarLoading(state,loading){
      state.Loading.titulo=loading.titulo;
      state.Loading.estado=true;
    },
    ocultarLoading(state){
      state.Loading.estado=false;
    },
    mostrarSnack(state,snack){
      state.Snack.titulo=snack.titulo;
      state.Snack.estado=true;
      state.Snack.tiempo=snack.tiempo,
      state.Snack.color=snack.color,
      state.Snack.modo=snack.modo,
      state.Snack.x=snack.x,
      state.Snack.y=snack.y
    },
    setUsuario(state, Usuario) {
      state.Login.usuario = Usuario;
    },
    setToken(state, Token) {
      state.Login.token = Token;
    }
   
  },
  actions: {
    guardarToken({ commit }, token) {
      commit("setToken", token);
      commit("setUsuario", decode(token));
      localStorage.setItem("token", token);
    },
    autoLogin({ commit }) {
      let token = localStorage.getItem("token");
      if (token) {
        commit("setToken", token);
        commit("setUsuario", decode(token));
        router.push({ name: "home" });
      }
    },
    salir({ commit }) {
      commit("setToken", '');
      commit("setUsuario", '');
      localStorage.removeItem("token");
      router.push({ name: "login" });
    }
  }
})


import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Loading:{
      titulo:'',
      estado:''
    }
  },
  mutations: {
    mostrarLoading(state,loading){
      state.Loading.titulo=loading.titulo;
      state.Loading.estado=true;
    },
    ocultarLoading(state){
      state.Loading.estado=false;
    }
  },
  actions: {

  }
})


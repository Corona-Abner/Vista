import Vue from 'vue'
import Vuex from 'vuex'

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
    }
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
    }
  },
  actions: {

  }
})


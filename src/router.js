import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
//funcion para la carga deiferida o lazy loader
function diferida(view) {
  return () => import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`)
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: diferida('Home') 
    },
    {
      path: '/login',
      name: 'login',
      component: diferida('Login') 
    },
    {
      path: '/kits',
      name: 'kits',
      component: diferida('Kits') 
    },
    {
      path: '/lineas',
      name: 'lineas',
      component: diferida('Lineas') 
    },
    {
      path: '/marcas',
      name: 'marcas',
      component: diferida('Marcas') 
    },
    {
      path: '/productos',
      name: 'productos',
      component: diferida('Productos') 
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: diferida('Usuarios') 
    },
  ]
})

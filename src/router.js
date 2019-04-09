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
      path: '/about',
      name: 'about',
      component: diferida('About') 
    },
    {
      path: '/login',
      name: 'login',
      component: diferida('Login') 
    }
  ]
})

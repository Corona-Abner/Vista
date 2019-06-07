import Vue from 'vue'
import Router from 'vue-router'

import store from './store'

Vue.use(Router)
//funcion para la carga deiferida o lazy loader
function diferida(view) {
  return () => import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`)
}

const router = new Router({

  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: diferida('Home') ,
      meta:{
        administrador:true,
        informatica: true,
        usuario: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: diferida('Login'), 
      meta:{
        libre:true
      }
    },
    {
      path: '/kits',
      name: 'kits',
      component: diferida('Kits') ,
     meta:{
      administrador:true,
      informatica: true,
      usuario: false
     }
    },
    {
      path: '/lineas',
      name: 'lineas',
      component: diferida('Lineas') ,
      meta:{
        administrador:true,
        informatica: true,
        usuario: false
       }
    },
    {
      path: '/marcas',
      name: 'marcas',
      component: diferida('Marcas') ,
      meta:{
        administrador:true,
        informatica: true,
        usuario: false
       }
    },
    {
      path: '/productos',
      name: 'productos',
      component: diferida('Productos') ,
      meta:{
        administrador:true,
        informatica: true,
        usuario: false
       }
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: diferida('Usuarios') ,
      meta:{
        administrador:true,
        informatica: false,
        usuario: false
       }
      
    },
    {
      path: '/compras',
      name: 'compras',
      component: diferida('Compras') ,
      meta:{
        administrador:true,
        informatica: true,
        usuario: false
       }
      
    },
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)){
    next()
  }
  else if(store.state.Login.usuario && store.state.Login.usuario.tipo=="administrador"){
    if (to.matched.some(record => record.meta.administrador)){
      next()
    }
  }
  else if(store.state.Login.usuario && store.state.Login.usuario.tipo=="informatica"){
    if (to.matched.some(record => record.meta.informatica)){
      next()
    }
  }
  else if(store.state.Login.usuario && store.state.Login.usuario.tipo=="usuario"){
    if (to.matched.some(record => record.meta.usuario)){
      next()
    }
  }
});

export default router;

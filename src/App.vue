<template>
  <div id="app">
    <!-- Aplicacion principal -->
    <v-app id="inspire">
      <div v-if="Login!=null && Login.usuario!='' ">
        <!-- Solo en moviles: menu del lado Izquierdo -->
        <v-navigation-drawer
          v-model="diseño"
          fixed
          :mini-variant="mini"
          absolute
          temporary
          dark
          app
        >
          <!-- Listado de menu -->
          <v-list>
            <v-list-tile>
              <v-list-tile-action>
                <v-btn icon @click.stop="mini = !mini">
                  <v-icon v-if="mini">chevron_right</v-icon>
                  <v-icon v-else>chevron_left</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
            <!-- Recorre todos los elementos -->
            <div v-for="Elemento in Elementos" :key="Elemento.titulo">
              <v-list-group v-if="Elemento.items" :prepend-icon="Elemento.icono" v-show="(Elemento.meta.administrador && esAdmin) || (Elemento.meta.informatica && esInfo) || (Elemento.meta.usuario && esUser)">
                <template v-slot:activator>
                  <v-list-tile>
                    <v-list-tile-title>{{Elemento.titulo}}</v-list-tile-title>
                  </v-list-tile>
                </template>

                <v-list-tile v-for="item in Elemento.items" :key="item.titulo" :to="item.ruta">
                  <v-list-tile-action>
                    <v-icon small>{{ item.icono }}</v-icon>
                  </v-list-tile-action>
                  <!-- Contenido del elemento de la lista -->
                  <v-list-tile-content>
                    <v-list-tile-title>
                      <h4>
                        <small>{{ item.titulo }}</small>
                      </h4>
                    </v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list-group>
              <v-list-tile v-else :to="Elemento.ruta" v-show="(Elemento.meta.administrador && esAdmin) || (Elemento.meta.informatica && esInfo) || (Elemento.meta.usuario && esUser)">
                <!-- Icono del elemento de la lista -->
                <v-list-tile-action>
                  <v-icon>{{ Elemento.icono }}</v-icon>
                </v-list-tile-action>
                <!-- Contenido del elemento de la lista -->
                <v-list-tile-content>
                  <v-list-tile-title>{{ Elemento.titulo }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </div>

            <v-divider></v-divider>
            <v-list-tile  @click="cerrar">
                <!-- Icono del elemento de la lista -->
                <v-list-tile-action >
                  <v-icon>exit_to_app</v-icon>
                </v-list-tile-action>
                <!-- Contenido del elemento de la lista -->
                <v-list-tile-content>
                  <v-list-tile-title>Cerrar</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
          
          </v-list>
        </v-navigation-drawer>
        <!-- Barra de herrmientas -->
        <v-toolbar clipped-left dark>
          <!-- Solo en moviles: el icono para mostrar el menu -->
          <v-toolbar-side-icon class="hidden-md-and-up" @click.stop="diseño = !diseño"></v-toolbar-side-icon>
          <!-- Solo en moviles: espaciador -->
          <v-spacer class="hidden-md-and-up"></v-spacer>
          <!-- Flex -->
          <v-flex xs1>
            <!-- Icono del tribunal -->
            <v-img :src="require('@/assets/logo.svg')" height="45" contain></v-img>
          </v-flex>
          <!-- Solo Escritorio: Recorre todos los elementos -->
          <v-toolbar-items
            class="hidden-sm-and-down"
            v-for="Elemento in Elementos"
            :key="Elemento.titulo"
          >
            <v-btn
              flat
              v-if="Elemento.items"
              v-show="(Elemento.meta.administrador && esAdmin) || (Elemento.meta.informatica && esInfo) || (Elemento.meta.usuario && esUser)"
            >
              <v-menu>
                <template v-slot:activator="{ on }">
                  <div v-on="on">
                    <v-icon left>{{Elemento.icono}}</v-icon>
                    {{Elemento.titulo}}
                  </div>
                </template>

                <v-list>
                  <v-list-tile v-for="(item, index) in Elemento.items" :key="index" :to="item.ruta">
                    <template v-show="(Elemento.meta.administrador && esAdmin) || (Elemento.meta.informatica && esInfo) || (Elemento.meta.usuario && esUser)">
                      <v-list-tile-action>
                        <v-icon small>{{ item.icono }}</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title v-text="item.titulo"></v-list-tile-title>
                    </template>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-btn>
            <v-btn
              flat
              v-else
              :to="Elemento.ruta"
              v-show="(Elemento.meta.administrador && esAdmin) || (Elemento.meta.informatica && esInfo) || (Elemento.meta.usuario && esUser)"
            >
              <v-icon left>{{Elemento.icono}}</v-icon>
              {{Elemento.titulo}}
            </v-btn>
          </v-toolbar-items>

          <v-spacer class="hidden-sm-and-down"></v-spacer>
          <v-btn icon @click="cerrar" class="hidden-sm-and-down">
            <v-icon>exit_to_app</v-icon>
          </v-btn>
        </v-toolbar>
      </div>

      <v-content>
        <router-view/>
        <v-dialog v-model="Loading.estado" hide-overlay persistent width="300">
          <v-card dark>
            <v-card-text>
              <v-layout align-center justify-center fill-height>{{Loading.titulo}}</v-layout>
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-snackbar
          v-model="Snack.estado"
          :multi-line="Snack.modo === 'multi'"
          :vertical="Snack.modo === 'verti'"
          :timeout="Snack.tiempo"
          :color="Snack.color"
          :bottom="Snack.y === 'bottom'"
          :top="Snack.y === 'top'"
          :left="Snack.x === 'left'"
          :right="Snack.x === 'right'"
        >
          <v-layout align-center justify-center fill-height>{{Snack.titulo}}</v-layout>
        </v-snackbar>
      </v-content>
    </v-app>
  </div>
</template>

<!-- Script de la pagina App.vue -->

<script>
//Importamos un mape de estado para la store
import { mapState } from "vuex";
export default {
  name: "App",
  data() {
    return {
      //Variable para naviagtion drawer
      diseño: null,
      mini: true,
      Elementos: [
        {
          titulo: "Inicio",
          ruta: "/",
          icono: "home",
          items: null,
          meta: {
            administrador: true,
            informatica: true,
            usuario: true
          }
        },
        {
          titulo: "Usuarios",
          ruta: "/usuarios",
          icono: "supervisor_account",
          items: null,
          meta: {
            administrador: true,
            informatica: false,
            usuario: false
          }
        },
        {
          titulo: "Inventario",
          icono: "store_mall_directory",
          meta: {
            administrador: true,
            informatica: true,
            usuario: false
          },
          items: [
            {
              titulo: "Productos",
              icono: "speaker",
              ruta: "/productos",
              meta: {
                administrador: true,
                informatica: true,
                usuario: false
              }
            },
            {
              titulo: "Kits",
              icono: "speaker_group",
              ruta: "/kits",
              meta: {
                administrador: true,
                informatica: true,
                usuario: false
              }
            },
            {
              titulo: "Lineas",
              icono: "confirmation_number",
              ruta: "/lineas",
              meta: {
                administrador: true,
                informatica: true,
                usuario: false
              }
            },
            {
              titulo: "Marcas",
              icono: "local_offer",
              ruta: "/marcas",
              meta: {
                administrador: true,
                informatica: true,
                usuario: false
              }
            }
          ]
        },
        {
          titulo: "Compras",
          ruta: "/compras",
          icono: "shopping_cart",
          items: null,
          meta: {
            administrador: true,
            informatica: true,
            usuario: false
          }
        }
      ],
      snack: true
    };
  },
  computed: {
    //Mapeo de los estados de la Store
    ...mapState(["Loading", "Snack", "Login"]),
    esAdmin() {
      return (
        this.$store.state.Login.usuario &&
        this.$store.state.Login.usuario.tipo == "administrador"
      );
    },
    esInfo() {
      return (
        this.$store.state.Login.usuario &&
        this.$store.state.Login.usuario.tipo == "informatica"
      );
    },
    esUser() {
      return (
        this.$store.state.Login.usuario &&
        this.$store.state.Login.usuario.tipo == "usuario"
      );
    }
  },
  created() {
    this.$store.dispatch("autoLogin");
    if(this.$store.state.Login.usuario==''){
     
      this.$router.push("/login");
    }
    
  },
  methods: {
    async cerrar() {
      await this.$store.dispatch("salir");
    }
  }
};
</script>

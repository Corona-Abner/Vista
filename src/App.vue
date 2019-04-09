<template>
<div id="app">
    <!-- Aplicacion principal -->
    <v-app id="inspire">
        <!-- Solo en moviles: menu del lado Izquierdo -->
        <v-navigation-drawer v-model="diseño" fixed :mini-variant="mini" absolute  temporary dark app>
            <!-- Listado de menu -->
            <v-list dense>
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
                <v-list-tile v-for="Elemento in Elementos" :to="Elemento.ruta" :key="Elemento.titulo">

                    <!-- Icono del elemento de la lista -->
                    <v-list-tile-action>
                        <v-icon>{{ Elemento.icono }}</v-icon>
                    </v-list-tile-action>
                    <!-- Contenido del elemento de la lista -->
                    <v-list-tile-content>
                        <v-list-tile-title>{{ Elemento.titulo }}</v-list-tile-title>
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
            <v-toolbar-items class="hidden-sm-and-down" v-for="Elemento in Elementos" :key="Elemento.titulo">
                <v-btn flat :to="Elemento.ruta">
                    <v-icon left>{{Elemento.icono}}</v-icon>
                    {{Elemento.titulo}}
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-content>
            <router-view />
            <v-dialog v-model="Loading.estado" hide-overlay persistent width="300">
                <v-card dark>
                    <v-card-text>
                        <v-layout align-center justify-center fill-height>
                            {{Loading.titulo}}
                        </v-layout>
                        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <v-snackbar v-model="Snack.estado" :multi-line="Snack.modo === 'multi'" :vertical="Snack.modo === 'verti'" :timeout='Snack.tiempo' :color="Snack.color" :bottom="Snack.y === 'bottom'" :top="Snack.y === 'top'" :left="Snack.x === 'left'" :right="Snack.x === 'right'">
                <v-layout align-center justify-center fill-height>
                    {{Snack.titulo}}
                </v-layout>
            </v-snackbar>
        </v-content>

    </v-app>
</div>
</template>

<!-- Script de la pagina App.vue -->

<script>
//Importamos un mape de estado para la store
import {
    mapState
} from "vuex";
export default {
    name: 'App',
    data() {
        return {
            //Variable para naviagtion drawer
            diseño: null,
            mini: true,
            Elementos: [{
                titulo: 'Inicio',
                ruta: '/',
                icono: 'home'
            }, ],
            snack: true
        }
    },
    computed: {
        //Mapeo de los estados de la Store
        ...mapState(['Loading', 'Snack'])
    }
}
</script>

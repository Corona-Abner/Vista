<template>
<div id="app">
    <!-- Aplicacion principal -->
    <v-app id="inspire">
        <!-- Menu del lado Izquierdo -->
        <v-navigation-drawer v-model="diseño" fixed :mini-variant="mini" absolute dark temporary app>
            <!-- Listado de menu -->
            <v-list dense>
                <!-- Recorre todos los elemntos -->
                <v-list-tile v-for="Elemento in Elementos" :to="Elemento.Ruta" :key="Elemento.Titulo">
                    <!-- Icono del elemento de la lista -->
                    <v-list-tile-action>
                        <v-icon>{{ Elemento.Icono }}</v-icon>
                    </v-list-tile-action>
                    <!-- Contenido del elemento de la lista -->
                    <v-list-tile-content>
                        <v-list-tile-title>{{ Elemento.Titulo }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar clipped-left dark>
         
                <v-toolbar-side-icon class="hidden-md-and-up" @click.stop="diseño = !diseño"></v-toolbar-side-icon>
                <v-spacer class="hidden-md-and-up"></v-spacer>
                <v-flex xs1>
                    <v-img :src="require('@/assets/logo.svg')" height="45" contain></v-img>
                </v-flex>
          

        </v-toolbar>
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
            Elementos: []
        }
    },
    computed: {
        //Mapeo de los estados de la Store
        ...mapState(['Loading'])
    }
}
</script>

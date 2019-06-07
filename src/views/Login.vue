<template>
<!-- Contenedor -->
<v-container fluid fill-height>
    <!-- Dieño -->
    <v-layout align-center justify-center>
        <!-- Flex -->
        <v-flex xs12 sm8 md4>
            <!-- Carta -->
            <v-card>
                <!-- Parte de arriba de la carta -->
                <v-toolbar color="blue darken-1">
                    <!-- Titulo -->
                    <v-toolbar-title>
                        Iniciar sesión
                    </v-toolbar-title>
                </v-toolbar>
                <!-- Contenido de la carta -->
                <v-card-text>
                    <v-form>
                        <!-- Input de usuario -->
                        <v-text-field v-model="login.usuario" prepend-icon="person" autoComplete="username" label="Usuario"></v-text-field>
                        <!-- Input de contraseña -->
                        <v-text-field v-model="login.clave" prepend-icon="lock" autoComplete="current-password" label="Contraseña" type="password"></v-text-field>

                    </v-form>
                </v-card-text>
                <!-- Botonrs de la carta -->
                <v-card-actions>
                    <!-- Spaciador -->
                    <v-spacer></v-spacer>
                    <!-- Boton para acceder -->
                    <v-btn color="blue" @click="Mostrar">Acceder</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</v-container>
</template>

<script>
import axios from 'axios';
export default {
    data: () => ({
        login: {
            usuario: '',
            clave: ''
        },
        API_URL: 'usuarios/login'
    }),
    created() {
        if (this.$store.state.Login.usuario != '') {
            this.$router.push({
                name: 'home'
            });
        }
    },
    methods: {
       async Mostrar() {
            this.error = null;
            this.$store.commit("mostrarLoading", {
                titulo: "Iniciando Sesion",
                estado: true
            });
           await axios.post(this.API_URL, this.login).then((response) => {
                this.$store.dispatch("guardarToken", response.data.token)
                this.$router.push({
                    name: 'home'
                })
                this.$store.commit("ocultarLoading");
            }).catch((err) => {

                if (err.message === "Network Error"){this.$store.commit("mostrarSnack", {
                        titulo: "Server Ocupado",
                        estado: true,
                        tiempo: 3000,
                        color: 'error',
                        modo: 'verti'
                    });}
                else{ if (err.response.status == 400) {
                    this.$store.commit("mostrarSnack", {
                        titulo: "Introduce el usuario y la contraseña",
                        estado: true,
                        tiempo: 3000,
                        color: 'error',
                        modo: 'verti'
                    });
                };
                if (err.response.status == 401) {
                    this.$store.commit("mostrarSnack", {
                        titulo: "No tiene permisos para entrar",
                        estado: true,
                        tiempo: 3000,
                        color: 'error',
                        modo: 'verti'
                    });
                };
                if (err.response.status == 404) {
                    this.$store.commit("mostrarSnack", {
                        titulo: "Usuario y/o contraseña incorrectos",
                        estado: true,
                        tiempo: 3000,
                        color: 'error',
                        modo: 'verti'
                    });
                };}
               
                this.$store.commit("ocultarLoading");
            });
        }
    }
}
</script>

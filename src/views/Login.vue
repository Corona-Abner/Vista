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
                    <v-toolbar-title >
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
                        <v-flex xs12 v-if="error">
                            <div class="red--text">
                                {{error}}
                            </div>
                        </v-flex>
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
export default {
    data: () => ({
        login: {
            usuario: '',
            clave: ''
        },
        error: null,
        API_URL: 'usuarios/login'
    }),
    methods: {
        Mostrar() {
            
            this.$store.commit("mostrarSnack", {
                titulo: 'Iniciando Sesión',
                estado: true,
                tiempo: 1000,
                color:'error',
                modo:'verti'
            });
        }
    }

}
</script>

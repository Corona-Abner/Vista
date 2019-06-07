<template>
<v-container fluid>
    <v-layout>
        <v-flex>
            <v-card>
                <!-- Barra de herramientas -->
                <v-toolbar flat>
                    <!-- Titulo -->
                    <v-toolbar-title>Usuarios</v-toolbar-title>
                    <!-- Divisor -->
                    <v-divider class="mx-2" inset vertical></v-divider>
                    <!-- Spaciador -->
                    <v-spacer></v-spacer>
                    <!-- Cuadro de busqueda -->
                    <v-text-field v-model="Busqueda" append-icon="search" label="Busqueda" single-line hide-details></v-text-field>
                    <!-- Spaciador -->
                    <v-spacer></v-spacer>
                    <!-- Dialogo para agregar o editar -->
                    <v-dialog v-model="Dialogo" max-width="500px">
                        <!-- Boton para activar el dialogo -->
                        <v-btn slot="activator" color="primary" class="mb-2">Nuevo</v-btn>
                        <!-- Contenido del dialogo -->
                        <v-card>
                            <!-- Titulo -->
                            <v-card-title>
                                <span class="headline">{{ Titulo_dialogo }}</span>
                            </v-card-title>
                            <!-- Datos -->
                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs12 sm12 md12>
                                            
                                                <v-text-field type="text" :disabled="!(Indice === -1)" v-model="Item_editado.usuario" label="Usuario" counter maxlength="10"></v-text-field>
                                            
                                        </v-flex>
                                        <v-flex xs12 sm12 md12>
                                            <v-form>
                                                <v-text-field :disabled="!Item_editado.supervisor" v-model="Pass" label="Contraseña" type="password" counter maxlength="8">
                                                </v-text-field>
                                            </v-form>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field type="text" v-model="Item_editado.nombre" autocomplete="new-password" label="Nombre" counter maxlength="20"></v-text-field>
                                        </v-flex>

                                        <v-flex xs6>
                                            <v-text-field type="text" v-model="Item_editado.area" label="Area" counter maxlength="15"></v-text-field>
                                        </v-flex>
                                        <v-flex xs6>
                                            <v-select v-model="Item_editado.tipo" :items="tipos"  label="Tipo"></v-select>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-checkbox v-model="Item_editado.supervisor" color="primary" :label="`Supervisor`"></v-checkbox>
                                        </v-flex>
                                        
                                        <!-- Mensaje de validacion -->
                                        <v-flex xs12 v-show="Validacion">
                                            <div class="red--text" v-for="Mensaje in Mensajes" :key="Mensaje" v-text="Mensaje">
                                            </div>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-text>
                            <!-- Opciones para cerrar y aceptar -->
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" flat @click="Cerrar">Cancelar</v-btn>
                                <v-btn color="primary" flat @click="Aceptar">Guardar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <!-- Dialogo para eliminar-->
                    <v-dialog v-model="Dialogo2" max-width="500px">
                        <v-card>
                            <v-card-title class="headline">Eliminar</v-card-title>
                            <v-card-text>Estás a punto de eliminar al usuario: {{ Item_editado.usuario }}
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" flat="flat" @click="Cerrar2">
                                    Cancelar
                                </v-btn>
                                <v-btn color="primary" flat="flat" @click="Aceptar2">
                                    Aceptar
                                </v-btn>
                            </v-card-actions>

                        </v-card>
                    </v-dialog>
                </v-toolbar>
                <!-- Tabla de datos -->
                <v-data-table :loading="Cargando" :headers="Encabezados" :items="Usuarios" :search="Busqueda" class="elevation-1" rows-per-page-text="Numero de filas" no-results-text="No se ha encontrado resultados">
                    <!-- Barra de progreso -->
                    <v-progress-linear v-slot:progress color="primary" indeterminate></v-progress-linear>
                    <!-- lista de datos -->
                    <template v-slot:items="props">
                        <td>{{ props.item.usuario }}</td>
                        <td>{{ props.item.nombre }}</td>
                        <td>{{ props.item.area}}</td>
                        <div v-if="props.item.supervisor">
                            <td>
                                <v-icon class="ml-3 mt-3" small>check</v-icon>
                            </td>
                        </div>
                        <div v-else>
                            <td>
                                <v-icon class="ml-3 mt-3" small>close</v-icon>
                            </td>
                        </div>

                        <td>
                            <!-- Boton editar -->
                            <v-icon small class="mr-2" @click="Editar(props.item)">
                                edit
                            </v-icon>
                            <!-- Boton eliminar -->
                            <v-icon small @click="Eliminar(props.item)">
                                delete
                            </v-icon>
                        </td>
                    </template>
                    <!-- Mensaje si no se encontraron datos -->
                    <template v-slot:no-data>
                        <v-flex xs12 sm12 text-xs-center>
                            <v-alert :value="true" color="error" v-show="!Cargando">
                                No se encontraron datos
                                <v-btn color="primary" @click="Listar">Actualizar</v-btn>
                            </v-alert>
                        </v-flex>
                    </template>
                    <!-- Numero de lineas-->
                    <template v-slot:pageText="props">
                        Lineas {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
                    </template>
                </v-data-table>
            </v-card>
        </v-flex>
    </v-layout>
</v-container>
</template>

<!-- Script de la pagina Usuarios -->

<script>
//Importamos Axios para utilzar Apis
import axios from 'axios';
export default {
    //Datos a utilizar en la vista
    data: () => ({
        Pass:'',
        //Valor para hace una busqueda 
        Busqueda: '',
        //Valor para mostrar el dialogo de editar y agregar
        Dialogo: false,
        //Valor para mostrar el dialogo de mover papelera y restaurar
        Dialogo2: false,
        //Indice de los elemntos
        Indice: -1,
        //Valor para mostrar la barra de cargado
        Cargando: true,
        //Mensajes para validar
        Validacion: false,
        Mensajes: [],
        //Elementos para la tabla de la pestaña 1
        Usuarios: [],
        Lineas: [],
        Marcas: [],
        tipos:['administrador','informatica','usuario' ],
        
        //Encabezados para la tabla de la pestaña 1
        Encabezados: [{
                text: 'Usuario',
                value: 'usuario'
            },
            {
                text: 'Nombre',
                value: 'nombre'
            },
            {
                text: 'Area',
                value: 'area'
            },
            {
                text: 'Supervisor',
                value: 'supervisor'
            },
            {
                text: 'Opciones',
                value: 'opciones',
                sortable: false
            }
        ],
        //Datos para agregar y editar
        Item_editado: {
            "usuario": '',
            "clave": '',
            "nombre": '',
            "area": '',
            "derechos": 0,
            "foto": null,
            "supervisor": 1,
            "activos": 0,
            "sacar": 0,
            "opera": 0,
            "facturar": 0,
            "cobrar": 0,

            "facturas": 0,
            "devoluc": 0,
            "pagos": 0,
            "cotiza": 0,
            "cobranza": 0,
            "camfecha": 0,
            "numpoliza": 0,
            "periodos": 0,
            "modificaprecio": 0,
            "existencia": 0,
            "existsalidas": 0,
            "gerenciales": 0,
            "vendedor": 'SYS',
            "surtirpedidos": 0,
            "cobrador": 'SYS',
            "password_Hash": null,
            "password_Salt": null,
            "tipo": ''
        },
        Item_copia:[],
        //Variable para la api
        API_URL: 'usuarios/'
    }),
    //Metodo para utilzar propiedades computadas
    computed: {
        Titulo_dialogo() {
            return this.Indice === -1 ? 'Agregar' : 'Editar';
        }
    },
    //Metodo vigilante
    watch: {
        Dialogo(valor) {
            valor || this.Cerrar()
        }
    },
    //Cuando se crea la vista
    created() {
        this.Item_copia ==JSON.parse(JSON.stringify( this.Item_editado)); 
        this.Listar();
    },
    //Metodos
    methods: {
        //Metodo para Obtener datos de la api
        Listar() {
            this.Cargando = true;
            this.Usuarios = [];
            axios.get(this.API_URL).then((response) => {
                this.Usuarios = response.data;
                this.Cargando = false;
            }).catch((error) => {
                console.log(error);
                this.Cargando = false;
            });
        },
        //metodo para editar un elemento
        Editar(item) {
            this.Indice = this.Usuarios.indexOf(item);
            
            this.Item_editado =JSON.parse(JSON.stringify( item)); 
            this.Dialogo = true;
        },
        //metodo para eliminar un elemento
        Eliminar(item) {
            this.Dialogo2 = true;
            this.Item_editado = item;

        },
        //Aceptar para elimnar
        Aceptar2() {
            axios.delete(this.API_URL + this.Item_editado.usuario).then((response) => {
                this.Usuarios.splice(this.Usuarios.indexOf(this.Item_editado), 1);
                this.Cerrar2();
            }).catch((error) => {
                console.log(error);
            });
        },
        //Metodo para cerrar el dialogo 2
        Cerrar2() {
            this.Limpiar();
            this.Dialogo2 = false;
        },
        //Metodo par aceptar al editar y agregar elementos
        Aceptar() {
            this.Validar();
            if (this.Validacion) {
                return
            }
            //Validar
            if (this.Indice > -1) {
                //Editar
                axios.put(this.API_URL + this.Item_editado.usuario+"/"+this.Pass, this.Item_editado).then((response) => {
                    this.Cerrar();
                    this.Limpiar();
                    this.Listar();
                }).catch((error) => {
                    console.log(error);
                });
            } else {
                //agregar
                axios.post(this.API_URL+this.Pass, this.Item_editado).then((response) => {
                    this.Cerrar();
                    this.Limpiar();
                    this.Listar();
                }).catch((error) => {
                    console.log(error);
                });
            }
        },
        //metodo para cerrar el dialogo
        Cerrar() {
            this.Limpiar();
            this.Dialogo = false;
            this.Indice = -1;
        },
        //Metodo para validar
        Validar() {
            this.Validacion = false;
            this.Mensajes = [];
            //Verifica la longitud del nombre
            if (this.Item_editado.usuario.length < 3 || this.Item_editado.usuario.length > 10) {
                this.Mensajes.push(">El nombre de usuario debe tener entre 3 y 10 caracteres");
                this.Validacion = true;
            }
            if (this.Item_editado.supervisor) {
                if (this.Pass.length < 3 || this.Pass.length > 8) {
                    this.Mensajes.push(">La contraseña debe tener entre 3 y 8 caracteres");
                    this.Validacion = true;
                }
            }
              if (this.Item_editado.tipo=='' || this.Item_editado.tipo==null ) {
                this.Mensajes.push(">Elija el tipo de usuario");
                    this.Validacion = true;
            }
            if (this.Item_editado.nombre.length <=3 || this.Item_editado.nombre.length > 20) {
                this.Mensajes.push(">El nombre debe tener entre 3 y 20 caracteres");
                this.Validacion = true;
            }
            if (this.Item_editado.area.length < 3 || this.Item_editado.area.length > 15) {
                this.Mensajes.push(">El area debe tener entre 3 y 15 caracteres");
                this.Validacion = true;
            }
            //Verifica si el nombre esta repetido
            if (this.Indice == -1) {
                if (this.Usuarios.some(c => c.usuario.toUpperCase() === this.Item_editado.usuario.toUpperCase())) {
                    this.Mensajes.push(">El nombre de usuario esta repetido");
                    this.Validacion = true;
                }
            }
        },
        //Metodo para limpiar
        Limpiar() {
            this.Indice = -1;
            this.Validacion = false;
            this.Mensajes = [];
            this.Item_editado ==JSON.parse(JSON.stringify( this.Item_copia)); 

        },
    }
}
</script>

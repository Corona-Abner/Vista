<template>
<v-container fluid>
    <v-layout>
        <v-flex>
            <v-card>
                <v-toolbar flat>
                    <!-- Titulo -->
                    <v-toolbar-title>Kits</v-toolbar-title>
                    <!-- Divisor -->
                    <v-divider class="mx-2" inset vertical></v-divider>
                    <!-- Spaciador -->
                    <v-spacer></v-spacer>
                    <!-- Cuadro de busqueda -->
                    <v-text-field v-model="Busqueda" append-icon="search" label="Busquedas" single-line hide-details></v-text-field>
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
                                            <v-text-field type="number" :disabled="!this.Indice ==-1" v-model="Item_editado.articulo" label="Nombre" :min="1" prefix="KIT"></v-text-field>

                                        </v-flex>
                                        <v-flex xs12 sm12 md12>
                                            <v-text-field type="text" v-model="Item_editado.descrip" label="Descripcion" counter maxlength="50"></v-text-field>
                                        </v-flex>
                                        <v-layout align-center justify-center row fill-height>
                                            <v-flex xs6>
                                                <v-autocomplete v-model="Componente" :items="Productos" item-text="articulo" label="Producto" prepend-icon="search">
                                                </v-autocomplete>
                                            </v-flex>
                                            <v-flex xs2>
                                                <v-btn small fab @click="LOL(Componente)">
                                                    <v-icon>add</v-icon>
                                                </v-btn>
                                            </v-flex>
                                        </v-layout>
                                        <v-data-table :headers="Encabezados2" :items="Prods" rows-per-page-text="Numero de filas" no-results-text="No hay comp0nentes en el kit">
                                            <!-- lista de datos -->
                                            <template v-slot:items="props">

                                                <td>{{ props.item.articulo }}</td>
                                                <td>{{ props.item.precio1 }}</td>

                                                <td>{{props.item.inventariopiezas}}</td>

                                                <td>
                                                    <!-- Boton eliminar -->
                                                    <v-icon small @click="Eliminar(props.item)">
                                                        delete
                                                    </v-icon>

                                                </td>

                                            </template>
                                        </v-data-table>
                                        <!-- Checkboxes -->

                                        <v-flex xs12>
                                            <v-checkbox color="primary" v-model="Item_editado.paraventa" label="Para venta"></v-checkbox>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-checkbox color="primary" v-model="Item_editado.invent" label="Control inventario"></v-checkbox>
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

                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
                <v-data-table :loading="Cargando" :headers="Encabezados" :items="Kits" :search="Busqueda" class="elevation-1" rows-per-page-text="Numero de filas" no-results-text="No se ha encontrado resultados">
                    <!-- Barra de progreso -->
                    <v-progress-linear v-slot:progress indeterminate></v-progress-linear>
                    <!-- lista de datos -->
                    <template v-slot:items="props">

                        <td>{{ props.item.articulo }}</td>
                        <td>{{ props.item.descrip }}</td>

                        <td>{{props.item.inventariopiezas}}</td>

                        <td>
                            <v-icon small class="mr-2" @click="Eliminar(props.item)">
                                info
                            </v-icon>
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
                    <!-- Numero de Marcas-->
                    <template v-slot:pageText="props">
                        Marcas {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
                    </template>
                </v-data-table>
            </v-card>
        </v-flex>
    </v-layout>

</v-container>
</template>

<script>
//Importamos Axios para utilzar Apis
import axios from 'axios';
export default {
    data: () => ({
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
        Kits: [],
        Productos: [],
        Prods: [],
        Componente: '',
        Encabezados: [{
                text: 'Nombre',
                value: 'Mombre'
            },
            {
                text: 'Descripcion',
                value: 'Descripcion'
            },
            {
                text: 'Cantidad',
                value: 'Cantidad'
            },
            {
                text: 'Opciones',
                value: 'Opciones',
                sortable: false
            }
        ],
        Encabezados2: [{
                text: 'Nombre',
                value: 'nombre'
            },
            {
                text: 'Precio',
                value: 'descripcion'
            },
            {
                text: 'Cantidad',
                value: 'cantidad'
            },
            {
                text: 'Opciones',
                value: 'opciones',
                sortable: false
            }
        ],
        Item_editado: {
            "articulo": '',
            "descrip": '',
            "linea": '',
            "marca": '',
            "precio1": 0,
            "precio2": 0,
            "precio3": 0,
            "precio4": 0,
            "precio5": 0,
            "precio6": 0,
            "precio7": 0,
            "precio8": 0,
            "precio9": 0,
            "precio10": 0,
            "existencia": 0,
            "costoU": 0,
            "costo": 0,
            "unidad": null,
            "porRecib": 0,
            "porSurt": 0,
            "impuesto": "IVA",
            "minimo": 0,
            "maximo": 0,
            "observ": null,
            "costoStd": 0,
            "kit": 0,
            "serie": 0,
            "lote": 0,
            "invent": 1,
            "imagen": null,
            "paraventa": 1,
            "url": null,
            "curso": 0,
            "usuario": null,
            "usuhora": null,
            "usufecha": "2019-03-07T00:00:00",
            "exportado": 0,
            "enVenta": 0,
            "recalcular": 0,
            "granel": 0,
            "peso": 0,
            "bajoCosto": 0,
            "bloqueado": 0,
            "u1": 0,
            "u2": 0,
            "u3": 0,
            "u4": 0,
            "u5": 0,
            "u6": 0,
            "u7": 0,
            "u8": 0,
            "u9": 0,
            "u10": 0,
            "acaja": 0,
            "modificaprecio": null,
            "fraccionario": 0,
            "iespecial": 0,
            "ubicacion": null,
            "c2": 0,
            "c3": 0,
            "c4": 0,
            "c5": 0,
            "c6": 0,
            "c7": 0,
            "c8": 0,
            "c9": 0,
            "c10": 0,
            "movimientos": 0,
            "clasificacion": null,
            "rop": 0,
            "rotacion": 0,
            "clasifant": null,
            "eoq": 0,
            "etiquetas": 0,
            "modelo": null,
            "color": null,
            "talla": null,
            "speso": 0,
            "etiqueta": null,
            "numero": 0,
            "carton": 0,
            "ubicaetiq": null,
            "unidadrecibe": null,
            "unidadempaque": null,
            "sinvolumen": 0,
            "presentacion": 0,
            "servicio": 0,
            "numeroservicios": 0,
            "claveproveedor": null,
            "dp": 0,
            "familia": null,
            "subfamilia": null,
            "subfam1": null,
            "subfam2": null,
            "entradas": 0,
            "salidas": 0,
            "cantent": 0,
            "cantsal": 0,
            "pronostico": 0,
            "oferta": 0,
            "costoentrada": 0,
            "costosalida": 0,
            "unidadesentrada": 0,
            "unidadessalida": 0,
            "donativo": 0,
            "costopeps": 0,
            "costoueps": 0,
            "contenido": null,
            "presentacionextra": null,
            "pesoextra": 0,
            "autor": null,
            "tema": null,
            "editorial": null,
            "fabricante": "SYS",
            "preciousd": 0,
            "costousd": 0,
            "puntos": 0,
            "autocodigo": 0,
            "inventariopiezas": null,
            "diasstockmaximo": null,
            "diasstockminimo": null,
            "requerimiento": null,
            "tiempoAire": 0,
            "ssmaTimeStamp": 'NULL',
            "ensambladoenlinea": 0,
            "iepslitro": null,
            "claveprodserv": null,
            "claveunidad": null,
            "lineaNavigation": null,
            "marcaNavigation": null
        },
        //Variable para la api
        API_URL: 'prods/'
    }),
    computed: {
        Titulo_dialogo() {
            return this.Indice === -1 ? 'Agregar' : 'Editar';
        }
    },
    created() {
        this.Listar();
    },
    methods: {
        Listar() {
            this.Cargando = true;
            this.Kits = [];
            this.Productos = [];
            axios.get(this.API_URL + "listark").then((response) => {
                this.Kits = response.data;
                this.Cargando = false;
            }).catch((error) => {
                console.log(error);
                this.Cargando = false;
            });
            axios.get(this.API_URL + "listarnombre").then((response) => {
                this.Productos = response.data;
                this.Cargando = false;
            }).catch((error) => {
                console.log(error);
                this.Cargando = false;
            });
        },
        LOL(com) {
            var index = this.Productos.findIndex(function (item, i) {
                return item.articulo === com
            });
            this.Prods.push(this.Productos[index]);
        }
    }
}
</script>

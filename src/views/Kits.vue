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

                </v-toolbar>
                <v-data-table :loading="Cargando" :headers="Encabezados" :items="Kits" :search="Busqueda" class="elevation-1" rows-per-page-text="Numero de filas" no-results-text="No se ha encontrado resultados">
                    <!-- Barra de progreso -->
                    <v-progress-linear v-slot:progress  indeterminate></v-progress-linear>
                    <!-- lista de datos -->
                    <template v-slot:items="props" >
                        
                        
                        <td>{{ props.item.articulo }}</td>
                        <td >{{ props.item.descrip }}</td>
                        
                        <td >{{props.item.inventariopiezas}}</td>
                        
                        <td >
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
        Encabezados: [{
                text: 'Nombre',
                value: 'nombre'
            },
            {
                text: 'Descripcion',
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
            "unidad": "0",
            "porRecib": 0,
            "porSurt": 0,
            "impuesto": "0",
            "minimo": 0,
            "maximo": 0,
            "observ": "0",
            "costoStd": 0,
            "kit": 1,
            "serie": 0,
            "lote": 0,
            "invent": 0,
            "imagen": "0",
            "paraventa": 0,
            "url": "0",
            "curso": 0,
            "usuario": "0",
            "usuhora": "0",
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
            "modificaprecio": "0",
            "fraccionario": 0,
            "iespecial": 0,
            "ubicacion": "0",
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
            "clasificacion": "0",
            "rop": 0,
            "rotacion": 0,
            "clasifant": "0",
            "eoq": 0,
            "etiquetas": 0,
            "modelo": "0",
            "color": "0",
            "talla": "0",
            "speso": 0,
            "etiqueta": "0",
            "numero": 0,
            "carton": 0,
            "ubicaetiq": "0",
            "unidadrecibe": "0",
            "unidadempaque": "0",
            "sinvolumen": 0,
            "presentacion": 0,
            "servicio": 0,
            "numeroservicios": 0,
            "claveproveedor": "0",
            "dp": 0,
            "familia": "0",
            "subfamilia": "0",
            "subfam1": "0",
            "subfam2": "0",
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
            "contenido": "0",
            "presentacionextra": "0",
            "pesoextra": 0,
            "autor": "0",
            "tema": "0",
            "editorial": "0",
            "fabricante": "0",
            "preciousd": 0,
            "costousd": 0,
            "puntos": 0,
            "autocodigo": 0,
            "inventariopiezas": 0,
            "diasstockmaximo": 0,
            "diasstockminimo": 0,
            "requerimiento": 0,
            "tiempoAire": 0,
            "ssmaTimeStamp": 'NULL',
            "ensambladoenlinea": 0,
            "iepslitro": 0,
            "clases": "0",
            "claveprodserv": "",
            "claveunidad": ""
        },
         //Variable para la api
        API_URL: 'prods/listar/kits'
    }),
     created() {
        this.Listar();
    },
    methods:{
         Listar() {
            this.Cargando = true;
            this.Kits = [];
            axios.get(this.API_URL).then((response) => {
                this.Kits = response.data;
                this.Cargando = false;
            }).catch((error) => {
                console.log(error);
                this.Cargando = false;
            });
        }
    }
}
</script>

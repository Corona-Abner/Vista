<template>
  <v-container fluid>
    <v-layout>
      <v-flex>
        <v-card>
          <v-tabs fixed-tabs>
            <v-tab>Hechas</v-tab>
            <v-tab>
              <v-badge>
                <template v-slot:badge>!</template>
                <span>Pendientes</span>
              </v-badge>
            </v-tab>
            <v-tab>Canceladas</v-tab>

            <v-tabs-items>
              <v-tab-item>
                <v-toolbar flat>
                  <!-- Titulo -->
                  <v-toolbar-title>Compras hechas</v-toolbar-title>
                  <!-- Divisor -->
                  <v-divider class="mx-2" inset vertical></v-divider>
                  <!-- Spaciador -->

                  <!-- Cuadro de busqueda -->
                  <v-text-field
                    v-model="Busqueda1"
                    append-icon="search"
                    label="Busqueda"
                    single-line
                    hide-details
                  ></v-text-field>
                  <!-- Spaciador -->
                  <v-spacer></v-spacer>
                  <!-- Dialogo de hacer compra -->
                  <v-dialog
                    v-model="DialogoCompra"
                    fullscreen
                    hide-overlay
                    transition="dialog-bottom-transition"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark v-on="on">Nueva</v-btn>
                    </template>
                    <v-card>
                      <v-toolbar dark color="primary">
                        
                        <v-toolbar-title>Neva Compra</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                          <v-btn dark flat @click="DialogoCompra = false">Cerrar</v-btn>
                          <v-btn dark flat @click="DialogoCompra = false">Guardar</v-btn>
                          <v-btn dark flat @click="DialogoCompra = false">Aceptar</v-btn>
                        </v-toolbar-items>
                      </v-toolbar>
                        </v-card>
                  </v-dialog>
                </v-toolbar>
                <!-- Tabla de datos -->
                <v-data-table
                  :loading="Cargando1"
                  :headers="Encabezados"
                  :items="Hechas"
                  :search="Busqueda1"
                  rows-per-page-text="Numero de filas"
                  no-results-text="No se ha encontrado resultados"
                >
                  <!-- Barra de progreso -->
                  <v-progress-linear v-slot:progress indeterminate></v-progress-linear>
                  <!-- lista de datos -->
                  <template v-slot:items="props">
                    <td>{{ props.item.factura }}</td>
                    <td>{{ props.item.datos }}</td>
                    <td>{{ props.item.importe}}</td>
                    <td>
                      <v-icon small @click="Eliminar(props.item)">delete</v-icon>
                    </td>
                  </template>
                  <template v-slot:no-results>
                    <v-flex xs12 sm12 text-xs-center>
                      <v-alert
                        :value="true"
                        color="error"
                        icon="warning"
                      >No se encontraron resultados para "{{ Busqueda }}".</v-alert>
                    </v-flex>
                  </template>
                  <!-- Mensaje si no se encontraron datos -->
                  <template v-slot:no-data>
                    <v-flex xs12 sm12 text-xs-center>
                      <v-alert :value="true" color="error" v-show="!Cargando1">
                        No se encontraron datos
                        <v-btn color="primary" @click="ListarHechas">Actualizar</v-btn>
                      </v-alert>
                    </v-flex>
                  </template>
                  <!-- Numero de lineas-->
                  <template
                    v-slot:pageText="props"
                  >Lineas {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}</template>
                </v-data-table>
              </v-tab-item>
              <v-tab-item>
                <v-toolbar flat>
                  <!-- Titulo -->
                  <v-toolbar-title>Compras pendientes</v-toolbar-title>
                  <!-- Divisor -->
                  <v-divider class="mx-2" inset vertical></v-divider>
                  <!-- Spaciador -->

                  <!-- Cuadro de busqueda -->
                  <v-text-field
                    v-model="Busqueda2"
                    append-icon="search"
                    label="Busqueda"
                    single-line
                    hide-details
                  ></v-text-field>
                  <!-- Spaciador -->
                  <v-spacer></v-spacer>
                </v-toolbar>
                <!-- Tabla de datos -->
                <v-data-table
                  :loading="Cargando2"
                  :headers="Encabezados"
                  :items="Pendientes"
                  :search="Busqueda2"
                  rows-per-page-text="Numero de filas"
                  no-results-text="No se ha encontrado resultados"
                >
                  <!-- Barra de progreso -->
                  <v-progress-linear v-slot:progress indeterminate></v-progress-linear>
                  <!-- lista de datos -->
                  <template v-slot:items="props">
                    <td>{{ props.item.factura }}</td>
                    <td>{{ props.item.datos }}</td>
                    <td>{{ props.item.importe}}</td>
                    <td>
                      <v-icon small @click="Eliminar(props.item)">delete</v-icon>
                    </td>
                  </template>
                  <template v-slot:no-results>
                    <v-flex xs12 sm12 text-xs-center>
                      <v-alert
                        :value="true"
                        color="error"
                        icon="warning"
                      >No se encontraron resultados para "{{ Busqueda2 }}".</v-alert>
                    </v-flex>
                  </template>
                  <!-- Mensaje si no se encontraron datos -->
                  <template v-slot:no-data>
                    <v-flex xs12 sm12 text-xs-center>
                      <v-alert :value="true" color="error" v-show="!Cargando2">
                        No se encontraron datos
                        <v-btn color="primary" @click="ListarPendientes">Actualizar</v-btn>
                      </v-alert>
                    </v-flex>
                  </template>
                  <!-- Numero de lineas-->
                  <template
                    v-slot:pageText="props"
                  >Lineas {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}</template>
                </v-data-table>
              </v-tab-item>
              <v-tab-item>dfs</v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import { finished } from "stream";
export default {
  data: () => ({
    //Valor para hace una busqueda
    Busqueda1: "",
    Busqueda2: "",
    Busqueda3: "",
    //Indice de los elemntos
    Indice: -1,
    Todos: 0,
    //Valor para mostrar la barra de cargado
    Cargando1: true,
    Cargando2: true,
    //Mensajes para validar
    DialogoCompra:false,
    Validacion: false,
    Mensajes: [],
    //Elementos para la tabla de la pestaña 1
    Hechas: [],
    Pendientes: [],
    Cancelada: [],
    //Encabezados para la tabla de la pestaña 1
    Encabezados: [
      {
        text: "Factura",
        value: "factura"
      },
      {
        text: "Descripcion",
        value: "datos"
      },
      {
        text: "Importe",
        value: "importe"
      },
      {
        text: "Opciones",
        value: "opciones",
        sortable: false
      }
    ],
    Item_editado: {
      compra: 0,
      ocupado: 0,
      tipoDoc: "PE",
      factura: "1528",
      fEmision: "2019-04-15T00:00:00",
      hora: null,
      fVenc: null,
      proveedor: "000009",
      importe: 0,
      descuento: 0,
      impuesto: 0,
      costo: 0,
      almacen: 1,
      estado: "PE",
      observ: "",
      tipoCam: 1,
      moneda: "MN",
      desc1: 0,
      desc2: 0,
      desc3: 0,
      desc4: 0,
      desc5: 0,
      datos: "AC EQUIPO DE COMPUTO Y OFICINA \r\n  \r\n  Mexico",
      desglose: -1,
      cuenxpag: null,
      usuario: "SUP",
      usufecha: "2019-04-15T00:00:00",
      usuhora: "22:23:58",
      exportado: null,
      noReferen: null,
      vencimiento: "2019-04-15T00:00:00",
      deCompra: null,
      donativo: null,
      porcentajederetencion: 0,
      retencion: 0,
      pedimentos: null,
      compraconfirmada: null,
      ssmaTimeStamp: "NULL"
    },

    Item_copia: []
  }),
  created() {
    this.Item_editado.usuario = this.$store.state.Login.usuario.idusuario;
    this.Item_copia = JSON.parse(JSON.stringify(this.Item_editado));
    this.ListarHechas();
    this.ListarPendientes();
  },
  methods: {
    async ListarHechas() {
      try {
        this.Cargando1 = true;
        let res = await axios.get(
          "/compras/listarhechas/" +
            this.Item_editado.usuario +
            "/" +
            this.Todos
        );
        this.Hechas = res.data;
      } catch (error) {}
      this.Cargando1 = false;
    },
    async ListarPendientes() {
      try {
        this.Cargando2 = true;
        let res = await axios.get(
          "/compras/listarpendientes/" +
            this.Item_editado.usuario +
            "/" +
            this.Todos
        );
        this.Pendientes = res.data;
      } catch (error) {}
      this.Cargando2 = false;
    }
  }
};
</script>

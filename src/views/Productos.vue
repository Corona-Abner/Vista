<template>
  <v-container fluid>
    <v-layout>
      <v-flex>
        <v-card>
          <!-- Barra de herramientas -->
          <v-toolbar flat>
            <!-- Titulo -->
            <v-toolbar-title>Productos</v-toolbar-title>
            <!-- Divisor -->
            <v-divider class="mx-2" inset vertical></v-divider>
            <!-- Spaciador -->
            <v-spacer></v-spacer>
            <!-- Cuadro de busqueda -->
            <v-text-field
              v-model="Busqueda"
              append-icon="search"
              label="Busqueda"
              single-line
              hide-details
            ></v-text-field>
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
                        <v-text-field
                          type="text"
                          :disabled="!(this.Indice ==-1)"
                          v-model="Item_editado.articulo"
                          label="Nombre"
                          counter
                          maxlength="15"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-text-field
                          type="text"
                          v-model="Item_editado.descrip"
                          label="Descripcion"
                          counter
                          maxlength="50"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs6>
                        <v-select
                          :items="Lineas"
                          item-text="descrip"
                          v-model="Item_editado.linea"
                          label="Linea"
                        ></v-select>
                      </v-flex>
                      <v-flex xs6>
                        <v-select
                          :items="Marcas"
                          item-text="descrip"
                          v-model="Item_editado.marca"
                          label="Marca"
                        ></v-select>
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field
                          type="number"
                          :min="0"
                          v-model="Item_editado.precio1"
                          label="Precio"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field
                          type="number"
                          disabled
                          :min="1"
                          v-model="Item_editado.existencia"
                          label="Cantidad"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs6>
                        <v-text-field
                          type="number"
                          :min="1"
                          v-model="Item_editado.claveprodserv"
                          label="Clave Servicio"
                          
                          maxlength="10"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field
                          type="text"
                          v-model="Item_editado.claveunidad"
                          label="Clave Unidad"
                          counter
                          maxlength="6"
                        ></v-text-field>
                      </v-flex>

                      <!-- Checkboxes -->

                      <v-flex xs6>
                        <v-checkbox
                          color="primary"
                          v-model="Item_editado.paraventa"
                          label="Para venta"
                        ></v-checkbox>
                      </v-flex>
                      <v-flex xs6>
                        <v-checkbox
                          color="primary"
                          v-model="Item_editado.invent"
                          label="Control inventario"
                        ></v-checkbox>
                      </v-flex>

                      <!-- Mensaje de validacion -->
                      <v-flex xs12 v-show="Validacion">
                        <div
                          class="red--text"
                          v-for="Mensaje in Mensajes"
                          :key="Mensaje"
                          v-text="Mensaje"
                        ></div>
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
                <v-card-text>Estás a punto de eliminar el producto: {{ Item_editado.articulo }}</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat="flat" @click="Cerrar2">Cancelar</v-btn>
                  <v-btn color="primary" flat="flat" @click="Aceptar2">Aceptar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <!-- Tabla de datos -->
          <v-data-table
            :loading="Cargando"
            :headers="Encabezados"
            :items="Productos"
            :search="Busqueda"
            rows-per-page-text="Numero de filas"
            no-results-text="No se ha encontrado resultados"
          >
            <!-- Barra de progreso -->
            <v-progress-linear v-slot:progress indeterminate></v-progress-linear>
            <!-- lista de datos -->
            <template v-slot:items="props">
              <td>{{ props.item.articulo }}</td>
              <td>{{ props.item.descrip }}</td>
              <td>{{ props.item.linea}}</td>
              <td>{{ props.item.marca }}</td>
              <td>${{props.item.precio1.toFixed(2) }} / {{ props.item.existencia }}</td>
              <td>
                <!-- Boton editar -->
                <v-icon small class="mr-2" @click="Editar(props.item)">edit</v-icon>
                <!-- Boton eliminar -->
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
                <v-alert :value="true" color="error" v-show="!Cargando">
                  No se encontraron datos
                  <v-btn color="primary" @click="Listar">Actualizar</v-btn>
                </v-alert>
              </v-flex>
            </template>
            <!-- Numero de lineas-->
            <template
              v-slot:pageText="props"
            >Lineas {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}</template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<!-- Script de la pagina Productos -->

<script>
//Importamos Axios para utilzar Apis
import axios from "axios";
export default {
  //Datos a utilizar en la vista
  data: () => ({
    //Valor para hace una busqueda
    Busqueda: "",
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
    Productos: [],
    Lineas: [],
    Marcas: [],
    //Encabezados para la tabla de la pestaña 1
    Encabezados: [
      {
        text: "Nombre",
        value: "articulo"
      },
      {
        text: "Descripcion",
        value: "descrip"
      },
      {
        text: "Linea",
        value: "linea"
      },
      {
        text: "Marca",
        value: "marca"
      },
      {
        text: "Precio/Cantidad",
        value: "precio1"
      },
      {
        text: "Opciones",
        value: "opciones",
        sortable: false
      }
    ],
    //Datos para agregar y editar
    Item_editado: {
      articulo: "",
      descrip: "",
      linea: "",
      marca: "",
      precio1: 0,
      precio2: 0,
      precio3: 0,
      precio4: 0,
      precio5: 0,
      precio6: 0,
      precio7: 0,
      precio8: 0,
      precio9: 0,
      precio10: 0,
      existencia: 0,
      costoU: 0,
      costo: 0,
      unidad: "PZA",
      porRecib: 0,
      porSurt: 0,
      impuesto: "IVA",
      minimo: 0,
      maximo: 0,
      observ: null,
      costoStd: 0,
      kit: 0,
      serie: 0,
      lote: 0,
      invent: 1,
      imagen: null,
      paraventa: 1,
      url: null,
      curso: 0,
      usuario: null,
      usuhora: null,
      usufecha: "2019-03-07T00:00:00",
      exportado: 0,
      enVenta: 0,
      recalcular: 0,
      granel: 0,
      peso: 0,
      bajoCosto: 0,
      bloqueado: 0,
      u1: 0,
      u2: 0,
      u3: 0,
      u4: 0,
      u5: 0,
      u6: 0,
      u7: 0,
      u8: 0,
      u9: 0,
      u10: 0,
      acaja: 0,
      modificaprecio: null,
      fraccionario: 0,
      iespecial: 0,
      ubicacion: null,
      c2: 0,
      c3: 0,
      c4: 0,
      c5: 0,
      c6: 0,
      c7: 0,
      c8: 0,
      c9: 0,
      c10: 0,
      movimientos: 0,
      clasificacion: null,
      rop: 0,
      rotacion: 0,
      clasifant: null,
      eoq: 0,
      etiquetas: 0,
      modelo: null,
      color: null,
      talla: null,
      speso: 0,
      etiqueta: null,
      numero: 0,
      carton: 0,
      ubicaetiq: null,
      unidadrecibe: null,
      unidadempaque: null,
      sinvolumen: 0,
      presentacion: 0,
      servicio: 0,
      numeroservicios: 0,
      claveproveedor: null,
      dp: 0,
      familia: null,
      subfamilia: null,
      subfam1: null,
      subfam2: null,
      entradas: 0,
      salidas: 0,
      cantent: 0,
      cantsal: 0,
      pronostico: 0,
      oferta: 0,
      costoentrada: 0,
      costosalida: 0,
      unidadesentrada: 0,
      unidadessalida: 0,
      donativo: 0,
      costopeps: 0,
      costoueps: 0,
      contenido: null,
      presentacionextra: null,
      pesoextra: 0,
      autor: null,
      tema: null,
      editorial: null,
      fabricante: "SYS",
      preciousd: 0,
      costousd: 0,
      puntos: 0,
      autocodigo: 0,
      inventariopiezas: null,
      diasstockmaximo: null,
      diasstockminimo: null,
      requerimiento: null,
      tiempoAire: 0,
      ssmaTimeStamp: "NULL",
      ensambladoenlinea: 0,
      iepslitro: null,
      claveprodserv: null,
      claveunidad: null,
      lineaNavigation: null,
      marcaNavigation: null
    },
    Item_copia: [],
    //Variable para la api
    API_URL: "prods/"
  }),
  //Metodo para utilzar propiedades computadas
  computed: {
    Titulo_dialogo() {
      return this.Indice === -1 ? "Agregar" : "Editar";
    }
  },
  //Metodo vigilante
  watch: {
    Dialogo(valor) {
      valor || this.Cerrar();
    }
  },
  //Cuando se crea la vista
  created() {
    this.Item_copia = JSON.parse(JSON.stringify(this.Item_editado));
    axios
      .get("lineas")
      .then(response => {
        this.Lineas = response.data;
      })
      .catch(error => {
        console.log(error);
      });
    axios
      .get("marcas")
      .then(response => {
        this.Marcas = response.data;
      })
      .catch(error => {
        console.log(error);
      });
    this.Listar();
  },
  //Metodos
  methods: {
    //Metodo para Obtener datos de la api
    Listar() {
      this.Cargando = true;
      this.Productos = [];
      axios
        .get(this.API_URL + "listarp")
        .then(response => {
          this.Productos = response.data;
          this.Cargando = false;
        })
        .catch(error => {
          console.log(error);
          this.Cargando = false;
        });
    },
    //metodo para editar un elemento
    Editar(item) {
      this.Indice = this.Productos.indexOf(item);
      this.Item_editado = this.Item_editado = JSON.parse(JSON.stringify(item));
      delete this.Item_editado.autocodigo;
      this.Dialogo = true;
    },
    //metodo para eliminar un elemento
    Eliminar(item) {
      this.Dialogo2 = true;
      this.Item_editado = item;
    },
    //Aceptar para elimnar
    Aceptar2() {
      axios
        .delete(this.API_URL + this.Item_editado.articulo)
        .then(response => {
          this.Productos.splice(this.Productos.indexOf(this.Item_editado), 1);
          this.Cerrar2();
        })
        .catch(error => {
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
        return;
      }

      this.Item_editado.usuario = this.$store.state.Login.usuario.idusuario;
      //Validar
      if (this.Indice > -1) {
        //Editar
        axios
          .put(this.API_URL + this.Item_editado.articulo, this.Item_editado)
          .then(response => {
            this.Cerrar();
            this.Limpiar();
            this.Listar();
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        //agregar
        axios
          .post(this.API_URL, this.Item_editado)
          .then(response => {
            this.Cerrar();
            this.Limpiar();
            this.Listar();
          })
          .catch(error => {
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
      if (
        this.Item_editado.articulo.length < 3 ||
        this.Item_editado.articulo.length > 15
      ) {
        this.Mensajes.push(">El nombre debe tener entre 3 y 15 caracteres");
        this.Validacion = true;
      }
      if (this.Item_editado.descrip.length > 50) {
        this.Mensajes.push(">La descripcion debe tener menos de 50 caracteres");
        this.Validacion = true;
      }
      if (this.Item_editado.linea == "") {
        this.Mensajes.push(">Escoje una linea");
        this.Validacion = true;
      }
      if (this.Item_editado.marca == "") {
        this.Mensajes.push(">Escoje una marca");
        this.Validacion = true;
      }
      if (
        this.Item_editado.claveprodserv.length < 3 ||
        this.Item_editado.claveprodserv.length > 10
      ) {
        this.Mensajes.push(
          ">La clave de servicio debe tener entre 3 y 10 caracteres"
        );
        this.Validacion = true;
      }
      if (
        this.Item_editado.claveunidad.length < 3 ||
        this.Item_editado.claveunidad.length > 10
      ) {
        this.Mensajes.push(
          ">La clave de unidad debe tener entre 3 y 10 caracteres"
        );
        this.Validacion = true;
      }
      //Verifica si el nombre esta repetido
      if (this.Indice == -1) {
        if (
          this.Productos.some(
            c =>
              c.articulo.toUpperCase() ===
              this.Item_editado.articulo.toUpperCase()
          )
        ) {
          this.Mensajes.push(">El nombre esta repetido");
          this.Validacion = true;
        }
      }
    },
    //Metodo para limpiar
    Limpiar() {
      this.Indice = -1;
      this.Validacion = false;
      this.Mensajes = [];
      this.Item_editado = JSON.parse(JSON.stringify(this.Item_copia));
    }
  }
};
</script>

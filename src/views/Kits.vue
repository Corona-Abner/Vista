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
            <v-text-field
              v-model="Busqueda"
              append-icon="search"
              label="Busquedas"
              single-line
              hide-details
            ></v-text-field>
            <!-- Spaciador -->
            <v-spacer></v-spacer>
            <v-dialog v-model="Dialogo2" max-width="500px">
              <v-card>
                <v-card-title class="headline">Eliminar</v-card-title>
                <v-card-text>Estás a punto de eliminar el kit: {{ Item_editado.articulo }}</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat="flat" @click="Cerrar2">Cancelar</v-btn>
                  <v-btn color="primary" flat="flat" @click="Aceptar2">Aceptar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
                          type="number"
                          v-if="this.Indice ===-1"
                          v-model="Item_editado.articulo"
                          label="Nombre"
                          :min="1"
                          prefix="KIT"
                        ></v-text-field>
                        <v-text-field
                          type="text"
                          v-else
                          disabled
                          v-model="Item_editado.articulo"
                          label="Nombre"
                          :min="1"
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
                        <v-text-field
                          type="number"
                          disabled
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
                      <v-layout align-center justify-center row fill-height>
                        <v-flex xs6>
                          <v-autocomplete
                            v-model="Componente"
                            :items="Productos_Lista"
                            item-text="descrip"
                            item-value="articulo"
                            label="Producto"
                            prepend-icon="search"
                          ></v-autocomplete>
                        </v-flex>
                        <v-flex xs2>
                          <v-btn small fab @click="AgregarComp(Componente)">
                            <v-icon>add</v-icon>
                          </v-btn>
                        </v-flex>
                      </v-layout>
                      <v-flex xs12>
                        <v-data-table
                          :headers="Encabezados2"
                          :items="Componentes_Lista"
                          rows-per-page-text="Numero de filas"
                          no-results-text="No hay componentes en el kit"
                        >
                          <!-- lista de datos -->
                          <template v-slot:items="props">
                            <td>{{ props.item.componente }}</td>
                            <td>{{ props.item.observ }}</td>

                            <td>{{props.item.cantidad}}</td>

                            <td>
                              <!-- Boton eliminar -->
                              <v-icon small @click="EliminarComp(props.item)">delete</v-icon>
                            </td>
                          </template>
                        </v-data-table>
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
          </v-toolbar>
          <v-data-table
            item-key="articulo"
            :loading="Cargando"
            :headers="Encabezados"
            :items="Kits"
            :search="Busqueda"
            class="elevation-1"
            rows-per-page-text="Numero de filas"
            no-results-text="No se ha encontrado resultados"
          >
            <!-- Barra de progreso -->
            <v-progress-linear v-slot:progress indeterminate></v-progress-linear>
            <!-- lista de datos -->
            <template v-slot:items="props">
              <tr @click="Expandir(props)">
                <td>{{ props.item.articulo }}</td>
                <td>{{ props.item.descrip }}</td>

                <td>${{props.item.precio1.toFixed(2) }} / {{props.item.existencia}}</td>

                <td>
                  <!-- Boton editar -->
                  <v-icon small class="mr-2" @click="Editar(props.item)">edit</v-icon>
                  <!-- Boton eliminar -->
                  <v-icon small @click="Eliminar(props.item)">delete</v-icon>
                </td>
              </tr>
            </template>
            <!--Expandir componentes-->
            <template v-slot:expand="props">
              <v-card flat>
                <v-card-text>
                  <div
                    v-for="(comp, index) in Componentes_Expand"
                    :key="index"
                  >{{comp.componente}} - ${{comp.precio.toFixed(2)}}</div>
                </v-card-text>
              </v-card>
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
            <template
              v-slot:pageText="props"
            >Marcas {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}</template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    Busqueda: "",
    //Valor para mostrar el dialogo de editar y agregar
    Dialogo: false,
    //Valor para mostrar el dialogo de mover papelera y restaurar
    Dialogo2: false,
    //Indice de los elementos
    Indice: -1,
    //Valor para mostrar la barra de cargado
    Cargando: true,
    //Mensajes para validar
    Validacion: false,
    Mensajes: [],
    //Elementos para la tabla de la pestaña 1
    Kits: [],
    Componente: "",
    Componentes_Lista: [],
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
        text: "Precio/Cantidad",
        value: "precio1"
      },
      {
        text: "Opciones",
        value: "Opciones",
        sortable: false
      }
    ],
    Encabezados2: [
      {
        text: "Componente",
        value: "componente"
      },
      {
        text: "Precio",
        value: "observ"
      },
      {
        text: "Cantidad",
        value: "cantidad"
      },
      {
        text: "Opciones",
        value: "opciones",
        sortable: false
      }
    ],
    Item_editado: {
      articulo: "",
      descrip: "",
      linea: "SYS",
      marca: "SYS",
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
      kit: 1,
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
      inventariopiezas: 0,
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
    API_URL: "prods/",
    //Lista de los productos para el select
    Productos_Lista: [],
    Componentes_Expand: []
  }),

  computed: {
    Titulo_dialogo() {
      return this.Indice === -1 ? "Agregar" : "Editar";
    }
  },
  watch: {
    Dialogo(valor) {
      valor || this.Cerrar();
    }
  },
  async created() {
    this.Item_copia = JSON.parse(JSON.stringify(this.Item_editado));
    this.Listar();
    await axios
      .get(this.API_URL + "listarnombre")
      .then(response => {
        this.Productos_Lista = response.data;
        this.Cargando = false;
      })
      .catch(error => {
        console.log(error);
        this.Cargando = false;
      });
  },
  methods: {
    async Editar(item) {
      await axios
        .get("compparts/lista/" + item.articulo)
        .then(response => {
          this.Componentes_Lista = response.data;
        })
        .catch(error => {
          console.log(error);
        });
      this.Indice = this.Kits.indexOf(item);
      this.Item_editado = item;
      delete this.Item_editado.autocodigo;
      this.Dialogo = true;
    },
    async Listar() {
      this.Cargando = true;
      this.Kits = [];
      await axios
        .get(this.API_URL + "listark")
        .then(response => {
          this.Kits = response.data;
          this.Cargando = false;
        })
        .catch(error => {
          console.log(error);
          this.Cargando = false;
        });
    },
    async Expandir(props) {
      await axios
        .get("compparts/componentes/" + props.item.articulo)
        .then(response => {
          this.Componentes_Expand = response.data;
          props.expanded = !props.expanded;
        })
        .catch(error => {
          console.log(error);
        });
    },
    AgregarComp(com) {
      var index = this.Productos_Lista.map(function(e) {
        return e.articulo;
      }).indexOf(com);

      var prod = this.Productos_Lista[index];
      if (
        !this.Componentes_Lista.some(
          c => c.componente.toUpperCase() === prod.articulo.toUpperCase()
        )
      ) {
        if (this.Indice == -1) {
          this.Componentes_Lista.push({
            articulo: "KIT" + this.Item_editado.articulo,
            componente: prod.articulo,
            cantidad: 1,
            almacen: 1,
            observ: prod.precio1 == null ? 0 : prod.precio1,
            idpartida: null,
            tiempo: null,
            exportado: null,
            ssmaTimeStamp: "NULL"
          });
        } else {
          this.Componentes_Lista.push({
            articulo: this.Item_editado.articulo,
            componente: prod.articulo,
            cantidad: 1,
            almacen: 1,
            observ: prod.precio1 == null ? 0 : prod.precio1,
            idpartida: null,
            tiempo: null,
            exportado: null,
            ssmaTimeStamp: "NULL"
          });
        }
        this.Item_editado.precio1 += prod.precio1;
        this.cantidadKit();
      } else {
      }
    },
    cantidadKit() {
      var menor = 0;
      for (var i in this.Componentes_Lista) {
        var comp = this.Componentes_Lista[i];
        var index = this.Productos_Lista.map(function(e) {
          return e.articulo;
        }).indexOf(comp.componente);

        var prod = this.Productos_Lista[index];
        var num = prod.existencia / comp.cantidad;
        if (i == 0) {
          menor = num;
        } else {
          if (menor > num) {
            menor = num;
          }
        }
      }
      this.Item_editado.existencia = menor;
    },
    EliminarComp(com) {
      this.Componentes_Lista.splice(this.Componentes_Lista.indexOf(com), 1);
      this.Item_editado.precio1 -= com.observ;
      if (this.Componentes_Lista.length == 0) {
        this.Item_editado.precio1 = 0;
      }
      this.cantidadKit();
    },
    //Metodo para cerrar el dialogo
    Cerrar() {
      this.Limpiar();
      this.Dialogo = false;
      this.Indice = -1;
    },
    //metodo para eliminar un elemento
    Eliminar(item) {
      this.Dialogo2 = true;
      this.Item_editado = item;
    },
    //Aceptar para elimnar
    async Aceptar2() {
      await axios
        .delete("compparts/delkit/" + this.Item_editado.articulo)
        .then(response => {})
        .catch(error => {});
      await axios
        .delete("componens/" + this.Item_editado.articulo)
        .then(response => {})
        .catch(error => {});
      await axios
        .delete(this.API_URL + this.Item_editado.articulo)
        .then(response => {
          this.Kits.splice(this.Kits.indexOf(this.Item_editado), 1);
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
    async Aceptar() {
      //Validar
      this.Validar();
      if (this.Validacion) {
        return;
      }

      this.Item_editado.usuario = this.$store.state.Login.usuario.idusuario;
      if (this.Indice > -1) {
        //Editar
        await axios
          .delete("compparts/DelKit/" + this.Item_editado.articulo)
          .then(response => {})
          .catch(error => {
            console.log(error);
          });
        await axios
          .post("compparts/AddKit/", this.Componentes_Lista)
          .then(response => {})
          .catch(error => {
            console.log(error);
          });
        await axios
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
        this.Item_editado.articulo = "KIT" + this.Item_editado.articulo;
        console.log(this.Item_editado);
        await axios
          .post(this.API_URL, this.Item_editado)
          .then(response => {})
          .catch(error => {
            console.log(error);
          });
        await axios
          .post("componens/", {
            articulo: this.Item_editado.articulo,
            coment: null,
            minimo: null,
            existencia: this.Item_editado.existencia,
            exportado: null,
            ssmaTimeStamp: "NULL"
          })
          .then(response => {})
          .catch(error => {
            console.log(error);
          });
        await axios
          .post("compparts/AddKit/", this.Componentes_Lista)
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

    Validar() {
      this.Validacion = false;
      this.Mensajes = [];
      //Verifica la longitud del nombre
      if (
        this.Item_editado.articulo.length < 3 ||
        this.Item_editado.articulo.length > 15
      ) {
        this.Componentes_Lista = [];
        this.Mensajes.push(">El nombre debe tener entre 3 y 15 caracteres");
        this.Validacion = true;
      }
      if (this.Item_editado.descrip.length > 50) {
        this.Mensajes.push(">La descripcion debe tener menos 50 caracteres");
        this.Validacion = true;
      }
      //Verifica si el nombre esta repetido
      if (this.Indice == -1) {
        if (
          this.Kits.some(
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
      this.Componentes_Lista = [];
      this.Componente = "";
      this.Item_editado = JSON.parse(JSON.stringify(this.Item_copia));
    }
  }
};
</script>

<template>
  <v-container fluid>
    <v-layout>
      <v-flex>
        <v-card>
          <!-- Barra de herramientas -->
          <v-toolbar flat>
            <!-- Titulo -->
            <v-toolbar-title>Lineas</v-toolbar-title>
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
                        <div v-if=" this.Indice ==-1">
                          <v-text-field
                            type="text"
                            v-model="Item_editado.linea"
                            label="Linea"
                            counter
                            maxlength="6"
                          ></v-text-field>
                        </div>
                        <div v-else>
                          <v-text-field
                            disabled
                            type="text"
                            v-model="Item_editado.linea"
                            label="Linea"
                            counter
                            maxlength="6"
                          ></v-text-field>
                        </div>
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

                      <!-- Mensaje de validacion -->
                      <v-flex xs12 sm12 md12 v-show="Validacion">
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
                  <v-btn color="blue darken-1" flat @click="Cerrar">Cancelar</v-btn>
                  <v-btn color="blue darken-1" flat @click="Aceptar">Guardar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="Dialogo2" max-width="500px">
              <v-card>
                <v-card-title class="headline">Eliminar</v-card-title>
                <v-card-text>Estás a punto de eliminar la linea: {{ Item_editado.linea }}</v-card-text>
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
            :items="Lineas"
            :search="Busqueda"
            class="elevation-1"
            rows-per-page-text="Numero de filas"
            no-results-text="No se ha encontrado resultados"
          >
            <!-- Barra de progreso -->
            <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
            <!-- lista de datos -->
            <template v-slot:items="props">
              <td>{{ props.item.linea }}</td>
              <td>{{ props.item.descrip }}</td>
              <td>
                <!-- Boton editar -->
                <v-icon small class="mr-2" @click="Editar(props.item)">edit</v-icon>
                <!-- Boton eliminar -->
                <v-icon small @click="Eliminar(props.item)">delete</v-icon>
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
            <template
              v-slot:pageText="props"
            >Lineas {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}</template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


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
    Lineas: [],
    //Encabezados para la tabla de la pestaña 1
    Encabezados: [
      {
        text: "Linea",
        value: "linea"
      },
      {
        text: "Descripcion",
        value: "descripcion"
      },
      {
        text: "Opciones",
        value: "opciones",
        sortable: false
      }
    ],
    //Datos para agregar y editar
    Item_editado: {
      linea: "",
      descrip: "",
      usuario: "",
      usuFecha: "2019-03-21T00:00:00",
      usuHora: "0",
      numero: 0
    },
    Item_copia: [],
    //Variable para la api
    API_URL: "lineas/"
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
    this.Listar();
  },
  //Metodos
  methods: {
    //Metodo para Obtener datos de la api
    Listar() {
      this.Cargando = true;
      this.Lineas = [];
      axios
        .get(this.API_URL)
        .then(response => {
          this.Lineas = response.data;
          this.Cargando = false;
        })
        .catch(error => {
          console.log(error);
          this.Cargando = false;
        });
    },
    //metodo para editar un elemento
    Editar(item) {
      this.Indice = this.Lineas.indexOf(item);
      this.Item_editado = item;
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
        .delete(this.API_URL + this.Item_editado.linea)
        .then(response => {
          this.Lineas.splice(this.Lineas.indexOf(this.Item_editado), 1);
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
      //Validar
      this.Validar();
      if (this.Validacion) {
        return;
      }
      this.Item_editado.usuario = this.$store.state.Login.usuario.idusuario;
      if (this.Indice > -1) {
        //Editar
        axios
          .put(this.API_URL + this.Item_editado.linea, this.Item_editado)
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
    Cerrar() {
      this.Limpiar();
      this.Dialogo = false;
      this.Indice = -1;
    },
    //Metodo para validar
    Validar() {
      this.Validacion = false;
      this.Mensajes = [];
      if (
        this.Item_editado.linea.length < 2 ||
        this.Item_editado.linea.length > 6
      ) {
        this.Mensajes.push(">La linea debe tener entre 2 y 6 caracteres");
        this.Validacion = true;
      }
      if (this.Item_editado.linea.length > 50) {
        this.Mensajes.push(">La descripcion debe tener menos de 50 caracteres");
        this.Validacion = true;
      }
      //Verifica si el nombre esta repetido
      if (this.Indice == -1) {
        if (
          this.Lineas.some(
            c => c.linea.toUpperCase() === this.Item_editado.linea.toUpperCase()
          )
        ) {
          this.Mensajes.push(">La linea esta repetido");
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

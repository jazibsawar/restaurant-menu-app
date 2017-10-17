<template>
  <v-layout row justify-center>
    <v-dialog v-model="addMenu" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ editting ? 'Edit ' : 'Add ' }} Menu</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="menu.title" label="Title" :error-messages="errors.collect('title')" v-validate="'required'" data-vv-name="title" required></v-text-field>
              </v-flex>
             <v-flex xs11 sm5>
                <v-menu
                    lazy
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-right="40"
                    max-width="290px"
                    min-width="290px"
                >
                    <v-text-field
                    slot="activator"
                    label="Select Date"
                    v-model="menu.metadata.date"
                    prepend-icon="event"
                    readonly
                    ></v-text-field>
                    <v-date-picker v-model="menu.metadata.date" no-title scrollable actions>
                    <template scope="{ save, cancel }">
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                        <v-btn flat color="primary" @click="save">OK</v-btn>
                        </v-card-actions>
                    </template>
                    </v-date-picker>
                </v-menu>
                </v-flex>
            </v-layout>
          </v-container>
          <div style="color: red" v-show="status.error" >
                {{ status.error }}
          </div>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closeDialog">Close</v-btn>
          <v-btn
            color="info"
            :loading="status.loading"
            @click="saveMenu(menu)"
            :disabled="status.loading"
            >
            Save
            <span slot="loader" class="custom-loader">
                <v-icon light>fa-refresh</v-icon>
            </span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<<script>
import {mapGetters} from 'vuex'
import Datepicker from 'vuejs-datepicker'
import Loader from '~/components/Loader.vue'

export default {
  components: {
    Datepicker,
    Loader
  },
  computed: {
    ...mapGetters([
      'menu', 'status', 'addMenu', 'editting'
    ])
  },
  methods: {
    closeDialog () {
      this.$validator.reset()
      this.$store.dispatch('setMenuDefault')
      this.$store.dispatch('toggleAddMenu')
    },
    saveMenu (menu) {
      this.$validator.validateAll()
      if (this.$store.editting) {
        if ((!this.errors.any())) {
          this.$store.dispatch('editMenu', menu)
        }
      } else {
        if (!this.errors.any()) {
          this.$store.dispatch('addMenu', menu)
        }
      }
    }
  }
}
</script>

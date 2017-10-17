<template>
  <v-layout row justify-center>
        <v-card style="width: 70%;">
          <v-card-title>
            <span class="headline">{{ editting ? 'Edit ' : 'Add ' }} Menu Details</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text >
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <div>
                  <div v-if="!editting" class="headline">
                    <span style="text-align:left" class="grey--text" >{{menu.title}}</span>
                    <datepicker disabled-picker :value="menu.metadata.date" placeholder="select date"></datepicker>
                    <v-btn @click="editMenu(menu)" icon style="height: 25px; width: 30px;">
                      <v-icon dark >fa-edit</v-icon>
                    </v-btn>
                  </div>
                  <div v-else class="headline">
                    <v-text-field v-model="menu.title" label="Title" :error-messages="errors.collect('title')" v-validate="'required'" data-vv-name="title" required></v-text-field>
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
                  </div>
                </div>
                </v-flex>
                <label>Categories</label>
                <v-flex v-if="menu.metadata.menu" xs12 class="mb-2">
                  <div >
                    <ul >
                      <li v-for="(item,index) in menu.metadata.menu" :key="index">
                        <v-chip close @input="deleteCategory(index)" outline color="green"> {{item.title}} </v-chip>
                        <v-btn fab dark small color="cyan" @click="editCategory(item, index)">
                          <v-icon dark>edit</v-icon>
                        </v-btn>
                        <v-list >
                          <template v-for="menu in item.menuItems">
                            <v-subheader v-if="menu.title" v-text="menu.title"> </v-subheader>
                            <v-list-tile avatar v-bind:key="menu.title" >
                              <v-list-tile-avatar>
                                <img v-bind:src="menu.feature_image.url" v-if="!!menu.feature_image.url" />
                              </v-list-tile-avatar>
                              <v-list-tile-content>
                                <v-list-tile-title v-html="menu.content"></v-list-tile-title>
                                <v-list-tile-sub-title v-html="menu.price"></v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                          </template>
                        </v-list>
                      </li>
                    </ul>
                  </div>
                  <v-btn warning fab small dark @click="addCategoryModal">
                    <v-icon>fa-plus</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn  :disabled="status.loading" primary dark @click="closeDialog">Done</v-btn>
          </v-card-actions>
          <AddCategory></AddCategory>
          <AddCategoryTitle></AddCategoryTitle>
        </v-card>
  </v-layout>
</template>

<<script>
import {mapGetters} from 'vuex'
import Datepicker from 'vuejs-datepicker'
import AddCategory from '~/components/AddCategory.vue'
import AddCategoryTitle from '~/components/AddCategoryTitle.vue'
import Loader from '~/components/Loader.vue'
import _ from 'lodash'

export default {
  components: {
    Datepicker,
    AddCategory,
    AddCategoryTitle,
    Loader
  },
  computed: {
    ...mapGetters([
      'menu', 'status', 'editting'
    ])
  },
  methods: {
    editCategory (category, index) {
      this.$store.dispatch('setCategory', _.cloneDeep(category))
      this.$store.dispatch('setSelectedCategory', index)
      this.$store.dispatch('toggleEdittingCategory', true)
      this.$store.dispatch('toggleCategoryModal')
    },
    deleteCategory (index) {
      this.$store.dispatch('deleteCategory', index)
    },
    addCategoryModal () {
      this.$store.dispatch('setCategoryDefault')
      this.$store.dispatch('toggleAddCategoryTitle')
    },
    closeDialog () {
      this.$validator.reset()
      this.$store.dispatch('setSelectedCategory', 0)
      this.$store.dispatch('toggleEdittingCategory', false)
      this.$store.dispatch('setCategoryDefault')
      this.$store.dispatch('toggleAddMenuDetails')
      this.$store.dispatch('toggleEditting', false)
      this.$store.dispatch('setMenuDefault')
    },
    editMenu () {
      this.$store.dispatch('toggleEditting', true)
    },
    saveMenu (menu) {
      this.$validator.validateAll()
      if (this.$store.state.editting) {
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

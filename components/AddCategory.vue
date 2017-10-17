<template>
  <v-layout row justify-center>
    <v-dialog v-model="categoryModalOpen" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ edittingCategory ? 'Edit ' : 'Add ' }} Category</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <div>
                <div v-if="!edittingCategoryTitle" class="headline">
                    <span style="text-align:left" class="grey--text" >{{category.title}}</span>
                    <v-btn @click="editCategory(category)" icon style="height: 25px; width: 30px;">
                      <v-icon dark >fa-edit</v-icon>
                    </v-btn>
                </div>
                <v-flex v-else xs12 sm12 md12>
                  <v-text-field v-model="category.title" label="Title" :error-messages="errors.collect('title')" v-validate="'required'" data-vv-name="title" required></v-text-field>
                  <div style="color: red" v-show="categoryStatus.error" >
                        {{ categoryStatus.error }}
                  </div>
                  <small>*indicates required field</small>
                  <v-btn
                    color="info"
                    :loading="categoryStatus.loading"
                    @click="saveCategory(category)"
                    :disabled="categoryStatus.loading"
                    >
                    Save
                    <span slot="loader" class="custom-loader">
                        <v-icon light>fa-refresh</v-icon>
                    </span>
                  </v-btn>
                </v-flex>
              </div>
              <v-container grid-list-md>
                <label class="ingredients_list_label">Menu Items</label>
                <v-flex v-if="category.menuItems" xs12 class="mb-2">
                  <div class="input-group input-group--dirty">
                    <ul class="ingredients_list">
                      <li v-for="(item,index) in category.menuItems" :key="index">
                        {{item.title}}
                        <v-btn @click="removeMenuItem(index)" icon style="height: 30px; width: 30px">
                          <v-icon dark >fa-trash-o</v-icon>
                        </v-btn>
                        <v-btn @click="editMenuItem(item, index)" icon style="height: 25px; width: 30px;">
                          <v-icon dark >fa-edit</v-icon>
                        </v-btn>
                      </li>
                    </ul>
                  </div>
                  <div v-if="menuItemModal">
                    <AddMenuItem />
                  </div>
                  <v-btn warning fab small dark @click="addMenuItemModal">
                    <v-icon>fa-plus</v-icon>
                  </v-btn>
                </v-flex>
              </v-container>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" primary dark @click="closeDialog">Done</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
import AddMenuItem from '~/components/AddMenuItem.vue'
import _ from 'lodash'

export default {
  components: {
    AddMenuItem
  },
  computed: {
    ...mapGetters([
      'category',
      'menuItemModal',
      'categoryModalOpen',
      'edittingCategory',
      'edittingCategoryTitle',
      'categoryStatus'
    ])
  },
  methods: {
    addMenuItemModal () {
      this.$store.dispatch('toggleMenuItemModal')
      this.$store.dispatch('setMenuItemDefault')
      this.$store.dispatch('toggleEdittingMenuItem', false)
      this.$store.dispatch('setMenuItemStatus')
    },
    editMenuItem (menuItem, index) {
      let menu = _.cloneDeep(menuItem)
      menu.index = index
      this.$store.dispatch('setMenuItem', menu)
      this.$store.dispatch('toggleEdittingMenuItem', true)
      this.$store.dispatch('toggleMenuItemModal')
    },
    removeMenuItem (index) {
      this.$store.dispatch('deleteMenuItem', index)
    },
    closeDialog () {
      this.$validator.reset()
      this.$store.dispatch('toggleCategoryModal')
      this.$store.dispatch('setSelectedCategory', 0)
      this.$store.dispatch('toggleEdittingCategory', false)
      this.$store.dispatch('setCategoryDefault')
      this.$store.dispatch('setCategoryStatus')
    },
    editCategory () {
      this.$store.dispatch('toggleEditCategoryTitle', true)
    },
    saveCategory (category) {
      this.$validator.validateAll()
      if (this.$store.getters.edittingCategoryTitle) {
        if ((!this.errors.any())) {
          this.$store.dispatch('editCategory', category)
        }
      } else {
        if (!this.errors.any()) {
          this.$store.dispatch('addCategory', category)
        }
      }
    }
  }
}
</script>
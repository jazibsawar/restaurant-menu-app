<template>
  <v-layout row justify-center>
    <v-dialog v-model="editForm" scrollable persistent width="50vw">
        <v-card>
          <v-card-title>
            <span class="headline">{{ editting ? 'Edit ' : 'Add ' }}Menu</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text style="height: 70vh;">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="menuModel.title" label="Title" :error-messages="errors.collect('title')" v-validate="'required'" data-vv-name="title" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <div class="input-group input-group--dirty">
                    <label>Content</label>
                    <wysiwyg v-model="menuModel.content" />
                  </div>
                </v-flex>
                <v-flex xs12>
                  <label>Date</label>
                  <datepicker v-model="menuModel.metadata.date"></datepicker>
                </v-flex>
                <v-flex xs12 class="mb-2">
                  <div class="input-group input-group--dirty">
                    <label class="ingredients_list_label">Menu Items</label>
                    <ul class="ingredients_list">
                      <li v-for="(item,index) in menuModel.metadata.menuItems" :key="index">
                        {{item.title}}
                        <v-btn fab dark small error @click="removeMenuItem(index)" class="btn_remove_ingredient">
                          <v-icon dark>remove</v-icon>
                        </v-btn>
                      </li>
                    </ul>
                  </div>
                </v-flex>
                <v-flex xs10 class="mb-3">
                  <v-text-field ref="addMenuTitleRef" label="Title"></v-text-field>
                  <v-text-field ref="addMenuDescriptionRef" label="Description"></v-text-field>
                  <v-text-field ref="addMenuPriceRef" label="Price"></v-text-field>
                  <v-flex xs12>
                  <v-select
                    v-bind:items="categories"
                    ref="addMenuCategoryRef" 
                    label="Category"
                    required
                  ></v-select>
                  </v-flex>
                  <v-flex xs12>
                  <img class="upload_image" :src="menuModel.metadata.feature_image.url.replace(/ /g,'%20')" v-if="!!menuModel.metadata.feature_image.url" />
                  <form enctype="multipart/form-data" novalidate>
                    <input type="file" @change="onFileChange" accept="image/*" data-vv-name="image" v-validate="'required|mimes:image/*'" required />
                    <div class="input-group fileUploadError">
                      <div class="input-group__error" v-show="errors.has('image') && !editting">
                        {{ errors.first('image') }}
                      </div>
                    </div>
                  </form>
                </v-flex>
                </v-flex>
                <v-flex xs2 class="mb-3">
                  <v-btn warning fab small dark @click="addMenuItem($refs.addMenuTitleRef,$refs.addMenuDescriptionRef,$refs.addMenuPriceRef,$refs.addMenuCategoryRef)">
                    <v-icon>add</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn error dark @click="closeDialog" :disabled="loading">Close</v-btn>
            <v-btn :loading="loading" :disabled="loading" primary dark @click="saveRecipe(recipeModel)">Save</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
  </v-layout>
</template>

<<script>
import {mapGetters} from 'vuex'
import Datepicker from 'vuejs-datepicker'

export default {
  components: {
    Datepicker
  },
  computed: {
    ...mapGetters([
      'editForm', 'menuModel', 'editting', 'loading', 'categories'
    ])
  },
  methods: {
    closeDialog () {
      // this.$validator.reset();
      // this.$store.dispatch('setRecipeDefault');
      // this.$store.dispatch('setEditForm', false);
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

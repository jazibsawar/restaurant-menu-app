<template>
   <v-layout column>
    <v-flex xs12 sm12>
      <v-container fill-height v-if="categories.length == 0 && !loading">
            <v-layout row wrap align-center>
                <v-flex class="text-xs-center">
                    <h4>No Categories found!</h4>
                    <v-btn light large class="amber" @click="openDialog" :disabled="loading">Add Category</v-btn>
                </v-flex>
            </v-layout>
        </v-container>
      <v-container fluid grid-list-md class="grey lighten-4">
        <v-layout v-if="categories.length > 0" row wrap>
          <v-flex
            xs3
            v-for="(category, index) in categories" :key="index"
          >
            <v-card>
              <nuxt-link :to="'/menu/'+category._id">
                <v-card-media
                    v-if="category.metadata"
                    :src="category.metadata.feature_image.url"
                    height="200px"
                >
                    <v-container fill-height fluid>
                    <v-layout fill-height>
                        <v-flex xs12 align-end flexbox>
                        <span class="headline white--text" v-text="category.title"></span>
                        </v-flex>
                    </v-layout>
                    </v-container>
                </v-card-media>
              </nuxt-link>
              <v-card-actions class="white">
                <v-spacer v-text="category.content"></v-spacer>
                <v-btn @click="openEditForm(category)" icon>
                   <v-icon>fa-edit</v-icon>
                </v-btn>
                <v-btn @click="deleteCategory(index)" icon>
                   <v-icon>fa-trash-o </v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
          <v-flex>
            <v-btn @click="openDialog" fab dark color="indigo">
             <v-icon dark >fa-plus</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
      <AddCategory></AddCategory>
      <div v-if="loading">
        <Loader/>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
import AddCategory from '~/components/AddCategory.vue'
// import Loader from 'vue-full-loading'
import Loader from '~/components/Loader.vue'

export default {
  components: {
    AddCategory,
    Loader
  },
  computed: {
    ...mapGetters([
      'categories',
      'categoryModel',
      'categoryModalOpen',
      'loading'
    ])
  },
  methods: {
    openDialog () {
      this.$store.dispatch('toggleCategoryModal')
    },
    openEditForm (category) {
      this.$store.dispatch('setCategory', category)
      this.$store.dispatch('toggleEdittingCategory')
      this.$store.dispatch('toggleCategoryModal')
    //   this.$store.dispatch('setEditForm',true);
    },
    deleteCategory (category) {
      this.$store.dispatch('deleteCategory', category)
    }
  }
}
</script>

<template>
<v-layout row justify-center>
    <v-dialog v-model="addCategoryTitle" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ edittingCategoryTitle ? 'Edit ' : 'Add ' }} Category</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="category.title" label="Title" :error-messages="errors.collect('title')" v-validate="'required'" data-vv-name="title" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <div style="color: red" v-show="categoryStatus.error" >
                {{ categoryStatus.error }}
          </div>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closeDialog">Close</v-btn>
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
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import {mapGetters} from 'vuex'
import AddMenuItem from '~/components/AddMenuItem.vue'

export default {
  components: {
    AddMenuItem
  },
  computed: {
    ...mapGetters([
      'category',
      'addCategoryTitle',
      'categoryStatus',
      'edittingCategoryTitle'
    ])
  },
  methods: {
    closeDialog () {
      this.$validator.reset()
      this.$store.dispatch('toggleAddCategoryTitle')
      this.$store.dispatch('toggleEdittingCategory', false)
      this.$store.dispatch('setCategoryDefault')
      this.$store.dispatch('setCategoryStatus')
    },
    saveCategory (category) {
      this.$validator.validateAll()
      if (!this.errors.any()) {
        this.$store.dispatch('addCategory', category)
      }
    }
  }
}
</script>
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
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="categoryModel.title" label="Title" :error-messages="errors.collect('title')" v-validate="'required'" data-vv-name="title" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="categoryModel.content" :error-messages="errors.collect('description')" v-validate="'required'" data-vv-name="description" label="Description" hint="Short description for the category"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <div v-if="categoryModel.metadata.feature_image">
                <img class="upload_image" :src="categoryModel.metadata.feature_image.url.replace(/ /g,'%20')" v-if="!!categoryModel.metadata.feature_image.url" />
                </div>
                <form enctype="multipart/form-data" novalidate>
                <input type="file" @change="onFileChange" accept="image/*" data-vv-name="image" v-validate="'required|mimes:image/*'" required />
                <div class="input-group fileUploadError">
                    <div class="input-group__error" v-show="errors.has('image') && !edittingCategory" >
                    {{ errors.first('image') }}
                    </div>
                </div>
                </form>
            </v-flex>
            </v-layout>
          </v-container>
          <div style="color: red" v-show="error" >
                {{ error }}
          </div>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closeDialog">Close</v-btn>
          <v-btn
            color="info"
            :loading="loading"
            @click="saveCategory(categoryModel)"
            :disabled="loading"
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

export default {
  computed: {
    ...mapGetters([
      'categoryModel',
      'categoryModalOpen',
      'edittingCategory',
      'loading',
      'error'
    ])
  },
  methods: {
    closeDialog () {
      this.$validator.reset()
      this.$store.dispatch('toggleCategoryModal')
      this.$store.dispatch('setCategoryDefault')
    },
    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        this.$store.dispatch('setCategoryImage', '')
        this.$store.dispatch('setCategoryFile', '')
        return
      }
      // var image = new Image()
      var reader = new FileReader()
      reader.onload = (e) => {
        this.$store.dispatch('setCategoryImage', e.target.result)
        this.$store.dispatch('setCategoryFile', files[0])
      }
      reader.readAsDataURL(files[0])
    },
    saveCategory (category) {
      this.$validator.validateAll()
      if (this.$store.state.edittingCategory) {
        if ((!this.errors.any()) || (this.errors.count() === 1 && this.errors.has('image'))) {
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
<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
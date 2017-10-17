<template>
  <div>
    <v-flex xs12 >
        <span class="headline">{{ edittingMenuItem ? 'Edit ' : 'Add ' }} Menu Item</span>
    </v-flex>
    <v-flex xs12 >
        <v-text-field v-model="menuItem.title" label="Title" :error-messages="errors.collect('title')" v-validate="'required'" data-vv-name="title" required></v-text-field>
    </v-flex>
    <v-flex xs12 >
        <v-text-field v-model="menuItem.content" label="Description" :error-messages="errors.collect('description')" v-validate="'required'" data-vv-name="description" required></v-text-field>
    </v-flex>
    <v-flex xs12 >
        <v-text-field v-model="menuItem.price" label="Price" :error-messages="errors.collect('price')" v-validate="'required'" data-vv-name="price" required></v-text-field>
    </v-flex>
    <v-flex xs12>
        <img style="height: 25%; width: 25%;" class="upload_image" :src="menuItem.feature_image.url.replace(/ /g,'%20')" v-if="!!menuItem.feature_image.url" />
        <form enctype="multipart/form-data" novalidate>
        <input type="file" @change="onFileChange" accept="image/*" data-vv-name="image" v-validate="'required|mimes:image/*'" required />
        <div class="input-group fileUploadError">
            <div class="input-group__error" v-show="errors.has('image') && !edittingMenuItem">
            {{ errors.first('image') }}
            </div>
        </div>
        </form>
    </v-flex>
    <div style="color: red" v-show="menuItemStatus.error" >
                {{ menuItemStatus.error }}
          </div>
    <v-flex>
        <v-btn
            color="info"
            :loading="menuItemStatus.loading"
            @click="addMenuItem(menuItem)"
            :disabled="menuItemStatus.loading"
            >
            Save
            <span slot="loader" class="custom-loader">
                <v-icon light>fa-refresh</v-icon>
            </span>
          </v-btn>
    </v-flex>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'menuItem',
      'menuItemStatus',
      'edittingMenuItem'
    ])
  },
  methods: {
    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        this.$store.dispatch('setMenuImage', '')
        this.$store.dispatch('setMenuFile', '')
        return
      }
      var reader = new FileReader()
      reader.onload = (e) => {
        this.$store.dispatch('setMenuImage', e.target.result)
        this.$store.dispatch('setMenuFile', files[0])
      }
      reader.readAsDataURL(files[0])
    },
    addMenuItem (menuItem) {
      this.$validator.validateAll()
      if (this.$store.getters.edittingMenuItem) {
        if ((!this.errors.any()) || (this.errors.count() === 1 && this.errors.has('image'))) {
          console.log(menuItem)
          this.$store.dispatch('editMenuItem', menuItem)
        }
      } else {
        if (!this.errors.any()) {
          this.$store.dispatch('addMenuItem', menuItem)
        }
      }
    }
  }
}
</script>
<template>
 <div class="field">
    <label class="label is-medium">{{ edittingMenuItem ? 'Edit ' : 'Add ' }} Menu Item</label>
    <b-field :message="errors.collect('title')">
        <b-input
            type="text"
            v-model="menuItem.title"
            placeholder="Add Item Title"
            v-validate="'required'" data-vv-name="title"
            required>
        </b-input>
    </b-field>
    <b-field :message="errors.collect('description')">
        <b-input
            type="text"
            maxlength="200"
            v-model="menuItem.content"
            placeholder="Menu Item Description"
            v-validate="'required'" data-vv-name="description"
            required>
        </b-input>
    </b-field>
    <b-field :message="errors.collect('price')">
        <b-input
            type="number"
            v-model="menuItem.price"
            placeholder="Menu Item Price"
            v-validate="'required'" data-vv-name="price"
            required>
        </b-input>
    </b-field>
    <b-field >
      <img style="height: 25%; width: 25%;" class="upload_image" :src="menuItem.feature_image.url.replace(/ /g,'%20')" v-if="!!menuItem.feature_image.url" />
      <form enctype="multipart/form-data" novalidate>
      <input type="file" @change="onFileChange" accept="image/*" data-vv-name="image" v-validate="'required|mimes:image/*'" required />
      <div class="input-group fileUploadError">
          <div class="input-group__error" v-show="errors.has('image') && !edittingMenuItem">
          {{ errors.first('image') }}
          </div>
      </div>
      </form>
    </b-field>
    <div v-show="menuItemStatus.error" class="field is-danger" >
      {{ menuItemStatus.error }}
    </div>
    <div class="field">
      <p class="control">
        <button v-if="!menuItemStatus.loading" class="button is-info is-medium" @click="addMenuItem(menuItem)" >Save</button>
        <button v-else class="button is-info is-loading is-medium" @click="addMenuItem(menuItem)" disabled>Save</button>
      </p>
    </div>
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
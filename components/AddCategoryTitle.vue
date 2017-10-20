<template>
  <b-modal :active.sync="addCategoryTitle" :canCancel="['x', 'outside']" max-width="500px">
      <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">{{ edittingCategoryTitle ? 'Edit ' : 'Add ' }} Category Title</p>
        </header>
        <section class="modal-card-body menu-modal-body">
            <b-field label="Title" :message="errors.collect('title')">
                <b-input
                    type="text"
                    v-model="category.title"
                    placeholder="Category Title"
                    v-validate="'required'" data-vv-name="title"
                    required>
                </b-input>
            </b-field>
        </section>
        <footer class="modal-card-foot">
            <div style="color: red" v-show="categoryStatus.error" >
                   {{ categoryStatus.error }}
            </div>
            <button class="button is-medium" type="button" @click="closeDialog">Close</button>
            <button v-if="!categoryStatus.loading" class="button is-info is-medium" @click="saveCategory(category)" >Save</button>
            <button v-else class="button is-info is-loading is-medium" @click="saveCategory(category)" disabled>Save</button>
        </footer>
    </div>
  </b-modal>
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
    ]),
    addCategoryTitle: {
      get: function () {
        return this.$store.state.addCategoryTitle
      },
      set: function (value) {
        this.$store.dispatch('toggleAddCategoryTitle')
      }
    }
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
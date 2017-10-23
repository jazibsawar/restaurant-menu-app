<template>
 <b-modal :active.sync="addMenu" :canCancel="['x', 'outside']" max-width="500px">
    <div class="modal-card">
      <header class="modal-card-head">
          <p class="modal-card-title">{{ editting ? 'Edit ' : 'Add ' }} Menu</p>
      </header>
      <section class="modal-card-body menu-modal-body">
          <b-field label="Select a date" :message="errors.collect('date')" >
            <b-datepicker v-model="menu.metadata.date"
                :first-day-of-week="1"
                placeholder="Click to select"
                v-validate="'required'" data-vv-name="date"
                required>
            </b-datepicker>
          </b-field>
          <b-field label="Title" :message="errors.collect('title')">
              <b-input
                  type="text"
                  v-model="menu.title"
                  placeholder="Menu Title"
                  v-validate="'required'" data-vv-name="title"
                  required>
              </b-input>
          </b-field>

          <b-field label="Description" :message="errors.collect('description')">
              <b-input
                  type="textarea"
                  maxlength="200"
                  v-model="menu.content"
                  placeholder="Menu Description"
                  v-validate="'required'" data-vv-name="description"
                  required>
              </b-input>
          </b-field>
          <div style="color: red" v-show="status.error" >
               *{{ status.error }}
          </div>
      </section>
      <footer class="modal-card-foot">
          <button class="button is-medium" type="button" @click="closeDialog">Close</button>
          <button v-if="!status.loading" class="button is-info is-medium" @click="saveMenu(menu)" >Save</button>
          <button v-else class="button is-info is-loading is-medium" @click="saveMenu(menu)" disabled>Save</button>
      </footer>
  </div>
 </b-modal>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'menu', 'status', 'editting'
    ]),
    addMenu: {
      get: function () {
        return this.$store.state.addMenu
      },
      set: function (value) {
        this.$store.dispatch('toggleAddMenu')
      }
    }
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

<style lang="css" scoped>
  .menu-modal-body {
     padding-bottom: 150px;
  }
</style>

<template>
  <v-layout>
    <v-flex xs12 sm12>
      <div v-if="addMenuDetails">
          <AddMenuDetails />
      </div>
      <AddMenu />
      <v-container fill-height v-if="menus.length == 0 && !addMenu && !addMenuDetails">
            <v-layout row wrap align-center>
                <v-flex class="text-xs-center">
                    <h4>No Menus found!</h4>
                    <v-btn light large class="amber" @click="addNewMenu" :disabled="status.loading">Add Menu</v-btn>
                </v-flex>
            </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
import AddMenu from '~/components/AddMenu.vue'
import AddMenuDetails from '~/components/AddMenuDetails.vue'

// import Loader from 'vue-full-loading'
import Loader from '~/components/Loader.vue'

export default {
  components: {
    AddMenu,
    AddMenuDetails,
    Loader
  },
  computed: {
    ...mapGetters([
      'menus',
      'status',
      'addMenu',
      'addMenuDetails'
    ])
  },
  methods: {
    addNewMenu () {
      this.$store.dispatch('toggleAddMenu')
    },
    openEditForm (category) {
      this.$store.dispatch('setCategory', category)
      this.$store.dispatch('toggleEdittingCategory')
      this.$store.dispatch('toggleAddMenu')
    },
    deleteCategory (category) {
      this.$store.dispatch('deleteCategory', category)
    }
  }
}
</script>

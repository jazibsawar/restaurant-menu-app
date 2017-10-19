<template>
  <div>
      <div v-if="initializeStatus && !addMenu && !addMenuDetails" class="container menu-date">
        <b-field label="Select a date">
          <b-datepicker v-model="selectedDate"
              :first-day-of-week="1"
              placeholder="Click to select">
          </b-datepicker>
        </b-field>
      </div>
      <br>
     <section class="hero is-primary is-bold is-large" v-if="menus == null && !addMenu && !addMenuDetails">
      <div class="hero-body">
        <div class="container-fluid has-text-centered">
          <h1 class="title">
            No Menu Found for Selected Date!
          </h1>
          <br>
          <h2 class="subtitle">
            <a class="button is-success is-medium" @click="addNewMenu" :disabled="status.loading">Add Menu</a>
          </h2>
        </div>
      </div>
    </section>
    <div v-else-if="!addMenu && !addMenuDetails">
      <Menu />
    </div>
    <AddMenuDetails v-if="addMenuDetails" />
    <AddMenu />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import AddMenu from '~/components/AddMenu.vue'
import AddMenuDetails from '~/components/AddMenuDetails.vue'
import Menu from '~/components/Menu.vue'

// import Loader from 'vue-full-loading'
import Loader from '~/components/Loader.vue'

export default {
  components: {
    AddMenu,
    AddMenuDetails,
    Menu,
    Loader
  },
  computed: {
    ...mapGetters([
      'menus',
      'status',
      'addMenu',
      'addMenuDetails',
      'initializeStatus'
    ]),
    selectedDate: {
      get: function () {
        return this.$store.state.selectedDate
      },
      set: function (value) {
        this.$store.dispatch('setSelectedDate', value)
      }
    }
  },
  watch: {
    selectedDate: 'getMenu'
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
    },
    getMenu () {
      console.log('here')
      this.$store.dispatch('getMenus')
    }
  }
}
</script>
<style lang="css" scoped>
  .menu-date {
    max-width: 600px;
  }
  
</style>
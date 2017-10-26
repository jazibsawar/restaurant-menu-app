<template>
  <div>
      <div v-if="initializeStatus && !addMenu && !addMenuDetails" class="container menu-date">
        <b-datepicker class="menu-date-picker" v-model="selectedDate"
            :first-day-of-week="1"
            placeholder="Click to select">
        </b-datepicker>
      </div>
      <br>
     <section class="hero is-bold is-large" v-if="menus == null && !addMenu && !addMenuDetails">
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
      <RestaurantMenu />
    </div>
    <AddMenuDetails v-if="addMenuDetails" />
    <AddMenu />
    <b-loading :active.sync="status.loading" :canCancel="true"></b-loading>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import AddMenu from '~/components/AddMenu.vue'
import AddMenuDetails from '~/components/AddMenuDetails.vue'
import RestaurantMenu from '~/components/Menu.vue'

export default {
  components: {
    AddMenu,
    AddMenuDetails,
    RestaurantMenu
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
      this.$store.dispatch('setMenuDate')
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
      this.$store.dispatch('getMenus')
    }
  }
}
</script>
<style lang="css" scoped>
  .menu-date {
    max-width: 600px;
  }
  .menu-date-picker >>> .input{
    border-radius: 5px;
    height: 40px;
  }
  .hero.is-large .hero-body {
    padding-bottom: 5rem;
    padding-top: 4rem;
 }
 .menu-date-picker >>> .input.is-hovered, .menu-date-picker >>> .input:hover {
    border-color: #dbdbdb;
 }
  
</style>
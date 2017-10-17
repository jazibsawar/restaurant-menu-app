<template>
  <v-app>
  <v-toolbar app>restaurant-menu-app</v-toolbar>
  <main>
    <v-content>
      <v-container fluid>
        <restaurantMenu />
      </v-container>
    </v-content>
  </main>
  <v-footer app></v-footer>
</v-app>
</template>

<script>
import restaurantMenu from '~/components/Menu.vue'
import Datepicker from 'vuejs-datepicker'

export default {
  components: {
    restaurantMenu,
    Datepicker
  }
}
</script>

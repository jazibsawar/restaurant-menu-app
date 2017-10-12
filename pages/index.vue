<template>
  <v-app>
  <v-toolbar app>restaurant-menu-app</v-toolbar>
  <main>
    <v-content>
      <v-container fluid>
        <category />
      </v-container>
    </v-content>
  </main>
  <v-footer app></v-footer>
</v-app>
</template>

<script>
import category from '~/components/Category.vue'
import Datepicker from 'vuejs-datepicker'

export default {
  components: {
    category,
    Datepicker
  }
}
</script>

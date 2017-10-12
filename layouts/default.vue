<template>
  <div>
    <nuxt/>
  </div>
</template>

<script>
  import store from '~/store/store'
  import Vue from 'vue'
  import Vuetify from 'vuetify'
  import('~/node_modules/vuetify/dist/vuetify.min.css')
  import('~/node_modules/font-awesome/css/font-awesome.css')

  Vue.use(Vuetify)
  
  export default {
    store,
    beforeMount: function () {
      this.$store.dispatch('getCategories')
    }
  }
</script>


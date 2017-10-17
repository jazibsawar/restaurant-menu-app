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
      this.$store.dispatch('getMenus')
    }
  }
</script>
<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>



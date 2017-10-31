<template>
  <div style="position: relative;">
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <img src="https://cosmicjs.com/images/logo.svg" alt="Cosmic Restaurant App" width="112" height="28">
            <h1>Restaurant Menu</h1>
          </a>
        </div>
      </nav>
      <section>
          <nuxt />
      </section>
      <footer class="footer">
        <div class="container">
          <div class="content has-text-centered">
            <p>
              <a href="https://cosmicjs.com" style="color: #fff" target="_blank">Powered by <strong>Cosmic JS</strong></a>
            </p>
          </div>
        </div>
      </footer>
    </div>
</template>

<script>
  import store from '~/store/store'
  import('~/node_modules/font-awesome/css/font-awesome.css')
  
  export default {
    store,
    mounted: function () {
      this.$store.dispatch('getMenus')
      this.$store.dispatch('setInitializeStatus', true)
    }
  }
</script>
<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @media screen and (min-width: 1024px){
    .navbar {
        border-color: #f2f2f2;
        border-bottom-style: solid;
        border-bottom-width: 0.1px;
    }
  }

  .navbar {
      border-color: #f2f2f2;
      border-bottom-style: solid;
      border-bottom-width: 0.1px;
      background-color: #f5f5f5;;
  }

  a.navbar-item:hover {
      background-color: #f5f5f5;;
  }

  .footer {
    padding: 24px 24px 24px;
    padding: 5px;
    background: #CC7F31;
    color: #000;
    opacity: 0.5;
    position: absolute;
    width: 100%;
    height: 35px;
    bottom: 0;
  }

</style>



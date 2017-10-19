<template>
  <div>
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
              Powered by <strong>CosmicJs</strong>
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
    beforeMount: function () {
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
  @media screen and (min-width: 1024px){
    .navbar {
        min-height: 5rem;
        border-color: #f2f2f2;
        border-bottom-style: solid;
        border-bottom-width: 0.1px;
    }
  }

  .navbar {
      border-color: #f2f2f2;
      border-bottom-style: solid;
      border-bottom-width: 0.1px;
  }

  a.navbar-item:hover {
      background-color: white;
  }

  .footer {
    padding: 24px 24px 24px;
  }

</style>



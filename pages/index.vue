<template>
  <section class="section content-section">
    <div class="container-fluid">
      <LandingPage />
    </div>
  </section>
</template>

<script>
import LandingPage from '~/components/LandingPage.vue'

export default {
  components: {
    LandingPage
  }
}
</script>

<style lang="css" scoped>
  .content-section {
    background-image: url('/static/background.jpg');
    min-height: calc(100vh - 52px);
    min-height: calc(100vh - 3.25rem);
  }
</style>


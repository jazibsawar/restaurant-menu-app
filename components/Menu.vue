<template>
    <section class="container menu">
        <h2 class="menu-title has-text-centered">{{menus.title}}</h2>
        <p class="menu-description has-text-centered">{{menus.content}}</p>
        <button class="button is-small" type="button" @click="editMenu(menus)">Edit</button>
      <div class="menu-category" v-for="(category,index) in menus.metadata.menu" :key="index">
        <h3>{{category.title}}</h3>
        <div class="box" v-for="(item,index) in category.menuItems" :key="index">
          <article class="media">
            <div class="media-left">
              <figure class="image menu-item-image">
                <img :src="item.feature_image.url" :alt="item.title" :title="item.title">
              </figure>
            </div>
            <div class="media-content">
              <div class="content">
                <div class="columns menu-item-info">
                  <div class="column is-10">
                    <p>
                      <strong>{{item.title}}</strong>
                      <br>
                      {{item.content}}
                    </p>
                  </div>
                  <div class="column menu-item-price">
                    <p>${{item.price}}</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'menus',
      'status'
    ])
  },
  methods: {
    addNewMenu () {
      this.$store.dispatch('toggleAddMenu')
    },
    editMenu (menu) {
      this.$store.dispatch('setMenu', menu)
      this.$store.dispatch('toggleEditting', true)
      this.$store.dispatch('toggleAddMenuDetails')
    }
  }
}
</script>

<style lang="css" scoped>
    .menu{
        max-width: 700px;
        margin: auto;
        padding: 5em 1em;
    }
    .menu > .menu-title {
      font: bold 45px/1.2 'Dancing Script', cursive;
    }
    .menu > .menu-description {
      font: 400 15px/1.2 'Libre Baskerville', serif;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #a7a9ac;
      margin: 0;
    }
    .menu-category {
      margin-top: 2em;
    }
    .menu-category > h3 {
      font: 500 36px/1.2 'Dancing Script', cursive;
      border-bottom: 0.07em solid;
      width: fit-content;
      padding: 0;
      margin-bottom: 0.3em;
    }
    .menu-category .box {
      margin-left: 1em;
      padding: 0.7rem 1rem;
    }
    .menu-category .box:not(:last-child) {
      margin-bottom: 12px;
      margin-bottom: 0.5rem;
    }
    .menu-item-image {
      width: 128px;
      height: 92px;
    }
    .menu-item-image img {
      height: 100%;
      width: auto;
    }
    .menu-item-info {
      min-height: 92px;
      justify-content: center;
      align-items: center;
    }
    .menu-item-info .menu-item-price {
      text-align: right;
      font-weight: bold;
      font-family: 'Dancing Script';
      color: #1a1a1a;
    }
</style>
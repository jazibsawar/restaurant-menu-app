<template>
    <section class="container menu">
        <h2 class="menu-title has-text-centered">
          <span>{{menus.title}}</span>
          <span >
            <a class="button edit-button" @click="editMenu(menus)">
              <span class="icon is-small is-info">
                <i class="fa fa-edit"></i>
              </span>
            </a>
            <a class="button delete-button" @click="deleteMenu(menus)">
              <span class="icon is-small is-danger">
                <i class="fa fa-trash"></i>
              </span>
            </a>
          </span> 
        </h2>
        <p class="menu-description has-text-centered">{{menus.content}}</p>
      <div class="menu-category" v-for="(category,index) in menus.metadata.menu" :key="index">
        <h3>{{category.title}}</h3>
        <div class="box" v-for="(item,index) in category.menuItems" :key="index">
          <article class="media">
            <div class="media-left">
              <figure class="image menu-item-image">
                <a @click="openImageModel(item.feature_image.url)">
                  <img :src="item.feature_image.url" :alt="item.title" :title="item.title" >
                </a>
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
      <b-modal :active.sync="openImageFlag">
          <p class="image is-4by3">
              <img :src="this.image">
          </p>
      </b-modal>
    </section>
</template>

<script>
import {mapGetters} from 'vuex'
import _ from 'lodash'

export default {
  data () {
    return {
      openImageModal: false,
      image: null
    }
  },
  computed: {
    ...mapGetters([
      'menus',
      'status'
    ]),
    openImageFlag: {
      get: function () {
        return this.openImageModal
      },
      set: function (value) {
        this.openImageModal = value
      }
    }
  },
  methods: {
    openImageModel (image) {
      this.image = image
      this.openImageModal = true
    },
    addNewMenu () {
      this.$store.dispatch('toggleAddMenu')
    },
    editMenu (menu) {
      if (this.$store.state.isPresent) {
        var newMenu = {
          title: _.cloneDeep(menu.title),
          content: _.cloneDeep(menu.content),
          metadata: {
            menu: _.cloneDeep(menu.metadata.menu),
            date: this.$store.state.selectedDate
          }
        }
        console.log('Adding Menu: ', newMenu)
        this.$store.dispatch('setMenu', newMenu)
        this.$store.dispatch('addMenu', newMenu)
        // this.$store.dispatch('setMenus', this.$store.state.menu)
      } else {
        this.$store.dispatch('setMenu', menu)
        this.$store.dispatch('toggleEditting', true)
        this.$store.dispatch('toggleAddMenuDetails')
      }
    },
    deleteMenu (menu) {
      this.$store.dispatch('deleteMenu', menu)
    }
  }
}
</script>

<style lang="css" scoped>
    .edit-button {
      border: 1px solid transparent;;
      margin: 2px;
      background-color: Transparent;
    }
    .edit-button:hover {
      border-radius: 50%;
      border: 1px solid transparent;
      border-color: blue;
    }
    .delete-button {
      border: 1px solid transparent;;
      margin: 2px;
      background-color: Transparent;
    }
    .delete-button:hover {
      border-radius: 50%;
      border: 1px solid transparent;
      border-color: red;
    }
    .menu{
        max-width: 800px;
        margin: auto;
        padding: 2.5em 1em;
    }
    .menu > .menu-title {
      font: bold 45px/1.2 'Dancing Script', cursive;
    }
    .menu > .menu-description {
      font: 400 15px/1.2 'Libre Baskerville', serif;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #505015;
      margin: 0;
    }
    .menu-category {
      margin: 2em 3em;
    }
    .menu-category > h3 {
      font: 500 36px/1.2 'Dancing Script', cursive;
      border-bottom: 0.07em solid;
      width: fit-content;
      padding: 0;
      margin-bottom: 0.3em;
    }
    .menu-category .box {
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
      width: 100%;
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
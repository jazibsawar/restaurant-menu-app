<template>
  <div class="tile is-ancestor">
    <div class="tile is-vertical is-8 container">
      <div class="tile">
        <div class="tile is-parent">
          <article class="tile is-child notification">
            <h3 align="center" class="title">{{ editting ? 'Edit ' : 'Add ' }} Menu Details</h3>
            <div class="content box">
              <div class="field" style="width: 400px;">
                <label class="label is-medium">Date: {{menu.metadata.date}}</label>
                <b-field label="Title" :message="errors.collect('title')">
                    <b-input
                        type="text"
                        v-model="menu.title"
                        placeholder="Menu Title"
                        v-validate="'required'" data-vv-name="title"
                        :disabled="!editting"
                        required>
                    </b-input>
                </b-field>
                <b-field label="Description" :message="errors.collect('description')">
                    <b-input
                        type="text"
                        maxlength="200"
                        v-model="menu.content"
                        placeholder="Menu Description"
                        v-validate="'required'" data-vv-name="description"
                        :disabled="!editting"
                        required>
                    </b-input>
                </b-field>
                <div v-show="status.error" class="field is-danger" >
                  {{ status.error }}
                </div>
                <div class="field">
                  <p class="control">
                    <div v-if="!editting">
                      <button class="button is-info is-medium" @click="editMenu">
                        Edit
                      </button>
                    </div>
                    <div v-else>
                      <button v-if="!status.loading" class="button is-info is-medium" @click="saveMenu(menu)" >Save</button>
                      <button v-else class="button is-info is-loading is-medium" @click="saveMenu(menu)" disabled>Save</button>
                    </div>
                  </p>
                </div>
              </div>

              <div>
                <label class="label is-medium">Categories</label>
                <div class="menu-category" v-if="menu.metadata.menu" v-for="(category,index) in menu.metadata.menu" :key="index">
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
                <br >
                <div align="center">
                  <button class="button is-warning is-medium" @click="addCategoryModal">
                        Add
                  </button>
                </div>
              </div>
            </div>
            <div align="right">
              <button class="button is-info is-medium" @click="closeDialog">
                    Done
              </button>
            </div>
            <AddCategory></AddCategory>
            <AddCategoryTitle></AddCategoryTitle>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import AddCategory from '~/components/AddCategory.vue'
import AddCategoryTitle from '~/components/AddCategoryTitle.vue'
import Loader from '~/components/Loader.vue'
import _ from 'lodash'

export default {
  components: {
    AddCategory,
    AddCategoryTitle,
    Loader
  },
  computed: {
    ...mapGetters([
      'menu', 'status', 'editting'
    ])
  },
  methods: {
    editCategory (category, index) {
      this.$store.dispatch('setCategory', _.cloneDeep(category))
      this.$store.dispatch('setSelectedCategory', index)
      this.$store.dispatch('toggleEdittingCategory', true)
      this.$store.dispatch('toggleCategoryModal')
    },
    deleteCategory (index) {
      this.$store.dispatch('deleteCategory', index)
    },
    addCategoryModal () {
      console.log('here')
      this.$store.dispatch('setCategoryDefault')
      this.$store.dispatch('toggleAddCategoryTitle')
    },
    closeDialog () {
      this.$validator.reset()
      this.$store.dispatch('setSelectedCategory', 0)
      this.$store.dispatch('toggleEdittingCategory', false)
      this.$store.dispatch('setCategoryDefault')
      this.$store.dispatch('toggleAddMenuDetails')
      this.$store.dispatch('toggleEditting', false)
      this.$store.dispatch('setMenuDefault')
    },
    editMenu () {
      this.$store.dispatch('toggleEditting', true)
    },
    saveMenu (menu) {
      this.$validator.validateAll()
      if (this.$store.state.editting) {
        if ((!this.errors.any())) {
          this.$store.dispatch('editMenu', menu)
        }
      } else {
        if (!this.errors.any()) {
          this.$store.dispatch('addMenu', menu)
        }
      }
    }
  }
}
</script>
<style lang="css" scoped>
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

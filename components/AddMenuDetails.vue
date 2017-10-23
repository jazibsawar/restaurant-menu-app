<template>
  <div class="tile is-ancestor">
    <div class="tile is-vertical is-9 container">
      <div class="tile notification" style="justify-content: center;">
        <div class="page-font tile is-10 is-parent" >
          <article class="tile is-child">
            <h1 align="center" class="title">{{ editting ? 'Edit ' : 'Add ' }} Menu Details</h1>
            <div class="content box">
              <label style="text-align: center;" class="label is-medium">Date: {{menu.metadata.date.split('T')[0]}}</label>
              <div class="field" style="width: 400px;">
                <b-field label="Title" :message="errors.collect('title')">
                    <b-input
                        type="text"
                        v-model="menu.title"
                        placeholder="Menu Title"
                        v-validate="'required'" data-vv-name="title"
                        :disabled="!editMenu"
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
                        :disabled="!editMenu"
                        required>
                    </b-input>
                </b-field>
                <div v-show="status.error" class="field is-danger" >
                  {{ status.error }}
                </div>
                <div class="field">
                  <p class="control">
                    <div v-if="!editMenu">
                      <button class="button is-info is-small" @click="editMenuInfo">
                        Edit
                      </button>
                    </div>
                    <div v-else>
                      <button v-if="!status.loading" class="button is-info is-small" @click="saveMenu(menu)" >Save</button>
                      <button v-else class="button is-info is-loading is-small" @click="saveMenu(menu)" disabled>Save</button>
                    </div>
                  </p>
                </div>
              </div>

              <div>
                <label class="label" style="font-size: 36px">Categories</label>
                <div align="right">
                  <button class="button is-warning is-medium" @click="addCategoryModal">
                         Add Category
                  </button>
                </div>
                <div class="menu-category" v-if="menu.metadata.menu" v-for="(category,index) in menu.metadata.menu" :key="index">
                    <h3>
                      <span style="border-bottom: 0.07em solid;">{{category.title}}</span> 
                      <span style="margin-left: 15px;">
                        <a class="edit-button button" @click="editCategory(category, index)">
                          <span class="icon is-small is-info">
                            <i class="fa fa-edit"></i>
                          </span>
                        </a>
                      </span>
                      <span>
                        <a class="delete-button button" @click="deleteCategory(index)">
                          <span class="icon is-small is-danger">
                            <i class="fa fa-trash"></i>
                          </span>
                        </a>
                      </span>
                    </h3>
                    
                    
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
              </div>
              <div align="right">
                <br>
                <button class="button is-info is-medium" @click="closeDialog(menu)">
                      Done
                </button>
              </div>
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
import _ from 'lodash'

export default {
  components: {
    AddCategory,
    AddCategoryTitle
  },
  computed: {
    ...mapGetters([
      'menu', 'status', 'editting', 'editMenu'
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
      this.$store.dispatch('setCategoryDefault')
      this.$store.dispatch('toggleAddCategoryTitle')
    },
    closeDialog (menus) {
      this.$validator.reset()
      this.$store.dispatch('setMenus', menus)
      this.$store.dispatch('setSelectedCategory', 0)
      this.$store.dispatch('toggleEdittingCategory', false)
      this.$store.dispatch('setCategoryDefault')
      this.$store.dispatch('toggleAddMenuDetails')
      this.$store.dispatch('toggleEditting', false)
      this.$store.dispatch('setMenuDefault')
    },
    editMenuInfo () {
      this.$store.dispatch('setEditMenu', true)
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
    .page-font {
      font-family: 'Dancing Script';
    }
    .menu-category {
      margin-top: 2em;
    }
    .menu-category > h3 {
      font: 500 30px/1.2 'Dancing Script', cursive;
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
    .notification {
      background-color: transparent;
      border-radius: 3px;
      padding: 20px 40px 20px 24px;
      padding: 1.25rem 2.5rem 1.25rem 1.5rem;
      position: relative;
  }
  .tile .title {
      color: #363636;
      font-size: 32px;
      font-size: 3rem;
      font-weight: 600;
      line-height: 1.125;
  }
</style>

<template>
  <b-modal :active.sync="categoryModalOpen" :canCancel="['x', 'outside']" max-width="500px">
      <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">{{ edittingCategory ? 'Edit ' : 'Add ' }} Category</p>
        </header>
        <section class="modal-card-body menu-modal-body">
            <div class="field">
              <b-field :message="errors.collect('title')">
                  <b-input
                      type="text"
                      v-model="category.title"
                      placeholder="Category Title"
                      v-validate="'required'" data-vv-name="title"
                      :disabled="!edittingCategoryTitle"
                      required>
                  </b-input>
              </b-field>
              <div v-show="categoryStatus.error" class="field is-danger" >
                {{ categoryStatus.error }}
              </div>
              <div class="field">
                <p class="control">
                  <div v-if="!edittingCategoryTitle">
                    <button class="button is-info" @click="editCategory(category)">
                      Edit
                    </button>
                  </div>
                  <div v-else>
                    <button v-if="!categoryStatus.loading" class="button is-info is-medium" @click="saveCategory(category)" >Save</button>
                    <button v-else class="button is-info is-loading is-medium" @click="saveCategory(category)" disabled>Save</button>
                  </div>
                </p>
              </div>
            </div>
            <div>
                <p id="menu_item">
                  <label class="label is-medium">Menu Items</label>
                </p>
                <p id="add_menu_btn">
                  <button v-if="!menuItemModal" class="button is-warning" @click="addMenuItemModal">
                          Add Item
                  </button>
                </p>
                <br/><br/>
              </div>
            <div >
              
                <div class="box" v-if="category.menuItems" v-for="(item,index) in category.menuItems" :key="index">
                  <article class="media">
                    <div class="media-left menu-item-image">
                      <figure class="image menu-item-image">
                        <img :src="item.feature_image.url" :alt="item.title" :title="item.title">
                      </figure>
                    </div>
                    <div class="media-content">
                      <div class="content">
                        <div class="columns menu-item-info">
                          <div class="column is-8">
                            <p>
                              <strong>{{item.title}}</strong>
                              <br>
                              {{item.content}}
                            </p>
                          </div>
                          <div class="column menu-item-price">
                            <p>${{item.price}}</p>
                          </div>
                          <div class="column menu-item-price">
                            <div>
                              <a class="button" @click="editMenuItem(item, index)">
                                <span class="icon is-small is-info">
                                  <i class="fa fa-edit"></i>
                                </span>
                              </a>
                              <a class="button" @click="removeMenuItem(index)">
                                <span class="icon is-small is-danger">
                                  <i class="fa fa-trash"></i>
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
                <div v-if="menuItemModal">
                    <AddMenuItem />
                    <div align="center">
                      <button class="button is-danger" @click="addMenuItemModal">
                            Hide
                      </button>
                    </div>
                </div>
            </div>
        </section>
        <footer class="modal-card-foot">
            <button class="button is-medium" type="button" @click="closeDialog">Close</button>
        </footer>
    </div>
  </b-modal>
</template>

<script>
import {mapGetters} from 'vuex'
import AddMenuItem from '~/components/AddMenuItem.vue'
import _ from 'lodash'

export default {
  components: {
    AddMenuItem
  },
  computed: {
    ...mapGetters([
      'category',
      'menuItemModal',
      'edittingCategory',
      'edittingCategoryTitle',
      'categoryStatus'
    ]),
    categoryModalOpen: {
      get: function () {
        return this.$store.state.categoryModalOpen
      },
      set: function (value) {
        this.$validator.reset()
        this.$store.dispatch('toggleCategoryModal')
        this.$store.dispatch('setSelectedCategory', 0)
        this.$store.dispatch('toggleEdittingCategory', false)
        this.$store.dispatch('setCategoryDefault')
        this.$store.dispatch('setCategoryStatus')
      }
    }
  },
  methods: {
    addMenuItemModal () {
      this.$store.dispatch('toggleMenuItemModal')
      this.$store.dispatch('setMenuItemDefault')
      this.$store.dispatch('toggleEdittingMenuItem', false)
      this.$store.dispatch('setMenuItemStatus')
    },
    editMenuItem (menuItem, index) {
      let menu = _.cloneDeep(menuItem)
      menu.index = index
      this.$store.dispatch('setMenuItem', menu)
      this.$store.dispatch('toggleEdittingMenuItem', true)
      this.$store.dispatch('toggleMenuItemModal')
    },
    removeMenuItem (index) {
      this.$store.dispatch('deleteMenuItem', index)
    },
    closeDialog () {
      this.$validator.reset()
      this.$store.dispatch('toggleCategoryModal')
      this.$store.dispatch('setSelectedCategory', 0)
      this.$store.dispatch('toggleEdittingCategory', false)
      this.$store.dispatch('setCategoryDefault')
      this.$store.dispatch('setCategoryStatus')
    },
    editCategory () {
      this.$store.dispatch('toggleEditCategoryTitle', true)
    },
    saveCategory (category) {
      this.$validator.validateAll()
      if (this.$store.getters.edittingCategoryTitle) {
        if ((!this.errors.any())) {
          this.$store.dispatch('editCategory', category)
        }
      } else {
        if (!this.errors.any()) {
          this.$store.dispatch('addCategory', category)
        }
      }
    }
  }
}
</script>
<style lang="css" scoped>
    .menu-item-image {
      width: 80px;
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
    #menu_item{
      width:50%;
      text-align:left;
      display: inline-block;
    }
    #add_menu_btn{
      width:50%;
      text-align:right;
      display: inline-block;
    }
</style>
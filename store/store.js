import Vue from 'vue'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
import _ from 'lodash'
import Request from '~/common/request'

Vue.use(Vuex)
Vue.use(VeeValidate)

const state = {
  menus: [
  ],
  status: {
    loading: false,
    success: false,
    error: false
  },
  menu: {
    title: null,
    content: null,
    metadata: {
      date: null,
      menuItems: [{
      }]
    }
  },
  categories: [
  ],
  categoryModel: {
    title: null,
    content: null,
    metadata: {
      feature_image: {
      }
    }
  },
  categoryModalOpen: false,
  edittingCategory: false,
  editForm: false,
  editting: false,
  pagination: {
    page: 1,
    limit: 12,
    total: 0
  }
}

function isCategoryUnique (categories, category, edit = false) {
  let res = _.find(categories, { 'slug': category.title.toLowerCase() })
  if (edit) {
    if (category._id !== res._id) {
      return false
    }
    return true
  }
  return !res
}

const getters = {
  getName (state) {
    return state.name
  },
  menuModel (state) {
    return state.menu
  },
  loading (state) {
    return state.status.loading
  },
  error (state) {
    return state.status.error
  },
  editForm (state) {
    return state.editForm
  },
  categories (state) {
    return state.categories
  },
  categoryModel (state) {
    return state.categoryModel
  },
  categoryModalOpen (state) {
    return state.categoryModalOpen
  },
  edittingCategory (state) {
    return state.edittingCategory
  },
  editting (state) {
    return state.editting
  },
  pagination (state) {
    return state.pagination
  }
}

const mutations = {
  SET_MENU_DEFAULT (state) {
    state.menu = {
      title: null,
      description: null,
      price: null,
      date: null
    }
  },
  TOGGLE_EDITTING (state) {
    state.editting = !state.editting
  },
  TOGGLE_EDITFORM (state, payload) {
    state.editForm = payload
  },
  LOADING (state) {
    state.status = {
      loading: true,
      success: false,
      error: false
    }
  },
  ADD_MENU (state, payload) {
    state.menus.unshift(payload)
  },
  EDIT_MENU (state, payload) {
    state.menus = _.unionBy([payload], state.menus, '_id')
  },
  SUCCESS (state) {
    state.status = {
      loading: false,
      success: true,
      error: false
    }
  },
  ERROR (state, payload) {
    state.status = {
      loading: false,
      success: false,
      error: payload
    }
  },
  SET_TOTAL (state, payload) {
    state.pagination.total = Math.ceil(payload / state.pagination.limit)
  },
  SET_CATEGORIES (state, payload) {
    state.categories = payload
  },
  SET_CATEGORY_IMAGE (state, payload) {
    state.categoryModel.metadata.feature_image.url = payload
  },
  SET_CATEGORY_FILE (state, payload) {
    state.categoryModel.metadata.feature_image.file = payload
  },
  TOGGLE_CATEGORY_MODAL (state) {
    state.categoryModalOpen = !state.categoryModalOpen
  },
  SET_CATEGORY_DEFAULT (state) {
    state.categoryModel = {
      title: null,
      content: null,
      metadata: {
        feature_image: {
        }
      }
    }
  },
  ADD_CATEGORY (state, payload) {
    state.categories.unshift(payload)
  },
  EDIT_CATEGORY (state, payload) {
    state.categories = _.unionBy([payload], state.categories, '_id')
  },
  SET_CATEGORY (state, payload) {
    state.categoryModel = payload
  },
  TOGGLE_EDITTING_CATEGORY (state) {
    state.edittingCategory = !state.edittingCategory
  },
  DELETE_CATEGORY (state, payload) {
    state.categories.splice(payload, 1)
  }
}

const actions = {
  getMenus (context) {
    context.commit('LOADING')
    Request.getRecipes(context.getters.pagination).then(res => {
      context.commit('SET_MENUS', res.objects.all || [])
      context.commit('SET_TOTAL', res.total || 0)
      context.commit('SUCCESS')
    })
      .catch(e => {
        context.commit('ERROR', e)
      })
  },
  addMenu (context, payload) {
    context.commit('LOADING')
    Request.addMenu(payload).then(menu => {
      context.commit('ADD_MENU', menu)
      context.commit('SET_MENU_DEFAULT')
      context.commit('TOGGLE_EDITFORM', false)
      context.commit('SUCCESS')
    })
      .catch(e => {
        context.commit('ERROR', e)
      })
  },
  editMenu (context, payload) {
    context.commit('LOADING')
    Request.editRecipe(payload).then(menu => {
      context.commit('EDIT_MENU', menu)
      context.commit('SET_MENU_DEFAULT')
      context.commit('TOGGLE_EDITTING')
      context.commit('TOGGLE_EDITFORM', false)
      context.commit('SUCCESS')
    })
      .catch(e => {
        context.commit('ERROR', e)
      })
  },
  getCategories (context) {
    context.commit('LOADING')
    Request.getCategories(context.getters.pagination).then(res => {
      context.commit('SET_CATEGORIES', res.objects.all || [])
      context.commit('SET_TOTAL', res.total || 0)
      context.commit('SUCCESS')
    })
      .catch(e => {
        context.commit('ERROR', e)
      })
  },
  addCategory (context, payload) {
    context.commit('LOADING')
    if (isCategoryUnique(this.state.categories, payload)) {
      Request.addCategory(payload).then(category => {
        context.commit('ADD_CATEGORY', category)
        context.commit('SET_CATEGORY_DEFAULT')
        context.commit('SUCCESS')
        context.commit('TOGGLE_CATEGORY_MODAL')
      })
        .catch(e => {
          context.commit('ERROR', e)
        })
    } else {
      context.commit('ERROR', 'Category Already Present!')
    }
  },
  editCategory (context, payload) {
    context.commit('LOADING')
    if (isCategoryUnique(this.state.categories, payload, true)) {
      Request.editCategory(payload).then(category => {
        context.commit('EDIT_CATEGORY', category)
        context.commit('SET_CATEGORY_DEFAULT')
        context.commit('SUCCESS')
        context.commit('TOGGLE_CATEGORY_MODAL')
      })
        .catch(e => {
          context.commit('ERROR', e)
        })
    } else {
      context.commit('ERROR', 'Category Already Present!')
    }
  },
  toggleCategoryModal (context) {
    context.commit('TOGGLE_CATEGORY_MODAL')
  },
  setCategoryImage (context, payload) {
    context.commit('SET_CATEGORY_IMAGE', payload)
  },
  setCategoryFile (context, payload) {
    context.commit('SET_CATEGORY_FILE', payload)
  },
  setCategoryDefault (context) {
    context.commit('SET_CATEGORY_DEFAULT')
  },
  setCategory (context, payload) {
    context.commit('SET_CATEGORY', payload)
  },
  toggleEdittingCategory (context) {
    context.commit('TOGGLE_EDITTING_CATEGORY')
  },
  deleteCategory (context, payload) {
    context.commit('LOADING')
    Request.deleteCategory(this.state.categories[payload]).then((res) => {
      context.commit('DELETE_CATEGORY', payload)
      context.commit('SUCCESS')
    })
      .then((e) => {
        context.commit('ERROR', e)
      })
  }
}

const store = () => {
  return new Vuex.Store({
    state,
    getters,
    mutations,
    actions
  })
}

export default store

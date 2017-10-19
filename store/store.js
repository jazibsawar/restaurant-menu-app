import Vue from 'vue'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
import _ from 'lodash'
import Request from '~/common/request'

Vue.use(Vuex)
Vue.use(VeeValidate)

const state = {
  menus: null,
  menu: {
    title: null,
    content: null,
    metadata: {
      menu: [],
      date: null
    }
  },
  status: {
    loading: false,
    success: false,
    error: false
  },
  menuItemStatus: {
    loading: false,
    success: false,
    error: false
  },
  categoryStatus: {
    loading: false,
    success: false,
    error: false
  },
  menuItem: {
    title: null,
    content: null,
    price: null,
    feature_image: {
    }
  },
  category: {
    title: null,
    content: null,
    menuItems: []
  },
  selectedDate: new Date(),
  addMenu: false,
  addMenuDetails: false,
  categoryModalOpen: false,
  addCategoryTitle: false,
  menuItemModal: false,
  edittingCategory: false,
  edittingMenuItem: false,
  edittingCategoryTitle: false,
  editting: false,
  selectedCategory: null,
  initializeStatus: false,
  pagination: {
    page: 1,
    limit: 12,
    total: 0
  }
}

function isValueUnique (collection, payload, selector, edit = false) {
  if (edit) {
    let res = _.findIndex(collection, { [selector]: payload[selector] })
    console.log('Index: ', res, payload.index)
    if (res === -1 || (res !== -1 && res === payload.index)) {
      return true
    }
    return false
  }
  return !_.find(collection, { [selector]: payload[selector] })
}

const getters = {
  category (state) {
    return state.category
  },
  menuItem (state) {
    return state.menuItem
  },
  menus (state) {
    return state.menus
  },
  menu (state) {
    return state.menu
  },
  addMenu (state) {
    return state.addMenu
  },
  addMenuDetails (state) {
    return state.addMenuDetails
  },
  menuItemStatus (state) {
    return state.menuItemStatus
  },
  categoryStatus (state) {
    return state.categoryStatus
  },
  status (state) {
    return state.status
  },
  editting (state) {
    return state.editting
  },
  categoryModalOpen (state) {
    return state.categoryModalOpen
  },
  addCategoryTitle (state) {
    return state.addCategoryTitle
  },
  menuItemModal (state) {
    return state.menuItemModal
  },
  edittingMenuItem (state) {
    return state.edittingMenuItem
  },
  edittingCategory (state) {
    return state.edittingCategory
  },
  edittingCategoryTitle (state) {
    return state.edittingCategoryTitle
  },
  pagination (state) {
    return state.pagination
  },
  selectedCategory (state) {
    return state.selectedCategory
  },
  initializeStatus (state) {
    return state.initializeStatus
  }
}

const mutations = {
  SET_MENU_DEFAULT (state) {
    state.menu = {
      title: null,
      content: null,
      metadata: {
        menu: [],
        date: null
      }
    }
  },
  SET_CATEGORY_DEFAULT (state) {
    state.category = {
      title: null,
      content: null,
      menuItems: []
    }
  },
  SET_MENU_ITEM_DEFAULT (state) {
    state.menuItem = {
      title: null,
      content: null,
      price: null,
      feature_image: {
      }
    }
  },
  SET_MENUS (state, payload) {
    state.menus = payload
  },
  SET_MENU (state, payload) {
    state.menu = payload
  },
  TOGGLE_ADD_MENU (state) {
    state.addMenu = !state.addMenu
  },
  TOGGLE_ADD_MENU_DETAILS (state) {
    state.addMenuDetails = !state.addMenuDetails
  },
  ADD_MENU_ITEM (state, payload) {
    state.category.menuItems.unshift(payload)
  },
  TOGGLE_EDITTING (state, payload) {
    state.editting = payload
  },
  TOGGLE_ADD_CATEGORY_TITLE (state) {
    state.addCategoryTitle = !state.addCategoryTitle
  },
  TOGGLE_EDITTING_CATEGORY_TITLE (state, payload) {
    state.edittingCategoryTitle = payload
  },
  LOADING (state) {
    state.status = {
      loading: true,
      success: false,
      error: false
    }
  },
  MENU_ITEM_LOADING (state) {
    state.menuItemStatus = {
      loading: true,
      success: false,
      error: false
    }
  },
  MENU_ITEM_SUCCESS (state) {
    state.menuItemStatus = {
      loading: false,
      success: true,
      error: false
    }
  },
  MENU_ITEM_ERROR (state, payload) {
    state.menuItemStatus = {
      loading: false,
      success: false,
      error: payload
    }
  },
  CATEGORY_LOADING (state) {
    state.categoryStatus = {
      loading: true,
      success: false,
      error: false
    }
  },
  CATEGORY_SUCCESS (state) {
    state.categoryStatus = {
      loading: false,
      success: true,
      error: false
    }
  },
  CATEGORY_ERROR (state, payload) {
    state.categoryStatus = {
      loading: false,
      success: false,
      error: payload
    }
  },
  ADD_MENU (state, payload) {
    payload.metadata.menu = JSON.parse(payload.metadata.menu)
    state.menu = payload
  },
  EDIT_MENU (state, payload) {
    payload.metadata.menu = JSON.parse(payload.metadata.menu)
    state.menu = payload
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
  SET_MENU_IMAGE (state, payload) {
    state.menuItem.feature_image.url = payload
  },
  SET_MENU_FILE (state, payload) {
    state.menuItem.feature_image.file = payload
  },
  TOGGLE_CATEGORY_MODAL (state) {
    state.categoryModalOpen = !state.categoryModalOpen
  },
  TOGGLE_MENU_ITEM_MODAL (state) {
    state.menuItemModal = !state.menuItemModal
  },
  ADD_CATEGORY (state, payload) {
    state.menu.metadata.menu.unshift(_.cloneDeep(payload))
  },
  EDIT_CATEGORY (state, payload) {
    console.log('before: ', state.menu.metadata.menu)
    _.assign(state.menu.metadata.menu[state.selectedCategory], _.cloneDeep(payload))
    console.log('after: ', state.menu.metadata.menu)
  },
  SET_CATEGORY (state, payload) {
    state.category = payload
  },
  SET_MENU_ITEM (state, payload) {
    state.menuItem = payload
  },
  EDIT_MENU_ITEM (state, payload) {
    const index = payload.index
    delete payload.index
    state.category.menuItems[index] = payload
  },
  DELETE_MENU_ITEM (state, payload) {
    state.category.menuItems.splice(payload, 1)
  },
  TOGGLE_EDITTING_CATEGORY (state, payload) {
    state.edittingCategory = payload
  },
  DELETE_CATEGORY (state, payload) {
    state.menu.metadata.menu.splice(payload, 1)
  },
  TOGGLE_EDITTING_MENU_ITEM (state, payload) {
    state.edittingMenuItem = payload
  },
  SET_SELECTED_CATEGORY (state, payload) {
    state.selectedCategory = payload
  },
  SET_SELECTED_DATE (state, payload) {
    state.selectedDate = payload
  },
  SET_INITIALIZE_STATUS (state, payload) {
    state.initializeStatus = payload
  }
}

const actions = {
  getMenus (context) {
    context.commit('LOADING')
    console.log('Date1: ', this.state.selectedDate)
    Request.getMenus(this.state.selectedDate.toISOString()).then(res => {
      console.log('res: ', res)
      if (res.total) {
        console.log('here')
        res.objects.all[0].metadata.menu = JSON.parse(res.objects.all[0].metadata.menu)
        context.commit('SET_MENUS', res.objects.all[0])
      } else {
        context.commit('SET_MENUS', null)
      }
      context.commit('SET_TOTAL', res.total || 0)
      context.commit('SUCCESS')
    })
      .catch(e => {
        context.commit('ERROR', 'Something went wrong.')
      })
  },
  addMenu (context, payload) {
    context.commit('LOADING')
    if (isValueUnique(context.getters.menus, payload, 'date')) {
      Request.addMenu(payload).then(menu => {
        context.commit('TOGGLE_ADD_MENU')
        context.commit('ADD_MENU', menu)
        context.commit('TOGGLE_ADD_MENU_DETAILS')
        context.commit('TOGGLE_EDITTING', false)
        context.commit('SUCCESS')
      })
        .catch(e => {
          context.commit('ERROR', 'Something went wrong.')
        })
    } else {
      context.commit('ERROR', 'Menu for this date already present!')
    }
  },
  editMenu (context, payload) {
    context.commit('LOADING')
    Request.editMenu(payload).then(menu => {
      context.commit('EDIT_MENU', menu)
      context.commit('TOGGLE_EDITTING', false)
      context.commit('SUCCESS')
    })
      .catch(e => {
        context.commit('ERROR', 'Something went wrong.')
      })
  },
  addMenuItem (context, payload) {
    context.commit('MENU_ITEM_LOADING')
    if (isValueUnique(context.getters.category.menuItems, payload, 'title')) {
      Request.saveMedia(payload).then((payload) => {
        context.commit('ADD_MENU_ITEM', payload)
        context.commit('EDIT_CATEGORY', context.getters.category)
        Request.editMenu(context.getters.menu).then(menu => {
          context.commit('SET_MENU_ITEM_DEFAULT')
          context.commit('TOGGLE_MENU_ITEM_MODAL')
          context.commit('EDIT_MENU_ITEM', false)
          context.commit('MENU_ITEM_SUCCESS')
        })
          .catch(e => {
            context.commit('MENU_ITEM_ERROR', 'Something went wrong.')
          })
      })
        .catch(e => {
          context.commit('MENU_ITEM_ERROR', 'Something went wrong.')
        })
    } else {
      context.commit('MENU_ITEM_ERROR', 'Menu Item Already Present!')
    }
  },
  editMenuItem (context, payload) {
    context.commit('MENU_ITEM_LOADING')
    if (isValueUnique(context.getters.category.menuItems, payload, 'title', true)) {
      Request.saveMedia(payload).then((payload) => {
        context.commit('EDIT_MENU_ITEM', payload)
        context.commit('EDIT_CATEGORY', context.getters.category)
        Request.editMenu(context.getters.menu).then(menu => {
          context.commit('SET_MENU_ITEM_DEFAULT')
          context.commit('TOGGLE_MENU_ITEM_MODAL')
          context.commit('EDIT_MENU_ITEM', false)
          context.commit('MENU_ITEM_SUCCESS')
        })
          .catch(e => {
            context.commit('MENU_ITEM_ERROR', 'Something went wrong.')
          })
      })
        .catch(e => {
          context.commit('MENU_ITEM_ERROR', 'Something went wrong.')
        })
    } else {
      context.commit('MENU_ITEM_ERROR', 'Menu Item Already Present!')
    }
  },
  deleteMenuItem (context, payload) {
    context.commit('MENU_ITEM_LOADING')
    Request.deleteMedia(state.category.menuItems[payload].feature_image.id).then((res) => {
      context.commit('DELETE_MENU_ITEM', payload)
      context.commit('EDIT_CATEGORY', context.getters.category)
      Request.editMenu(context.getters.menu).then(menu => {
        context.commit('SET_MENU_ITEM_DEFAULT')
        context.commit('EDIT_MENU_ITEM', false)
        context.commit('MENU_ITEM_SUCCESS')
      })
        .catch(e => {
          context.commit('MENU_ITEM_ERROR', 'Something went wrong.')
        })
    })
      .catch(e => {
        context.commit('MENU_ITEM_ERROR', 'Something went wrong.')
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
        context.commit('ERROR', 'Something went wrong.')
      })
  },
  addCategory (context, payload) {
    context.commit('CATEGORY_LOADING')
    if (isValueUnique(context.getters.menu.metadata.menu, payload, 'title')) {
      context.commit('ADD_CATEGORY', payload)
      Request.editMenu(context.getters.menu).then(menu => {
        context.commit('TOGGLE_ADD_CATEGORY_TITLE')
        context.commit('SET_SELECTED_CATEGORY', 0)
        context.commit('CATEGORY_SUCCESS')
        context.commit('TOGGLE_CATEGORY_MODAL')
      })
        .catch(e => {
          context.commit('CATEGORY_ERROR', 'Something went wrong.')
        })
    } else {
      context.commit('CATEGORY_ERROR', 'Category Already Present!')
    }
  },
  editCategory (context, payload) {
    context.commit('CATEGORY_LOADING')
    payload.index = context.getters.selectedCategory
    if (isValueUnique(context.getters.menu.metadata.menu, payload, 'title', true)) {
      delete payload.index
      context.commit('EDIT_CATEGORY', payload)
      Request.editMenu(context.getters.menu).then(menu => {
        context.commit('CATEGORY_SUCCESS')
        context.commit('TOGGLE_EDITTING_CATEGORY_TITLE', false)
      })
        .catch(e => {
          context.commit('CATEGORY_ERROR', 'Something went wrong.')
        })
    } else {
      context.commit('CATEGORY_ERROR', 'Category Already Present!')
    }
  },
  toggleAddMenu (context) {
    context.commit('TOGGLE_ADD_MENU')
  },
  toggleAddMenuDetails (context) {
    context.commit('TOGGLE_ADD_MENU_DETAILS')
  },
  toggleMenuItemModal (context) {
    context.commit('TOGGLE_MENU_ITEM_MODAL')
  },
  toggleCategoryModal (context) {
    context.commit('TOGGLE_CATEGORY_MODAL')
  },
  toggleEditCategoryTitle (context, payload) {
    context.commit('TOGGLE_EDITTING_CATEGORY_TITLE', payload)
  },
  toggleAddCategoryTitle (context) {
    context.commit('TOGGLE_ADD_CATEGORY_TITLE')
  },
  setMenuImage (context, payload) {
    context.commit('SET_MENU_IMAGE', payload)
  },
  setMenuFile (context, payload) {
    context.commit('SET_MENU_FILE', payload)
  },
  setCategoryDefault (context) {
    context.commit('SET_CATEGORY_DEFAULT')
  },
  setCategory (context, payload) {
    context.commit('SET_CATEGORY', payload)
  },
  toggleEdittingCategory (context, payload) {
    context.commit('TOGGLE_EDITTING_CATEGORY', payload)
  },
  toggleEdittingMenuItem (context, payload) {
    context.commit('TOGGLE_EDITTING_MENU_ITEM', payload)
  },
  setMenuItem (context, payload) {
    context.commit('SET_MENU_ITEM', payload)
  },
  setMenuItemDefault (context) {
    context.commit('SET_MENU_ITEM_DEFAULT')
  },
  deleteCategory (context, payload) {
    context.commit('CATEGORY_LOADING')
    Request.deleteCategory(context.getters.menu.metadata.menu[payload])
    context.commit('DELETE_CATEGORY', payload)
    Request.editMenu(context.getters.menu).then(menu => {
      context.commit('TOGGLE_EDITTING_CATEGORY_TITLE', false)
      context.commit('CATEGORY_SUCCESS')
    })
      .catch(e => {
        context.commit('CATEGORY_ERROR', 'Something went wrong.')
      })
  },
  setMenuDefault (context) {
    context.commit('SET_MENU_DEFAULT')
  },
  toggleEditting (context, payload) {
    context.commit('TOGGLE_EDITTING', payload)
  },
  setSelectedCategory (context, payload) {
    context.commit('SET_SELECTED_CATEGORY', payload)
  },
  setMenuItemStatus (context) {
    context.commit('MENU_ITEM_SUCCESS')
  },
  setCategoryStatus (context) {
    context.commit('CATEGORY_SUCCESS')
  },
  setSelectedDate (context, payload) {
    context.commit('SET_SELECTED_DATE', payload)
  },
  setInitializeStatus (context, payload) {
    context.commit('SET_INITIALIZE_STATUS', payload)
  },
  setMenu (context, payload) {
    context.commit('SET_MENU', payload)
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

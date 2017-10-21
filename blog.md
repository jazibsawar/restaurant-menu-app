# How to build Restaurant Menu app in vue.js & vuex using cosmicjs #

In this tutorial, I'm going to show you how to create a **Restaurant Menu App** using [Vue2](https://vuejs.org/), [Vuex](https://vuex.vuejs.org/en/), [Buefy](https://buefy.github.io) and [Cosmicjs](http://cosmicjs.com/). It is hosted on the Cosmic JS App Server. We will be using cosmicjs npm package for implementing the basic CRUD for our objects and to retrieve data and media from cosmic. Let's get started.

[Download the GitHub repo.!](https://github.com/jazibsawar/restaurant-menu-app)

## Prerequisites ##

You will be requiring to install Node JS and npm before starting. Make sure you already have them.

## Getting Started ##

### Doing everything using the existing git repo ###

First of all, you have to be sure you have node > 6.x installed, than run the following commands:

```javascript
npm install -g vue-cli
git clone https://github.com/jazibsawar/restaurant-menu-app
cd restaurant-menu-app
npm install
npm run dev
```

After successfull completion of the last command browser window will automatically open

`package.json` will look like this.

```javascript
{
  "name": "restaurant-menu-app",
  "version": "1.0.0",
  "description": "Cosmic Restaurant Menu App",
  "author": "BitBytes",
  "private": true,
  "scripts": {
    "dev": "nuxt",
    "build": "nuxt build",
    "start": "nuxt start",
    "generate": "nuxt generate",
    "lint": "eslint --ext .js,.vue --ignore-path .gitignore .",
    "precommit": "npm run lint"
  },
  "dependencies": {
    "async": "^2.5.0",
    "buefy": "^0.5.4",
    "cosmicjs": "^2.4.20",
    "css-loader": "^0.28.7",
    "font-awesome": "^4.7.0",
    "lodash": "^4.17.4",
    "nuxt": "^1.0.0-rc11",
    "style-loader": "^0.19.0",
    "vee-validate": "^2.0.0-rc.18"
  },
  "devDependencies": {
    "babel-eslint": "^7.2.3",
    "eslint": "^4.3.0",
    "eslint-config-standard": "^10.2.1",
    "eslint-loader": "^1.9.0",
    "eslint-plugin-html": "^3.1.1",
    "eslint-plugin-import": "^2.7.0",
    "eslint-plugin-node": "^5.1.1",
    "eslint-plugin-promise": "^3.5.0",
    "eslint-plugin-standard": "^3.0.1"
  }
}
```

### What we're installing and why ###

1. We're going to use **vue** and **vuex** libraries to create components and manage state.

2. We're using **async** package to make async requests to cosmic for deleting media in a loop.

3. We're using **buefy** package to create our layouts using vue components.

4. We're going to use **cosmicjs** library to handle our requests to our Cosmic JS bucket.

5. **vee-validate** is used for form validation.

6. **nuxt** is used for server side rendering.

## Building our app ##

Now we will set up our nuxt.config.js in our root directory where we will change the favicon and set the other basic properties for the app link build properties and linting etc. Also we will include the external CDN's required for the app.

Below is the nuxt.config.js file.

```javascript
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Restaurant Menu App',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Cosmic Restaurant Menu App' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon-32x32.png' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css?family=Dancing+Script:700' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css?family=Crimson+Text:400,600,700,400italic' }
    ]
  },
  plugins: ['~plugins/buefy'],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
        config.module.rules.push({
          enforce: 'pre',
          test: /\.styl$/,
          loader: ['style-loader', 'css-loader'],
          exclude: /(node_modules)/
        })
      }
    }
  }
}
```

### Setup default.js ###

default.js in the layouts directory is the starting point in all the app. Here we include master view attributes like navbar and footer. the important thing here is `<nuxt />` the nuxt tag will initiate all the pages depending upon the route.

```javascript
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
```

In the script section in beforeMount we have called the actions that we need to be called when the application loads. Here 'getMenus' is worth noting. This action fetches the menu for the current date when application is launched. We have also exposed the store to the vue components.

#### Routing ####

When using nuxt.js we do not need to worry about creating the routes. Nuxt do the job for us. We need to follow the file directory rules described by nuxt and it will create all the necessary routes for us.
For more information visit [Nuxt documentation](https://nuxtjs.org/guide/routing)

### Setup index.vue ###

`\pages\index.vue` is the first page that will render. I have used buefy components for UI. You can check their documentation [here](https://buefy.github.io/#/documentation/start). Most important code block here to include landingpage component in the template `<LandingPage />`. This piece of code will render the LandingPage component.

```javascript
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
```

## Vuex ##

Moving ahead first I will discuss about Vuex and why we should use that. You can obviously use simple state and props for smaller applications. But for large applications we must use some kind of state management like redux in React. Vuex is maintained by vue team and it is widely used. Today we will use that. Below is the Vuex flow diagram that I will explain.

![Vuex Concept Flow](https://raw.githubusercontent.com/vuejs/vuex/dev/docs/en/images/vuex.png)

There are four main concepts in vuex.

- State

- Actions

- Mutations

- Getters

**State** is where our whole application state/data will be store. So how it will work? For example, you are using this store in you component and want to change some state value. You have to dispatch an **action**. Then **action** will commit the **mutation** and it will change the state. So why action is needed, we can change state directly in mutation. Action is very important. We need actions when we have to call any async function and then on its success change the state. In case of API we consume request in actions and commit mutation to change state. It is very simple but very import to follow.

**Getters** are simple getter function to get value of state in components. If you need one state value in different components so it is better to create getter for it and use that getter in component as computed property.

It is convention to create vuex folder and then create store.js in it. So I did the same and created `store/store.js`. Below is the store.js code:

```javascript
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
  selectedDate: new Date(new Date().setHours(0, 0, 0, 0)),
  addMenu: false,
  addMenuDetails: false,
  categoryModalOpen: false,
  addCategoryTitle: false,
  menuItemModal: false,
  editMenu: false,
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
function isEmpty (res) {
  return !res.total
}

function isValueUnique (collection, payload, selector, edit = false) {
  if (edit) {
    let res = _.findIndex(collection, { [selector]: payload[selector] })
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
  editMenu (state) {
    return state.editMenu
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
  SET_EDIT_MENU (state, payload) {
    state.editMenu = payload
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
    _.assign(state.menu.metadata.menu[state.selectedCategory], _.cloneDeep(payload))
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
  },
  SET_MENU_DATE (state) {
    state.menu.metadata.date = state.selectedDate
  }
}

const actions = {
  getMenus (context) {
    context.commit('LOADING')
    Request.getMenus(this.state.selectedDate.toISOString()).then(res => {
      if (!isEmpty(res)) {
        res.objects.all[0].metadata.menu = JSON.parse(res.objects.all[0].metadata.menu)
        context.commit('SET_MENUS', res.objects.all[0])
      } else {
        console.log('Error: ')
        context.commit('SET_MENUS', null)
      }
      context.commit('SUCCESS')
    })
      .catch(e => {
        context.commit('ERROR', 'Something went wrong.')
      })
  },
  addMenu (context, payload) {
    context.commit('LOADING')
    Request.getMenus(context.getters.menu.metadata.date.toISOString()).then(res => {
      if (isEmpty(res)) {
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
    })
      .catch(e => {
        context.commit('ERROR', 'Something went wrong.')
      })
  },
  editMenu (context, payload) {
    context.commit('LOADING')
    Request.editMenu(payload).then(menu => {
      context.commit('ADD_MENU', menu)
      context.commit('SET_EDIT_MENU', false)
      context.commit('SUCCESS')
    })
      .catch(e => {
        context.commit('ERROR', 'Something went wrong.')
      })
  },
  deleteMenu (context, payload) {
    context.commit('LOADING')
    Request.deleteMenu(payload).then(menu => {
      context.commit('SET_MENU_DEFAULT')
      context.commit('SET_MENUS', null)
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
  },
  setEditMenu (context, payload) {
    context.commit('SET_EDIT_MENU', payload)
  },
  setMenuDate (context) {
    context.commit('SET_MENU_DATE')
  },
  setMenus (context, payload) {
    context.commit('SET_MENUS', payload)
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
```

## Config ##

`config/config.js` is the file in which we store the basic configurations to access the cosmicjs.

```javascript
const config = {
  bucket: {
    slug: 'restaurant-menu-app',
    read_key: 'DSTjEtUhwVUe2WS3pwnZl36rQf5qiRVWVuSraQw7atHpd8XUIA',
    write_key: 'MjgkxDPTFACpycQpTsPeBDbOYBObzdY7g8PfYuPnQ76DVb5kxA'
  },
  object_type: 'menus'
}

export default config

```

## Commons ##

In `/common` I have created three .js files inorder to structre my code and make it scalable. `/common/request.js` file will use `/common/cosmic.js` package and make requests to provided endpoints and return Promises. `/common/paramMapping.js` will create a request object in case of add and edit.

`/common/cosmic.js` extends the cosmic-js package as it was missing `deleteMedia` and sort functionality in `getObjectsByType` functions.


cosmic.js extended code is below.

```javascript
import Cosmic from 'cosmicjs';
var api_url = 'https://api.cosmicjs.com';
var api_version = 'v1';

Cosmic.getObjectsByType = function(config, object, callback){
  var endpoint = api_url + '/' + api_version + '/' + config.bucket.slug + '/object-type/' + object.type_slug + '?read_key=' + config.bucket.read_key;
  if (object.limit) endpoint += '&limit=' + object.limit;
  if (object.skip) endpoint +=  '&skip=' + object.skip;
  if (object.locale) endpoint += '&locale=' + object.locale;
  if (object.sort) endpoint += '&sort=' + object.sort;
  fetch(endpoint)
  .then(function(response){
    if (response.status >= 400) {
      var err = {
        "message" : "There was an error with this request."
      }
      return callback(err, false);
    }
    return response.json()
  })
  .then(function(response){
    // Constructor
    var cosmic = {};
    var objects = response.objects;
    cosmic.objects = {};
    cosmic.objects.all = objects;
    cosmic.object = _.map(objects, keyMetafields);
    cosmic.object = _.keyBy(cosmic.object, "slug");
    cosmic.total = response.total;
    return callback(false, cosmic);
  });
};

Cosmic.deleteMedia = function(config, object, callback){
    var endpoint = api_url + '/' + api_version + '/' + config.bucket.slug + '/media/' + object.media_id;
    fetch(endpoint, {
      method: 'delete',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(object)
    })
    .then(function(response){
      if (response.status >= 400) {
        var err = {
          'message': 'There was an error with this request.'
        }
        return callback(err, false);
      }
      return response.json()
    })
    .then(function(response){
      return callback(false, response);
    });
};

function keyMetafields(object){
  var metafields = object.metafields;
  if(metafields){
    object.metafield = _.keyBy(metafields, 'key');
  }
  return object;
}

export default Cosmic;
```

## Components ##

In this application I created following components.

- LandingPage.vue

- Menu.vue

- AddMenu.vue

- AddMenuDetails.vue

- AddCategoryTitle.vue

- AddCategory.vue

- AddMenuItem.vue

### LandingPage.vue ###

LandingPage.vue is the main component. It will show a date picker already set to the current date. If any menu exist for that date it will be loaded below via the component `<Menu />` otherwise a button will appear to add a menu on that date.

```javascript
import {mapActions,mapGetters} from 'vuex';
```

This will map getter of vuex store to computed property of Vue and map actions to methods.

```javascript
<template>
  <div>
      <div v-if="initializeStatus && !addMenu && !addMenuDetails" class="container menu-date">
        <b-datepicker class="menu-date-picker" v-model="selectedDate"
            :first-day-of-week="1"
            placeholder="Click to select">
        </b-datepicker>
      </div>
      <br>
     <section class="hero is-bold is-large" v-if="menus == null && !addMenu && !addMenuDetails">
      <div class="hero-body">
        <div class="container-fluid has-text-centered">
          <h1 class="title">
            No Menu Found for Selected Date!
          </h1>
          <br>
          <h2 class="subtitle">
            <a class="button is-success is-medium" @click="addNewMenu" :disabled="status.loading">Add Menu</a>
          </h2>
        </div>
      </div>
    </section>
    <div v-else-if="!addMenu && !addMenuDetails">
      <RestaurantMenu />
    </div>
    <AddMenuDetails v-if="addMenuDetails" />
    <AddMenu />
    <b-loading :active.sync="status.loading" :canCancel="true"></b-loading>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import AddMenu from '~/components/AddMenu.vue'
import AddMenuDetails from '~/components/AddMenuDetails.vue'
import RestaurantMenu from '~/components/Menu.vue'

export default {
  components: {
    AddMenu,
    AddMenuDetails,
    RestaurantMenu
  },
  computed: {
    ...mapGetters([
      'menus',
      'status',
      'addMenu',
      'addMenuDetails',
      'initializeStatus'
    ]),
    selectedDate: {
      get: function () {
        return this.$store.state.selectedDate
      },
      set: function (value) {
        this.$store.dispatch('setSelectedDate', value)
      }
    }
  },
  watch: {
    selectedDate: 'getMenu'
  },
  methods: {
    addNewMenu () {
      this.$store.dispatch('toggleAddMenu')
      this.$store.dispatch('setMenuDate')
    },
    openEditForm (category) {
      this.$store.dispatch('setCategory', category)
      this.$store.dispatch('toggleEdittingCategory')
      this.$store.dispatch('toggleAddMenu')
    },
    deleteCategory (category) {
      this.$store.dispatch('deleteCategory', category)
    },
    getMenu () {
      console.log('here')
      this.$store.dispatch('getMenus')
    }
  }
}
</script>
<style lang="css" scoped>
  .menu-date {
    max-width: 600px;
  }
  .menu-date-picker >>> .input{
    border-radius: 5px;
    height: 40px;
  }
  .hero.is-large .hero-body {
    padding-bottom: 5rem;
    padding-top: 4rem;
 }
 .menu-date-picker >>> .input.is-hovered, .menu-date-picker >>> .input:hover {
    border-color: #dbdbdb;
 }
</style>

```

### Menu.vue ###

Menu.vue shows the menu fetched for that date.

```javascript
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
```

### AddMenu.vue ###

AddMenu.vue displays a dialog to enter the title , description and date for the menu. It appears after you click the add Menu button.

```javascript
<template>
 <b-modal :active.sync="addMenu" :canCancel="['x', 'outside']" max-width="500px">
    <div class="modal-card">
      <header class="modal-card-head">
          <p class="modal-card-title">{{ editting ? 'Edit ' : 'Add ' }} Menu</p>
      </header>
      <section class="modal-card-body menu-modal-body">
          <b-field label="Select a date" :message="errors.collect('date')" >
            <b-datepicker v-model="menu.metadata.date"
                :first-day-of-week="1"
                placeholder="Click to select"
                v-validate="'required'" data-vv-name="date"
                required>
            </b-datepicker>
          </b-field>
          <b-field label="Title" :message="errors.collect('title')">
              <b-input
                  type="text"
                  v-model="menu.title"
                  placeholder="Menu Title"
                  v-validate="'required'" data-vv-name="title"
                  required>
              </b-input>
          </b-field>

          <b-field label="Description" :message="errors.collect('description')">
              <b-input
                  type="textarea"
                  maxlength="200"
                  v-model="menu.content"
                  placeholder="Menu Description"
                  v-validate="'required'" data-vv-name="description"
                  required>
              </b-input>
          </b-field>
          <div style="color: red" v-show="status.error" >
               *{{ status.error }}
          </div>
      </section>
      <footer class="modal-card-foot">
          <button class="button is-medium" type="button" @click="closeDialog">Close</button>
          <button v-if="!status.loading" class="button is-info is-medium" @click="saveMenu(menu)" >Save</button>
          <button v-else class="button is-info is-loading is-medium" @click="saveMenu(menu)" disabled>Save</button>
      </footer>
  </div>
 </b-modal>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'menu', 'status', 'editting'
    ]),
    addMenu: {
      get: function () {
        return this.$store.state.addMenu
      },
      set: function (value) {
        this.$store.dispatch('toggleAddMenu')
      }
    }
  },
  methods: {
    closeDialog () {
      this.$validator.reset()
      this.$store.dispatch('setMenuDefault')
      this.$store.dispatch('toggleAddMenu')
    },
    saveMenu (menu) {
      console.log('here')
      this.$validator.validateAll()
      if (this.$store.editting) {
        if ((!this.errors.any())) {
          this.$store.dispatch('editMenu', menu)
        }
      } else {
        if (!this.errors.any()) {
          console.log('validated')
          this.$store.dispatch('addMenu', menu)
        }
      }
    }
  }
}
</script>

<style lang="css" scoped>
  .menu-modal-body {
     padding-bottom: 150px;
  }
</style>

```

### AddMenuDetails.vue ###

Once you have entered the title, description and date for the menu and saved it a menu will be created and a new component will be loaded in which you can add new categories and menuItems in the menu object.

```javascript
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
      console.log('here')
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

```

### AddCategoryTitle.vue ###

On pressing the add category button a dialog opens in which you enter the title for the category.

```javascript
<template>
  <b-modal :active.sync="addCategoryTitle" :canCancel="['x', 'outside']" max-width="500px">
      <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">{{ edittingCategoryTitle ? 'Edit ' : 'Add ' }} Category Title</p>
        </header>
        <section class="modal-card-body menu-modal-body">
            <b-field label="Title" :message="errors.collect('title')">
                <b-input
                    type="text"
                    v-model="category.title"
                    placeholder="Category Title"
                    v-validate="'required'" data-vv-name="title"
                    required>
                </b-input>
            </b-field>
        </section>
        <footer class="modal-card-foot">
            <div style="color: red" v-show="categoryStatus.error" >
                   {{ categoryStatus.error }}
            </div>
            <button class="button is-medium" type="button" @click="closeDialog">Close</button>
            <button v-if="!categoryStatus.loading" class="button is-info is-medium" @click="saveCategory(category)" >Save</button>
            <button v-else class="button is-info is-loading is-medium" @click="saveCategory(category)" disabled>Save</button>
        </footer>
    </div>
  </b-modal>
</template>
<script>
import {mapGetters} from 'vuex'
import AddMenuItem from '~/components/AddMenuItem.vue'

export default {
  components: {
    AddMenuItem
  },
  computed: {
    ...mapGetters([
      'category',
      'addCategoryTitle',
      'categoryStatus',
      'edittingCategoryTitle'
    ]),
    addCategoryTitle: {
      get: function () {
        return this.$store.state.addCategoryTitle
      },
      set: function (value) {
        this.$store.dispatch('toggleAddCategoryTitle')
      }
    }
  },
  methods: {
    closeDialog () {
      this.$validator.reset()
      this.$store.dispatch('toggleAddCategoryTitle')
      this.$store.dispatch('toggleEdittingCategory', false)
      this.$store.dispatch('setCategoryDefault')
      this.$store.dispatch('setCategoryStatus')
    },
    saveCategory (category) {
      this.$validator.validateAll()
      if (!this.errors.any()) {
        this.$store.dispatch('addCategory', category)
      }
    }
  }
}
</script>
```

### AddCategory.vue ###

This component displays the Category title and provides the functionality to add menuItems in the category.

```javascript
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
```

### AddMenuItem.vue ###

This component shows the form to enter the basic information for the menu item.

```javascript
<template>
 <div class="field">
    <label class="label is-medium">{{ edittingMenuItem ? 'Edit ' : 'Add ' }} Menu Item</label>
    <b-field :message="errors.collect('title')">
        <b-input
            type="text"
            v-model="menuItem.title"
            placeholder="Add Item Title"
            v-validate="'required'" data-vv-name="title"
            required>
        </b-input>
    </b-field>
    <b-field :message="errors.collect('description')">
        <b-input
            type="text"
            maxlength="200"
            v-model="menuItem.content"
            placeholder="Menu Item Description"
            v-validate="'required'" data-vv-name="description"
            required>
        </b-input>
    </b-field>
    <b-field :message="errors.collect('price')">
        <b-input
            type="number"
            v-model="menuItem.price"
            placeholder="Menu Item Price"
            v-validate="'required'" data-vv-name="price"
            required>
        </b-input>
    </b-field>
    <b-field >
      <img style="height: 25%; width: 25%;" class="upload_image" :src="menuItem.feature_image.url.replace(/ /g,'%20')" v-if="!!menuItem.feature_image.url" />
      <form enctype="multipart/form-data" novalidate>
      <input type="file" @change="onFileChange" accept="image/*" data-vv-name="image" v-validate="'required|mimes:image/*'" required />
      <div class="input-group fileUploadError">
          <div class="input-group__error" v-show="errors.has('image') && !edittingMenuItem">
          {{ errors.first('image') }}
          </div>
      </div>
      </form>
    </b-field>
    <div v-show="menuItemStatus.error" class="field is-danger" >
      {{ menuItemStatus.error }}
    </div>
    <div class="field">
      <p class="control">
        <button v-if="!menuItemStatus.loading" class="button is-info is-medium" @click="addMenuItem(menuItem)" >Save</button>
        <button v-else class="button is-info is-loading is-medium" @click="addMenuItem(menuItem)" disabled>Save</button>
      </p>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'menuItem',
      'menuItemStatus',
      'edittingMenuItem'
    ])
  },
  methods: {
    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        this.$store.dispatch('setMenuImage', '')
        this.$store.dispatch('setMenuFile', '')
        return
      }
      var reader = new FileReader()
      reader.onload = (e) => {
        this.$store.dispatch('setMenuImage', e.target.result)
        this.$store.dispatch('setMenuFile', files[0])
      }
      reader.readAsDataURL(files[0])
    },
    addMenuItem (menuItem) {
      this.$validator.validateAll()
      if (this.$store.getters.edittingMenuItem) {
        if ((!this.errors.any()) || (this.errors.count() === 1 && this.errors.has('image'))) {
          console.log(menuItem)
          this.$store.dispatch('editMenuItem', menuItem)
        }
      } else {
        if (!this.errors.any()) {
          this.$store.dispatch('addMenuItem', menuItem)
        }
      }
    }
  }
}
</script>
```

## Conclusion ##

This is a basic app for a restaurant menu built using vue , vuex , cosmicJs and nuxt.js. I hope you liked the tutorial and will be helpfull for you.
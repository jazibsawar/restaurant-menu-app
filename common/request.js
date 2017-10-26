import Cosmic from './cosmic'
import config from '../config/config'
import async from 'async'
// import _ from 'lodash'
import {generateMenuObject} from './paramMapping'

function getMenus (date) {
  return new Promise((resolve, reject) => {
    const params = {
      type_slug: config.object_type,
      metafield_key: 'date',
      metafield_value: date
    }
    Cosmic.getObjectsBySearch(config, params, (err, res) => {
      if (!err) {
        resolve(res)
      } else {
        reject(err)
      }
    })
  })
}

function addMenu (obj) {
  return new Promise((resolve, reject) => {
    const params = generateMenuObject(obj)
    Cosmic.addObject(config, params, (err, res) => {
      if (!err) {
        resolve(res.object)
      } else {
        reject(err)
      }
    })
  })
}

function deleteCategory (category) {
  async.eachSeries(category.menuItems, (menu, callback) => {
    if (!!menu.feature_image && !!menu.feature_image.id) {
      deleteMedia(menu.feature_image.id).then((res) => {
        callback()
      })
    }
  })
}

function editMenu (obj) {
  return new Promise((resolve, reject) => {
    const params = generateMenuObject(obj, true)
    Cosmic.editObject(config, params, (err, res) => {
      if (!err) {
        resolve(res.object)
      } else {
        reject(err)
      }
    })
  })
}

function deleteMenu (menu) {
  const params = {
    write_key: config.bucket.write_key,
    slug: menu.slug
  }
  if (!newFunction()) {
    for (var i = 0; i < menu.metadata.menu.length; i++) {
      deleteCategory(menu.metadata.menu[i])
    }
  }
  return new Promise((resolve, reject) => {
    Cosmic.deleteObject(config, params, (err, res) => {
      if (!err) {
        resolve(res)
      } else {
        reject(err)
      }
    })
  })

  function newFunction () {
    return !menu.metadata.menu
  }
}
function saveMedia (payload) {
  return new Promise((resolve, reject) => {
    if (payload.feature_image.file && payload.feature_image.id) {
      deleteMedia(payload.feature_image.id).then((res) => {
        addMedia(payload.feature_image.file).then((media) => {
          payload.feature_image.url = media.url
          payload.feature_image.imgix_url = media.imgix_url
          payload.feature_image.value = media.name
          payload.feature_image.id = media._id
          delete payload.feature_image.file
          resolve(payload)
        })
      })
        .catch(e => {
          reject(e)
        })
    } else if (payload.feature_image.file) {
      addMedia(payload.feature_image.file).then((media) => {
        payload.feature_image.url = media.url
        payload.feature_image.imgix_url = media.imgix_url
        payload.feature_image.value = media.name
        payload.feature_image.id = media._id
        delete payload.feature_image.file
        resolve(payload)
      })
        .catch(e => {
          reject(e)
        })
    } else {
      resolve(payload)
    }
  })
}

function addMedia (file) {
  const params = {
    media: file,
    folder: config.image_folder
  }
  return new Promise((resolve, reject) => {
    Cosmic.addMedia(config, params, (err, res) => {
      if (!err) {
        resolve(res.body.media)
      } else {
        reject(err)
      }
    })
  })
}

function deleteMedia (id) {
  const params = {
    media_id: id,
    write_key: config.bucket.write_key
  }
  return new Promise((resolve, reject) => {
    Cosmic.deleteMedia(config, params, (err, res) => {
      if (!err) {
        resolve(res)
      } else {
        reject(err)
      }
    })
  })
}
export default {getMenus, addMenu, editMenu, deleteCategory, saveMedia, deleteMedia, deleteMenu}

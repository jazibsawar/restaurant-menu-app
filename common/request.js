import Cosmic from './Cosmic'
import config from '../config/config'
import _ from 'lodash'
import {generateMenuObject, generateCategoryObject} from './paramMapping'

function addCategory (obj) {
  return new Promise((resolve, reject) => {
    console.log('Request: ', obj)
    addMedia(obj.metadata.feature_image.file).then((media) => {
      obj.metadata.feature_image.url = media.url
      obj.metadata.feature_image.imgix_url = media.imgix_url
      obj.metadata.feature_image.value = media.name
      obj.metadata.feature_image.id = media._id
      const params = generateCategoryObject(obj)
      Cosmic.addObject(config, params, (err, res) => {
        if (!err) {
          resolve(res.object)
        } else {
          reject(err)
        }
      })
    })
      .catch((e) => {
        reject(e)
      })
  })
}

function getMenus (pagination) {
  return new Promise((resolve, reject) => {
    const params = {
      type_slug: config.menu_object,
      limit: pagination.limit,
      sort: '-created_at',
      skip: (pagination.page - 1) * pagination.limit
    }
    Cosmic.getObjectsByType(config, params, (err, res) => {
      if (!err) {
        resolve(res)
      } else {
        reject(err)
      }
    })
  })
}

function getCategories (pagination) {
  return new Promise((resolve, reject) => {
    const params = {
      type_slug: config.category_object,
      limit: pagination.limit,
      sort: '-created_at',
      skip: (pagination.page - 1) * pagination.limit
    }
    Cosmic.getObjectsByType(config, params, (err, res) => {
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
    console.log('Request: ', obj)
    addMedia(obj.metadata.feature_image.file).then((media) => {
      obj.metadata.feature_image.url = media.url
      obj.metadata.feature_image.imgix_url = media.imgix_url
      obj.metadata.feature_image.value = media.name
      obj.metadata.feature_image.id = media._id
      const params = generateMenuObject(obj)
      Cosmic.addObject(config, params, (err, res) => {
        if (!err) {
          resolve(res.object)
        } else {
          reject(err)
        }
      })
    })
      .catch((e) => {
        reject(e)
      })
  })
}

function editCategory (obj) {
  const featureImage = _.find(obj.metafields, ['key', 'feature_image'])
  return new Promise((resolve, reject) => {
    if (obj.metadata.feature_image.file) {
      deleteMedia(featureImage.id).then((res) => {
        addMedia(obj.metadata.feature_image.file).then((media) => {
          obj.metadata.feature_image.url = media.url
          obj.metadata.feature_image.imgix_url = media.imgix_url
          obj.metadata.feature_image.value = media.name
          obj.metadata.feature_image.id = media._id
          const params = generateCategoryObject(obj, true)
          Cosmic.editObject(config, params, (err, res) => {
            if (!err) {
              resolve(res.object)
            } else {
              reject(err)
            }
          })
        })
          .catch((e) => {
            reject(e)
          })
      })
        .catch((e) => {
          reject(e)
        })
    } else {
      obj.metadata.feature_image.value = featureImage.value
      obj.metadata.feature_image.id = featureImage.id
      const params = generateCategoryObject(obj, true)
      Cosmic.editObject(config, params, (err, res) => {
        if (!err) {
          resolve(res.object)
        } else {
          reject(err)
        }
      })
    }
  })
}

function deleteCategory (category) {
  const params = {
    write_key: config.bucket.write_key,
    slug: category.slug
  }
  const featureImage = _.find(category.metafields, ['key', 'feature_image'])
  return new Promise((resolve, reject) => {
    deleteMedia(featureImage.id).then((res) => {
      Cosmic.deleteObject(config, params, (err, res) => {
        if (!err) {
          resolve(res)
        } else {
          reject(err)
        }
      })
    })
      .catch((e) => {
        reject(e)
      })
  })
}

// function editMenu (obj) {
//   const feature_image = _.find(obj.metafields, ['key', 'feature_image'])
//   return new Promise((resolve, reject) => {
//     if (obj.metadata.feature_image.file) {
//       deleteMedia(feature_image.id).then((res) => {
//         if (res.status === 200) {
//           addMedia(obj.metadata.feature_image.file).then((media) => {
//             obj.metadata.feature_image.url = media.url
//             obj.metadata.feature_image.imgix_url = media.imgix_url
//             obj.metadata.feature_image.value = media.name
//             obj.metadata.feature_image.id = media._id
//             const params = generateRecipeObject(obj, true)
//             Cosmic.editObject(config, params, (err, res) => {
//               if (!err) {
//                 resolve(res.object)
//               } else {
//                 reject(err)
//               }
//             })
//           })
//             .catch((e) => {
//               reject(e)
//             })
//         } else {
//           reject(err)
//         }
//       })
//         .catch((e) => {
//           reject(e)
//         })
//     } else {
//       obj.metadata.feature_image.value = feature_image.value
//       obj.metadata.feature_image.id = feature_image.id
//       const params = generateRecipeObject(obj, true)
//       Cosmic.editObject(config, params, (err, res) => {
//         if (!err) {
//           resolve(res.object)
//         } else {
//           reject(err)
//         }
//       })
//     }
//   })
// }

// function deleteMenu (recipe) {
//   const params = {
//     write_key: config.bucket.write_key,
//     slug: recipe.slug
//   }
//   const feature_image = _.find(recipe.metafields, ['key', 'feature_image'])
//   return new Promise((resolve, reject) => {
//     deleteMedia(feature_image.id).then((res) => {
//       if (res.status === 200) {
//         Cosmic.deleteObject(config, params, (err, res) => {
//           if (!err) {
//             resolve(res)
//           } else {
//             reject(err)
//           }
//         })
//       } else {
//         reject(err)
//       }
//     })
//       .catch((e) => {
//         reject(e)
//       })
//   })
// }
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
export default {getMenus, addMenu, addCategory, getCategories, editCategory, deleteCategory}

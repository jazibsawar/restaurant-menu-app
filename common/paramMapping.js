import config from '../config/config'

function generateMenuObject (payload, edit = false) {
  let params = {
    write_key: config.bucket.write_key,
    type_slug: config.menu_object,
    title: payload.title,
    content: payload.content,
    metafields: [{
      required: true,
      value: payload.metadata.menuItems,
      key: 'menuItems',
      title: 'MENUITEMS',
      type: 'text',
      children: false,
      has_length_edit: true,
      parent: false
    },
    {
      required: true,
      value: payload.metadata.date,
      key: 'date',
      title: 'Date',
      type: 'text',
      children: false,
      has_length_edit: true,
      parent: false
    },
    {
      required: true,
      value: payload.metadata.feature_image.value,
      key: 'feature_image',
      title: 'FEATURE IMAGE',
      type: 'file',
      children: false,
      url: payload.metadata.feature_image.url,
      imgix_url: payload.metadata.feature_image.imgix_url,
      has_length_edit: false,
      parent: false,
      id: payload.metadata.feature_image.id
    }
    ]
  }

  if (edit) {
    params.slug = payload.slug
  }

  return params
}

function generateCategoryObject (payload, edit = false) {
  let params = {
    write_key: config.bucket.write_key,
    type_slug: config.category_object,
    title: payload.title,
    content: payload.content,
    metafields: [{
      required: true,
      value: payload.metadata.feature_image.value,
      key: 'feature_image',
      title: 'FEATURE IMAGE',
      type: 'file',
      children: false,
      url: payload.metadata.feature_image.url,
      imgix_url: payload.metadata.feature_image.imgix_url,
      has_length_edit: false,
      parent: false,
      id: payload.metadata.feature_image.id
    }
    ]
  }
  if (edit) {
    params.slug = payload.slug
  }
  return params
}

export {generateMenuObject, generateCategoryObject}

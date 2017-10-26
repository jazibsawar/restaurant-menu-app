import config from '../config/config'

function generateMenuObject (payload, edit = false) {
  let params = {
    write_key: config.bucket.write_key,
    type_slug: config.object_type,
    title: payload.title,
    content: payload.content,
    metafields: [{
      required: true,
      value: JSON.stringify(payload.metadata.menu),
      key: 'menu',
      title: 'MENU',
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
    }
    ]
  }

  if (edit) {
    params.slug = payload.slug
  }

  return params
}

export {generateMenuObject}

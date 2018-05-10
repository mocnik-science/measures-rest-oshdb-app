const express = require('express')
const url = require('url')

const C = require('./../constants')
const settingsApp = require('./../settings')
const {itemForUser, allItemsShort} = require('./../tier4-functionality/items')

module.exports.runRoutesPublic = (use, get, post) => {
  // static
  use('/static/vs', express.static('./../frontend/node_modules/monaco-editor/min/vs'))
  use('/static/libs', express.static('./../backend/libs'))
  use('/static/help', express.static('./../backend/help'))
  
  // repository (lod)
  use('/repository/static/', express.static(C.PATH_TEMPLATES_LOD_STATIC))
  get('/repository/measure/:id', (req, res) => {
    const measure = itemForUser(C.PATH_MEASURES, null, C.MEASURE, req.params.id)
    console.log(measure)
    const implementedBy = []
    for (const p of measure.implementedBy) implementedBy.push(itemForUser(C.PATH_PERSON, null, C.PERSON, p.id))

    
    res.render('measure', Object.assign(defaultData(req), {
      item: {
        uri: `${settingsApp.repositoryUrl}/measure/${measure.id}`,
        type: 'dq:measure',
        itemTitle: measure.name,
        itemTypeTitle: 'Measure',
      },
    }))
    
  })
  
  // development
  if (!C.DEVELOPMENT) {
    use('/', express.static('./../frontend/build'))
    use('*', express.static('./../frontend/build/index.html'))
  }  
}




const defaultData = req => {
  const items = []
  C.ITEMS.forEach(i => items.push(Object.assign({list: allItemsShort(i.path)}, i)))
  return {
    home: {
      titleLong: C.REPOSITORY_NAME_LONG,
      titleShort: C.REPOSITORY_NAME_SHORT,
      url: settingsApp.repositoryUrl,
      namespaces: C.REPOSITORY_NAMESPACES,
      items: items,
    },
    title: 'world',
    url: url.format({
      protocol: req.protocol,
      host: req.hostname,
      pathname: req.originalUrl,
    }),
  }
}

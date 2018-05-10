const express = require('express')

const C = require('./../constants')
const settingsApp = require('./../settings')
const {itemForUser} = require('./../tier4-functionality/items')
const {typesFromMeasure, isOSM, isQualityMeasure, nameForTypesOfMeasure, groundingsFromMeasure, tagsFromMeasure, listToPersonList, forenameToForenameShort, defaultData} = require('./../tier4-functionality/lod')

module.exports.runRoutesPublicLOD = (use, get, post) => {
  use('/repository/static/', express.static(C.PATH_TEMPLATES_LOD_STATIC))
  get('/repository/measure/:id', (req, res) => {
    const item = itemForUser(C.MEASURE, null, req.params.id)
    const types = typesFromMeasure(item)
    res.render('measure', Object.assign(defaultData(req), {
      title: item.name,
      itemMeta: {
        uri: `${settingsApp.repositoryUrl}/measure/${item.id}`,
        type: types.join(' '),
        itemTitle: item.name,
        itemTypeTitle: nameForTypesOfMeasure(types),
        isOSM: isOSM(item),
        isQualityMeasure: isQualityMeasure(item),
        implementedBy: listToPersonList(item.implementedBy),
        documentedBy: listToPersonList(item.documentedBy),
        api: {
          prefix: 'http://',
          main: 'purl.org/osm-data-quality/measure/measure-test/grid',
          suffix: '?resolution={resolution}&bbox={bounding box}',
        },
        usesGrounding: groundingsFromMeasure(item),
        assessesTag: tagsFromMeasure(item),
      },
      item: item,
    }))
  })
  get('/repository/result/:id', (req, res) => {
    const item = itemForUser(C.RESULT, null, req.params.id)
    res.render('result', Object.assign(defaultData(req), {
      title: item.name,
      itemMeta: {
        uri: `${settingsApp.repositoryUrl}/result/${item.id}`,
        type: 'dq:result',
        itemTitle: item.name,
        itemTypeTitle: 'Result',
        documentedBy: listToPersonList(item.documentedBy),
      },
      item: item,
    }))
  })
  get('/repository/context/:id', (req, res) => {
    const item = itemForUser(C.CONTEXT, null, req.params.id)
    res.render('context', Object.assign(defaultData(req), {
      title: item.name,
      itemMeta: {
        uri: `${settingsApp.repositoryUrl}/context/${item.id}`,
        type: 'dq:context',
        itemTitle: item.name,
        itemTypeTitle: 'Context',
        documentedBy: listToPersonList(item.documentedBy),
      },
      item: item,
    }))
  })
  get('/repository/person/:id', (req, res) => {
    const item = itemForUser(C.PERSON, null, req.params.id)
    res.render('person', Object.assign(defaultData(req), {
      title: item.name,
      type: 'foaf:person',
      itemMeta: {
        uri: `${settingsApp.repositoryUrl}/person/${item.id}`,
        itemTitle: item.name,
        itemTypeTitle: 'Person',
      },
      item: item,
      license: null,
    }))
  })
}

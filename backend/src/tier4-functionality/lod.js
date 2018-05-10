const url = require('url')

const C = require('./../constants')
const settingsApp = require('./../settings')
const {itemForUser, allItemsShort} = require('./../tier4-functionality/items')

module.exports.typesFromMeasure = measure => {
  let types = (isOSM(measure)) ? ['dq:measure', 'dq:spatialMeasure', 'osmdq:spatialMeasure'] : ['dq:measure', 'dq:spatialMeasure']
  if (isQualityMeasure(measure)) return types = types.concat((isOSM(measure)) ? 'osmdq:spatialDataQualityMeasure' : 'dq:dataQualityMeasure')
  return types
}

module.exports.isOSM = isOSM = measure => measure.appliesToDataset && measure.appliesToDataset.id === 'osmdq:OpenStreetMap'
module.exports.isQualityMeasure = isQualityMeasure = measure => (measure.usesGrounding.length > 0)

module.exports.nameForTypesOfMeasure = types => {
  if (types.includes('osmdq:spatialDataQualityMeasure')) return 'OpenStreetMap Data Quality Measure'
  if (types.includes('osmdq:spatialMeasure')) return 'OpenStreetMap Measure'
  if (types.includes('dq:dataQualityMeasure')) return 'Data Quality Measure'
  if (types.includes('dq:measure')) return 'Measure'
  return ''
}

module.exports.groundingsFromMeasure = measure => measure.usesGrounding.map(g => ({
  id: g.id,
  label: C.LOD_GROUNDING_DICTIONARY[g.id],
}))

module.exports.tagsFromMeasure = measure => measure.assessesTag.split(/[,;]/).map(t => t.match(/ *"?([^"=]*)"? *(= *"?([^"=]*)"? *)?/)).map(t => ({
  key: t[1].trim(),
  value: (t[3]) ? t[3].trim() : undefined,
}))

module.exports.listToPersonList = list => {
  const result = list.map(p => itemForUser(C.PERSON, null, p.id)).filter(p => p)
  result.map(p => p.forenameShort = forenameToForenameShort(p.forename))
  return result
}

module.exports.forenameToForenameShort = forenameToForenameShort = forename => forename.replace(/[a-zß-ÿ]/g, '')

module.exports.defaultData = req => {
  const items = []
  C.ITEM_CLASSES.map(c => items.push(Object.assign({list: allItemsShort(c.path)}, c)))
  return {
    home: {
      titleLong: C.REPOSITORY_NAME_LONG,
      titleShort: C.REPOSITORY_NAME_SHORT,
      url: settingsApp.repositoryUrl,
      namespaces: C.REPOSITORY_NAMESPACES,
      items: items,
    },
    url: url.format({
      protocol: req.protocol,
      host: req.hostname,
      pathname: req.originalUrl,
    }),
    license: {
      source: settingsApp.repositoryUrl + '/static/license.md',
      title: 'MIT license',
      itemsLicensed: 'description and source code',
    },
  }
}

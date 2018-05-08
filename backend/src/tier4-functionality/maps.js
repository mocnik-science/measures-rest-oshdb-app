const C = require('./../constants')
const {itemForUser} = require('./items')
const settingsApp = require('./../settings')
const {template} = require('./templates')

// MAP //

const mapIndexTemplate = template(C.FILE_MAP_INDEX_TEMPLATE)

module.exports.getMap = (user, port, id) => {
  const json = itemForUser(C.PATH_MEASURES, user, C.MEASURE, id)
  return mapIndexTemplate({
    name: json.name,
    id: json.id,
    url: settingsApp.mapUrl(port),
  })
}

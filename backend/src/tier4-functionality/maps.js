const C = require('./../constants')
const {itemForUser} = require('./items')
const settingsApp = require('./../settings')
const {template} = require('./templates')
const {isLevelPublic} = require('./../tier4-functionality/common')
const {settings} = require('./../tier4-functionality/settings')

// MAP //

const mapIndexTemplate = template(C.FILE_MAP_INDEX_TEMPLATE)

module.exports.getMap = (req, res, user, level) => {
  const json = itemForUser(C.MEASURE, user, req.params.id)
  if (json === null) res.status(404).send('measure not found')
  else {
    res.set('Content-Type', 'text/html')
    res.status(200).send(mapIndexTemplate({
      name: json.name,
      id: json.id,
      url: isLevelPublic(level) ? settingsApp.apiPublic.prefix + settingsApp.apiPublic.main(json.id, C.PORT_PUBLIC_SERVICE) : settingsApp.apiUser.prefix + settingsApp.apiUser.main(json.id, settings(user).port),
    }))
  }
}

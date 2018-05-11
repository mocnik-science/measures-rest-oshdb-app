const C = require('./../constants')
const settingsApp = require('./../settings')
const {isLevelPublic} = require('./../tier4-functionality/common')
const {itemForUser} = require('./../tier4-functionality/items')
const {getMap} = require('./../tier4-functionality/maps')
const {settings} = require('./../tier4-functionality/settings')

module.exports.runRoutesAuthenticatedMap = (use, get, post) => {
  // html map page
  get('/map/:id', (req, res) => {
    res.set('Content-Type', 'text/html')
    res.status(200).send(getMap(req.user, settings(req.user).port, req.params.id))
  })
  
  // map data
  get('/backend/map/:level/:id', (req, res) => {
    const json = itemForUser(C.MEASURE, isLevelPublic(req.params.level) ? null : req.user, req.params.id)
    res.status(200).json({
      measure: json,
      url: settingsApp.mapUrl(settings(req.user).port),
    })
  })
}

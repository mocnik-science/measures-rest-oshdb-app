const C = require('./../constants')
const settingsApp = require('./../settings')
const {isLevelPublic} = require('./../tier4-functionality/common')
const {itemForUser} = require('./../tier4-functionality/items')
const {getMap} = require('./../tier4-functionality/maps')
const {settings} = require('./../tier4-functionality/settings')

module.exports.runRoutesAuthenticatedMap = (use, get, post) => {
  // html map page
  get('/repository/map/:level/:id', (req, res) => getMap(isLevelPublic(req.params.level) ? null : req.user, req.params.level)(req, res))
  
  // map data
  get('/backend/map/:level/:id', (req, res) => {
    const json = itemForUser(C.MEASURE, isLevelPublic(req.params.level) ? null : req.user, req.params.id)
    res.status(200).json({
      measure: json,
      url: isLevelPublic(req.params.level) ? settingsApp.apiPublic.prefix + settingsApp.apiPublic.main(req.params.id, C.PORT_PUBLIC_SERVICE) : settingsApp.apiUser.prefix + settingsApp.apiUser.main(req.params.id, settings(req.user).port),
    })
  })
}

const {getMap} = require('./../tier4-functionality/maps')

module.exports.runRoutesPublicMap = (use, get, post) => {
  // html map page
  get('/repository/map/:id', getMap(null, C.LEVEL_PUBLIC))
}

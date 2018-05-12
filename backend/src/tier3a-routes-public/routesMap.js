const {getMap} = require('./../tier4-functionality/maps')

module.exports.runRoutesPublicMap = (use, get, post) => {
  // html map page
  get('/map/:id', (req, res) => res.status(200).send(getMap(req, res, null, C.LEVEL_PUBLIC)))
}

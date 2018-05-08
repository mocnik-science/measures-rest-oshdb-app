const {getMap} = require('./../tier4-functionality/maps')
const {settings} = require('./../tier4-functionality/settings')

module.exports.runRoutesAuthenticatedMap = (use, get, post) => {
  get('/map/:id', (req, res) => {
    res.set('Content-Type', 'text/html')
    res.status(200).send(getMap(req.user, settings(req.user).port, req.params.id))
  })
}

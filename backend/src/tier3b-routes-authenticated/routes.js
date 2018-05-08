const {runRoutesAuthenticatedItems} = require('./routesItems')
const {runRoutesAuthenticatedMap} = require('./routesMap')
const {runRoutesAuthenticatedService} = require('./routesService')

module.exports.runRoutesAuthenticated = (...param) => {
  runRoutesAuthenticatedItems(...param)
  runRoutesAuthenticatedMap(...param)
  runRoutesAuthenticatedService(...param)
}

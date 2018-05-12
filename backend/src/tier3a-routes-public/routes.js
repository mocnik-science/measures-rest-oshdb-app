const {runRoutesPublicLOD} = require('./routesLOD')
const {runRoutesPublicMap} = require('./routesMap')
const {runRoutesPublicStatic} = require('./routesStatic')
const {runRoutesPublicProduction} = require('./routesProduction')

module.exports.runRoutesPublic = (...param) => {
  runRoutesPublicLOD(...param)
  runRoutesPublicMap(...param)
  runRoutesPublicStatic(...param)
  runRoutesPublicProduction(...param)
}

const {runRoutesPublicLOD} = require('./routesLOD')
const {runRoutesPublicStatic} = require('./routesStatic')
const {runRoutesPublicProduction} = require('./routesProduction')

module.exports.runRoutesPublic = (...param) => {
  runRoutesPublicLOD(...param)
  runRoutesPublicStatic(...param)
  runRoutesPublicProduction(...param)
}

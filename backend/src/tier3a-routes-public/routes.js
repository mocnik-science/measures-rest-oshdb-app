const {runRoutesPublicLOD} = require('./routesLOD')
const {runRoutesPublicStatic} = require('./routesStatic')

module.exports.runRoutesPublic = (...param) => {
  runRoutesPublicLOD(...param)
  runRoutesPublicStatic(...param)
}

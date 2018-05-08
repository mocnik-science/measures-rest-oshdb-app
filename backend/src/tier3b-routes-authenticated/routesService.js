const C = require('./../constants')
const {writeJava} = require('./../tier4-functionality/java')
const {serviceState, serviceCheck, serviceStart, serviceStop} = require('./../tier4-functionality/services')
const {settings} = require('./../tier4-functionality/settings')

let serviceCancel = false
let serviceHasState = null

module.exports.runRoutesAuthenticatedService = (use, get, post) => {
  get('/backend/service/state', (req, res) => {
    res.status(200).json(serviceState(req.user, settings(req.user).port))
  })
  get('/backend/service/check', (req, res) => {
    serviceCheck(req.user, result => res.status(200).json(result))
  })
  get('/backend/service/start', (req, res) => {
    serviceCancel = false
    serviceHasState = C.SERVICE_IS_CHECKING
    writeJava(req.user)
    serviceCheck(req.user, result => {
      const checkSuccess = Object.values(result).filter(x => x !== '').length == 0
      serviceHasState = null
      if (!checkSuccess || serviceCancel) res.status(404).send('could not compile')
      else {
        serviceStart(req.user, settings(req.user).port)
        res.status(200).json(serviceState(req.user, settings(req.user).port))  
      }
    })
  })
  get('/backend/service/stop', (req, res) => {
    serviceStop(req.user)
    res.status(200).json(serviceState(req.user, settings(req.user).port))
  })
}

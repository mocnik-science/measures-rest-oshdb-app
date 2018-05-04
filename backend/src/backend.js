const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs-extra')
const https = require('https')
const passport = require('passport')

const C = require('./constants')
const settingsApp = require('./settings')
const {useAuthentication, User} = require('./functionality/authentication')
const {allItemsShort} = require('./functionality/items')
const {writeJava} = require('./functionality/java')
const {getMap} = require('./functionality/maps')
const {getItems, getItem, postItem, getItemPublic, getItemNew} = require('./functionality/routesItems')
const {serviceState, serviceCheck, serviceStart, serviceStop} = require('./functionality/services')
const {settings} = require('./functionality/settings')

// INIT APP //

const app = express()

const bodyParserJson = bodyParser.json()
app.use((req, res, next) => (req.method == 'POST') ? bodyParserJson(req, res, next): next())

const [get, post] = useAuthentication(app)

// ROUTES //

// authenticate
app.get('/backend/login', (req, res, next) => passport.authenticate(['local', (settingsApp.ldapOptions) ? 'ldapauth' : null], (err, user, info) => {
  if (err) res.status(200).json({username: null})
  else req.logIn(user, err => {
    if (err) res.status(200).json({username: null})
    else res.status(200).json(User.getUserinfo(user))
  })
})(req, res, next))
app.get('/backend/user', (req, res) => res.status(200).json((req.user) ? User.getUserinfo(req.user) : {username: null}))
app.get('/backend/logout', (req, res) => {
  req.logout()
  res.status(200).json((req.user) ? User.getUserinfo(req.user) : {username: null})
})

// context
get('/backend/context/all', getItems(C.PATH_CONTEXTS, C.CONTEXT))
get('/backend/context/id/:level/:id', getItem(C.PATH_CONTEXTS, C.CONTEXT))
post('/backend/context/id/:level/:id', postItem(C.PATH_CONTEXTS, C.CONTEXT))
get('/backend/context/public/:level/:id', getItemPublic(C.PATH_CONTEXTS, C.CONTEXT))
get('/backend/context/new', getItemNew(C.PATH_CONTEXTS, C.CONTEXT, {}))

// measure
get('/backend/measure/all', getItems(C.PATH_MEASURES, C.MEASURE))
get('/backend/measure/id/:level/:id', getItem(C.PATH_MEASURES, C.MEASURE))
post('/backend/measure/id/:level/:id', postItem(C.PATH_MEASURES, C.MEASURE))
get('/backend/measure/public/:level/:id', getItemPublic(C.PATH_MEASURES, C.MEASURE))
get('/backend/measure/new', getItemNew(C.PATH_MEASURES, C.MEASURE, {code: '', enabled: false}))

// person
get('/backend/person/all', getItems(C.PATH_PERSONS, C.PERSON))
get('/backend/person/id/:level/:id', getItem(C.PATH_PERSONS, C.PERSON))
post('/backend/person/id/:level/:id', postItem(C.PATH_PERSONS, C.PERSON))
get('/backend/person/public/:level/:id', getItemPublic(C.PATH_PERSONS, C.PERSON))
get('/backend/person/new', getItemNew(C.PATH_PERSONS, C.PERSON, {}))

// result
get('/backend/result/all', getItems(C.PATH_RESULTS, C.RESULT))
get('/backend/result/id/:level/:id', getItem(C.PATH_RESULTS, C.RESULT))
post('/backend/result/id/:level/:id', postItem(C.PATH_RESULTS, C.RESULT))
get('/backend/result/public/:level/:id', getItemPublic(C.PATH_RESULTS, C.RESULT))
get('/backend/result/new', getItemNew(C.PATH_RESULTS, C.RESULT, {}))

// metadataItems
get('/backend/items', (req, res) => {
  const data = {}
  for (const i of C.ITEMS) data[`${i.item}s`] = allItemsShort(i.path, req.user).concat(allItemsShort(i.path, null))
  res.status(200).json(data)
})

// service
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

// map
get('/map/:id', (req, res) => {
  res.set('Content-Type', 'text/html')
  res.status(200).send(getMap(req.user, settings(req.user).port, req.params.id))
})

// static
app.use('/static/vs', express.static('./../frontend/node_modules/monaco-editor/min/vs'))
app.use('/static/libs', express.static('./../backend/libs'))
app.use('/static/help', express.static('./../backend/help'))

if (!C.DEVELOPMENT) {
  app.use('/', express.static('./../frontend/build'))
  app.use('*', express.static('./../frontend/build/index.html'))
}

if (C.HTTPS) {
  https.createServer({
    key: fs.readFileSync(C.KEY),
    cert: fs.readFileSync(C.CERT),
  }, app).listen(C.PORT)
} else {
  app.set('port', C.PORT)
  app.listen(app.get('port'))
}

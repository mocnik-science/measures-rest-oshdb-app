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
const {getItems, getItem, postItem, getItemDependencies, getItemPublic, getItemNew} = require('./functionality/routesItems')
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

// items
for (const i of C.ITEMS) {
  get(`/backend/${i.item}/all`, getItems(i.path, i.item))
  get(`/backend/${i.item}/id/:level/:id`, getItem(i.path, i.item))
  post(`/backend/${i.item}/id/:level/:id`, postItem(i.path, i.item))
  // get(`/backend/${i.item}/dependencies/:level/:id`, getItemDependencies(i.path, i.item))
  get(`/backend/${i.item}/public/:level/:id`, getItemPublic(i.path, i.item))
  get(`/backend/${i.item}/new`, getItemNew(i.path, i.item, i.dataNew))
}

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

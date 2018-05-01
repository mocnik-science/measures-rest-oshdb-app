const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs-extra')
const handlebars = require('handlebars')
const https = require('https')
const {join, resolve} = require('path')
const os = require('os')
const passport = require('passport')
const localPassportStrategy = require('passport-local').Strategy
const ldapStrategy = require('passport-ldapauth')
const session = require('express-session')
const {spawn, spawnSync} = require('child_process')

const settingsApp = require('./settings')

const PATH_SERVICE = './../../measures-rest-oshdb-docker'
const PATH_DATA = './../../measures-rest-oshdb-data'
const PATH_USERS = `${PATH_DATA}/users`
const PATH_DBS = `${PATH_DATA}/dbs`
const PATH_JAVA = 'java'
const PATH_CONTEXTS = 'contexts'
const PATH_MEASURES = 'measures'
const PATH_PERSONS = 'persons'
const PATH_RESULTS = 'results'
const FILE_SETTINGS = 'settings.json'
const CMD_SERVICE_REACHABLE = 'curl --max-time .25'
const CMD_SERVICE_STATE = './state'
const CMD_SERVICE_CHECK = './check'
const CMD_SERVICE_LOGS = './logs'
const CMD_SERVICE_START = './start'
const CMD_SERVICE_STOP = './stop'
const PATH_TEMPLATES = './templates'
const FILE_JAVA_TEMPLATE = `${PATH_TEMPLATES}/java.tmpl`
const FILE_JAVA_RUN_TEMPLATE = `${PATH_TEMPLATES}/javaRun.tmpl`
const FILE_MAP_INDEX_TEMPLATE = `${PATH_TEMPLATES}/map.tmpl`
const HOST_SERVICE = 'localhost'
const PORT_SERVICE = 14242
const KEY = join(os.homedir(), '.cert/key.pem')
const CERT = join(os.homedir(), '.cert/cert.pem')
const NEW_ITEM = 'new'

const DEVELOPMENT = (process.env.DEVELOPMENT != undefined) ? (process.env.DEVELOPMENT == 'true') : true
const PORT = (process.env.PORT) ? process.env.PORT : (DEVELOPMENT) ? 3001 : 443
const HTTPS = (process.env.HTTPS != undefined) ? (process.env.HTTPS == 'true') : !DEVELOPMENT

const app = express()

const bodyParserJson = bodyParser.json()
app.use((req, res, next) => (req.method == 'POST') ? bodyParserJson(req, res, next): next())

// AUTHENTICATION

const requireAuth = (req, res, next) => {
  if (req.user) return next()
  return res.status(403).send('forbidden')
}

const get = (route, ...xs) => app.get(route, requireAuth, ...xs)
const post = (route, ...xs) => app.post(route, requireAuth, ...xs)

passport.use(new localPassportStrategy((username, password, done) => {
  const usernames = settingsApp.localUsers()
  if (usernames[username] !== undefined && usernames[username] === password) {
    const u = User.fromLocal(username)
    if (!fs.existsSync(`${PATH_USERS}/${u.username()}`)) fs.mkdirSync(`${PATH_USERS}/${u.username()}`)
    return done(null, u)
  }
  return done(null, false, {})
}))
passport.use(new ldapStrategy(settingsApp.ldapOptions(), (user, done) => {
  const u = User.fromLdap(user)
  if (!fs.existsSync(`${PATH_USERS}/${u.username()}`)) fs.mkdirSync(`${PATH_USERS}/${u.username()}`)
  done(null, u)
}))

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((id, done) => done(null, id))

app.use(session({
  secret: 'un9ßq9^ac%§8x"mixaü',
  resave: false,
  saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())

// USER

class User {
  constructor() {
    this._userinfo = null
  }
  
  static fromUserinfo(userinfo) {
    const u = new this
    u._userinfo = userinfo
    return u
  }
  
  static fromLocal(x) {
    const u = new this;
    u._userinfo = {username: x}
    return u
  }
  
  static fromLdap(x) {
    const u = new this;
    u._userinfo = {}
    u._userinfo.username = x.cn
    u._userinfo.fullname = x.displayName
    u._userinfo.surname = x.sn
    u._userinfo.forename = x.givenName
    return u
  }
  
  static getUserinfo(u) {
    return (u && '_userinfo' in u) ? User.fromUserinfo(u._userinfo).userinfo() : {username: null}
  }
  
  static getUsername(u) {
    return (u && '_userinfo' in u) ? User.fromUserinfo(u._userinfo).username() : {username: null}
  }

  userinfo() {
    return this._userinfo
  }

  username() {
    return this.userinfo().username
  }
}

// HELPING FUNCTIONS

// ids and names
const name2id = id => id.replace(/[\s-_]+(\w)/g, (match, p, offset) => `-${p}`).toLowerCase()
const className = id => `Measure${id.replace(/^([a-z])|-([a-z])/g, (match, p1, p2, offset) => p1 ? p1.toUpperCase() : p2.toUpperCase())}`

// common
const idToFilename = (id, ext='json') => `${className(id)}.${ext}`
const idToPathUserFilename = (user, id, path='', ext='json') => {
  if (path !== '') {
    const p = pathUser(user, path)
    if (!fs.existsSync(p)) fs.mkdirSync(p)
  }
  return pathUser(user, path, idToFilename(id, ext))
}
const pathUser = (user, ...path) => `${PATH_USERS}/${User.getUsername(user)}/${join(...path)}`
const pathUserAbsolute = (user, ...path) => resolve(pathUser(user, ...path))
const dirUser = (user, ...path) => {
  const p = pathUser(user, ...path)
  if (!fs.existsSync(p)) fs.mkdirSync(p)
  return p
}
const itemForUser = (path, user, id) => {
  if (!id) return null
  const filename = idToPathUserFilename(user, id, path)
  return (!fs.existsSync(filename) || !fs.statSync(filename).isFile()) ? null : JSON.parse(fs.readFileSync(filename))
}
const saveItem = (path, user, id, json) => fs.writeFileSync(idToPathUserFilename(user, id, path), JSON.stringify(json))
const moveItem = (path, user, idOld, idNew) => {
  const filenameNew = idToPathUserFilename(user, idNew, path)
  if (fs.existsSync(filenameNew)) return false
  fs.renameSync(idToPathUserFilename(user, idOld, path), filenameNew)
  return true
}
const allItems = (path, user) => fs.readdirSync(dirUser(user, path))
  .filter(filename => filename.endsWith('.json'))
  .filter(filename => ![FILE_SETTINGS].includes(filename))
  .map(filename => JSON.parse(fs.readFileSync(pathUser(user, path, filename))))
const settings = user => {
  const filename = pathUser(user, FILE_SETTINGS)
  if (!fs.existsSync(filename)) fs.writeFileSync(filename, JSON.stringify({
    port: Math.max(PORT_SERVICE, ...allSettings().map(json => json.port)) + 1
  }))
  return JSON.parse(fs.readFileSync(filename))
}
const allSettings = () => fs.readdirSync(PATH_USERS)
  .filter(pathname => !pathname.startsWith('.'))
  .filter(pathname => fs.existsSync(`${PATH_USERS}/${pathname}/${FILE_SETTINGS}`))
  .map(pathname => JSON.parse(fs.readFileSync(`${PATH_USERS}/${pathname}/${FILE_SETTINGS}`)))
const removeJavaDir = user => fs.removeSync(pathUser(user, PATH_JAVA))
const saveJava = (user, name, code) => fs.writeFileSync(pathUser(user, PATH_JAVA, name), code)
const saveJavaMeasure = (user, id, code) => fs.writeFileSync(idToPathUserFilename(user, id, PATH_JAVA, 'java'), code)

// services
let serviceHasState = null
let serviceCancel = false
const SERVICE_IS_CHECKING = 'checking code ...'
const SERVICE_IS_STARTING = 'service starting ...'
const SERVICE_IS_STARTED = 'service started'
const SERVICE_IS_STOPPED = 'service stopped'
const portReachable = (host, port) => (spawnSync(`${CMD_SERVICE_REACHABLE} http://${host}:${port}`, {shell: true}).status == 0)
const serviceState = (user, port) => {
  const running = [SERVICE_IS_CHECKING, SERVICE_IS_STARTING, SERVICE_IS_STARTED].includes(serviceHasState) || spawnSync(`${CMD_SERVICE_STATE} ${User.getUsername(user)}`, {cwd: PATH_SERVICE, shell: true}).status == 0
  let logs = null
  if (running) {
    const ls = spawnSync(`${CMD_SERVICE_LOGS} ${User.getUsername(user)}`, {cwd: PATH_SERVICE, shell: true}).stderr.toString()
    const lsArray = ls.split('\n').reverse()
    const logsArray = []
    for (let lArray of lsArray) {
      if (lArray.startsWith('[INFO] ') || lArray.endsWith(' java.util.logging.LogManager$RootLogger log') || lArray.startsWith('SEVERE: Failed to resolve default logging config file: config/java.util.logging.properties') || lArray.startsWith('http://')) break
      logsArray.push(lArray)
    }
    logs = logsArray.reverse().join('\n')
  }
  return {
    serviceRunning: running,
    serviceState: (serviceHasState) ? serviceHasState : ((running) ? (portReachable(HOST_SERVICE, port) ? SERVICE_IS_STARTED : SERVICE_IS_STARTING) : SERVICE_IS_STOPPED),
    serviceLogs: logs,
  }
}
const serviceCheck = (user, callback) => {
  const s = spawn(`${CMD_SERVICE_CHECK} ${User.getUsername(user)} ${pathUserAbsolute(user, PATH_JAVA)}`, {cwd: PATH_SERVICE, shell: true})
  let out = ''
  s.stdout.on('data', outCmd => out += outCmd.toString())
  s.on('close', code => {
    const files = allItems(PATH_MEASURES, user).map(json => {
      const a = idToPathUserFilename(user, json.id, PATH_JAVA, 'java').split('/')
      return [json.id, a[a.length - 1]]
    })
    const result = {}
    for (const json of allItems(PATH_MEASURES, user)) if (json.enabled) result[json.id] = ''
    for (const l of out.split('\n')) for (const file of files)
      if (result[file[0]] !== undefined && ~l.indexOf(file[1])) result[file[0]] = ((result[file[0]]) ? result[file[0]] : '') + l + '\n'
    callback(result)
  })
}
const serviceStart = (user, port) => spawnSync(`${CMD_SERVICE_START} ${User.getUsername(user)} ${pathUserAbsolute(user, PATH_JAVA)} ${port}`, {cwd: PATH_SERVICE, shell: true})
const serviceStop = user => {
  serviceCancel = true
  spawnSync(`${CMD_SERVICE_STOP} ${User.getUsername(user)}`, {cwd: PATH_SERVICE, shell: true})
}

// templates
const readTemplate = t => handlebars.compile(fs.readFileSync(t, 'utf-8'))
const javaTemplate = readTemplate(FILE_JAVA_TEMPLATE)
const javaRunTemplate = readTemplate(FILE_JAVA_RUN_TEMPLATE)
const mapIndexTemplate = readTemplate(FILE_MAP_INDEX_TEMPLATE)
const useTemplate = (template, data) => {
  const data2 = {}
  for (let d of Object.keys(data)) data2[d] = (typeof data[d] == 'string') ? new handlebars.SafeString(data[d]) : data[d]
  return template(data2)
}
const writeJava = user => {
  const jsons = allItems(PATH_MEASURES, user)
  removeJavaDir(user)
  jsons.filter(json => json.enabled).map(json => {
    saveJavaMeasure(user, json.id, useTemplate(javaTemplate, {
      id: json.id,
      className: className(json.id),
      code: json.code.replace(/^\s*import\s.+\n?/gm, ''),
      imports: json.code.split('\n').filter(s => s.match(/^\s*import\s.+/)).join('\n'),
    }))
  })
  saveJava(user, 'Run.java', useTemplate(javaRunTemplate, {
    measures: jsons.filter(json => json.enabled).map(json => ({className: className(json.id)})),
    databaseFile: `/data/dbs/sweden_20180112_z12_keytable.oshdb`,
  }))
}
const getMap = (user, port, id) => {
  const json = itemForUser(PATH_MEASURES, user, id)
  return useTemplate(mapIndexTemplate, {
    name: json.name,
    id: json.id,
    url: settingsApp.mapUrl(port),
  })
}

// ROUTES

// authenticate
app.get('/backend/login', (req, res, next) => passport.authenticate(['local', 'ldapauth'], (err, user, info) => {
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

// item
const getItems = (path, item) => (req, res) => {
  const items = {}
  for (const json of allItems(path, req.user)) items[json.id] = json
  res.status(200).json({[`${item}s`]: items})
}
const getItem = (path, item) => (req, res) => {
  const json = itemForUser(path, req.user, req.params.id)
  if (json == null) res.status(404).send(`${item} not found`)
  else res.status(200).json(json)
}
const postItem = (path, item) => (req, res) => {
  const json = itemForUser(path, req.user, req.params.id)
  if (json == null) res.status(404).send(`${item} not found`)
  else {
    const data = req.body
    if (json.timestamp >= data.timestamp) res.status(200).json({success: true})
    else {
      json.timestamp = data.timestamp
      if (data.data.name && json.name !== data.data.name) {
        json.id = name2id(data.data.name)
        if (!moveItem(path, req.user, req.params.id, json.id)) return res.status(200).json({success: false, messages: {nameError: `A ${item} with a very similar (or same) name already exists.`}})
      }
      const jsonNew = Object.assign(json, data.data)
      saveItem(path, req.user, json.id, jsonNew)
      res.status(200).json({success: true})
    }
  }
}
const getItemNew = (path, item, data) => (req, res) => {
  let i = 0
  let name = null
  while (name === null || itemForUser(path, req.user, name2id(name)) !== null) name = `${NEW_ITEM} ${item} ${++i}`
  saveItem(path, req.user, name2id(name), Object.assign({
    id: name2id(name),
    name: name,
    enabled: false,
  }, data))
  const items = {}
  for (const json of allItems(path, req.user)) items[json.id] = json
  res.status(200).json({[`${item}s`]: items})
}

// context
get('/backend/contexts', getItems(PATH_CONTEXTS, 'context'))
get('/backend/context/id/:id', getItem(PATH_CONTEXTS, 'context'))
post('/backend/context/id/:id', postItem(PATH_CONTEXTS, 'context'))
get('/backend/context/new', getItemNew(PATH_CONTEXTS, 'context', {}))

// measure
get('/backend/measures', getItems(PATH_MEASURES, 'measure'))
get('/backend/measure/id/:id', getItem(PATH_MEASURES, 'measure'))
post('/backend/measure/id/:id', postItem(PATH_MEASURES, 'measure'))
get('/backend/measure/new', getItemNew(PATH_MEASURES, 'measure', {code: ''}))

// person
get('/backend/persons', getItems(PATH_PERSONS, 'person'))
get('/backend/person/id/:id', getItem(PATH_PERSONS, 'person'))
post('/backend/person/id/:id', postItem(PATH_PERSONS, 'person'))
get('/backend/person/new', getItemNew(PATH_PERSONS, 'person', {}))

// result
get('/backend/results', getItems(PATH_RESULTS, 'result'))
get('/backend/result/id/:id', getItem(PATH_RESULTS, 'result'))
post('/backend/result/id/:id', postItem(PATH_RESULTS, 'result'))
get('/backend/result/new', getItemNew(PATH_RESULTS, 'result', {}))

// service
get('/backend/service/state', (req, res) => {
  res.status(200).json(serviceState(req.user, settings(req.user).port))
})
get('/backend/service/check', (req, res) => {
  serviceCheck(req.user, result => res.status(200).json(result))
})
get('/backend/service/start', (req, res) => {
  serviceCancel = false
  serviceHasState = SERVICE_IS_CHECKING
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
app.use('/static/manual', express.static('./../backend/manual'))

if (!DEVELOPMENT) {
  app.use('/', express.static('./../frontend/build'))
  app.use('*', express.static('./../frontend/build/index.html'))
}

if (HTTPS) {
  https.createServer({
    key: fs.readFileSync(KEY),
    cert: fs.readFileSync(CERT),
  }, app).listen(PORT)
} else {
  app.set('port', PORT)
  app.listen(app.get('port'))
}

const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const handlebars = require('handlebars')
const https = require('https')
const {join} = require('path')
const os = require('os')
const passport = require('passport')
const localPassportStrategy = require('passport-local').Strategy
const session = require('express-session')
const {spawn, spawnSync} = require('child_process')

const PATH_SERVICE = './../../measures-rest-oshdb-docker'
const PATH_USER = './../../measures-rest-oshdb-users'
const PATH_JAVA = 'java'
const PATH_MEASURES = 'measures'
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
const NEW_MEASURE = 'new measure'

const DEVELOPMENT = process.env.DEVELOPMENT || true

const app = express()
app.set('port', process.env.PORT || 3001)

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
  const usernames = {
    'franz-benjamin': 'hello',
    'fb': 'hello',
  }
  if (usernames[username] !== undefined && usernames[username] === password) {
    if (!fs.existsSync(`${PATH_USER}/${username}`)) fs.mkdirSync(`${PATH_USER}/${username}`)
    return done(null, username)
  }
  return done(null, false, {})
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

// HELPING FUNCTIONS

// ids and names
const name2id = id => id.replace(/[\s-_]+(\w)/g, (match, p, offset) => `-${p}`).toLowerCase()
const className = id => `Measure${id.replace(/^([a-z])|-([a-z])/g, (match, p1, p2, offset) => p1 ? p1.toUpperCase() : p2.toUpperCase())}`

// common
const idToFilename = (id, ext='json') => `${className(id)}.${ext}`
const idToPathUserFilename = (username, id, path='', ext='json') => pathUser(username, path, idToFilename(id, ext))
const pathUser = (username, ...path) => `${PATH_USER}/${username}/${join(...path)}`
const measureForId = (username, id) => {
  if (!id) return null
  const filename = idToPathUserFilename(username, id, PATH_MEASURES)
  return (!fs.existsSync(filename) || !fs.statSync(filename).isFile()) ? null : JSON.parse(fs.readFileSync(filename))
}
const saveMeasure = (username, id, json) => fs.writeFileSync(idToPathUserFilename(username, id, PATH_MEASURES), JSON.stringify(json))
const allMeasures = username => fs.readdirSync(`${PATH_USER}/${username}/${PATH_MEASURES}`)
  .filter(filename => filename.endsWith('.json'))
  .filter(filename => ![FILE_SETTINGS].includes(filename))
  .map(filename => JSON.parse(fs.readFileSync(pathUser(username, PATH_MEASURES, filename))))
const settings = username => {
  const filename = pathUser(username, FILE_SETTINGS)
  if (!fs.existsSync(filename)) fs.writeFileSync(filename, JSON.stringify({
    port: Math.max(PORT_SERVICE, ...allSettings().map(json => json.port)) + 1
  }))
  return JSON.parse(fs.readFileSync(filename))
}
const allSettings = () => fs.readdirSync(PATH_USER)
  .filter(pathname => !pathname.startsWith('.'))
  .filter(pathname => fs.existsSync(`${PATH_USER}/${pathname}/${FILE_SETTINGS}`))
  .map(pathname => JSON.parse(fs.readFileSync(`${PATH_USER}/${pathname}/${FILE_SETTINGS}`)))
const saveJava = (username, name, code) => fs.writeFileSync(pathUser(username, PATH_JAVA, name), code)
const saveJavaMeasure = (username, id, code) => fs.writeFileSync(idToPathUserFilename(username, id, PATH_JAVA, 'java'), code)

// services
let serviceHasState = null
let serviceCancel = false
const SERVICE_IS_CHECKING = 'checking code ...'
const SERVICE_IS_STARTING = 'service starting ...'
const SERVICE_IS_STARTED = 'service started'
const SERVICE_IS_STOPPED = 'service stopped'
const portReachable = (host, port) => (spawnSync(`${CMD_SERVICE_REACHABLE} http://${host}:${port}`, {shell: true}).status == 0)
const serviceState = username => {
  const running = [SERVICE_IS_CHECKING, SERVICE_IS_STARTING, SERVICE_IS_STARTED].includes(serviceHasState) || spawnSync(`${CMD_SERVICE_STATE} ${username}`, {cwd: PATH_SERVICE, shell: true}).status == 0
  let logs = null
  if (running) {
    const ls = spawnSync(`${CMD_SERVICE_LOGS} ${username}`, {cwd: PATH_SERVICE, shell: true}).stderr.toString()
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
    serviceState: (serviceHasState) ? serviceHasState : ((running) ? (portReachable(HOST_SERVICE, PORT_SERVICE) ? SERVICE_IS_STARTED : SERVICE_IS_STARTING) : SERVICE_IS_STOPPED),
    serviceLogs: logs,
  }
}
const serviceCheck = (username, callback) => {
  const s = spawn(`${CMD_SERVICE_CHECK} ${username} ${PATH_USER}/${username}/${PATH_JAVA}`, {cwd: PATH_SERVICE, shell: true})
  let out = ''
  s.stdout.on('data', outCmd => out += outCmd.toString())
  s.on('close', code => {
    const files = allMeasures(username).map(json => {
      const a = idToPathUserFilename(username, json.id, PATH_JAVA, 'java').split('/')
      return [json.id, a[a.length - 1]]
    })
    const result = {}
    for (const json of allMeasures(username)) if (json.active) result[json.id] = ''
    for (const l of out.split('\n')) for (const file of files)
      if (result[file[0]] !== undefined && ~l.indexOf(file[1])) result[file[0]] = ((result[file[0]]) ? result[file[0]] : '') + l + '\n'
    callback(result)
  })
}
const serviceStart = (username, port) => spawnSync(`${CMD_SERVICE_START} ${username} ${PATH_USER}/${username}/${PATH_JAVA} ${port}`, {cwd: PATH_SERVICE, shell: true})
const serviceStop = username => {
  serviceCancel = true
  spawnSync(`${CMD_SERVICE_STOP} ${username}`, {cwd: PATH_SERVICE, shell: true})
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
const writeJava = username => {
  const jsons = allMeasures(username)
  jsons.map(json => {
    saveJavaMeasure(username, json.id, useTemplate(javaTemplate, {
      id: json.id,
      className: className(json.id),
      code: json.code.replace(/^\s*import\s.+\n?/gm, ''),
      imports: json.code.split('\n').filter(s => s.match(/^\s*import\s.+/)).join('\n'),
    }))
  })
  saveJava(username, 'Run.java', useTemplate(javaRunTemplate, {
    measures: jsons.filter(json => json.active).map(json => ({className: className(json.id)})),
    databaseFile: '/data/dbs/sweden_20180112_z12_keytable.oshdb',
  }))
}
const getMap = (username, port, id) => {
  const json = measureForId(username, id)
  return useTemplate(mapIndexTemplate, {
    name: json.name,
    id: json.id,
    portService: port,
  })
}

// ROUTES

// authenticate
app.get('/backend/login', (req, res, next) => passport.authenticate('local', (err, user, info) => {
  if (err) res.status(200).json({username: null})
  else req.logIn(user, err => {
    if (err) res.status(200).json({username: null})
    else res.status(200).json({username: req.user})
  })
})(req, res, next))
app.get('/backend/user', (req, res) => res.status(200).json({username: req.user ? req.user : null}))
app.get('/backend/logout', (req, res) => {
  req.logout()
  res.status(200).json({username: req.user})
})

// measures
get('/backend/measures', (req, res) => {
  const measures = {}
  for (const json of allMeasures(req.user)) measures[json.id] = json
  res.status(200).json({measures: measures})
})

// measure
get('/backend/measure/id/:id', (req, res) => {
  const json = measureForId(req.user, req.params.id)
  if (json == null) res.status(404).send('measure not found')
  else res.status(200).json(json)
})
post('/backend/measure/id/:id', (req, res) => {
  const json = measureForId(req.user, req.params.id)
  if (json == null) res.status(404).send('measure not found')
  else {
    const data = req.body
    if (json.timestamp >= data.timestamp) res.status(200).json({success: true})
    else {
      json.timestamp = data.timestamp
      const jsonNew = Object.assign(json, data.data)
      saveMeasure(req.user, req.params.id, jsonNew)
      res.status(200).json({success: true})
    }
  }
})
get('/backend/measure/new', (req, res) => {
  let i = 0
  let name = null
  while (name === null || measureForId(req.user, name2id(name)) !== null) name = `${NEW_MEASURE} ${++i}`
  saveMeasure(req.user, name2id(name), {
    id: name2id(name),
    name: name,
    code: '',
    active: false,
  })
  const measures = {}
  for (const json of allMeasures(req.user)) measures[json.id] = json
  res.status(200).json({measures: measures})
})

// service
get('/backend/service/state', (req, res) => {
  res.status(200).json(serviceState(req.user))
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
      res.status(200).json(serviceState(req.user))  
    }
  })
})
get('/backend/service/stop', (req, res) => {
  serviceStop(req.user)
  res.status(200).json(serviceState(req.user))
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

if (DEVELOPMENT) app.use('/', express.static('./../frontend/build'))

if (DEVELOPMENT) app.listen(app.get('port'))
else {
  https.createServer({
    key: fs.readFileSync(KEY),
    cert: fs.readFileSync(CERT),
  }, app).listen(433)
}

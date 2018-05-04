const os = require('os')
const {join} = require('path')

module.exports = C = {}

C.PATH_SERVICE = './../../measures-rest-oshdb-docker'
C.PATH_DATA = './../../measures-rest-oshdb-data'
C.PATH_USERS = `${C.PATH_DATA}/users`
C.PATH_PUBLIC = `${C.PATH_DATA}/public`
C.PATH_DBS = `${C.PATH_DATA}/dbs`
C.PATH_JAVA = 'java'
C.PATH_CONTEXTS = 'contexts'
C.PATH_MEASURES = 'measures'
C.PATH_PERSONS = 'persons'
C.PATH_RESULTS = 'results'
C.FILE_SETTINGS = 'settings.json'
C.CMD_SERVICE_REACHABLE = 'curl --max-time .25'
C.CMD_SERVICE_STATE = './state'
C.CMD_SERVICE_CHECK = './check'
C.CMD_SERVICE_LOGS = './logs'
C.CMD_SERVICE_START = './start'
C.CMD_SERVICE_STOP = './stop'
C.PATH_TEMPLATES = './templates'
C.FILE_JAVA_TEMPLATE = `${C.PATH_TEMPLATES}/java.tmpl`
C.FILE_JAVA_RUN_TEMPLATE = `${C.PATH_TEMPLATES}/javaRun.tmpl`
C.FILE_MAP_INDEX_TEMPLATE = `${C.PATH_TEMPLATES}/map.tmpl`
C.HOST_SERVICE = 'localhost'
C.PORT_SERVICE = 14242
C.KEY = join(os.homedir(), '.cert/key.pem')
C.CERT = join(os.homedir(), '.cert/cert.pem')
C.NEW_ITEM = 'new'

C.DEVELOPMENT = (process.env.DEVELOPMENT != undefined) ? (process.env.DEVELOPMENT == 'true') : true
C.PORT = (process.env.PORT) ? process.env.PORT : (C.DEVELOPMENT) ? 3001 : 443
C.HTTPS = (process.env.HTTPS != undefined) ? (process.env.HTTPS == 'true') : !C.DEVELOPMENT

C.LEVEL_PUBLIC = 'public'
C.LEVEL_USER = 'user'

C.CONTEXT = 'context'
C.MEASURE = 'measure'
C.PERSON = 'person'
C.RESULT = 'result'
C.ITEMS = [
  {item: C.CONTEXT, path: C.PATH_CONTEXTS},
  {item: C.MEASURE, path: C.PATH_MEASURES},
  {item: C.PERSON, path: C.PATH_PERSONS},
  {item: C.RESULT, path: C.PATH_RESULTS},
]

C.SERVICE_IS_CHECKING = 'checking code ...'
C.SERVICE_IS_STARTING = 'service starting ...'
C.SERVICE_IS_STARTED = 'service started'
C.SERVICE_IS_STOPPED = 'service stopped'

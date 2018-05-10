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
C.PATH_POM_XML = `${C.PATH_SERVICE}/docker/files/pom.xml`
C.FILE_JAVA_MEASURE_TEMPLATE = `${C.PATH_TEMPLATES}/javaMeasure.java.handlebars`
C.FILE_JAVA_RUN_TEMPLATE = `${C.PATH_TEMPLATES}/javaRun.java.handlebars`
C.FILE_MAP_INDEX_TEMPLATE = `${C.PATH_TEMPLATES}/map.html.handlebars`
C.FILE_DOWNLOAD_README_TEMPLATE = `${C.PATH_TEMPLATES}/README.md.handlebars`
C.FILE_DOWNLOAD_ERROR_TEMPLATE = `${C.PATH_TEMPLATES}/ERROR.md.handlebars`
C.PATH_TEMPLATES_LOD_VIEWS = './templates-lod'
C.PATH_TEMPLATES_LOD_LAYOUTS = './templates-lod/layouts'
C.PATH_TEMPLATES_LOD_PARTIALS = './templates-lod/partials'
C.PATH_TEMPLATES_LOD_STATIC = './templates-lod/static'
C.REPOSITORY_NAME_LONG = 'OSM Measure Repository'
C.REPOSITORY_NAME_SHORT = 'OSM Measure Repo'
C.REPOSITORY_NAMESPACES = {
  // dcterms: 'http://purl.org/dc/terms/',
  // foaf: 'http://xmlns.com/foaf/0.1/',
  // geo: 'http://www.opengis.net/ont/geosparql#',
  // owl: 'http://www.w3.org/2002/07/owl#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  // xsd: 'http://www.w3.org/2001/XMLSchema#',
  dq: 'http://purl.org/data-quality#',
  osmdq: 'http://purl.org/osm-data-quality#',
}
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

C.MEASURE = 'measure'
C.RESULT = 'result'
C.CONTEXT = 'context'
C.PERSON = 'person'
C.ITEMS = [
  {itemName: C.MEASURE, path: C.PATH_MEASURES, name: 'measures', dataNew: {code: '', enabled: false}},
  {itemName: C.RESULT, path: C.PATH_RESULTS, name: 'results', dataNew: {}},
  {itemName: C.CONTEXT, path: C.PATH_CONTEXTS, name: 'contexts', dataNew: {}},
  {itemName: C.PERSON, path: C.PATH_PERSONS, name: 'people', dataNew: {}},
]

C.SERVICE_IS_CHECKING = 'checking code ...'
C.SERVICE_IS_STARTING = 'service starting ...'
C.SERVICE_IS_STARTED = 'service started'
C.SERVICE_IS_STOPPED = 'service stopped'

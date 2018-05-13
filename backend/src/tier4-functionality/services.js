const {spawn, spawnSync} = require('child_process')

const C = require('./../constants')
const {idToPathUserFilename, pathUserAbsolute} = require('./common')
const {allItems} = require('./items')

// SERVICES //

let serviceHasState = null
let serviceCancel = false

const portReachable = (host, port) => spawnSync(`${C.CMD_SERVICE_REACHABLE} http://${host}:${port}`, {shell: true}).status == 0

module.exports.serviceState = (user, port) => {
  const running = [C.SERVICE_IS_CHECKING, C.SERVICE_IS_STARTING, C.SERVICE_IS_STARTED].includes(serviceHasState) || spawnSync(`${C.CMD_SERVICE_STATE} ${user.username()}`, {cwd: C.PATH_SERVICE, shell: true}).status == 0
  let logs = null
  if (running) {
    const ls = spawnSync(`${C.CMD_SERVICE_LOGS} ${user.username()}`, {cwd: C.PATH_SERVICE, shell: true}).stderr.toString()
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
    serviceState: (serviceHasState) ? serviceHasState : ((running) ? (portReachable(C.HOST_SERVICE, port) ? C.SERVICE_IS_STARTED : C.SERVICE_IS_STARTING) : C.SERVICE_IS_STOPPED),
    serviceLogs: logs,
  }
}

module.exports.serviceCheck = (user, callback) => {
  const s = spawn(`${C.CMD_SERVICE_CHECK} ${user.username()} ${pathUserAbsolute(user, C.PATH_JAVA)}`, {cwd: C.PATH_SERVICE, shell: true})
  let out = ''
  s.stdout.on('data', outCmd => out += outCmd.toString())
  s.on('close', code => {
    const files = allItems(C.MEASURE.path, user).map(json => {
      const a = idToPathUserFilename(C.MEASURE, user, json.id, C.PATH_JAVA, 'java').split('/')
      return [json.id, a[a.length - 1]]
    })
    const result = {}
    for (const json of allItems(C.MEASURE.path, user)) if (json.enabled) result[json.id] = ''
    for (const l of out.split('\n')) for (const file of files)
      if (result[file[0]] !== undefined && ~l.indexOf(file[1])) result[file[0]] = ((result[file[0]]) ? result[file[0]] : '') + l + '\n'
    callback(result)
  })
}

module.exports.serviceStart = (user, port) => spawnSync(`${C.CMD_SERVICE_START} ${user.username()} ${pathUserAbsolute(user, C.PATH_JAVA)} ${port}`, {cwd: C.PATH_SERVICE, shell: true})

module.exports.serviceStop = user => {
  serviceCancel = true
  spawnSync(`${C.CMD_SERVICE_STOP} ${user.username()}`, {cwd: C.PATH_SERVICE, shell: true})
}

module.exports.servicePublicStart = () => spawnSync(`${C.CMD_SERVICE_PUBLIC_START} ${pathUserAbsolute(null, C.PATH_JAVA)}`, {cwd: C.PATH_SERVICE, shell: true})

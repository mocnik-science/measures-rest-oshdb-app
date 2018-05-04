const fs = require('fs-extra')

const C = require('./../constants')

// SETTINGS //

module.exports.settings = user => {
  const filename = pathUser(user, C.FILE_SETTINGS)
  if (!fs.existsSync(filename)) fs.writeFileSync(filename, JSON.stringify({
    port: Math.max(C.PORT_SERVICE, ...allSettings().map(json => json.port)) + 1,
  }))
  return JSON.parse(fs.readFileSync(filename))
}

module.exports.allSettings = () => fs.readdirSync(C.PATH_USERS)
  .filter(pathname => !pathname.startsWith('.'))
  .filter(pathname => fs.existsSync(`${C.PATH_USERS}/${pathname}/${C.FILE_SETTINGS}`))
  .map(pathname => JSON.parse(fs.readFileSync(`${C.PATH_USERS}/${pathname}/${C.FILE_SETTINGS}`)))

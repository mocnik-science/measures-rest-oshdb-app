const fs = require('fs-extra')

const C = require('./../constants')
const {generateGuid, idToPathUserFilename, pathUser, dirUser} = require('./common')

// ITEMS //

module.exports.itemForUser = itemForUser = (path, user, itemName, id) => {
  if (!id) return null
  const filename = idToPathUserFilename(user, itemName, id, path)
  return (!fs.existsSync(filename) || !fs.statSync(filename).isFile()) ? null : JSON.parse(fs.readFileSync(filename))
}

module.exports.saveItem = (path, user, itemName, id, json) => {
  const jsonOld = itemForUser(path, user, itemName, id)
  fs.writeFileSync(idToPathUserFilename(user, itemName, id, path), JSON.stringify(Object.assign(json, {hashid: (jsonOld) ? jsonOld.hashid : generateGuid()})))
}

module.exports.moveItem = (path, user, itemName, idOld, idNew) => {
  const filenameNew = idToPathUserFilename(user, itemName, idNew, path)
  if (fs.existsSync(filenameNew)) return false
  fs.renameSync(idToPathUserFilename(user, itemName, idOld, path), filenameNew)
  return true
}

module.exports.moveItemToPublic = (path, user, itemName, id) => {
  const filenameNew = idToPathUserFilename(null, itemName, id, path)
  if (fs.existsSync(filenameNew)) return false
  fs.renameSync(idToPathUserFilename(user, itemName, id, path), filenameNew)
  return true
}

module.exports.allItems = allItems = (path, user) => fs.readdirSync(dirUser(user, path))
  .filter(filename => filename.endsWith('.json'))
  .filter(filename => ![C.FILE_SETTINGS].includes(filename))
  .map(filename => JSON.parse(fs.readFileSync(pathUser(user, path, filename))))

module.exports.allItemsShort = (path, user) => allItems(path, user)
  .map(json => ({hashid: json.hashid, id: json.id, name: json.name, level: json.level}))

const fs = require('fs-extra')

const C = require('./../constants')
const {generateGuid, idToPathUserFilename, pathUser, dirUser} = require('./common')

// ITEMS //

const replaceAllItemLists = (user, hashid, idNew, levelNew, nameNew) => {
  const modifyJson = json => {
    if (typeof(json) === 'object' && 'hashid' in json && json.hashid == hashid && 'id' in json && 'level' in json && 'label' in json && 'value' in json) {
      json.id = idNew
      json.level = levelNew
      json.label = nameNew
      json.value = idNew
    }
    if (typeof(json) === 'object') Object.entries(json).forEach(([k, v]) => modifyJson(v))
    return json
  }
  const walk = (u, path) => fs.readdirSync(dirUser(u, path))
    .filter(filename => filename.endsWith('.json'))
    .filter(filename => ![C.FILE_SETTINGS].includes(filename))
    .map(filename => {
      const f = pathUser(u, path, filename)
      const json = JSON.parse(fs.readFileSync(f))
      const jsonNew = modifyJson(Object.assign({}, json))
      if (json !== jsonNew) fs.writeFileSync(f, JSON.stringify(jsonNew))
    })
  for (i of C.ITEMS) walk(user, i.path)
  for (i of C.ITEMS) walk(null, i.path)
}

module.exports.itemForUser = itemForUser = (path, user, itemName, id) => {
  if (!id) return null
  const filename = idToPathUserFilename(user, itemName, id, path)
  return (!fs.existsSync(filename) || !fs.statSync(filename).isFile()) ? null : JSON.parse(fs.readFileSync(filename))
}

module.exports.saveItem = (path, user, itemName, id, json) => {
  const jsonOld = itemForUser(path, user, itemName, id)
  fs.writeFileSync(idToPathUserFilename(user, itemName, id, path), JSON.stringify(Object.assign(json, {hashid: (jsonOld) ? jsonOld.hashid : generateGuid()})))
}

module.exports.moveItem = (path, user, itemName, idOld, data) => {
  replaceAllItemLists(user, data.hashid, data.id, data.level, data.name)
  const filenameNew = idToPathUserFilename(user, itemName, data.id, path)
  if (fs.existsSync(filenameNew)) return false
  fs.renameSync(idToPathUserFilename(user, itemName, idOld, path), filenameNew)
  return true
}

module.exports.moveItemToPublic = (path, user, itemName, id, data) => {
  replaceAllItemLists(user, data.hashid, data.id, data.level, data.name)
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

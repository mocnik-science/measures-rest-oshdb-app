const fs = require('fs-extra')

const C = require('./../constants')
const {generateGuid, isLevelUser, allUsernames, idToPathUserFilename, pathUser, pathUsername, dirUser, dirUsername} = require('./common')

// FILE/DEPENDENCIY WALKERS //

module.exports.itemForUser = itemForUser = (path, user, itemName, id) => {
  if (!id) return null
  const filename = idToPathUserFilename(user, itemName, id, path)
  return (!fs.existsSync(filename) || !fs.statSync(filename).isFile()) ? null : JSON.parse(fs.readFileSync(filename))
}

const extractDepencenciesFromJson = (json) => {
  const dependencies = []
  const dependenciesJson = (json, item=null) => {
    if (typeof(json) === 'object' && json !== null) {
      if (item !== null && 'hashid' in json && 'id' in json && 'level' in json && 'label' in json && 'value' in json) dependencies.push(json.hashid)
      Object.values(json).forEach(v => dependenciesJson(v, (item !== null) ? item : json))
    }
  }
  dependenciesJson(json)
  return dependencies
}

const walkThroughItems = (itemName, user, path, callback) => {
  fs.readdirSync(dirUser(user, path))
    .filter(filename => filename.endsWith('.json'))
    .filter(filename => ![C.FILE_SETTINGS].includes(filename))
    .map(filename => {
      const f = pathUser(user, path, filename)
      const json = JSON.parse(fs.readFileSync(f))
      callback(json, itemName)
    })
}

const uniqueDependencies = dependencies => {
  const depDict = {}
  dependencies.forEach(d => {
    depDict[d.hashid] = d
  })
  return Object.values(depDict)
}

// which elements does the element with the provided hashid depend on?
module.exports.resolveDependenciesItem = (path, user, itemName, id) => {
  const json = itemForUser(path, user, itemName, id)
  const dependenciesHashid = extractDepencenciesFromJson(json)
  const dependencies = []
  const walk = (...param) => walkThroughItems(...param, (json, itemName) => {
    if ('hashid' in json && dependenciesHashid.includes(json.hashid) && 'id' in json && 'level' in json) {
      dependencies.push({
        hashid: json.hashid,
        id: json.id,
        level: json.level,
        name: json.name,
        _itemName: itemName,
      })
    }
  })
  for (const i of C.ITEMS) walk(i.item, user, i.path)
  for (const i of C.ITEMS) walk(i.item, null, i.path)
  return uniqueDependencies(dependencies)
}

// which elements depend on the element with the provided hashid?
module.exports.resolveInverseDependenciesItem = (user, hashid) => {
  const dependencies = []
  const walk = (...param) => walkThroughItems(...param, (json, itemName) => {
    if (extractDepencenciesFromJson(json, hashid, itemName).includes(hashid)) dependencies.push({
      hashid: json.hashid,
      id: json.id,
      level: json.level,
      name: json.name,
      _itemName: itemName,
    })
  })
  for (const i of C.ITEMS) walk(i.item, user, i.path)
  for (const i of C.ITEMS) walk(i.item, null, i.path)
  return uniqueDependencies(dependencies)
}

const replaceAllItemLists = (user, hashid, idNew, levelNew, nameNew) => {
  const modifyJson = (json, firstLevel=true) => {
    if (typeof(json) === 'object' && json !== null) {
      if (!firstLevel && 'hashid' in json && json.hashid == hashid && 'id' in json && 'level' in json && 'label' in json && 'value' in json) {
        json.id = idNew
        json.level = levelNew
        json.label = nameNew
        json.value = idNew
      }
      Object.entries(json).forEach(([k, v]) => modifyJson(v, false))
    }
    return json
  }
  const walk = (username, path) => fs.readdirSync(dirUsername(username, path))
    .filter(filename => filename.endsWith('.json'))
    .filter(filename => ![C.FILE_SETTINGS].includes(filename))
    .map(filename => {
      const f = pathUsername(username, path, filename)
      const json = JSON.parse(fs.readFileSync(f))
      const jsonNew = modifyJson(Object.assign({}, json))
      if (json !== jsonNew) fs.writeFileSync(f, JSON.stringify(jsonNew))
    })
  if (user === null) for (const username of allUsernames()) for (const i of C.ITEMS) walk(username, i.path)
  else for (const i of C.ITEMS) walk(user.username(), i.path)
  for (const i of C.ITEMS) walk(null, i.path)
}

// OTHER //

module.exports.saveItem = (path, user, itemName, id, json) => {
  const jsonOld = itemForUser(path, user, itemName, id)
  fs.writeFileSync(idToPathUserFilename(user, itemName, id, path), JSON.stringify(Object.assign(json, {hashid: (jsonOld) ? jsonOld.hashid : generateGuid()})))
}

module.exports.moveItem = (path, user, itemName, idOld, levelOld, data) => {
  replaceAllItemLists(isLevelUser(levelOld) ? user : null, data.hashid, data.id, data.level, data.name)
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

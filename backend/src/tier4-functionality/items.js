const fs = require('fs-extra')

const C = require('./../constants')
const {generateGuid, isLevelUser, allUsernames, idToPathUserFilename, pathUser, pathUsername, dirUser, dirUsername} = require('./common')

// FILE/DEPENDENCIY WALKERS //

module.exports.itemForUser = itemForUser = (itemClass, user, id) => {
  if (!id) return null
  const filename = idToPathUserFilename(itemClass, user, id)
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

const walkThroughItems = (itemClass, user, callback) => {
  fs.readdirSync(dirUser(user, itemClass.path))
    .filter(filename => filename.endsWith('.json'))
    .filter(filename => ![C.FILE_SETTINGS].includes(filename))
    .map(filename => {
      const f = pathUser(user, itemClass.path, filename)
      const json = JSON.parse(fs.readFileSync(f))
      callback(json, itemClass.itemName)
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
module.exports.resolveDependenciesItem = (itemClass, user, id) => {
  const json = itemForUser(itemClass, user, id)
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
  for (const c of C.ITEM_CLASSES) walk(c, user)
  for (const c of C.ITEM_CLASSES) walk(c, null)
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
  for (const c of C.ITEM_CLASSES) walk(c, user)
  for (const c of C.ITEM_CLASSES) walk(c, null)
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
  const walk = (itemClass, username) => fs.readdirSync(dirUsername(username, itemClass.path))
    .filter(filename => filename.endsWith('.json'))
    .filter(filename => ![C.FILE_SETTINGS].includes(filename))
    .map(filename => {
      const f = pathUsername(username, itemClass.path, filename)
      const json = JSON.parse(fs.readFileSync(f))
      const jsonNew = modifyJson(Object.assign({}, json))
      if (json !== jsonNew) fs.writeFileSync(f, JSON.stringify(jsonNew))
    })
  if (user === null) for (const username of allUsernames()) for (const c of C.ITEM_CLASSES) walk(c, username)
  else for (const c of C.ITEM_CLASSES) walk(c, user.username())
  for (const c of C.ITEM_CLASSES) walk(c, null)
}

// OTHER //

module.exports.saveItem = (itemClass, user, id, json) => {
  const jsonOld = itemForUser(itemClass, user, id)
  fs.writeFileSync(idToPathUserFilename(itemClass, user, id), JSON.stringify(Object.assign(json, {hashid: (jsonOld) ? jsonOld.hashid : generateGuid()})))
}

module.exports.moveItem = (itemClass, user, idOld, levelOld, data) => {
  replaceAllItemLists(isLevelUser(levelOld) ? user : null, data.hashid, data.id, data.level, data.name)
  const filenameNew = idToPathUserFilename(itemClass, user, data.id)
  if (fs.existsSync(filenameNew)) return false
  fs.renameSync(idToPathUserFilename(itemClass, user, idOld), filenameNew)
  return true
}

module.exports.moveItemToPublic = (itemClass, user, id, data) => {
  replaceAllItemLists(user, data.hashid, data.id, data.level, data.name)
  const filenameNew = idToPathUserFilename(itemClass, null, id)
  if (fs.existsSync(filenameNew)) return false
  fs.renameSync(idToPathUserFilename(itemClass, user, id), filenameNew)
  return true
}

module.exports.allItems = allItems = (path, user=null) => fs.readdirSync(dirUser(user, path))
  .filter(filename => filename.endsWith('.json'))
  .filter(filename => ![C.FILE_SETTINGS].includes(filename))
  .map(filename => JSON.parse(fs.readFileSync(pathUser(user, path, filename))))

module.exports.allItemsShort = (path, user=null) => allItems(path, user)
  .map(json => ({hashid: json.hashid, id: json.id, name: json.name, level: json.level}))

const fs = require('fs-extra')
const {join, resolve} = require('path')
const uuidv4 = require('uuid/v4')

const C = require('./../constants')

// HASH //

module.exports.generateGuid = () => uuidv4()

// IDS AND NAMES //

module.exports.name2id = id => id.replace(/[\s-_]+(\w)/g, (match, p, offset) => `-${p}`).replace(/[^-a-zA-Z0-9]/g, '').toLowerCase()

module.exports.className = className = (itemName, id) => `${itemName[0].toUpperCase() + itemName.slice(1)}${id.replace(/^([a-z0-9])|-([a-z0-9])/g, (match, p1, p2, offset) => p1 ? p1.toUpperCase() : p2.toUpperCase())}`

// LEVELS //

module.exports.isLevelPublic = x => x && x.toLowerCase() === C.LEVEL_PUBLIC

module.exports.isLevelUser = x => x && x.toLowerCase() === C.LEVEL_USER

// USERS //

module.exports.allUsernames = () => fs.readdirSync(C.PATH_USERS).filter(x => !x.startsWith('.'))

// COMMON //

module.exports.itemNameToItem = itemName => {
  const items = C.ITEMS.filter(i => i.item === itemName)
  return (items.length) ? items[0] : null
}

module.exports.idToFilename = idToFilename = (itemName, id, ext='json') => `${className(itemName, id)}.${ext}`

module.exports.idToPathUserFilename = (user, itemName, id, path='', ext='json') => {
  if (path !== '') {
    const p = pathUser(user, path)
    if (!fs.existsSync(p)) fs.mkdirSync(p)
  }
  return pathUser(user, path, idToFilename(itemName, id, ext))
}

module.exports.pathUser = pathUser = (user, ...path) => pathUsername((user) ? user.username() : null, ...path)
module.exports.pathUsername = pathUsername = (username, ...path) => (username !== null) ? join(C.PATH_USERS, username, ...path) : join(C.PATH_PUBLIC, ...path)

module.exports.pathUserAbsolute = (user, ...path) => resolve(pathUser(user, ...path))

module.exports.dirUser = (user, ...path) => dirUsername((user) ? user.username() : null, ...path)
module.exports.dirUsername = dirUsername = (username, ...path) => {
  const p = pathUsername(username, ...path)
  if (!fs.existsSync(p)) fs.mkdirSync(p)
  return p
}

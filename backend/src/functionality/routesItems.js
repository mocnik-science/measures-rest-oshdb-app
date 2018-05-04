const C = require('./../constants')
const {name2id, isLevelPublic, isLevelUser} = require('./common')
const {itemForUser, saveItem, moveItem, moveItemToPublic, allItems} = require('./items')

// ROUTE ITEMS //

module.exports.getItems = getItems = (path, itemName) => (req, res) => {
  const items = {}
  for (const json of allItems(path, req.user)) items[`user-${json.id}`] = json
  for (const json of allItems(path, null)) items[`public-${json.id}`] = json
  res.status(200).json({success: true, items: items})
}

module.exports.getItem = (path, itemName) => (req, res) => {
  const json = itemForUser(path, isLevelPublic(req.params.level) ? null : req.user, itemName, req.params.id)
  if (json == null) res.status(404).send(`${itemName} not found`)
  else res.status(200).json(json)
}

module.exports.postItem = (path, itemName, data) => (req, res) => {
  const u = isLevelPublic(req.params.level) ? null : req.user
  const json = itemForUser(path, u, itemName, req.params.id)
  if (json == null) res.status(404).send(`${itemName} not found`)
  else if (u === null && !req.user.admin()) res.status(403).send(`no rights to modify`)
  else {
    const data = req.body
    if (json.timestamp >= data.timestamp) res.status(200).json({success: true})
    else {
      json.timestamp = data.timestamp
      if (data.data.name && json.name !== data.data.name) {
        json.id = name2id(data.data.name)
        if (!moveItem(path, u, itemName, req.params.id, Object.assign(json, data.data))) return res.status(200).json({success: false, messages: {nameError: `A ${itemName} with a very similar (or same) name exists already.`}})
      }
      const jsonNew = Object.assign(json, data.data)
      saveItem(path, u, itemName, json.id, jsonNew)
      res.status(200).json({success: true})
    }
  }
}

module.exports.getItemPublic = (path, itemName) => (req, res) => {
  if (!isLevelUser(req.params.level)) return res.status(200).json({success: false, messages: {itemError: `Only user items can be made public.`}})
  else if (!req.user.admin()) res.status(403).send(`no rights to modify`)
  else {
    const json = itemForUser(path, req.user, itemName, req.params.id)
    const jsonNew = Object.assign(json, {level: C.LEVEL_PUBLIC})
    if (!moveItemToPublic(path, req.user, itemName, req.params.id, jsonNew)) return res.status(200).json({success: false, messages: {nameError: `A ${itemName} with a very similar (or same) name has already been published.`}})
    saveItem(path, null, itemName, json.id, jsonNew)
    getItems(path, itemName)(req, res)
  }
}

module.exports.getItemNew = (path, itemName, data) => (req, res) => {
  let i = 0
  let name = null
  while (name === null || itemForUser(path, req.user, itemName, name2id(name)) !== null) name = `${C.NEW_ITEM} ${itemName} ${++i}`
  saveItem(path, req.user, itemName, name2id(name), Object.assign({
    id: name2id(name),
    name: name,
    level: C.LEVEL_USER,
  }, data))
  getItems(path, itemName)(req, res)
}

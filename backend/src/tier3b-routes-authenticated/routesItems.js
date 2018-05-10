const C = require('./../constants')
const {name2id, isLevelPublic, isLevelUser} = require('./../tier4-functionality/common')
const {itemForUser, resolveDependenciesItem, resolveInverseDependenciesItem, saveItem, moveItem, moveItemToPublic, allItems, allItemsShort} = require('./../tier4-functionality/items')
const {createZipMeasure} = require('./../tier4-functionality/java')

module.exports.runRoutesAuthenticatedItems = (use, get, post) => {
  // general
  for (const i of C.ITEMS) {
    get(`/backend/${i.itemName}/all`, getItems(i.path, i.itemName))
    get(`/backend/${i.itemName}/id/:level/:id`, getItem(i.path, i.itemName))
    post(`/backend/${i.itemName}/id/:level/:id`, postItem(i.path, i.itemName))
    // get(`/backend/${i.itemName}/dependencies/:level/:id`, getItemDependencies(i.path, i.itemName))
    get(`/backend/${i.itemName}/public/:level/:id`, getItemPublic(i.path, i.itemName))
    get(`/backend/${i.itemName}/new`, getItemNew(i.path, i.itemName, i.dataNew))
  }
  
  // metadataItems
  get('/backend/items', (req, res) => {
    const data = {}
    for (const i of C.ITEMS) data[`${i.itemName}s`] = allItemsShort(i.path, req.user).concat(allItemsShort(i.path, null))
    res.status(200).json(data)
  })
  
  // download
  get(`/backend/${C.MEASURE}/download/:level/:id`, (req, res) => createZipMeasure(req.user, req.params.level, req.params.id)(req, res))
}

// ROUTE ITEMS //

const getItems = (path, itemName) => (req, res) => {
  const items = {}
  for (const json of allItems(path, req.user)) items[`user-${json.id}`] = json
  for (const json of allItems(path, null)) items[`public-${json.id}`] = json
  res.status(200).json({success: true, items: items})
}

const getItem = (path, itemName) => (req, res) => {
  const json = itemForUser(path, isLevelPublic(req.params.level) ? null : req.user, itemName, req.params.id)
  if (json == null) res.status(404).send(`${itemName} not found`)
  else res.status(200).json(json)
}

const postItem = (path, itemName, data) => (req, res) => {
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
        if (!moveItem(path, u, itemName, req.params.id, req.params.level, Object.assign(json, data.data))) return res.status(200).json({success: false, messages: {nameError: `A ${itemName} with a very similar (or same) name exists already.`}})
      }
      const jsonNew = Object.assign(json, data.data)
      saveItem(path, u, itemName, json.id, jsonNew)
      res.status(200).json({success: true})
    }
  }
}

// const getItemDependencies = (path, itemName) => (req, res) => {
//   const json = itemForUser(path, isLevelPublic(req.params.level) ? null : req.user, itemName, req.params.id)
//   const dependencies = resolveDependenciesItem(req.user, json.hashid)
//   res.status(200).json({dependencies: dependencies})
// }

const getItemPublic = (path, itemName) => (req, res) => {
  if (!isLevelUser(req.params.level)) return res.status(200).json({success: false, messages: {itemError: `Only user items can be made public.`}})
  else if (!req.user.admin()) res.status(403).send(`no rights to modify`)
  else {
    const json = itemForUser(path, req.user, itemName, req.params.id)
    const dependencies = resolveDependenciesItem(path, req.user, itemName, json.id).filter(item => !isLevelPublic(item.level))
    const inverseDependencies = resolveInverseDependenciesItem(req.user, json.hashid).filter(item => !isLevelPublic(item.level))
    if (dependencies.length > 0) res.status(200).json({success: false, dependencies: dependencies})
    else if (inverseDependencies.length > 0) res.status(200).json({success: false, inverseDependencies: inverseDependencies})
    else {
      const jsonNew = Object.assign(json, {level: C.LEVEL_PUBLIC})
      if (!moveItemToPublic(path, req.user, itemName, req.params.id, jsonNew)) return res.status(200).json({success: false, messages: {nameError: `A ${itemName} with a very similar (or same) name has already been published.`}})
      saveItem(path, null, itemName, json.id, jsonNew)
      getItems(path, itemName)(req, res)
    }
  }
}

const getItemNew = (path, itemName, data) => (req, res) => {
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

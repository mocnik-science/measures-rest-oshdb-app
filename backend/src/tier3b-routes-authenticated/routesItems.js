const C = require('./../constants')
const {name2id, isLevelPublic, isLevelUser} = require('./../tier4-functionality/common')
const {itemForUser, resolveDependenciesItem, resolveInverseDependenciesItem, saveItem, moveItem, moveItemToPublic, allItems, allItemsShort} = require('./../tier4-functionality/items')
const {writeJava, createZipMeasure} = require('./../tier4-functionality/java')
const {servicePublicStart} = require('./../tier4-functionality/services')
const {restartEndpoint} = require('./../tier4-functionality/sparql')

module.exports.runRoutesAuthenticatedItems = (use, get, post) => {
  // general
  for (const c of C.ITEM_CLASSES) {
    get(`/backend/${c.itemName}/all`, getItems(c))
    get(`/backend/${c.itemName}/id/:level/:id`, getItem(c))
    post(`/backend/${c.itemName}/id/:level/:id`, postItem(c))
    // get(`/backend/${c.itemName}/dependencies/:level/:id`, getItemDependencies(c))
    get(`/backend/${c.itemName}/public/:level/:id`, getItemPublic(c))
    get(`/backend/${c.itemName}/new`, getItemNew(c, c.dataNew))
  }
  
  // metadataItems
  get('/backend/items', (req, res) => {
    const data = {}
    for (const c of C.ITEM_CLASSES) data[`${c.itemName}s`] = allItemsShort(c.path, req.user).concat(allItemsShort(c.path, null))
    res.status(200).json(data)
  })
  
  // download
  get(`/backend/${C.MEASURE.itemName}/download/:level/:id`, (req, res) => createZipMeasure(req.user, req.params.level, req.params.id)(req, res))
}

// ROUTE ITEMS //

const getItems = itemClass => (req, res) => {
  const items = {}
  for (const json of allItems(itemClass.path, req.user)) items[`user-${json.id}`] = json
  for (const json of allItems(itemClass.path, null)) items[`public-${json.id}`] = json
  res.status(200).json({success: true, items: items})
}

const getItem = itemClass => (req, res) => {
  const json = itemForUser(itemClass, isLevelPublic(req.params.level) ? null : req.user, req.params.id)
  if (json == null) res.status(404).send(`${itemClass.itemName} not found`)
  else res.status(200).json(json)
}

const postItem = (itemClass, data) => (req, res) => {
  const u = isLevelPublic(req.params.level) ? null : req.user
  const json = itemForUser(itemClass, u, req.params.id)
  if (json == null) res.status(404).send(`${itemClass.itemName} not found`)
  else if (u === null && !req.user.admin()) res.status(403).send('no rights to modify')
  else {
    const data = req.body
    if (json.timestamp >= data.timestamp) res.status(200).json({success: true})
    else {
      json.timestamp = data.timestamp
      if (data.data.name && json.name !== data.data.name) {
        json.id = name2id(data.data.name)
        if (!moveItem(itemClass, u, req.params.id, req.params.level, Object.assign(json, data.data))) return res.status(200).json({success: false, messages: {nameError: `A ${itemClass.itemName} with a very similar (or same) name exists already.`}})
      }
      const jsonNew = Object.assign(json, data.data)
      saveItem(itemClass, u, json.id, jsonNew)
      if (u === null) {
        writeJava(null)
        servicePublicStart()
        restartEndpoint()
      }
      res.status(200).json({success: true})
    }
  }
}

// const getItemDependencies = itemClass => (req, res) => {
//   const json = itemForUser(itemClass, isLevelPublic(req.params.level) ? null : req.user, req.params.id)
//   const dependencies = resolveDependenciesItem(req.user, json.hashid)
//   res.status(200).json({dependencies: dependencies})
// }

const getItemPublic = itemClass => (req, res) => {
  if (!isLevelUser(req.params.level)) return res.status(200).json({success: false, messages: {itemError: `Only user items can be made public.`}})
  else if (!req.user.admin()) res.status(403).send(`no rights to modify`)
  else {
    const json = itemForUser(itemClass, req.user, req.params.id)
    const dependencies = resolveDependenciesItem(itemClass, req.user, json.id).filter(itemClass => !isLevelPublic(itemClass.level))
    const inverseDependencies = resolveInverseDependenciesItem(req.user, json.hashid).filter(itemClass => !isLevelPublic(itemClass.level))
    if (dependencies.length > 0) res.status(200).json({success: false, dependencies: dependencies})
    else if (inverseDependencies.length > 0) res.status(200).json({success: false, inverseDependencies: inverseDependencies})
    else {
      const jsonNew = Object.assign(json, {level: C.LEVEL_PUBLIC})
      if (!moveItemToPublic(itemClass, req.user, req.params.id, jsonNew)) return res.status(200).json({success: false, messages: {nameError: `A ${itemClass.itemName} with a very similar (or same) name has already been published.`}})
      saveItem(itemClass, null, json.id, jsonNew)
      writeJava(null)
      servicePublicStart()
      restartEndpoint()
      getItems(itemClass)(req, res)
    }
  }
}

const getItemNew = (itemClass, data) => (req, res) => {
  let i = 0
  let name = null
  while (name === null || itemForUser(itemClass, req.user, name2id(name)) !== null) name = `${C.NEW_ITEM} ${itemClass.itemName} ${++i}`
  saveItem(itemClass, req.user, name2id(name), Object.assign({
    id: name2id(name),
    name: name,
    level: C.LEVEL_USER,
  }, data))
  getItems(itemClass)(req, res)
}

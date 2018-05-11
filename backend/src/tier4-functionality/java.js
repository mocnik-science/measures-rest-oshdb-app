const fs = require('fs-extra')
const {join} = require('path')
const JSZip = require('jszip')
const soap = require('simplified-oshdb-api-programming/dist/soap-to-measure')

const C = require('./../constants')
const {className, isLevelPublic, itemNameToItem, idToPathUserFilename, pathUser} = require('./common')
const {itemForUser, resolveDependenciesItem, allItems} = require('./items')
const {template} = require('./templates')

// JAVA //

const recreateJavaDir = user => {
  const dir = pathUser(user, C.PATH_JAVA)
  fs.removeSync(dir)
  fs.mkdirSync(dir)
}
const saveJava = (user, name, code) => fs.writeFileSync(pathUser(user, C.PATH_JAVA, name), code)
const saveJavaMeasure = (user, id, code) => fs.writeFileSync(idToPathUserFilename(C.MEASURE, user, id, C.PATH_JAVA, 'java'), code)

const javaMeasureTemplate = template(C.FILE_JAVA_MEASURE_TEMPLATE)
const javaRunTemplate = template(C.FILE_JAVA_RUN_TEMPLATE)

const measureJsonToJavaMeasure = json => {
  const parsedSoap = soap.soapToMeasure(json.code)
  if (parsedSoap.errors.length > 0) throw parsedSoap.errors.join('\n')
  return javaMeasureTemplate(Object.assign({
    id: json.id,
    className: className(C.MEASURE, json.id),
  }, parsedSoap))
}

const measureJsonToJavaRun = (jsons, options={}) => javaRunTemplate(Object.assign({
  measures: jsons.filter(json => json.enabled).map(json => ({className: className(C.MEASURE, json.id)})),
  databaseFile: `/data/dbs/sweden_20180112_z12_keytable.oshdb`,
  serverOnlyLocal: false,
}, options))

module.exports.writeJava = user => {
  const jsons = allItems(C.MEASURE.path, user)
  recreateJavaDir(user)
  jsons.filter(json => json.enabled).map(json => saveJavaMeasure(user, json.id, measureJsonToJavaMeasure(json)))
  saveJava(user, 'Run.java', measureJsonToJavaRun(jsons))
}

const downloadReadmeTemplate = template(C.FILE_DOWNLOAD_README_TEMPLATE)
const downloadErrorTemplate = template(C.FILE_DOWNLOAD_ERROR_TEMPLATE)

module.exports.createZipMeasure = (user, level, id) => (req, res) => {
  const json = itemForUser(C.MEASURE, isLevelPublic(req.params.level) ? null : user, id)
  const cn = className(C.MEASURE, json.id)
  
  const zip = new JSZip()
  zip.file(join(cn, 'data', `${cn}.json`), JSON.stringify(json))
  zip.file(join(cn, 'data', `${cn}.soap`), json.code)
  
  for (const d of resolveDependenciesItem(C.MEASURE, isLevelPublic(req.params.level) ? null : user, id)) {
    const itemClass = itemNameToItem(d._itemName)
    const json = itemForUser(itemClass, isLevelPublic(d.level) ? null : user, d.id)
    zip.file(join(cn, 'data', `${className(itemClass, d.id)}.json`), JSON.stringify(json))
  }
  
  zip.file(join(cn, 'README.md'), downloadReadmeTemplate({
    id: json.id,
    description: (json.description.trim() !== '') ? json.description : null,
  }))
  
  try {
    const javaMeasure = measureJsonToJavaMeasure(json)
    const javaRun = measureJsonToJavaRun([json], {
      databaseFile: '{{insert-name-of-database-here}}',
      serverOnlyLocal: true,
    })
    zip.folder(join(cn, 'src', 'main', 'java', 'org', 'giscience', 'measures', 'repository'))
      .file(`${cn}.java`, javaMeasure)
      .file('Run.java', javaRun)
    zip.file(join(cn, 'pom.xml'), fs.readFileSync(C.PATH_POM_XML))
  } catch (error) {
    zip.file(join(cn, 'ERROR.md'), downloadErrorTemplate({}))
  }
  
  zip
    .generateNodeStream({type: 'nodebuffer', streamFiles: true})
    .on('open', () => res.set('Content-Type', 'application/zip'))
    .pipe(res)
}

const fs = require('fs-extra')
const {join} = require('path')
const JSZip = require('jszip')
const path = require('path')
const soap = require('simplified-oshdb-api-programming/dist/soap-to-measure')

const C = require('./../constants')
const {name2id, className, isLevelPublic, itemNameToItem, idToPathUserFilename, pathUser} = require('./common')
const {itemForUser, resolveDependenciesItem, allItems} = require('./items')
const {template} = require('./templates')

// SOAP //

module.exports.urlPrefixParameter = measure => (!soap.soapToMeasure(measure.code).parameters) ? '' : Object.values(soap.soapToMeasure(measure.code).parameters).map(p => `&${p.name}=${p.defaultValue}`).join('')

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
const pomTemplate = template(C.FILE_JAVA_POM_TEMPLATE)
const cleanupTemplate = template(C.FILE_JAVA_CLEANUP_TEMPLATE)

const measureJsonToJavaMeasure = (user, json) => {
  const resolveSoapImports = parsedSoap => {
    if (parsedSoap.importGithub) {
      return null
    } else {
      const soapImports = parsedSoap.soapImports
      parsedSoap.soapImports = []
      for (const soapImport of soapImports) {
        let jsonImported = itemForUser(C.MEASURE, user, name2id(soapImport))
        if (jsonImported === null) jsonImported = itemForUser(C.MEASURE, null, name2id(soapImport))
        if (jsonImported === null) continue
        const parsedSoapImported = soap.soapToMeasure(jsonImported.code)
        parsedSoap.soapImports = parsedSoapImported.soapImports
        parsedSoap.code = parsedSoapImported.code
        parsedSoap.parameters = parsedSoapImported.parameters
        for (const p in parsedSoap.parametersOverwriteForImport) if (parsedSoap.parameters[p] !== undefined) parsedSoap.parameters[p].defaultValue = parsedSoap.parametersOverwriteForImport[p].defaultValue
        parsedSoap.mapReducibleType = parsedSoapImported.mapReducibleType
        for (const key of ['date', 'daysBefore', 'intervalInDays', 'refersToTimespan']) if (parsedSoap[key] === null) parsedSoap[key] = parsedSoapImported[key]
        parsedSoap = resolveSoapImports(parsedSoap)
      }
      return parsedSoap
    }
  }
  const parsedSoap = resolveSoapImports(soap.soapToMeasure(json.code))
  if (parsedSoap === null) return null
  if (parsedSoap.errors.length > 0) throw parsedSoap.errors.join('\n')
  return javaMeasureTemplate(Object.assign({
    id: json.id,
    className: className(C.MEASURE, json.id),
  }, parsedSoap))
}

const measureJsonToJavaRun = (user, jsons, options={}) => javaRunTemplate(Object.assign({
  measures: jsons.filter(json => (user === null || json.enabled)).map(json => ({className: className(C.MEASURE, json.id)})),
  importGithubClasses: jsons.filter(json => (user === null || json.enabled)).filter(json => soap.soapToMeasure(json.code).importGithub).map(json => className(C.MEASURE, json.id)),
  databaseFile: `/data/dbs/sweden_20180112_z12_keytable.oshdb`,
  serverOnlyLocal: false,
}, options))

const measureJsonToPom = jsons => {
  const importGithub = jsons.map(json => {
    const ig = soap.soapToMeasure(json.code).importGithub
    if (ig && ig.length > 0) {
      return {
        groupId: `com.${ig[0].repository.replace(/\//g, '.')}`,
        artifactId: className(C.MEASURE, json.id),
        version: ig[0].version,
      }
    }
    return null
  }).filter(ig => ig !== null)
  return pomTemplate({importGithub: [...new Set(importGithub)]})
}

const measureJsonToCleanup = jsons => {
  const importGithub = jsons.map(json => {
    const ig = soap.soapToMeasure(json.code).importGithub
    return (ig && ig.length > 0) ? `com/${ig[0].repository}` : null
  }).filter(ig => ig !== null)
  return cleanupTemplate({importGithub: [...new Set(importGithub)]})
}

module.exports.writeJava = user => {
  const jsons = allItems(C.MEASURE.path, user)
  recreateJavaDir(user)
  jsons.filter(json => (user === null || json.enabled)).map(json => {
    const javaMeasure = measureJsonToJavaMeasure(user, json)
    if (javaMeasure) saveJavaMeasure(user, json.id, javaMeasure)
  })
  saveJava(user, 'Run.java', measureJsonToJavaRun(user, jsons))
  saveJava(user, 'pom.xml', measureJsonToPom(jsons.filter(json => (user === null || json.enabled))))
  saveJava(user, 'cleanup.sh', measureJsonToCleanup(jsons.filter(json => (user === null || json.enabled)), true))
}

const downloadReadmeTemplate = template(C.FILE_DOWNLOAD_README_TEMPLATE)
const downloadErrorTemplate = template(C.FILE_DOWNLOAD_ERROR_TEMPLATE)

module.exports.createZipMeasure = (user, level, id) => (req, res) => {
  const u = isLevelPublic(req.params.level) ? null : user
  const json = itemForUser(C.MEASURE, u, id)
  const cn = className(C.MEASURE, json.id)
  
  const zip = new JSZip()
  zip.file(join(cn, 'data', `${cn}.json`), JSON.stringify(json))
  zip.file(join(cn, 'data', `${cn}.soap`), json.code)
  
  for (const d of resolveDependenciesItem(C.MEASURE, u, id)) {
    const itemClass = itemNameToItem(d._itemName)
    const json = itemForUser(itemClass, isLevelPublic(d.level) ? null : user, d.id)
    zip.file(join(cn, 'data', `${className(itemClass, d.id)}.json`), JSON.stringify(json))
  }
  
  zip.file(join(cn, 'README.md'), downloadReadmeTemplate({
    id: json.id,
    description: (json.description !== undefined && json.description !== null && json.description !== '') ? json.description.trim() : null,
  }))
  
  try {
    const javaRun = measureJsonToJavaRun(u, [json], {
      databaseFile: '{{insert-name-of-database-here}}',
      serverOnlyLocal: true,
    })
    const javaFolder = zip.folder(join(cn, 'src', 'main', 'java', 'org', 'giscience', 'measures', 'repository')).file('Run.java', javaRun)
    const javaMeasure = measureJsonToJavaMeasure(u, json)
    if (javaMeasure) javaFolder.file(`${cn}.java`, javaMeasure)
    const javaPom = measureJsonToPom([json])
    zip.file(join(cn, 'pom.xml'), javaPom)
  } catch (error) {
    zip.file(join(cn, 'ERROR.md'), downloadErrorTemplate({}))
  }
  
  res
    .set('Content-Type', 'application/zip')
    .set('Content-Disposition', `attachment;filename=${cn}.zip`)
  
  zip
    .generateNodeStream({type: 'nodebuffer', streamFiles: true})
    .pipe(res)
}

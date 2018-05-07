const fs = require('fs-extra')
const {join} = require('path')
const JSZip = require('jszip')
const soap = require('simplified-oshdb-api-programming/dist/soap-to-measure')

const C = require('./../constants')
const {isLevelPublic} = require('./common')
const {className, idToPathUserFilename, pathUser} = require('./common')
const {itemForUser, allItems} = require('./items')
const {readTemplate, useTemplate} = require('./templates')

// JAVA //

const recreateJavaDir = user => {
  const dir = pathUser(user, C.PATH_JAVA)
  fs.removeSync(dir)
  fs.mkdirSync(dir)
}
const saveJava = (user, name, code) => fs.writeFileSync(pathUser(user, C.PATH_JAVA, name), code)
const saveJavaMeasure = (user, itemName, id, code) => fs.writeFileSync(idToPathUserFilename(user, C.MEASURE, id, C.PATH_JAVA, 'java'), code)

const javaTemplate = readTemplate(C.FILE_JAVA_TEMPLATE)
const javaRunTemplate = readTemplate(C.FILE_JAVA_RUN_TEMPLATE)

const measureJsonToJavaMeasure = json => {
  const parsedSoap = soap.soapToMeasure(json.code)
  if (parsedSoap.errors) throw parsedSoap.errors.join('\n')
  return useTemplate(javaTemplate, Object.assign({
    id: json.id,
    className: className(C.MEASURE, json.id),
  }, parsedSoap))
}

const measureJsonToJava = jsons => useTemplate(javaRunTemplate, {
  measures: jsons.filter(json => json.enabled).map(json => ({className: className(C.MEASURE, json.id)})),
  databaseFile: `/data/dbs/sweden_20180112_z12_keytable.oshdb`,
})

module.exports.writeJava = user => {
  const jsons = allItems(C.PATH_MEASURES, user)
  recreateJavaDir(user)
  jsons.filter(json => json.enabled).map(json => saveJavaMeasure(user, C.MEASURE, json.id, measureJsonToJavaMeasure(json)))
  saveJava(user, 'Run.java', measureJsonToJava(jsons))
}

module.exports.createZipMeasure = (user, level, id) => (req, res) => {
  const json = itemForUser(C.PATH_MEASURES, isLevelPublic(req.params.level) ? null : user, C.MEASURE, id)
  const cn = className(C.MEASURE, json.id)
  
  const zip = new JSZip()
  zip.file(join(cn, `${cn}.json`), JSON.stringify(json))
  zip.file(join(cn, `${cn}.soap`), json.code)
  zip.file(join(cn, 'pom.xml'), fs.readFileSync(C.PATH_POM_XML))
  zip.file(join(cn, 'README.md'), 'This is a readme!')
  zip.folder(join(cn, 'src', 'main', 'java', 'org', 'giscience', 'measures', 'repository'))
    .file(`${cn}.java`, measureJsonToJavaMeasure(json))
    .file('Run.java', measureJsonToJava([json]))
  
  zip
    .generateNodeStream({type: 'nodebuffer', streamFiles: true})
    .on('open', () => res.set('Content-Type', 'application/zip'))
    .pipe(res)
}

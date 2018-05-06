const fs = require('fs-extra')
const soap = require('simplified-oshdb-api-programming/dist/soap-to-measure')

const C = require('./../constants')
const {className, idToPathUserFilename, pathUser} = require('./common')
const {allItems} = require('./items')
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

module.exports.writeJava = user => {
  const jsons = allItems(C.PATH_MEASURES, user)
  recreateJavaDir(user)
  jsons.filter(json => json.enabled).map(json => {
    const parsedSoap = soap.soapToMeasure(json.code)
    if (parsedSoap.errors) throw parsedSoap.errors.join('\n')
    saveJavaMeasure(user, C.MEASURE, json.id, useTemplate(javaTemplate, Object.assign({
      id: json.id,
      className: className(C.MEASURE, json.id),
    }, parsedSoap)))
  })
  saveJava(user, 'Run.java', useTemplate(javaRunTemplate, {
    measures: jsons.filter(json => json.enabled).map(json => ({className: className(C.MEASURE, json.id)})),
    databaseFile: `/data/dbs/sweden_20180112_z12_keytable.oshdb`,
  }))
}

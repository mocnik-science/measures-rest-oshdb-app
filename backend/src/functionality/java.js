const fs = require('fs-extra')
const soap = require('simplified-oshdb-api-programming/dist/soap-to-java')

const C = require('./../constants')
const {className, idToPathUserFilename, pathUser} = require('./common')
const {allItems} = require('./items')
const {readTemplate, useTemplate} = require('./templates')

// JAVA //

const removeJavaDir = user => fs.removeSync(pathUser(user, C.PATH_JAVA))
const saveJava = (user, name, code) => fs.writeFileSync(pathUser(user, C.PATH_JAVA, name), code)
const saveJavaMeasure = (user, itemName, id, code) => fs.writeFileSync(idToPathUserFilename(user, C.MEASURE, id, C.PATH_JAVA, 'java'), code)

const javaTemplate = readTemplate(C.FILE_JAVA_TEMPLATE)
const javaRunTemplate = readTemplate(C.FILE_JAVA_RUN_TEMPLATE)

module.exports.writeJava = user => {
  const jsons = allItems(C.PATH_MEASURES, user)
  removeJavaDir(user)
  fs.mkdir(pathUser(user, C.PATH_JAVA))
  jsons.filter(json => json.enabled).map(json => {
    saveJavaMeasure(user, C.MEASURE, json.id, useTemplate(javaTemplate, {
      id: json.id,
      className: className(C.MEASURE, json.id),
      code: soap.soapToJava(json.code.replace(/^\s*import\s.+\n?/gm, '')),
      imports: json.code.split('\n').filter(s => s.match(/^\s*import\s.+/)).join('\n'),
    }))
  })
  saveJava(user, 'Run.java', useTemplate(javaRunTemplate, {
    measures: jsons.filter(json => json.enabled).map(json => ({className: className(C.MEASURE, json.id)})),
    databaseFile: `/data/dbs/sweden_20180112_z12_keytable.oshdb`,
  }))
}

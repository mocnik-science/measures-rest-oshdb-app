const fs = require('fs-extra')
const handlebars = require('handlebars')

// TEMPLATES //

module.exports.readTemplate = t => handlebars.compile(fs.readFileSync(t, 'utf-8'))

module.exports.useTemplate = (template, data) => {
  const data2 = {}
  for (let d of Object.keys(data)) data2[d] = (typeof data[d] == 'string') ? new handlebars.SafeString(data[d]) : data[d]
  return template(data2)
}

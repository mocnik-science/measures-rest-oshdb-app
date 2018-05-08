const fs = require('fs')
const handlebars = require('handlebars')

// TEMPLATES //

module.exports.template = template => {
  const t = handlebars.compile(fs.readFileSync(template, 'utf-8'))
  return data => {
    const data2 = {}
    for (let d of Object.keys(data)) data2[d] = (typeof data[d] == 'string') ? new handlebars.SafeString(data[d]) : data[d]
    return t(data2)
  }
}

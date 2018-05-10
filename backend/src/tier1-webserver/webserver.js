const bodyParser = require('body-parser')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const fs = require('fs')
const https = require('https')

const C = require('./../constants')
const {runAuthentication} = require('./../tier2-authentication/authentication')

module.exports.runWebserver = () => {
  const app = express()
  
  // input
  const bodyParserJson = bodyParser.json()
  app.use((req, res, next) => (req.method == 'POST') ? bodyParserJson(req, res, next): next())
  
  // output
  app.set('views', C.PATH_TEMPLATES_LOD_VIEWS)
  app.engine('handlebars', expressHandlebars({
    defaultLayout: 'html',
    layoutsDir: C.PATH_TEMPLATES_LOD_LAYOUTS,
    partialsDir: C.PATH_TEMPLATES_LOD_PARTIALS,
    cache: false,
    precompiled: false,
    helpers: {
      capitalize: s => s[0].toUpperCase() + s.slice(1),
    },
  }))
  app.set('view engine', 'handlebars')
  
  // run
  runAuthentication(app)
  
  // create server
  if (C.HTTPS) {
    https.createServer({
      key: fs.readFileSync(C.KEY),
      cert: fs.readFileSync(C.CERT),
    }, app).listen(C.PORT)
  } else {
    app.set('port', C.PORT)
    app.listen(app.get('port'))
  }
}

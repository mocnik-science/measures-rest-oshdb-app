const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const https = require('https')

const C = require('./../constants')
const {runAuthentication} = require('./../tier2-authentication/authentication')

module.exports.runWebserver = () => {
  const app = express()
  
  const bodyParserJson = bodyParser.json()
  app.use((req, res, next) => (req.method == 'POST') ? bodyParserJson(req, res, next): next())
  
  runAuthentication(app)
  
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

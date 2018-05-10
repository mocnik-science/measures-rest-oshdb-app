const express = require('express')

const C = require('./../constants')

module.exports.runRoutesPublicStatic = (use, get, post) => {
  // static
  use('/static/vs', express.static('./../frontend/node_modules/monaco-editor/min/vs'))
  use('/static/libs', express.static('./../backend/libs'))
  use('/static/help', express.static('./../backend/help'))

  // development
  if (!C.DEVELOPMENT) {
    use('/', express.static('./../frontend/build'))
    use('*', express.static('./../frontend/build/index.html'))
  }  
}

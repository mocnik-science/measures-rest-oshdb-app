const express = require('express')

module.exports.runRoutesPublicStatic = (use, get, post) => {
  use('/static/vs', express.static('./../frontend/node_modules/monaco-editor/min/vs'))
  use('/static/libs', express.static('./../backend/libs'))
  use('/repository/static/libs', express.static('./../backend/libs'))
  use('/static/docs', express.static('./../backend/docs'))
}

const express = require('express')

const C = require('./../constants')

module.exports.runRoutesProduction = (use, get, post) => {
  // production
  if (!C.DEVELOPMENT) {
    use('/', express.static('./../frontend/build'))
    use('*', express.static('./../frontend/build/index.html'))
  }
}

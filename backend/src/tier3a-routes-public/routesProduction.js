const express = require('express')

const C = require('./../constants')

module.exports.runRoutesPublicProduction = (use, get, post) => {
  if (!C.DEVELOPMENT) {
    use('/', express.static('./../frontend/build'))
    use('*', express.static('./../frontend/build/index.html'))
  }
}

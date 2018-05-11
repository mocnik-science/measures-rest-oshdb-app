const express = require('express')

const C = require('./../constants')
const settingsApp = require('./../settings')
const {getMeasure, getResult, getContext, getPerson} = require('./../tier4-functionality/lod')

module.exports.runRoutesPublicLOD = (use, get, post) => {
  get('/repository/measure/:id', getMeasure(null))
  get('/repository/result/:id', getResult(null))
  get('/repository/context/:id', getContext(null))
  get('/repository/person/:id', getPerson(null))
  use('/repository/static/', express.static(C.PATH_TEMPLATES_LOD_STATIC))
  get('/repository', (req, res) => {
    res.render('home', Object.assign(defaultData(req, true), {
    }))
  })
}

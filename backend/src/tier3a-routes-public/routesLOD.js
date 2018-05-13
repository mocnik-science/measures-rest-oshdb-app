const express = require('express')
const fs = require('fs')

const C = require('./../constants')
const settingsApp = require('./../settings')
const {getMeasure, getResult, getContext, getPerson, defaultData} = require('./../tier4-functionality/lod')

module.exports.runRoutesPublicLOD = (use, get, post) => {
  get('/repository/measure/:id', getMeasure(null))
  get('/repository/result/:id', getResult(null))
  get('/repository/context/:id', getContext(null))
  get('/repository/person/:id', getPerson(null))
  use('/repository/static/', express.static(C.PATH_TEMPLATES_LOD_STATIC))
  get('/repository/documentation', (req, res) => res.render('documentation', Object.assign(defaultData(req, true), {
    documentation: fs.readFileSync('./docs-lod/documentation.md'),
  })))
  get('/repository/query', (req, res) => res.render('query', Object.assign(defaultData(req, true), {
    endpoint: settingsApp.sparqlEndpoint,
  })))
  get('/repository/about', (req, res) => res.render('about', Object.assign(defaultData(req, true), {})))
  get('/repository', (req, res) => res.render('home', Object.assign(defaultData(req, true), {})))
}

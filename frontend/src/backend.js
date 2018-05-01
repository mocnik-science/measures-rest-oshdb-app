import moment from 'moment'

// HELPING FUNCTIONS

const fetchWithCallback = uri => callback => {
  return fetch(uri, {
    accept: 'application/json',
    credentials: 'include',
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(callback)
}
const fetchRawWithCallback = uri => callback => {
  return fetch(uri, {
    accept: 'application/markdown',
    credentials: 'include',
  })
    .then(checkStatus)
    .then(parseText)
    .then(callback)
}
const putWithCallbackWithId = (uri, id) => (data, callback) => {
  return fetch(uri, {
    accept: 'application/json',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
    method: 'POST',
    body: JSON.stringify({
      id: id,
      data: data,
      timestamp: moment().utc().valueOf(),
    }),
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(callback)
}

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) return response
  console.error(`HTTP Error ${response.statusText}`)
  return {json: () => {}}
}

const parseJSON = response => response.json()
const parseText = response => response.text()

// IMPLEMENTATION

export const login = (username, password, callback) => fetchWithCallback(`/backend/login?username=${username}&password=${password}`)(callback)
export const logout = fetchWithCallback('/backend/logout')
export const user = fetchWithCallback('/backend/user')

export const contexts = fetchWithCallback('/backend/contexts')
export const context = (id, callback) => fetchWithCallback(`/backend/context/id/${id}`)(callback)
export const contextSave = (id, data, callback) => putWithCallbackWithId(`/backend/context/id/${id}`, id)(data, callback)
export const contextNew = fetchWithCallback('/backend/context/new')

export const measures = fetchWithCallback('/backend/measures')
export const measure = (id, callback) => fetchWithCallback(`/backend/measure/id/${id}`)(callback)
export const measureSave = (id, data, callback) => putWithCallbackWithId(`/backend/measure/id/${id}`, id)(data, callback)
export const measureNew = fetchWithCallback('/backend/measure/new')

export const persons = fetchWithCallback('/backend/persons')
export const person = (id, callback) => fetchWithCallback(`/backend/person/id/${id}`)(callback)
export const personSave = (id, data, callback) => putWithCallbackWithId(`/backend/person/id/${id}`, id)(data, callback)
export const personNew = fetchWithCallback('/backend/person/new')

export const results = fetchWithCallback('/backend/results')
export const result = (id, callback) => fetchWithCallback(`/backend/result/id/${id}`)(callback)
export const resultSave = (id, data, callback) => putWithCallbackWithId(`/backend/result/id/${id}`, id)(data, callback)
export const resultNew = fetchWithCallback('/backend/result/new')

export const items = fetchWithCallback('/backend/items')

export const serviceState = fetchWithCallback('/backend/service/state')
export const serviceCheck = fetchWithCallback('backend/service/check')
export const serviceStart = fetchWithCallback('/backend/service/start')
export const serviceStop = fetchWithCallback('/backend/service/stop')

export const help = (file, callback) => fetchRawWithCallback(`/static/help/${file}.md`)(callback)

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
export const user = fetchWithCallback('/backend/user')

export const measures = fetchWithCallback('/backend/measures')
export const measure = id => fetchWithCallback(`/backend/measure/id/${id}`)
export const measureSave = id => putWithCallbackWithId(`/backend/measure/id/${id}`, id)
export const measureNew = fetchWithCallback('/backend/measure/new')

export const serviceState = fetchWithCallback('/backend/service/state')
export const serviceCheck = fetchWithCallback('backend/service/check')
export const serviceStart = fetchWithCallback('/backend/service/start')
export const serviceStop = fetchWithCallback('/backend/service/stop')

export const manual = fetchRawWithCallback('/static/manual/manual.md')

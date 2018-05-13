const {spawn, spawnSync} = require('child_process')

const C = require('./../constants')

module.exports.restartEndpoint = () => spawnSync(C.CMD_SPARQL_RESTART, {shell: true}).status == 0

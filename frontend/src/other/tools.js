export const LEVEL_PUBLIC = 'PUBLIC'
export const LEVEL_USER = 'USER'

export const className = id => `Measure${id.replace(/^([a-z0-9])|-([a-z0-9])/g, (match, p1, p2, offset) => p1 ? p1.toUpperCase() : p2.toUpperCase())}`

export const isLevelPublic = x => x && x.toUpperCase() === LEVEL_PUBLIC
export const isLevelUser = x => x && x.toUpperCase() === LEVEL_USER

export const itemsToList = items => items.map(item => ({hashid: item.hashid, id: item.id, level: item.level, label: item.name, value: item.id}))

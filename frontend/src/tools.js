export const LEVEL_PUBLIC = 'PUBLIC'
export const LEVEL_USER = 'USER'

export const isLevelPublic = x => x && x.toUpperCase() === LEVEL_PUBLIC
export const isLevelUser = x => x && x.toUpperCase() === LEVEL_USER

export const itemsToList = items => items.map(item => ({label: item.name, value: item.id}))

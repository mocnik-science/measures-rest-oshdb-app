import item from './item'
import user from './user'

export const actionsUserReset = [
  item.userReset,
]

const actions = {
  ...item,
  ...user,
}
export default actions

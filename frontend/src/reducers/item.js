import {SET_ITEMS, SET_ITEM_ALL} from './../actions/item'

export default (state = {
  items: null,
  itemAll: {},
}, action) => {
  switch (action.type) {
    case SET_ITEMS:
      return {
        ...state,
        items: action.items,
      }
    case SET_ITEM_ALL:
      return {
        ...state,
        itemAll: {
          ...state.item,
          [action.itemName]: action.itemAll,
        },
      }
    default:
      return state
  }
}

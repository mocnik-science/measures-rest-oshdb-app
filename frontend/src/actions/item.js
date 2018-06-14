import {itemAll, items} from './../other/backend'

export const SET_ITEMS = 'SET_ITEMS'
export const SET_ITEM_ALL = 'SET_ITEM_ALL'

const actions = {
  initItemAll: itemName => (dispatch, getState) => {
    if (getState().item.itemAll[itemName] === undefined) itemAll(itemName, itemAll => dispatch(actions._setItemAll(itemName, itemAll.items)))
  },
  _setItemAll: (itemName, itemAll) => ({
    type: SET_ITEM_ALL,
    itemName: itemName,
    itemAll: itemAll,
  }),
  initItems: () => (dispatch, getState) => {
    if (getState().item.items === null) items(items => dispatch(actions._setItems(items)))
  },
  _setItems: items => ({
    type: SET_ITEMS,
    items: items,
  }),
  userReset: () => (dispatch, getState) => {
    for (const itemName of Object.keys(getState().item.itemAll)) console.log(itemName)
    for (const itemName of Object.keys(getState().item.itemAll)) itemAll(itemName, itemAll => dispatch(actions._setItemAll(itemName, itemAll.items)))
    if (getState().item.items !== null) items(items => dispatch(actions._setItems(items)))
  },  
}
export default actions
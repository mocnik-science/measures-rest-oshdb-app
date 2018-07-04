import {itemAll, items} from './../other/backend'

export const SET_ITEMS = 'SET_ITEMS'
export const SET_ITEM_ALL = 'SET_ITEM_ALL'

const actions = {
  forceItemAll: itemName => (dispatch, getState) => {
    itemAll(itemName, itemAll => dispatch(actions.setItemAll(itemName, itemAll.items)))
    actions.forceItems()
  },
  forceItems: () => (dispatch, getState) => {
    items(items => dispatch(actions.setItems(items)))
  },
  initItemAll: itemName => (dispatch, getState) => {
    if (getState().item.itemAll[itemName] === undefined) itemAll(itemName, itemAll => dispatch(actions.setItemAll(itemName, itemAll.items)))
  },
  setItemAll: (itemName, itemAll) => ({
    type: SET_ITEM_ALL,
    itemName: itemName,
    itemAll: itemAll,
  }),
  initItems: () => (dispatch, getState) => {
    if (getState().item.items === null) items(items => dispatch(actions.setItems(items)))
  },
  setItems: items => ({
    type: SET_ITEMS,
    items: items,
  }),
  userReset: () => (dispatch, getState) => {
    for (const itemName of Object.keys(getState().item.itemAll)) console.log(itemName)
    for (const itemName of Object.keys(getState().item.itemAll)) itemAll(itemName, itemAll => dispatch(actions.setItemAll(itemName, itemAll.items)))
    if (getState().item.items !== null) items(items => dispatch(actions.setItems(items)))
  },  
}
export default actions

import {login, user, asUser, logout} from './../other/backend'
import {actionsUserReset} from './index'

export const SET_USER = 'SET_USER'
export const RESET_USER_DATA = 'RESET_USER_DATA'

const actions = {
  initUser: () => (dispatch, getState) => {
    if (getState().user.user === null) user(user => dispatch(actions._setUser(user, true)))
  },
  asUser: username => dispatch => asUser(username, user => dispatch(actions._setUser(user))),
  login: (username, password) => dispatch => login(username, password, user => dispatch(actions._setUser(user))),
  logout: () => dispatch => logout(() => dispatch(actions._setUser(null))),
  _setUser: (user, supressLoginError=false) => (dispatch, getState) => {
    if (user !== getState().user.user) for (const a of actionsUserReset) a()(dispatch, getState)
    dispatch ({
      type: SET_USER,
      user: user,
      loginError: !supressLoginError && (user === undefined || user === null|| user.username === null),
    })
  }
}
export default actions

import {SET_USER} from './../actions/user'

export default (state = {
  user: null,
  loginError: false,
}, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.user,
        loginError: action.loginError,
      }
    default:
      return state
  }
}

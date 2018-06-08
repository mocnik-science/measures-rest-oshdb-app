import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import LoginForm from 'grommet/components/LoginForm'

import actions from './../actions'

class Authentication extends React.Component {
  render() {
    this.props.initUser()
    const loginMask = (
      <div style={{
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <LoginForm
          title='OSM Measure Repository'
          usernameType='text'
          errors={(this.props.loginError) ? ['Your login credentials are wrong.  Please try again.'] : []}
          onSubmit={e => this.props.login(e.username, e.password)}
        />
      </div>)
    return (
      <div>
        {this.props.user && this.props.user.username ? this.props.children : loginMask}
      </div>
    )
  }
}
Authentication.propTypes = {
  user: PropTypes.object,
  loginError: PropTypes.bool.isRequired,
  initUser: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  user: state.user.user,
  loginError: state.user.loginError,
})
const mapDispatchToProps = dispatch => ({
  initUser: () => dispatch(actions.initUser()),
  login: (username, password) => dispatch(actions.login(username, password)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Authentication)

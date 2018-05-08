import PropTypes from 'prop-types'
import React from 'react'
import LoginForm from 'grommet/components/LoginForm'

import {login, user} from './../other/backend'

class Authentication extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      loginError: false,
    }
  }
  getChildContext() {
    return {
      user: this.state.user,
    }
  }
  componentWillMount() {
    user(response => this.setState({user: response}))
  }
  render() {
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
          errors={(this.state.loginError) ? ['Your login credentials are wrong.  Please try again.'] : []}
          onSubmit={e => login(e.username, e.password, response => this.setState({
            loginError: (response === undefined || response.username === null),
            user: response,
          }))}
        />
      </div>)
    return (
      <div>
        {this.state.user && this.state.user.username ? this.props.children : loginMask}
      </div>
    )
  }
}
Authentication.childContextTypes = {
  user: PropTypes.object,
}

export default Authentication

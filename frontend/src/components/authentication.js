import React from 'react'
import LoginForm from 'grommet/components/LoginForm'

import {login, user} from './../backend'

class Authentication extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: null,
      loginError: false,
    }
  }
  componentWillMount() {
    user(d => this.setState(d))
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
          onSubmit={e => login(e.username, e.password, d => this.setState(Object.assign(d, {loginError: true})))}
        />
      </div>)
    return (
      <div>
        {this.state.username ? this.props.children : loginMask}
      </div>
    )
  }
}

export default Authentication

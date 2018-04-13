import React from 'react'
import LoginForm from 'grommet/components/LoginForm'

import {login, user} from './../backend'

class Authentication extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: null,
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
        <LoginForm title='Measures REST' usernameType='text' onSubmit={e => login(e.username, e.password, d => this.setState(d))}/>
      </div>)
    return (
      <div>
        {this.state.username ? this.props.children : loginMask}
      </div>
    )
  }
}

export default Authentication

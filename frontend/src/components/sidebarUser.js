import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import Anchor from 'grommet/components/Anchor'
import Menu from 'grommet/components/Menu'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faBars from '@fortawesome/fontawesome-free-solid/faBars'

import actions from './../actions'

class SidebarUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      asUser: null,
    }
  }
  render() {
    if (!this.props.user.admin || this.props.user.asUserList === null || this.props.user.asUserList === {}) return []
    return (
      <Menu
        responsive={true}
        icon={<FontAwesomeIcon icon={faBars}/>}
      >
        {
          [[this.props.user.realUsername, 'me']].concat(Object.entries(this.props.user.asUserList)).map(([username, name]) => <Anchor
            href='#'
            label={name}
            onClick={() => this.props.asUser(username)}
            key={username}
            icon={<span></span>}
            primary={username === this.props.user.username}
          />)
        }
      </Menu>
    )
  }
}

SidebarUser.propTypes = {
  user: PropTypes.object.isRequired,
  asUser: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  user: state.user.user,
})
const mapDispatchToProps = dispatch => ({
  asUser: user => dispatch(actions.asUser(user)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SidebarUser)

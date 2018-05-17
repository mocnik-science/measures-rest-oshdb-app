import PropTypes from 'prop-types'
import React from 'react'
import { withRouter } from 'react-router-dom'
import Anchor from 'grommet/components/Anchor'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import Header from 'grommet/components/Header'
import Menu from 'grommet/components/Menu'
import Sidebar from 'grommet/components/Sidebar'
import Title from 'grommet/components/Title'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faArrowLeft from '@fortawesome/fontawesome-free-solid/faArrowLeft'

import SidebarService from './sidebarService'
import SidebarUser from './sidebarUser'
import pages from './../pages/pages'

import {logout} from './../other/backend'

class SidebarNavigation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lastLocations: ['/'],
    }
    this.logout = this.logout.bind(this)
  }
  logout(e) {
    e.preventDefault()
    logout(() => window.location.href = '/')
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props && this.state.lastLocations[0] !== prevProps.location.pathname) this.setState({lastLocations: [prevProps.location.pathname, ...this.state.lastLocations.slice(0, 3)]})
  }
  render() {
    return (
      <Sidebar colorIndex='brand' className={ (this.props.collapsed) ? 'sidebar collapsed' : 'sidebar'}>
        {
          (this.props.collapsed) ?
          [
            <Button key="back" icon={<FontAwesomeIcon icon={faArrowLeft}/>} onClick={() => this.props.history.push(this.state.lastLocations.filter(x => x !== this.props.location.pathname)[0])}/>
          ] :
          [
            <Header key='header' pad='medium' justify='between' style={{paddingRight: 0}}>
              <Title>OSM Measure Repository</Title>
            </Header>,
            <Box key='navigation' flex='grow' justify='start'>
              <Menu primary={true}>
                {pages.map(page => (page.menu) ? <Anchor key={page.path} path={page.path} className={((typeof(page.menu) === 'string') ? 'subpage' : '') + ' ' + ((pages.filter(p => p.menu === page.path).length) ? 'hasSubpage' : '')}>{page.label}</Anchor> : [])}
                <Anchor key="logout" path="/logout" onClick={e => this.logout(e)}>Logout</Anchor>
              </Menu>
            </Box>,
            <SidebarUser key='user'/>,
            <SidebarService key='service'/>,
          ]
        }
      </Sidebar>
    )
  }
}
SidebarNavigation.propTypes = {
  collapsed: PropTypes.bool,
}
SidebarNavigation.defaultProps = {
  collapsed: false,
}

export default withRouter(SidebarNavigation)

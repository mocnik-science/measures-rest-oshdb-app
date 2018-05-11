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

import SidebarState from './sidebarState'
import pages from './../pages/pages'

import {logout} from './../other/backend'

class SidebarNavigation extends React.Component {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
  }
  logout(e) {
    e.preventDefault()
    logout(() => window.location.href = '/')
  }
  render() {
    return (
      <Sidebar colorIndex='brand' className={ (this.props.collapsed) ? 'sidebar collapsed' : 'sidebar'}>
        {
          (this.props.collapsed) ?
          [
            <Button key="back" icon={<FontAwesomeIcon icon={faArrowLeft}/>} onClick={this.props.history.goBack}/>
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
            <SidebarState key='footer'/>
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

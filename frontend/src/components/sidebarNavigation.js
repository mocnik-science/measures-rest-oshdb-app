import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import Anchor from 'grommet/components/Anchor'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import Header from 'grommet/components/Header'
import Menu from 'grommet/components/Menu'
import Sidebar from 'grommet/components/Sidebar'
import Title from 'grommet/components/Title'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faArrowLeft from '@fortawesome/fontawesome-free-solid/faArrowLeft'

import actions from './../actions'
import SidebarService from './sidebarService'
import SidebarUser from './sidebarUser'
import pages from './../pages/pages'

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
    this.props.logout()
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
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', padding: '12px 12px 12px 24px', height: 48}}>
                  <Anchor key="logout" path="/logout" onClick={e => this.logout(e)}>Logout</Anchor>
                  <span  style={{top: -11, position: 'relative'}}><SidebarUser key='user'/></span>
                </div>
              </Menu>
            </Box>,
            <SidebarService key='service'/>
          ]
        }
      </Sidebar>
    )
  }
}
SidebarNavigation.propTypes = {
  collapsed: PropTypes.bool,
  logout: PropTypes.func.isRequired,
}
SidebarNavigation.defaultProps = {
  collapsed: false,
}

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(actions.logout()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SidebarNavigation))

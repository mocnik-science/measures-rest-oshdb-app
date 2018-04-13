import React from 'react'
import Anchor from 'grommet/components/Anchor'
import Box from 'grommet/components/Box'
import Header from 'grommet/components/Header'
import Menu from 'grommet/components/Menu'
import Sidebar from 'grommet/components/Sidebar'
import Title from 'grommet/components/Title'

import SidebarState from './sidebarState'
import pages from './../pages'

class SidebarNavigation extends React.Component {
  render() {
    return (
      <Sidebar colorIndex='brand'>
        <Header pad='medium' justify='between'>
          <Title>Measures REST</Title>
        </Header>
        <Box flex='grow' justify='start'>
          <Menu primary={true}>
            {pages.map(page => (page.menu) ? <Anchor key={page.path} path={page.path}>{page.label}</Anchor> : [])}
          </Menu>
        </Box>
        <SidebarState/>
      </Sidebar>
    )
  }
}

export default SidebarNavigation

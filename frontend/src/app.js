import React from 'react'
import {default as AppGrommet} from 'grommet/components/App'
import Split from 'grommet/components/Split'
import { Redirect, Route, Switch } from 'react-router-dom'
import './app.css'
import './dist/app.css'

import pages from './pages'
import Authentication from './components/authentication'
import SidebarNavigation from './components/sidebarNavigation'

class App extends React.Component {
  render() {
    return (
      <AppGrommet centered={false}>
        <Authentication>
          <Route path='/' exact><Redirect to='/dashboard'/></Route>
          <Split flex='right'>
            <SidebarNavigation/>
            <Switch>
              {pages.map(page => <Route key={page.path} exact={page.exact} path={page.path} component={page.component}/>)}
            </Switch>
          </Split>
        </Authentication>
      </AppGrommet>
    )
  }
}

export default App

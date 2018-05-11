import React from 'react'
import {default as AppGrommet} from 'grommet/components/App'
import Split from 'grommet/components/Split'
import { matchPath, Redirect, Route, Switch, withRouter } from 'react-router-dom'
import './app.css'
import './dist/app.css'

import pages from './pages/pages'
import Authentication from './components/authentication'
import SidebarNavigation from './components/sidebarNavigation'

const activeComponent = props => pages.filter(page => matchPath(props.location.pathname, {path: page.path, exact: page.exact}))[0]

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeComponent: activeComponent(this.props),
    }
    this.onLocationDidChange = this.onLocationDidChange.bind(this)
  }
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) this.onLocationDidChange()
  }
  onLocationDidChange() {
    this.setState({activeComponent: activeComponent(this.props)})
  }
  render() {
    return (
      <AppGrommet centered={false}>
        <Authentication>
            <Split flex='right'>
              <SidebarNavigation collapsed={this.state.activeComponent && this.state.activeComponent.navigationCollapsed}/>
              <Switch>
                {pages.map(page => <Route key={page.path} exact={page.exact} path={page.path} component={page.component}/>)}
                <Redirect to='/dashboard'/>
              </Switch>
            </Split>
        </Authentication>
      </AppGrommet>
    )
  }
}

export default withRouter(App)

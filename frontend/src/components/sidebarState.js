import React from 'react'
import Button from 'grommet/components/Button'
import Footer from 'grommet/components/Footer'
import Label from 'grommet/components/Label'
import Layer from 'grommet/components/Layer'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faExclamationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle'
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay'
import faRedo from '@fortawesome/fontawesome-free-solid/faRedo'
import faStop from '@fortawesome/fontawesome-free-solid/faStop'

import {serviceState, serviceStart, serviceStop} from './../other/backend'

class SidebarService extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      serviceRunning: null,
      serviceState: null,
      serviceLogs: null,
      showLogsLayer: false,
    }
    this.checkService = this.checkService.bind(this)
    this.renderService = this.renderService.bind(this)
  }
  componentWillMount() {
    this.checkService = setInterval(this.checkService, 1000)
  }
  componentWillUnmount() {
    clearInterval(this.checkService)
  }
  checkService() {
    serviceState(response => this.setState(response))
  }
  renderService() {
    switch (this.state.serviceRunning) {
      case true:
        return <Button icon={<FontAwesomeIcon icon={faStop}/>} label={<Label>{this.state.serviceState}</Label>} plain={true} onClick={() => serviceStop(response => this.setState(response))}/>
      case false:
        return <Button icon={<FontAwesomeIcon icon={faPlay}/>} label={<Label>{this.state.serviceState}</Label>} plain={true} onClick={() => serviceStart(response => this.setState(response))}/>
      default:
        return []
    }
  }
  render() {
    return (
      <Footer pad='small' justify='between'>
        {this.renderService()}
        <div>
          {this.state.showLogsLayer ? <Layer closer={true} overlayClose={true} onClose={() => this.setState({showLogsLayer: false})}>
            <code style={{fontSize: 12, fontFamily: 'monospace', whiteSpace: 'pre'}}>{this.state.serviceLogs}</code>
          </Layer> : []}
          {this.state.serviceLogs ? <Button icon={<FontAwesomeIcon icon={faExclamationTriangle}/>} onClick={() => this.setState({showLogsLayer: true})}/> : []}
          {this.state.serviceRunning ? <Button icon={<FontAwesomeIcon icon={faRedo}/>} style={{marginLeft: -10}} onClick={() => serviceStart(response => this.setState(response))}/> : []}
        </div>
      </Footer>
    )
  }
}

export default SidebarService

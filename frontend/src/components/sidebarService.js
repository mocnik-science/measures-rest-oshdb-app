import PropTypes from 'prop-types'
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
      waitingForResponse: false,
      isMounted: false,
    }
    this.checkService = this.checkService.bind(this)
    this.renderService = this.renderService.bind(this)
    this.startService = this.startService.bind(this)
    this.stopService = this.stopService.bind(this)
    this.waitForResponse = this.waitForResponse.bind(this)
    this.unwaitForResponse = this.unwaitForResponse.bind(this)
  }
  componentWillMount() {
    this._checkService = setInterval(this.checkService, this.props.checkServiceInterval)
    this.setState({isMounted: true})
  }
  componentWillUnmount() {
    this.setState({isMounted: false})
    clearInterval(this._checkService)
    clearInterval(this._waitForResponse)
  }
  checkService() {
    serviceState(response => {
      if (this.state.isMounted) this.setState(response)
    })
  }
  startService() {
    this.waitForResponse()
    serviceStart(response => {
      this.unwaitForResponse()
      this.setState(response)
    })
  }
  stopService() {
    this.waitForResponse()
    serviceStop(response => {
      this.unwaitForResponse()
      this.setState(response)
    })
  }
  waitForResponse() {
    this.setState({waitingForResponse: true})
    this._waitForResponse = setInterval(this.unwaitForResponse, this.props.waitForResponseTimeout)
  }
  unwaitForResponse() {
    this.setState({waitingForResponse: false})
    this._waitForResponse = setInterval(this.unwaitForResponse, this.props.waitForResponseTimeout)
  }
  renderService() {
    switch (this.state.serviceRunning) {
      case true:
        return <Button icon={<FontAwesomeIcon icon={faStop}/>} label={<Label>{this.state.serviceState}</Label>} plain={true} onClick={(this.state.waitingForResponse) ? null : this.stopService}/>
      case false:
        return <Button icon={<FontAwesomeIcon icon={faPlay}/>} label={<Label>{this.state.serviceState}</Label>} plain={true} onClick={(this.state.waitingForResponse) ? null : this.startService}/>
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
          {this.state.serviceRunning ? <Button icon={<FontAwesomeIcon icon={faRedo}/>} style={{marginLeft: -10}} onClick={(this.state.waitingForResponse) ? null : this.startService}/> : []}
        </div>
      </Footer>
    )
  }
}
SidebarService.propTypes = {
  checkServiceInterval: PropTypes.number,
  waitForResponseTimeout: PropTypes.number,
}
SidebarService.defaultProps = {
  checkServiceInterval: 1000,
  waitForResponseTimeout: 5000,
}

export default SidebarService

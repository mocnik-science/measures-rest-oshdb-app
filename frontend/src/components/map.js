import React from 'react'

import {mapInfo} from './../other/backend'

class Map extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      measure: null,
      url: null,
    }
    this._L = window.L
  }
  componentDidMount() {
    mapInfo(this.props.level, this.props.id, response => this.setState(response, () => {
      this._map = this._L.map('map').setView([57, 12], 10)
      this._L.stamenTileLayer('toner-lite').addTo(this._map);
      this._L.isea3hLayer({
        url: `${this.state.url}/api/${this.props.id}/grid?bbox={bbox}&resolution={resolution}`,
        urlLibs: '/static/libs',
      }).addTo(this._map)
    }))
  }
  render() {
    return (<div id='map' style={{height: '100%'}}></div>)
  }
}

export default Map

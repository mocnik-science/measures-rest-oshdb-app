import React from 'react'

class Map extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
    }
    this._L = window.L
  }
  componentDidMount() {
    this._map = this._L.map('map').setView([57, 12], 10)
    this._L.stamenTileLayer('toner-lite').addTo(this._map);
    this._L.isea3hLayer({
      url: `${'http://localhost:14244'}/api/${this.props.id}/grid?bbox={bbox}&resolution={resolution}`,
      urlLibs: '/static/libs',
    }).addTo(this._map)
  }
  render() {
    return (<div id='map' style={{height: '100%'}}></div>)
  }
}

export default Map

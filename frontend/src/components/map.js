import PropTypes from 'prop-types'
import React from 'react'

class Map extends React.Component {
  constructor(props) {
    super(props)
    this._L = window.L
  }
  componentDidMount() {
    this._map = this._L.map('map').setView([57.7, 12.0], 10)
    this._L.stamenTileLayer('toner-lite').addTo(this._map);
    this._isea3h = this._L.isea3hLayer({
      url: `${this.props.url}?bbox={bbox}&resolution={resolution}`,
      urlLibs: '/static/libs',
      colorProgressBar: '#b81623',
    }).addTo(this._map)
  }
  componentWillUnmount() {
    this._map.removeLayer(this._isea3h)
    this._map.remove()
  }
  render() {
    return (<div id='map' style={{height: '100%'}}></div>)
  }
}
Map.propTypes = {
  url: PropTypes.string.isRequired,
}

export default Map

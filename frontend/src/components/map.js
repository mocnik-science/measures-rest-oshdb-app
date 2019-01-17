import PropTypes from 'prop-types'
import React from 'react'

class Map extends React.Component {
  constructor(props) {
    super(props)
    this._L = window.L
    this.addIsea3h = this.addIsea3h.bind(this)
  }
  componentDidMount() {
    this._map = this._L.map('map').setView([57.7, 12.0], 11)
    this._L.stamenTileLayer('toner-lite').addTo(this._map)
    this.addIsea3h()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.parameters !== this.props.parameters) this.addIsea3h()
  }
  componentWillUnmount() {
    this._map.removeLayer(this._isea3h)
    this._map.remove()
  }
  addIsea3h() {
    if (this._isea3h) this._map.removeLayer(this._isea3h)
    this._isea3h = this._L.isea3hLayer({
      url: `${this.props.url}?bbox={bbox}&resolution={resolution}${Object.keys(this.props.parameters).map(k => `&${k}={${k}}`).join('')}`,
      urlLibs: '/static/libs',
      colorProgressBar: '#b81623',
      parameters: this.props.parameters,
    }).addTo(this._map)
  }
  render() {
    return (<div id='map' style={{height: '100%'}}></div>)
  }
}
Map.propTypes = {
  url: PropTypes.string.isRequired,
  parameters: PropTypes.object,
}
Map.defaultProps = {
  parameters: {},
}

export default Map

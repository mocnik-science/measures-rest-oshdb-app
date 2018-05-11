import PropTypes from 'prop-types'
import React from 'react'
import Box from 'grommet/components/Box'

import Map from './../components/map'

class PageMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
    }
  }
  componentDidMount() {
  }
  render() {
    return (
      <div style={{height: '100%'}}>
        <Map
          level={this.props.match.params.level}
          id={this.props.match.params.id}
        />
      </div>
    )
  }
}
PageMap.propTypes = {
  match: PropTypes.object.isRequired,
}

export default PageMap

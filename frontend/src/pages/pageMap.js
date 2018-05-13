import PropTypes from 'prop-types'
import React from 'react'
import Box from 'grommet/components/Box'
import Split from 'grommet/components/Split'
import Title from 'grommet/components/Title'

import {mapInfo} from './../other/backend'
import Map from './../components/map'

class PageMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      measure: null,
      url: null,
    }
    mapInfo(this.props.match.params.level, this.props.match.params.id, response => this.setState(response))
  }
  render() {
    return (
      <div className='map-split'>
        <Split flex='left' separator={true}>
          {
            (this.state.measure) ?
            [
              <Map
                key='map'
                url={this.state.url}
              />,
              <Box key='sidebar' pad='medium' style={{width: 300}}>
                <Title>{this.state.measure.name}</Title>
                <p><b>You will soon find functionality here for analyzing the data.</b></p>
                <p>{this.state.measure.description}</p>
              </Box>
            ] : []
          }
        </Split>
      </div>
    )
  }
}
PageMap.propTypes = {
  match: PropTypes.object.isRequired,
}

export default PageMap

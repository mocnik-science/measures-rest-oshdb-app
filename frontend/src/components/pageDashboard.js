import React from 'react'
import Box from 'grommet/components/Box'
import Label from 'grommet/components/Label'
import Meter from 'grommet/components/Meter'
import Value from 'grommet/components/Value'
import WorldMap from 'grommet/components/WorldMap'

import {measures} from './../backend'

const MAX_MEASURES = 100

class PageDashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      measures: {},
    }
    measures(response => this.setState(response))
  }
  render() {
    return (
      <Box pad='large' align='center'>
        <h2 style={{marginBottom:80}}>Welcome!</h2>
        {/*
        <h2>Measures</h2>
        */}
        <Box>
          <Value
            value={Object.keys(this.state.measures).length / MAX_MEASURES * 100}
            units='measures'
            size='xsmall'
            align='start'
          />
          <Meter
            value={Object.keys(this.state.measures).length / MAX_MEASURES * 100}
            size='small'
          />
          <Box
            direction='row'
            justify='between'
            pad={{between: 'small'}}
            responsive={false}
          >
            <Label size='small'>0</Label>
            <Label size='small'>{MAX_MEASURES}</Label>
          </Box>
        </Box>
        {/*
        <h2 style={{marginTop: 80}}>Datasets</h2>
        <WorldMap
          series={[
            {
              id: 'heidelberg',
              label: 'Heidelberg',
              place: [49.416667, 8.716667],
              colorIndex: 'brand',
            }
          ]}
        />
        */}
      </Box>
    )
  }
}

export default PageDashboard

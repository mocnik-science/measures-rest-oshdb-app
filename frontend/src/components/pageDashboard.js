import React from 'react'
import Box from 'grommet/components/Box'
import Label from 'grommet/components/Label'
import Meter from 'grommet/components/Meter'
import Value from 'grommet/components/Value'
import WorldMap from 'grommet/components/WorldMap'

class PageDashboard extends React.Component {
  render() {
    return (
      <Box pad='large' align='center'>
        <h2>Measures</h2>
        <Box>
          <Value
            value={10}
            units='measures'
            size='xsmall'
            align='start'
          />
          <Meter
            size='small'
            value={40}
          />
          <Box
            direction='row'
            justify='between'
            pad={{between: 'small'}}
            responsive={false}
          >
            <Label size='small'>0</Label>
            <Label size='small'>40</Label>
          </Box>
        </Box>
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
      </Box>
    )
  }
}

export default PageDashboard

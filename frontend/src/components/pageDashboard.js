import React from 'react'
import Box from 'grommet/components/Box'
import Label from 'grommet/components/Label'
import Meter from 'grommet/components/Meter'
import Value from 'grommet/components/Value'
// import WorldMap from 'grommet/components/WorldMap'

import {items} from './../backend'

const MAX_CONTEXTS = 50
const MAX_MEASURES = 50
const MAX_PERSONS = 50
const MAX_RESULTS = 50

class PageDashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      contexts: [],
      measures: [],
      persons: [],
      results: [],
    }
    items(response => this.setState(response))
  }
  render() {
    return (
      <Box pad='large' align='center'>
        <h2 style={{marginBottom:80}}>Welcome!</h2>
        {/*
        <h2>Measures</h2>
        */}
        <div style={{display: 'flex', flexFlow: 'row'}}>
          <Box pad="medium">
            <Value
              value={Object.keys(this.state.measures).length}
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
          <Box pad="medium">
            <Value
              value={Object.keys(this.state.results).length}
              units='results'
              size='xsmall'
              align='start'
            />
            <Meter
              value={Object.keys(this.state.results).length / MAX_RESULTS * 100}
              size='small'
            />
            <Box
              direction='row'
              justify='between'
              pad={{between: 'small'}}
              responsive={false}
            >
              <Label size='small'>0</Label>
              <Label size='small'>{MAX_RESULTS}</Label>
            </Box>
          </Box>
          <Box pad="medium">
            <Value
              value={Object.keys(this.state.contexts).length}
              units='contexts'
              size='xsmall'
              align='start'
            />
            <Meter
              value={Object.keys(this.state.contexts).length / MAX_CONTEXTS * 100}
              size='small'
            />
            <Box
              direction='row'
              justify='between'
              pad={{between: 'small'}}
              responsive={false}
            >
              <Label size='small'>0</Label>
              <Label size='small'>{MAX_CONTEXTS}</Label>
            </Box>
          </Box>
          <Box pad="medium">
            <Value
              value={Object.keys(this.state.persons).length}
              units='people'
              size='xsmall'
              align='start'
            />
            <Meter
              value={Object.keys(this.state.persons).length / MAX_PERSONS * 100}
              size='small'
            />
            <Box
              direction='row'
              justify='between'
              pad={{between: 'small'}}
              responsive={false}
            >
              <Label size='small'>0</Label>
              <Label size='small'>{MAX_PERSONS}</Label>
            </Box>
          </Box>
        </div>
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

import PropTypes from 'prop-types'
import React from 'react'
import Box from 'grommet/components/Box'
// import WorldMap from 'grommet/components/WorldMap'

import {items} from './../other/backend'
import MeterItems from './../components/meterItems'

class PageDashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      contexts: [],
      measures: [],
      persons: [],
      results: [],
    }
  }
  componentDidMount() {
    items(response => this.setState(response))
  }
  render() {
    return (
      <Box pad='large' align='center'>
        <h2 style={{marginBottom: 80}}>Welcome{(this.context.user.forename) ? ' ' + this.context.user.forename : (this.context.user.username) ? ' ' + this.context.user.username : ''}!</h2>
        {/*
        <h2>Measures</h2>
        */}
        <div style={{display: 'flex', flexFlow: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
          <MeterItems
            items={this.state.measures}
            itemName='measure'
          />
          <MeterItems
            items={this.state.results}
            itemName='result'
          />
          <MeterItems
            items={this.state.contexts}
            itemName='context'
          />
          <MeterItems
            items={this.state.persons}
            itemName='person'
          />
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
PageDashboard.contextTypes = {
  user: PropTypes.object.isRequired,
}

export default PageDashboard

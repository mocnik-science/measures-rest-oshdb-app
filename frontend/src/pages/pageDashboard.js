import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import Box from 'grommet/components/Box'
// import WorldMap from 'grommet/components/WorldMap'

import actions from './../actions'
import MeterItems from './../components/meterItems'

class PageDashboard extends React.Component {
  render() {
    this.props.initItems()
    return (
      <Box pad='large' align='center'>
        <h2 style={{marginBottom: 80}}>Welcome{(this.props.user.forename) ? ' ' + this.props.user.forename : (this.props.user.username) ? ' ' + this.props.user.username : ''}!</h2>
        {/*
        <h2>Measures</h2>
        */}
        <div style={{display: 'flex', flexFlow: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
          <MeterItems
            items={(this.props.items) ? this.props.items.measures : []}
            itemName='measure'
          />
          <MeterItems
            items={(this.props.items) ? this.props.items.results : []}
            itemName='result'
          />
          <MeterItems
            items={(this.props.items) ? this.props.items.contexts : []}
            itemName='context'
          />
          <MeterItems
            items={(this.props.items) ? this.props.items.persons : []}
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
PageDashboard.propTypes = {
  user: PropTypes.object.isRequired,
  items: PropTypes.object,
}

const mapStateToProps = state => ({
  user: state.user.user,
  items: state.item.items,
})

const mapDispatchToProps = dispatch => ({
  initItems: () => dispatch(actions.initItems()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PageDashboard)

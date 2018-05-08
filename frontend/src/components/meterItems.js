import PropTypes from 'prop-types'
import React from 'react'
import Box from 'grommet/components/Box'
import Label from 'grommet/components/Label'
import Meter from 'grommet/components/Meter'
import Value from 'grommet/components/Value'

import {isLevelPublic, isLevelUser} from './../other/tools'

class MeterItems extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: undefined,
      value: null,
      label: null,
      numberItemsPublic: 0,
      numberItemsUser: 0,
      numberItemsSum: 0,
      numberItemsNonUsed: 0,
      numberItemsMax: 0,
    }
    this.onActive = this.onActive.bind(this)
  }
  onActive(active) {
    let label = 'total'
    let value = this.state.numberItemsSum
    if (active === 0) {
      label = 'public'
      value = this.state.numberItemsPublic
    } else if (active === 1) {
      label = 'user'
      value = this.state.numberItemsUser
    }
    this.setState({active: active, value: value, label: label})
  }
  componentWillReceiveProps(nextProps) {
    const s = {}
    s.numberItemsPublic = Object.values(nextProps.items).filter(i => isLevelPublic(i.level)).length
    s.numberItemsUser = Object.values(nextProps.items).filter(i => isLevelUser(i.level)).length
    s.numberItemsSum = s.numberItemsPublic + s.numberItemsUser
    s.numberItemsMax = (nextProps.max) ? nextProps.max : Math.ceil(s.numberItemsSum * 1.1 / 50) * 50
    s.numberItemsNonUsed = s.numberItemsMax - s.numberItemsSum
    this.setState(s)
  }
  componentDidUpdate(previousProps, previousState) {
    if (previousProps === this.props || previousState === this.state) return
    this.onActive(this.state.active)
  }
  render() {
    return (
      <Box className='meter' pad='medium'>
        <Box direction='row' justify='between' align='center'>
          <Value
            value={this.state.value}
            units={`${this.props.itemName}${(this.state.value === 1) ? '' : 's'}`}
            size='xsmall'
            align='start'
          />
          <span style={{fontSize: '1.25rem'}}>{this.state.label}</span>
        </Box>
        <span style={{marginTop: -14, marginBottom: -22}}>
          <Meter
            series={[
              {value: this.state.numberItemsPublic, colorIndex: 'color-public'},
              {value: this.state.numberItemsUser, colorIndex: 'color-user'},
              {value: this.state.numberItemsNonUsed, colorIndex: 'color-grey'},
            ]}
            max={this.state.numberItemsMax}
            stacked={true}
            size='medium'
            activeIndex={this.state.active}
            onActive={active => this.onActive(active)}
          />
        </span>
        <Box
          direction='row'
          justify='between'
          pad={{between: 'small'}}
          responsive={false}
        >
          <Label size='small'>0</Label>
          <Label size='small'>{this.state.numberItemsMax}</Label>
        </Box>
      </Box>
    )
  }
}
MeterItems.propTypes = {
  items: PropTypes.array.isRequired,
  max: PropTypes.number,
  itemName: PropTypes.string.isRequired,
}
MeterItems.defaultProps = {
  max: null,
}

export default MeterItems

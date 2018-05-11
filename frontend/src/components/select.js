import PropTypes from 'prop-types'
import React from 'react'
import Select from 'grommet/components/Select'

import {isLevelPublic} from './../other/tools'

export default class SelectNew extends React.Component {
  render() {
    const {forLevel, ...otherProps} = this.props
    return (
      <SelectNewInner
        {...otherProps}
        options={this.props.options.filter(i => (isLevelPublic(this.props.forLevel)) ? isLevelPublic(i.level) : true).map(i => {
          if (i.id === undefined) i.id = i.value
          return i
        })}
      />
    )
  }
}
SelectNew.propTypes = {
  forLevel: PropTypes.oneOf(['user', 'public']),
}
SelectNew.defaultProps = {
  forLevel: 'user',
}

class SelectNewInner extends Select {
  constructor(props, context) {
    super(props, context)
    this._renderValue = this._renderValue.bind(this)
  }
  _renderValue(option) {
    if (Array.isArray(option) && option.length > 1) return option.map(this._renderValue).join(', ')
    return super._renderValue(option)
  }
}

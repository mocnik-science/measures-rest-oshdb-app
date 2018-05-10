import React from 'react'
import PropTypes from 'prop-types'
import Select from 'grommet/components/Select'

import {isLevelPublic} from './../other/tools'

export default class SelectNew extends React.Component {
  render() {
    return (
      <SelectNewInner
        {...this.props}
        options={this.props.options.filter(i => (isLevelPublic(this.props.forLevel)) ? isLevelPublic(i.level) : true)}
      />
    )
  }
}
SelectNew.propTypes = {
  forLevel: PropTypes.oneOf(['private', 'public']),
}
SelectNew.defaultProps = {
  forLevel: 'private',
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

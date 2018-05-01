import Select from 'grommet/components/Select'

export default class SelectNew extends Select {
  constructor(props, context) {
    super(props, context)
    this._renderValue = this._renderValue.bind(this)
  }
  _renderValue(option) {
    if (Array.isArray(option) && option.length > 1) return option.map(this._renderValue).join(', ')
    return super._renderValue(option)
  }
}

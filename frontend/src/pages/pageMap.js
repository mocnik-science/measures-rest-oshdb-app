import PropTypes from 'prop-types'
import React from 'react'
import Box from 'grommet/components/Box'
import FormField from 'grommet/components/FormField'
import Split from 'grommet/components/Split'
import TextInput from 'grommet/components/TextInput'
import Title from 'grommet/components/Title'
import soap from 'simplified-oshdb-api-programming'

import {mapInfo} from './../other/backend'
import Map from './../components/map'

class PageMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      measure: null,
      url: null,
      parameters: {},
      activeParameters: {},
    }
    mapInfo(this.props.match.params.level, this.props.match.params.id, response => {
      response.parameters = {}
      const parsedSoap = soap.soapToMeasureWithWarnings(response.measure.code)
      if (parsedSoap.parameters !== undefined) Object.values(parsedSoap.parameters).map(p => response.parameters[p.name] = p.defaultValue)
      response.activeParameters = Object.assign({}, response.parameters)
      this.setState(response)
    })
    this.onBlur = this.onBlur.bind(this)
  }
  onBlur() {
    if (JSON.stringify(this.state.parameters) === JSON.stringify(this.state.activeParameters)) return
    this.setState({activeParameters: Object.assign({}, this.state.parameters)})
  }
  render() {
    const parsedSoap = (this.state.measure) ? soap.soapToMeasureWithWarnings(this.state.measure.code) : null
    return (
      <div className='map-split'>
        <Split flex='left' separator={true}>
          {
            (this.state.measure) ?
            [
              <Map
                key='map'
                url={this.state.url}
                parameters={this.state.activeParameters}
              />,
              <Box key='sidebar' pad='small' style={{width: 300}}>
                <Title style={{marginBottom: 20}}>{this.state.measure.name}</Title>
                {
                  (!this.state.measure) ? [] :
                  Object.values(parsedSoap.parameters).map(p => (
                  <FormField
                    key={p.name}
                    label={p.name}
                  >
                    <TextInput
                      defaultValue={this.state.parameters[p.name]}
                      onDOMChange={e => this.setState({parameters: Object.assign(this.state.parameters, {[p.name]: e.target.value})})}
                      onBlur={() => this.onBlur()}
                    />
                  </FormField>))
                }
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

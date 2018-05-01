import React from 'react'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import CheckBox from 'grommet/components/CheckBox'
import Header from 'grommet/components/Header'
import Label from 'grommet/components/Label'
import List from 'grommet/components/List'
import ListItem from 'grommet/components/ListItem'
import TextInput from 'grommet/components/TextInput'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck'
import faCode from '@fortawesome/fontawesome-free-solid/faCode'
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit'
import faExclamationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle'
import faMap from '@fortawesome/fontawesome-free-solid/faMap'
import faPlusSquare from '@fortawesome/fontawesome-free-regular/faPlusSquare'
import faStethoscope from '@fortawesome/fontawesome-free-solid/faStethoscope'

import {measures, measureSave, measureNew, serviceCheck} from './../backend'

class PageMeasure extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      measures: {},
      search: '',
      errors: null,
    }
    this.saveEnabled = this.saveEnabled.bind(this)
    this.renderErrors = this.renderErrors.bind(this)
    measures(response => this.setState(response))
  }
  saveEnabled(id, value) {
    const measures = this.state.measures
    measures[id].enabled = value
    this.setState({measures: measures})
    measureSave(id)({enabled: value}, () => {})
  }
  renderErrors(id) {
    if (this.state.errors === null || this.state.errors[id] === undefined) return []
    if (this.state.errors[id] !== '') return <Button className='exception' icon={<FontAwesomeIcon icon={faExclamationTriangle}/>} path={`/measure/log/${id}`}/>
    else return <Button icon={<FontAwesomeIcon icon={faCheck}/>} path={`/measure/log/${id}`}/>
  }
  render() {
    return (
      <div>
        <Header className='header' fixed={true} size='small' style={{paddingRight: 22}}>
          <Box flex={true} justify='end' direction='row'>
            <TextInput value={this.state.search} onDOMChange={e => this.setState({search: e.target.value})} style={{flexGrow: 1}} placeHolder='Search...' size='medium'/>
            <Button icon={<FontAwesomeIcon icon={faPlusSquare}/>} onClick={() => measureNew(response => this.setState(response))}/>
            <Button icon={<FontAwesomeIcon icon={faStethoscope}/>} onClick={() => serviceCheck(response => this.setState({errors: response}))}/>
          </Box>
        </Header>
        <List>
          {Object.values(this.state.measures).map(measure => (this.state.search !== '' && (!~measure.name.toLowerCase().indexOf(this.state.search.toLowerCase()))) ? [] :
            <ListItem key={measure.id} justify='between'>
              <span className='primary'>
                <CheckBox toggle={true} label={<Label className='pageItemLabelToggle'>{measure.name}</Label>} checked={this.state.measures[measure.id].enabled} onChange={e => this.saveEnabled(measure.id, e.target.checked)}/>
              </span>
              <span className='secondary'>
                {this.renderErrors(measure.id)}
                <Button icon={<FontAwesomeIcon icon={faEdit}/>} path={`/measure/${measure.id}/description`}/>
                <Button icon={<FontAwesomeIcon icon={faCode}/>} path={`/measure/${measure.id}/code`}/>
                <Button icon={<FontAwesomeIcon icon={faMap}/>} onClick={e => {
                  e.preventDefault()
                  window.open(`/map/${measure.id}`)
                }}/>
              </span>
            </ListItem>
          )}
        </List>
      </div>
    )
  }
}

export default PageMeasure

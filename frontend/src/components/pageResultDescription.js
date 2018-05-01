import React from 'react'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import Footer from 'grommet/components/Footer'
import Form from 'grommet/components/Form'
import FormField from 'grommet/components/FormField'
import FormFields from 'grommet/components/FormFields'
import Header from 'grommet/components/Header'
import Heading from 'grommet/components/Heading'
import Select from './select'
import TextInput from 'grommet/components/TextInput'

import {result, resultSave} from './../backend'

class PageResultDescription extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      name: '',
      nameError: null,
      description: '',
      descriptionError: null,
      documentedBy: [],
      documentedByList: [],
      documentedByError: null,
    }
    this.save = this.save.bind(this)
    result(this.props.match.params.id, response => this.setState(response))
  }
  save(e) {
    e.preventDefault()
    resultSave(this.state.id, {
      name: this.state.name,
      description: this.state.description,
      documentedBy: this.state.documentedBy,
    }, response => {
      if (response.success) this.props.history.push('/result')
      else this.setState(response.messages)
    })
  }
  render() {
    return (
      <Box align='center' pad='large'>
        <Form style={{width: 600}}>
          <Header>
            <Heading>{this.state.name}</Heading>
          </Header>
          <FormFields>
            <FormField label='name' error={this.state.nameError}>
              <TextInput value={this.state.name} onDOMChange={e => this.setState({name: e.target.value})}/>
            </FormField>
            <FormField label='description (human readable)' error={this.state.descriptionError}>
              <textarea rows="5" type="text" name="description" value={this.state.description} onChange={e => this.setState({description: e.target.value})}/>
            </FormField>
            <FormField label='documented by' error={this.state.documentedByError}>
              <Select options={this.state.documentedByList} multiple={true} value={this.state.documentedBy} onChange={e => this.setState({documentedBy: e.value})}/>
            </FormField>
          </FormFields>
          <Footer pad={{'vertical': 'medium', 'display': 'inline-block'}}>
            <Button label='save' type='submit' primary={true} onClick={this.save}/>
          </Footer>
        </Form>
      </Box>
    )
  }
}

export default PageResultDescription

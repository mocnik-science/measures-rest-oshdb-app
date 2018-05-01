import React from 'react'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import Footer from 'grommet/components/Footer'
import Form from 'grommet/components/Form'
import FormField from 'grommet/components/FormField'
import FormFields from 'grommet/components/FormFields'
import Header from 'grommet/components/Header'
import Heading from 'grommet/components/Heading'
import TextInput from 'grommet/components/TextInput'

import {person, personSave} from './../backend'

class PagePersonDescription extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      name: '',
      nameError: null,
      homepage: '',
      homepageError: null,
    }
    this.save = this.save.bind(this)
    person(this.props.match.params.id, response => this.setState(response))
  }
  save(e) {
    e.preventDefault()
    personSave(this.state.id, {
      name: this.state.name,
      homepage: this.state.homepage,
    }, response => {
      if (response.success) this.props.history.push('/person')
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
            <FormField label='forename and surname' error={this.state.nameError}>
              <TextInput value={this.state.name} onDOMChange={e => this.setState({name: e.target.value})}/>
            </FormField>
            <FormField label='homepage' error={this.state.homepageError}>
              <TextInput value={this.state.homepage} onDOMChange={e => this.setState({homepage: e.target.value})}/>
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

export default PagePersonDescription
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

import {measure, measureSave} from './../backend'

class PageMeasureDescription extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      name: '',
      nameError: null,
    }
    this.save = this.save.bind(this)
    measure(this.props.match.params.id)(response => this.setState(response))
  }
  save(e) {
    e.preventDefault()
    measureSave(this.state.id)({
      name: this.state.name,
    }, response => {
      if (response.success) this.props.history.push('/measure')
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
            <FormField label='description'>
              <TextInput value='hello'/>
            </FormField>
          </FormFields>
          <Footer pad={{'vertical': 'medium'}}>
            <Button label='save' type='submit' primary={true} onClick={this.save}/>
          </Footer>
        </Form>
      </Box>
    )
  }
}

export default PageMeasureDescription

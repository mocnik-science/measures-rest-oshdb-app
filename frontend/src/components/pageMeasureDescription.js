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

import {measures} from './../backend'

class PageMeasureDescription extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
    }
    measures(response => this.setState({measures: response.measures}))
  }
  render() {
    return (
      <Box align='center' pad='large'>
        <Form>
          <Header>
            <Heading>{this.state.name}</Heading>
          </Header>
          <FormFields>
            <FormField label='name'>
              <TextInput value={this.state.name} onDOMChange={e => this.setState({name: e.target.value})}/>
            </FormField>
            <FormField label='description'>
              <TextInput value='hello'/>
            </FormField>
          </FormFields>
          <Footer pad={{'vertical': 'medium'}}>
            <Button label='save' type='submit' primary={true}/>
          </Footer>
        </Form>
      </Box>
    )
  }
}

export default PageMeasureDescription

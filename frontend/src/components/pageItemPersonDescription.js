import React from 'react'
import FormField from 'grommet/components/FormField'
import TextInput from 'grommet/components/TextInput'

import {person, personSave} from './../backend'
import PageItemDescription from './pageItemDescription'

class PageItemPersonDescription extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      name: '',
      nameError: null,
      homepage: '',
      homepageError: null,
    }
  }
  render() {
    return (
      <PageItemDescription
        setState={response => this.setState(response)}
        itemName='person'
        item={person}
        itemSave={personSave}
        name={this.state.name}
        data={{
          name: this.state.name,
          homepage: this.state.homepage,
        }}
        fields={[
          <FormField key='name' label='forename and surname' error={this.state.nameError}>
            <TextInput value={this.state.name} onDOMChange={e => this.setState({name: e.target.value})}/>
          </FormField>,
          <FormField key='homepage' label='homepage' error={this.state.homepageError}>
            <TextInput value={this.state.homepage} onDOMChange={e => this.setState({homepage: e.target.value})}/>
          </FormField>,
        ]}
        {...this.props}
      />
    )
  }
}

export default PageItemPersonDescription

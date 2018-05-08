import React from 'react'
import FormField from 'grommet/components/FormField'
import TextInput from 'grommet/components/TextInput'

import {items} from './../other/backend'
import {itemsToList} from './../other/tools'
import Select from './../components/select'
import PageItemDescription from './pageItemDescription'

class PageContextDescription extends React.Component {
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
      level: null,
    }
  }
  componentDidMount() {
    items(response => this.setState({
      documentedByList: itemsToList(response.persons),
    }))
  }
  render() {
    return (
      <PageItemDescription
        setState={response => this.setState(response)}
        itemName='context'
        name={this.state.name}
        data={{
          name: this.state.name,
          description: this.state.description,
          documentedBy: this.state.documentedBy,
          level: this.state.level,
        }}
        fields={[
          <FormField key='name' label='name' error={this.state.nameError}>
            <TextInput value={this.state.name} onDOMChange={e => this.setState({name: e.target.value})}/>
          </FormField>,
          <FormField key='description' label='description (human readable)' error={this.state.descriptionError}>
            <textarea rows="5" type="text" name="description" value={this.state.description} onChange={e => this.setState({description: e.target.value})}/>
          </FormField>,
          <FormField key='documentedBy' label='documented by' error={this.state.documentedByError}>
            <Select options={this.state.documentedByList} multiple={true} value={this.state.documentedBy} onChange={e => this.setState({documentedBy: e.value})}/>
          </FormField>,
        ]}
        {...this.props}
      />
    )
  }
}

export default PageContextDescription

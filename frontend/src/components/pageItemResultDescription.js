import React from 'react'
import FormField from 'grommet/components/FormField'
import Select from './select'
import TextInput from 'grommet/components/TextInput'

import {result, resultSave, items} from './../backend'
import {itemsToList} from './../tools'
import PageItemDescription from './pageItemDescription'

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
        itemName='result'
        item={result}
        itemSave={resultSave}
        name={this.state.name}
        data={{
          name: this.state.name,
          description: this.state.description,
          documentedBy: this.state.documentedBy,
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

export default PageResultDescription

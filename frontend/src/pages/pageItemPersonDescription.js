import React from 'react'
import FormField from 'grommet/components/FormField'
import TextInput from 'grommet/components/TextInput'

import PageItemDescription from './pageItemDescription'

const styles = {
  formFieldRow: {
    display: 'flex',
  },
  formField: {
    marginRight: -1,
    marginBottom: -1,
  },
  formFieldLast: {
    marginBottom: -1,
  },
}

class PageItemPersonDescription extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      forename: '',
      surname: '',
      nameError: null,
      homepage: '',
      homepageError: null,
      level: null,
    }
  }
  render() {
    return (
      <PageItemDescription
        setState={response => this.setState(response)}
        itemName='person'
        name={`${this.state.forename} ${this.state.surname}`}
        data={{
          name: `${this.state.forename} ${this.state.surname}`,
          forename: this.state.forename,
          surname: this.state.surname,
          homepage: this.state.homepage,
          level: this.state.level,
        }}
        fields={[
          <div style={styles.formFieldRow}>
            <FormField key='name' label='forename' error={this.state.nameError} style={styles.formField}>
              <TextInput value={this.state.forename} onDOMChange={e => this.setState({forename: e.target.value})}/>
            </FormField>
            <FormField key='name' label='surname' error={this.state.nameError} style={styles.formFieldLast}>
              <TextInput value={this.state.surname} onDOMChange={e => this.setState({surname: e.target.value})}/>
            </FormField>
          </div>,
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

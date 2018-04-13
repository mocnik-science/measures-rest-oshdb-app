import React from 'react'
import PropTypes from 'prop-types'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import Header from 'grommet/components/Header'
import Title from 'grommet/components/Title'
import moment from 'moment'
import MonacoEditor from 'react-monaco-editor'

import {measure, measureSave} from './../backend'

class PageMeasureCode extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      name: '',
      code: '',
      saved: true,
      lastSaved: null,
      lastSavedTry: null,
      buttonLabel: 'saved',
    }
    this.editorDidMount = this.editorDidMount.bind(this)
    this.onChange = this.onChange.bind(this)
    this.save = this.save.bind(this)
    measure(this.props.match.params.id)(response => this.setState(response))
  }
  componentWillMount() {
    this.saveService = setInterval(this.save, this.props.autoSaveInterval)
  }
  componentWillUnmount() {
    clearInterval(this.saveService)
  }
  editorDidMount(editor, monaco) {
    editor.focus()
  }
  onChange(newValue, e) {
    this.setState({saved: false, code: newValue, lastSaved: null, lastSavedTry: null, buttonLabel: 'save'})
  }
  save(force=false) {
    if (this.state.saved) return
    let lastSavedTry = this.state.lastSavedTry
    if (this.state.lastSavedTry !== null && this.state.lastSavedTry.add(this.props.autoSaveTimeout, 'milliseconds') < moment()) {
      this.setState({lastSavedTry: null})
      lastSavedTry = null
    }
    if (!force && lastSavedTry !== null) return
    this.setState({lastSavedTry: moment(), buttonLabel: 'saving ...'})
    measureSave(this.state.id)({code: this.state.code}, response => this.setState((response.success) ? {saved: true, lastSaved: moment(), lastSavedTry: null, buttonLabel: 'saved'}: {}))
  }
  render() {
    const code = this.state.code
    return (
      <Box className='noScroll' full={true}>
        <Header>
          <Box pad='medium'>
            <Title>Measure: {this.state.name}</Title>
          </Box>
          <Box flex={true} justify='end' direction='row' responsive={false} pad='medium'>
            <Button label={this.state.buttonLabel} onClick={() => this.save(true)}/>
          </Box>
        </Header>
        <MonacoEditor
          language='java'
          theme='vs-dark'
          value={code}
          options={{
            selectOnLineNumbers: true,
          }}
          onChange={this.onChange}
          editorDidMount={this.editorDidMount}
          requireConfig={{
            url: 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
            paths: {'vs': '/static/vs'},
          }}
        />
      </Box>
    )
  }
}
PageMeasureCode.propTypes = {
  autoSaveInterval: PropTypes.number,
  autoSaveTimeout:  PropTypes.number,
}
PageMeasureCode.defaultProps = {
  autoSaveInterval: 5000,
  autoSaveTimeout: 5000,
}

export default PageMeasureCode

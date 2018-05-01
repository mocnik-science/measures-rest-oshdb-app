import React from 'react'
import PropTypes from 'prop-types'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import Header from 'grommet/components/Header'
import Title from 'grommet/components/Title'
import moment from 'moment'
import MonacoEditor from 'react-monaco-editor'

import {measure, measureSave} from './../backend'

const AUTOCOMPLETE_OBJECT = [
  // types
  'OSMType.Node',
  'OSMType.Way',
  'OSMType.Relation',
  // common
  'Geo.lengthOf',
]
const AUTOCOMPLETE_METHOD = [
  // methods
  'osmTypes',
  'where',
  'map',
  'filter',
  'average',
  'sum',
  'count',
  'uniq',
  'reduce',
  // other
  'getGeometry',
]

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
    this.editorWillMount = this.editorWillMount.bind(this)
    this.editorDidMount = this.editorDidMount.bind(this)
    this.onChange = this.onChange.bind(this)
    this.save = this.save.bind(this)
  }
  componentDidMount() {
    measure(this.props.match.params.id, response => this.setState(response))
    this.saveService = setInterval(this.save, this.props.autoSaveInterval)
  }
  componentDidUnmount() {
    clearInterval(this.saveService)
  }
  editorWillMount(monaco) {
    monaco.languages.registerCompletionItemProvider('java', {
      triggerCharacters: ['.', ' ', '\n', '('],
      provideCompletionItems: (model, position, token, context) => {
        const c = model.getValueInRange({startLineNumber: position.lineNumber, startColumn: position.column - 1, endLineNumber: position.lineNumber, endColumn: position.column})
        return ((c === '.') ? AUTOCOMPLETE_METHOD : AUTOCOMPLETE_OBJECT).map(l => ({label: l}))
      },
    })
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
    measureSave(this.state.id, {code: this.state.code}, response => this.setState((response.success) ? {saved: true, lastSaved: moment(), lastSavedTry: null, buttonLabel: 'saved'}: {}))
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
            fontSize: 16,
            minimap: {enabled: false},
            selectOnLineNumbers: true,
            wordWrap: 'on',
          }}
          onChange={this.onChange}
          editorWillMount={this.editorWillMount}
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

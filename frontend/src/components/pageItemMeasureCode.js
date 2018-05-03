import PropTypes from 'prop-types'
import React from 'react'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import Header from 'grommet/components/Header'
import Heading from 'grommet/components/Heading'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCertificate from '@fortawesome/fontawesome-free-solid/faCertificate'
import moment from 'moment'
import MonacoEditor from 'react-monaco-editor'

import {measure, measureSave} from './../backend'
import {isLevelPublic} from './../tools'

const SOAP_METHODS = [
  'osmTypes(',
  'where(',
  'map(',
  'filter(',
  'average(',
  'sum()',
  'count()',
  'uniq()',
  'reduce(',
]
const AUTOCOMPLETE_OBJECT = [
  // types
  'OSMType.Node',
  'OSMType.Way',
  'OSMType.Relation',
  // common
  'Geo.lengthOf(',
].concat(SOAP_METHODS)
const AUTOCOMPLETE_METHOD = [
  // other
  'getGeometry(',
].concat(SOAP_METHODS)

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
    measure(this.props.match.params.level, this.props.match.params.id, response => this.setState(response))
    this.saveService = setInterval(this.save, this.props.autoSaveInterval)
  }
  componentWillUnmount() {
    clearInterval(this.saveService)
  }
  editorWillMount(monaco) {
    monaco.languages.registerCompletionItemProvider('java', {
      triggerCharacters: ['.', ' ', '\n', '('],
      provideCompletionItems: (model, position, token, context) => {
        if (position.column < 3) return []
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
    measureSave(this.props.match.params.level, this.state.id, {code: this.state.code}, response => this.setState((response.success) ? {saved: true, lastSaved: moment(), lastSavedTry: null, buttonLabel: 'saved'}: {}))
  }
  render() {
    return (
      <Box className={'noScroll' + ((isLevelPublic(this.state.level) && !this.context.user.admin) ? ' disabled' : '')} full={true}>
        <Header>
          <Box pad='medium'>
            <Heading>
              {this.state.name}
              {
                isLevelPublic(this.state.level) ?
                  <span style={{
                    display: 'inlineBlock',
                    position: 'absolute',
                    marginLeft: 20,
                    marginTop: -12,
                    color: '#b81623',
                  }}>
                    <FontAwesomeIcon icon={faCertificate} style={{fontSize: 24}}/>
                  </span> : []
              }
            </Heading>
          </Box>
          {
            (isLevelPublic(this.state.level) && !this.context.user.admin) ?
            [] : 
            <Box flex={true} justify='end' direction='row' responsive={false} pad='medium'>
              <Button label={this.state.buttonLabel} onClick={() => this.save(true)}/>
            </Box>
          }
        </Header>
        <MonacoEditor
          language='java'
          theme='vs-dark'
          value={this.state.code}
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
  itemSave: PropTypes.func,
  autoSaveInterval: PropTypes.number,
  autoSaveTimeout:  PropTypes.number,
}
PageMeasureCode.defaultProps = {
  itemSave: (level, id, data, callback) => {},
  autoSaveInterval: 5000,
  autoSaveTimeout: 5000,
}
PageMeasureCode.contextTypes = {
  user: PropTypes.object.isRequired,
}

export default PageMeasureCode

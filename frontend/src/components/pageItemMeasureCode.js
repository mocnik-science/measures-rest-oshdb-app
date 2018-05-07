import PropTypes from 'prop-types'
import React from 'react'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import Footer from 'grommet/components/Footer'
import Header from 'grommet/components/Header'
import Heading from 'grommet/components/Heading'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCertificate from '@fortawesome/fontawesome-free-solid/faCertificate'
import faExclamationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle'
import moment from 'moment'
import MonacoEditor from 'react-monaco-editor'
import soap from 'simplified-oshdb-api-programming/dist/soap-to-measure'

import {item, itemSave} from './../backend'
import {isLevelPublic} from './../tools'

const AUTOCOMPLETE_DIRECTIVES = [
  'snapshots //',
  'contributions //',
  'now //',
  '####-##-## //',
  'last day //',
  'last month //',
  'last year //',
  'last # days //',
  'last # months //',
  'last # years //',
  'daily //',
  'monthly //',
  'yearly //',
  'every # days //',
  'every # months //',
  'every # years //',
]
const SOAP_METHODS = [
  'osmTypes(',
  'osmEntityFilter(',
  'osmTag(',
  'map(',
  'flatMap(',
  'filter(',
  'groupByEntity(',
  'aggregateBy(',
  'aggregateByGeometry(',
  'reduce(',
  'sum(',
  'count(',
  'uniq(',
  'countUniq(',
  'average(',
  'weightedAverage(',
  'collect(',
  'lineageBy(',
]
const SOAP_AGGREGATION_METHODS = [
  'min',
  'max',
  'average',
  'saturation',
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

const HEIGHT_HEADER = 72

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
      windowHeight: window.innerHeight,
      parsingErrors: [],
    }
    this.editorWillMount = this.editorWillMount.bind(this)
    this.editorDidMount = this.editorDidMount.bind(this)
    this.onResize = this.onResize.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onChangeCursorPosition = this.onChangeCursorPosition.bind(this)
    this.save = this.save.bind(this)
  }
  componentDidMount() {
    item('measure', this.props.match.params.level, this.props.match.params.id, response => this.setState(response))
    this.saveService = setInterval(this.save, this.props.autoSaveInterval)
    window.addEventListener('resize', this.onResize)
  }
  componentWillUnmount() {
    clearInterval(this.saveService)
  }
  editorWillMount(monaco) {
    this._monaco = monaco
    monaco.languages.registerCompletionItemProvider('java', {
      triggerCharacters: ['.', ' ', '\n', '(', '// '],
      provideCompletionItems: (model, position, token, context) => {
        if (position.column < 3) return []
        const matches = t => (t === model.getValueInRange({startLineNumber: position.lineNumber, startColumn: position.column - t.length, endLineNumber: position.lineNumber, endColumn: position.column}))
        if (matches('// ')) return AUTOCOMPLETE_DIRECTIVES.map(l => ({label: l}))
        if (matches('lineageBy(')) return SOAP_AGGREGATION_METHODS.map(l => ({label: l}))
        if (matches('.')) return AUTOCOMPLETE_METHOD.map(l => ({label: l}))
        return AUTOCOMPLETE_OBJECT.map(l => ({label: l}))
      },
    })
  }
  editorDidMount(editor, monaco) {
    this._editor = editor
    editor.focus()
    editor.onDidChangeCursorPosition(this.onChangeCursorPosition)
    this.onChangeCursorPosition(null)
  }
  onResize() {
    this.setState({editorHeight: window.innerHeight - HEIGHT_HEADER})
    if (this._editor) this._editor.layout()
  }
  onChange(newValue, e) {
    this.setState({saved: false, code: newValue, lastSaved: null, lastSavedTry: null, buttonLabel: 'save'})
  }
  onChangeCursorPosition(e) {
    if (this._editorDecorations === undefined || this._editorDecorations === null) this._editorDecorations = []
    if (e === null || (this.state.parsingErrors && this.state.parsingErrors.length) || this._lastSelectedLine !== e.position.lineNumber) {
      let parsedSoap = soap.soapToMeasureWithWarnings(this.state.code)
      parsedSoap.errors = parsedSoap.errors.concat(parsedSoap.warnings)
      this.setState({parsingErrors: parsedSoap.errors}, () => this._editor.layout())
      const decorationList = parsedSoap.errors.filter(err => err[0] !== null).map(err => ({
        range: new this._monaco.Range(Math.max(0, err[0] - 1), 1, err[0], 1),
        options: {isWholeLine: true, linesDecorationsClassName: 'decorationError'},
      }))
      this._editorDecorations = this._editor.deltaDecorations(this._editorDecorations, decorationList)
    }
    this._lastSelectedLine = (e === null) ? null : e.position.lineNumber
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
    itemSave('measure', this.props.match.params.level, this.state.id, {
      code: this.state.code,
    }, response => this.setState((response.success) ? {saved: true, lastSaved: moment(), lastSavedTry: null, buttonLabel: 'saved'}: {}))
  }
  render() {
    return (
      <Box className={'noScroll' + ((isLevelPublic(this.state.level) && !this.context.user.admin) ? ' disabled' : '')} full={true}>
        <Header>
          <Box pad='medium' style={{paddingTop: 0, paddingBottom: 0}}>
            <Heading style={{marginBottom: 0}}>
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
            <Box flex={true} justify='end' direction='row' responsive={false} pad='medium' style={{paddingTop: 0, paddingBottom: 0}}>
              <Button label={this.state.buttonLabel} onClick={() => this.save(true)}/>
            </Box>
          }
        </Header>
        <MonacoEditor
          height={this.state.windowHeight - ((this.state.parsingErrors && this.state.parsingErrors.length) ? 2 : 1) * HEIGHT_HEADER}
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
        {
          (this.state.parsingErrors && this.state.parsingErrors.length) ?
          <Footer pad='medium'>
            <FontAwesomeIcon icon={faExclamationTriangle} style={{fontSize: 24, marginRight: 14, marginBottom: 3, color: '#b81623'}}/>
            {this.state.parsingErrors.map(e => e[1]).join('\n')}
          </Footer> : []
        }
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

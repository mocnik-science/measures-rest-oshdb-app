import React from 'react'
import FormField from 'grommet/components/FormField'
import NumberInput from 'grommet/components/NumberInput'
import TextInput from 'grommet/components/TextInput'

import {items} from './../other/backend'
import {itemsToList} from './../other/tools'
import Select from './../components/select'
import PageItemDescription from './pageItemDescription'

const styles = {
  groundingLeft: {
    width: 326,
    padding: '7px 24px',
    float: 'left',
    clear: 'both',
  },
  groundingRight: {
    textAlign: 'right',
    float: 'right',
  },
}

class PageMeasureDescription extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      name: '',
      nameError: null,
      description: '',
      descriptionError: null,
      appliesToDataset: [],
      appliesToDatasetList: [
        {label: 'OpenStreetMap', value: 'osmdq:OpenStreetMap'},
        {label: 'Sweden', value: 'osmdr:sweden'},
      ],
      appliesToDatasetError: null,
      assesses: [],
      assessesList: [
        {label: 'completeness', value: 'dq:completeness'},
        {label: 'logical consistency', value: 'dq:logicalConsistency'},
        {label: 'positional accuracy', value: 'dq:positionalAccuracy'},
        {label: 'temporal quality', value: 'dq:temporalQuality'},
        {label: 'thematic accuracy', value: 'dq:thematicAccuracy'},
        {label: 'usability', value: 'dq:usability'},
      ],
      assessesError: null,
      typeOfResult: [],
      typeOfResultList: [],
      typeOfResultError: null,
      minimumResult: '',
      minimumResultError: null,
      maximumResult: '',
      maximumResultError: null,
      usesGrounding: [],
      usesGroundingListPerceptionBasedGrounding: [
        {label: 'extrinsic', value: 'dq:extrinsicGrounding|dq:perceptionBasedGrounding'},
      ],
      usesGroundingListDataBasedGrounding: [
        {label: 'intrinsic', value: 'dq:intrinsicGrounding|dq:dataBasedGrounding'},
        {label: 'extrinsic', value: 'dq:extrinsicGrounding|dq:dataBasedGrounding'},
      ],
      usesGroundingListGroundingInProcessedData: [
        {label: 'intrinsic', value: 'dq:intrinsicGrounding|dq:groundingInProcessedData'},
        {label: 'extrinsic', value: 'dq:extrinsicGrounding|dq:groundingInProcessedData'},
      ],
      usesGroundingListGroundingInRulesPatternsKnowledge: [
        {label: 'intrinsic', value: 'dq:intrinsic|dq:groundingInRulesPatternsKnowledge'},
        {label: 'extrinsic', value: 'dq:dq:extrinsic|dq:groundingInRulesPatternsKnowledge'},
      ],
      usesGroundingError: null,
      presumes: {},
      presumesForResultList: [],
      presumesOperatorList: [
        {label:'<', value: 'dq:less'},
        {label:'≤', value: 'dq:lessOrEqual'},
        {label:'=', value: 'dq:equal'},
        {label:'≥', value: 'dq:greaterOrEqual'},
        {label:'>', value: 'dq:greater'},
      ],
      presumesError: null,
      validInContext: [],
      validInContextList: [],
      validInContextError: null,
      assessesElementType: [],
      assessesElementTypeList: [
        {label:'node', value: 'osmdq:node'},
        {label:'way', value: 'osmdq:way'},
        {label:'area', value: 'osmdq:area'},
        {label:'relation', value: 'osmdq:relation'},
      ],
      assessesElementTypeError: null,
      assessesTag: '',
      assessesTagError: null,
      implementedBy: [],
      implementedByList: [],
      implementedByError: null,
      documentedBy: [],
      documentedByList: [],
      documentedByError: null,
      level: null,
    }
    this.objectAddEmptyValue = this.objectAddEmptyValue.bind(this)
    this.objectToSave = this.objectToSave.bind(this)
    this.floatFromSave = this.floatFromSave.bind(this)
    this.floatToSave = this.floatToSave.bind(this)
    this.setPresume = this.setPresume.bind(this)
  }
  objectAddEmptyValue(a) {
    if (a === undefined) a = {}
    const keys = Object.keys(a).map(x => parseInt(x, 10))
    if (keys.length === 0) return {0: {}}
    const jMax = Math.max(...keys)
    if (Object.values(a[jMax]).filter(x => x !== undefined).length) a[jMax + 1] = {}
    return a
  }
  objectToSave(a) {
    const rs = []
    for (const x of Object.values(a)) {
      const r = {}
      for (const [k, v] of Object.entries(x)) if (v !== undefined) r[k] = v
      if (Object.keys(r).length) rs.push(r)
    }
    return rs
  }
  floatFromSave(x) {
    return (x) ? x.toString() : undefined
  }
  floatToSave(x) {
    return parseFloat(x)
  }
  setPresume(j, k, v) {
    const presumes = Object.assign({}, this.state.presumes)
    presumes[j][k] = v
    this.setState({presumes: this.objectAddEmptyValue(presumes)})
  }
  componentDidMount() {
    items(response => this.setState({
      typeOfResultList: itemsToList(response.results),
      presumesForResultList: itemsToList(response.results),
      validInContextList: itemsToList(response.contexts),
      implementedByList: itemsToList(response.persons),
      documentedByList: itemsToList(response.persons),
    }))
  }
  render() {
    return (
      <PageItemDescription
        setState={response => {
          response.minimumResult = this.floatFromSave(response.minimumResult)
          response.maximumResult = this.floatFromSave(response.maximumResult)
          response.presumes = this.objectAddEmptyValue(response.presumes)
          this.setState(response)
        }}
        itemName='measure'
        name={this.state.name}
        data={{
          name: this.state.name,
          description: this.state.description,
          appliesToDataset: this.state.appliesToDataset,
          assesses: this.state.assesses,
          typeOfResult: this.state.typeOfResult,
          minimumResult: this.floatToSave(this.state.minimumResult),
          maximumResult: this.floatToSave(this.state.maximumResult),
          usesGrounding: this.state.usesGrounding,
          presumes: this.objectToSave(this.state.presumes),
          validInContext: this.state.validInContext,
          assessesElementType: this.state.assessesElementType,
          assessesTag: this.state.assessesTag,
          implementedBy: this.state.implementedBy,
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
          <FormField key='appliesToDataset' label='dataset' error={this.state.appliesToDatasetError}>
            <Select options={this.state.appliesToDatasetList} value={this.state.appliesToDataset.label} onChange={e => this.setState({appliesToDataset: e.value})}/>
          </FormField>,
          <FormField key='assesses' label='assessed data quality aspects' error={this.state.assessesError}>
            <Select options={this.state.assessesList} multiple={true} value={this.state.assesses} onChange={e => this.setState({assesses: e.value})}/>
          </FormField>,
          <FormField key='typeOfResult' label='type of result' error={this.state.typeOfResultError}>
            <Select options={this.state.typeOfResultList} forLevel={this.state.level} value={this.state.typeOfResult} onChange={e => this.setState({typeOfResult: e.value})}/>
          </FormField>,
          <FormField key='minimumResult' label='minimum result' error={this.state.minimumResultError}>
            <NumberInput value={this.state.minimumResult} onChange={e => this.setState({minimumResult: e.target.value})}/>
          </FormField>,
          <FormField key='maximumResult' label='maximum result' error={this.state.maximumResultError}>
            <NumberInput value={this.state.maximumResult} onChange={e => this.setState({maximumResult: e.target.value})}/>
          </FormField>,
          <FormField key='grounding' label='grounding' error={this.state.usesGroundingError}>
            <div style={styles.groundingLeft}>perception-based grounding</div>
            <Select style={styles.groundingRight} className="select-horizontal" options={this.state.usesGroundingListPerceptionBasedGrounding} inline={true} multiple={true} value={this.state.usesGrounding} onChange={e => this.setState({usesGrounding: e.value})}/>
            <div className="select-horizontal" style={styles.groundingLeft}>data-based grounding</div>
            <Select style={styles.groundingRight} className="select-horizontal" options={this.state.usesGroundingListDataBasedGrounding} inline={true} multiple={true} value={this.state.usesGrounding} onChange={e => this.setState({usesGrounding: e.value})}/>
            <div style={styles.groundingLeft}>grounding in processed data</div>
            <Select style={styles.groundingRight} className="select-horizontal" options={this.state.usesGroundingListGroundingInProcessedData} inline={true} multiple={true} value={this.state.usesGrounding} onChange={e => this.setState({usesGrounding: e.value})}/>
            <div style={styles.groundingLeft}>grounding in rules/patterns/knowledge</div>
            <Select style={styles.groundingRight} className="select-horizontal" options={this.state.usesGroundingListGroundingInRulesPatternsKnowledge} inline={true} multiple={true} value={this.state.usesGrounding} onChange={e => this.setState({usesGrounding: e.value})}/>
          </FormField>,
          <FormField key='presumes' label='presumes' error={this.state.presumesError}>
            {
              Object.entries(this.state.presumes).map(([j, p]) => (
                <FormField key={`presumes-${j}`} className="flex-row inner-formfield">
                  <Select className="presumesForResult" options={this.state.presumesForResultList} forLevel={this.state.level} value={p.forResult} onChange={e => this.setPresume(j, 'forResult', e.value)}/>
                  <Select className="presumesOperator" options={this.state.presumesOperatorList} value={p.operator} onChange={e => this.setPresume(j, 'operator', e.value)}/>
                  <TextInput style={{textAlign: 'right'}} className="presumesWithValue" value={p.withValue} onDOMChange={e => this.setPresume(j, 'withValue', e.target.value)} placeHolder="number"/>
                </FormField>
              ))
            }
          </FormField>,
          <FormField key='validInContext' label='valid in context' error={this.state.validInContextError}>
            <Select options={this.state.validInContextList} multiple={true} forLevel={this.state.level} value={this.state.validInContext} onChange={e => this.setState({validInContext: e.value})}/>
          </FormField>,
          <FormField key='assessesElementType' label='assessed element types' error={this.state.assessesElementTypeError}>
            <Select options={this.state.assessesElementTypeList} multiple={true} value={this.state.assessesElementType} onChange={e => this.setState({assessesElementType: e.value})}/>
          </FormField>,
          <FormField key='assessesTags' label='assessed tags' error={this.state.assessesTagError}>
            <TextInput value={this.state.assessesTag} onDOMChange={e => this.setState({assessesTag: e.target.value})} placeHolder={'e.g., "highway"="*", "highway"="residential"'}/>
          </FormField>,
          <FormField key='implementedBy' label='implemented by' error={this.state.implementedByError}>
            <Select options={this.state.implementedByList} multiple={true} forLevel={this.state.level} value={this.state.implementedBy} onChange={e => this.setState({implementedBy: e.value})}/>
          </FormField>,
          <FormField key='documentedBy' label='documented by' error={this.state.documentedByError}>
            <Select options={this.state.documentedByList} multiple={true} forLevel={this.state.level} value={this.state.documentedBy} onChange={e => this.setState({documentedBy: e.value})}/>
          </FormField>,
        ]}
        longForm={true}
        {...this.props}
      />
    )
  }
}

export default PageMeasureDescription

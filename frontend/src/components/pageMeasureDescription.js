import React from 'react'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import Footer from 'grommet/components/Footer'
import Form from 'grommet/components/Form'
import FormField from 'grommet/components/FormField'
import FormFields from 'grommet/components/FormFields'
import Header from 'grommet/components/Header'
import Heading from 'grommet/components/Heading'
import NumberInput from 'grommet/components/NumberInput'
import Select from './select'
import TextInput from 'grommet/components/TextInput'

import {measure, measureSave, items} from './../backend'
import {itemsToList} from './../tools'

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
      typeOfResultList: [{label: 'Result 1', value: 'result1'}, {label: 'Result 2', value: 'result2'}],
      typeOfResultError: null,
      minimumResult: undefined,
      minimumResultError: null,
      maximumResult: undefined,
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
      presumesForResult: [],
      presumesForResultList: [{label:'Test Measure', value: 'osmmrh:testMeasure'}, {label:'Another Measure', value: 'osmmrh:anotherMeasure'}],
      presumesOperator: [],
      presumesOperatorList: [
        {label:'<', value: 'dq:less'},
        {label:'≤', value: 'dq:lessOrEqual'},
        {label:'=', value: 'dq:equal'},
        {label:'≥', value: 'dq:greaterOrEqual'},
        {label:'>', value: 'dq:greater'},
      ],
      presumesWithValue: undefined,
      presumesError: null,
      validInContext: [],
      validInContextList: [{label:'Some context', value: 'osmmrh:someContext'}, {label:'Another Context', value: 'osmmrh:anotherContext'}],
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
      implementedByList: [
        {label: 'Amin Mobasheri', value: 'osmmrh:aminMobasheri'},
        {label: 'Christina Ludwig', value: 'osmmrh:christinaLudwig'},
        {label: 'Franz-Benjamin Mocnik', value: 'osmmrh:franzBenjaminMocnik'},
        {label: 'Leoni Möske', value: 'osmmrh:leoniMoeske'},
        {label: 'Yajie Liang', value: 'osmmrh:yajieLiang'},
      ],
      implementedByError: null,
      documentedBy: [],
      documentedByList: [
        {label: 'Amin Mobasheri', value: 'osmmrh:aminMobasheri'},
        {label: 'Christina Ludwig', value: 'osmmrh:christinaLudwig'},
        {label: 'Franz-Benjamin Mocnik', value: 'osmmrh:franzBenjaminMocnik'},
        {label: 'Leoni Möske', value: 'osmmrh:leoniMoeske'},
        {label: 'Yajie Liang', value: 'osmmrh:yajieLiang'},
      ],
      documentedByError: null,
    }
    this.save = this.save.bind(this)
    measure(this.props.match.params.id, response => this.setState(response))
    items(response => this.setState({
      typeOfResultList: itemsToList(response.results),
      presumesForResultList: itemsToList(response.results),
      validInContextList: itemsToList(response.contexts),
      implementedByList: itemsToList(response.persons),
      documentedByList: itemsToList(response.persons),
    }))
  }
  save(e) {
    e.preventDefault()
    console.log(this.state)
    /*
    measureSave(this.state.id, {
      name: this.state.name,
      description: this.state.description,
      dataset: this.state.dataset,
      assesses: this.state.assesses,
      typeOfResult: this.state.typeOfResult,
      minimumResult: this.state.minimumResult,
      maximumResult: this.state.maximumResult,
      usesGrounding: this.state.usesGrounding,
      presumesForResult: this.state.presumesForResult,
      presumesOperator: this.state.presumesOperator,
      presumesWithValue: this.state.presumesWithValue,
      validInContext: this.state.validInContext,
      assessesElementType: this.state.assessesElementType,
      assessesTag: this.state.assessesTag,
      implementedBy: this.state.implementedBy,
      documentedBy: this.state.documentedBy,
    }, response => {
      if (response.success) this.props.history.push('/measure')
      else this.setState(response.messages)
    })
    */
  }
  render() {
    return (
      <Box align='center' pad='large'>
        <Form style={{width: 600}}>
          <Header>
            <Heading>{this.state.name}</Heading>
          </Header>
          <FormFields>
            <FormField label='name' error={this.state.nameError}>
              <TextInput value={this.state.name} onDOMChange={e => this.setState({name: e.target.value})}/>
            </FormField>
            <FormField label='description (human readable)' error={this.state.descriptionError}>
              <textarea rows="5" type="text" name="description" value={this.state.description} onChange={e => this.setState({description: e.target.value})}/>
            </FormField>
            <FormField label='dataset' error={this.state.appliesToDatasetError}>
              <Select options={[{label: 'OpenStreetMap', value: 'osmdq:OpenStreetMap'}, {label: 'Sweden', value: 'sweden'}]} value={this.state.appliesToDataset.label} onChange={e => this.setState({appliesToDataset: e.value})}/>
            </FormField>
            <FormField label='assessed data quality aspects' error={this.state.assessesError}>
              <Select options={this.state.assessesList} multiple={true} value={this.state.assesses} onChange={e => this.setState({assesses: e.value})}/>
            </FormField>
            <FormField label='type of result' error={this.state.typeOfResultError}>
              <Select options={this.state.typeOfResultList} value={this.state.typeOfResult} onChange={e => this.setState({typeOfResult: e.value})}/>
            </FormField>
            <FormField label='minimum result' error={this.state.minimumResultError}>
              <NumberInput value={this.state.minimumResult} onChange={e => this.setState({minimumResult: e.value})}/>
            </FormField>
            <FormField label='maximum result' error={this.state.maximumResultError}>
              <NumberInput value={this.state.maximumResult} onChange={e => this.setState({maximumResult: e.value})}/>
            </FormField>
            <FormField label='grounding' error={this.state.usesGroundingError}>
              <div style={styles.groundingLeft}>perception-based grounding</div>
              <Select style={styles.groundingRight} className="select-horizontal" options={this.state.usesGroundingListPerceptionBasedGrounding} inline={true} multiple={true} value={this.state.usesGrounding} onChange={e => this.setState({usesGrounding: e.value})}/>
              <div className="select-horizontal" style={styles.groundingLeft}>data-based grounding</div>
              <Select style={styles.groundingRight} className="select-horizontal" options={this.state.usesGroundingListDataBasedGrounding} inline={true} multiple={true} value={this.state.usesGrounding} onChange={e => this.setState({usesGrounding: e.value})}/>
              <div style={styles.groundingLeft}>grounding in processed data</div>
              <Select style={styles.groundingRight} className="select-horizontal" options={this.state.usesGroundingListGroundingInProcessedData} inline={true} multiple={true} value={this.state.usesGrounding} onChange={e => this.setState({usesGrounding: e.value})}/>
              <div style={styles.groundingLeft}>grounding in rules/patterns/knowledge</div>
              <Select style={styles.groundingRight} className="select-horizontal" options={this.state.usesGroundingListGroundingInRulesPatternsKnowledge} inline={true} multiple={true} value={this.state.usesGrounding} onChange={e => this.setState({usesGrounding: e.value})}/>
            </FormField>
            <FormField className="flex-row" label='presumes' error={this.state.presumesError}>
              <Select className="presumesForResult" options={this.state.presumesForResultList} value={this.state.presumesForResult} onChange={e => this.setState({presumesForResult: e.value})}/>
              <Select className="presumesOperator" options={this.state.presumesOperatorList} value={this.state.presumesOperator} onChange={e => this.setState({presumesOperator: e.value})}/>
              <TextInput style={{textAlign: 'right'}} className="presumesWithValue" value={this.state.presumesWithValue} onDOMChange={e => this.setState({presumesWithValue: e.target.value})} placeHolder="number"/>
            </FormField>
            <FormField label='valid in context' error={this.state.validInContextError}>
              <Select options={this.state.validInContextList} multiple={true} value={this.state.validInContext} onChange={e => this.setState({validInContext: e.value})}/>
            </FormField>
            <FormField label='assessed element types' error={this.state.assessesElementTypeError}>
              <Select options={this.state.assessesElementTypeList} multiple={true} value={this.state.assessesElementType} onChange={e => this.setState({assessesElementType: e.value})}/>
            </FormField>
            <FormField label='assessed tags' error={this.state.assessesTagError}>
              <TextInput value={this.state.assessesTag} onDOMChange={e => this.setState({assessesTag: e.target.value})} placeHolder={'e.g., "highway"="*", "highway"="residential"'}/>
            </FormField>
            <FormField label='implemented by' error={this.state.implementedByError}>
              <Select options={this.state.implementedByList} multiple={true} value={this.state.implementedBy} onChange={e => this.setState({implementedBy: e.value})}/>
            </FormField>
            <FormField label='documented by' error={this.state.documentedByError}>
              <Select options={this.state.documentedByList} multiple={true} value={this.state.documentedBy} onChange={e => this.setState({documentedBy: e.value})}/>
            </FormField>
          </FormFields>
          <Footer pad={{'vertical': 'medium', 'display': 'inline-block'}}>
            <Button label='save' type='submit' primary={true} onClick={this.save}/>
          </Footer>
        </Form>
      </Box>
    )
  }
}

export default PageMeasureDescription

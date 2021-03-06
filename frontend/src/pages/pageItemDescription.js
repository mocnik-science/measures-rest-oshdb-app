import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import Footer from 'grommet/components/Footer'
import Form from 'grommet/components/Form'
import FormFields from 'grommet/components/FormFields'
import Header from 'grommet/components/Header'
import Heading from 'grommet/components/Heading'
import Toast from 'grommet/components/Toast'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCertificate from '@fortawesome/fontawesome-free-solid/faCertificate'

import actions from './../actions'
import {item, itemSave} from './../other/backend'
import {isLevelPublic} from './../other/tools'

class PageItemDescription extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: {},
    }
    this.onKeyDown = this.onKeyDown.bind(this)
    this.save = this.save.bind(this)
  }
  onKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') this.save(e)
  }
  save(e) {
    e.preventDefault()
    itemSave(this.props.itemName, this.props.match.params.level, this.props.match.params.id, this.props.data, response => {
      if (response && response.success) {
        this.props.forceItemAll(this.props.itemName)
        this.props.history.push(`/${this.props.itemName}`)
      } else this.setState({messages: response.messages})
    })
  }
  componentDidMount() {
    item(this.props.itemName, this.props.match.params.level, this.props.match.params.id, response => this.props.setState(response))
  }
  render() {
    return (
      <Box align='center' pad='large'>
        {
          (Object.keys(this.state.messages).length > 0) ?
          <Toast
            onClose={() => this.setState({messages: {}})}
            status='warning'>
            {Object.values(this.state.messages)}
          </Toast> : []
        }
        <Form style={{width: 600}} className={(isLevelPublic(this.props.data.level) && !this.props.user.admin) ? 'disabled' : ''}>
          <Header>
            <Heading style={{width: '100%'}}>
              {
                (isLevelPublic(this.props.data.level) && !this.props.user.admin) ?
                [] : 
                <Button label='save' type='submit' primary={true} onClick={this.save} style={{float: 'right'}}/>
              }
              <div style={{paddingRight: 140}}>
                {this.props.name.trim()}
                {
                  isLevelPublic(this.props.data.level) ?
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
              </div>
            </Heading>
          </Header>
          <FormFields onKeyDown={this.onKeyDown}>
            {this.props.fields}
          </FormFields>
          {
            (!this.props.longForm || (isLevelPublic(this.props.data.level) && !this.props.user.admin)) ?
            [] : 
            <Footer flex={true} justify="center" pad={{vertical: 'medium'}}>
              <Button label='save' type='submit' primary={true} onClick={this.save}/>
            </Footer>
          }
        </Form>
      </Box>
    )
  }
}
PageItemDescription.propTypes = {
  user: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
  itemName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  data: PropTypes.object,
  fields: PropTypes.array,
  longForm: PropTypes.bool,
}
PageItemDescription.defaultProps = {
  data: {},
  fields: [],
  longForm: false,
}

const mapStateToProps = state => ({
  user: state.user.user,
})
const mapDispatchToProps = dispatch => ({
  forceItemAll: itemName => dispatch(actions.forceItemAll(itemName)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PageItemDescription)

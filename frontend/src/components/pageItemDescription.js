import PropTypes from 'prop-types'
import React from 'react'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import Footer from 'grommet/components/Footer'
import Form from 'grommet/components/Form'
import FormFields from 'grommet/components/FormFields'
import Header from 'grommet/components/Header'
import Heading from 'grommet/components/Heading'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCertificate from '@fortawesome/fontawesome-free-solid/faCertificate'

import {isLevelPublic} from './../tools'

class PageItemDescription extends React.Component {
  constructor(props) {
    super(props)
    this.save = this.save.bind(this)
  }
  save(e) {
    e.preventDefault()
    this.props.itemSave(this.props.match.params.level, this.props.match.params.id, this.props.data, response => {
      if (response && response.success) this.props.history.push(`/${this.props.itemName}`)
      else this.setState(response.messages)
    })
  }
  componentDidMount() {
    this.props.item(this.props.match.params.level, this.props.match.params.id, response => this.props.setState(response))
  }
  render() {
    return (
      <Box align='center' pad='large'>
        <Form style={{width: 600}} className={(isLevelPublic(this.props.data.level) && !this.context.user.admin) ? 'disabled' : ''}>
          <Header>
            <Heading>
              {this.props.name}
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
              </Heading>
          </Header>
          <FormFields>
            {this.props.fields}
          </FormFields>
          {
            (isLevelPublic(this.props.data.level) && !this.context.user.admin) ?
            [] : 
            <Footer pad={{'vertical': 'medium', 'display': 'inline-block'}}>
              <Button label='save' type='submit' primary={true} onClick={this.save}/>
            </Footer>
          }
        </Form>
      </Box>
    )
  }
}
PageItemDescription.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
  itemName: PropTypes.string.isRequired,
  item: PropTypes.func,
  itemSave: PropTypes.func,
  name: PropTypes.string.isRequired,
  data: PropTypes.object,
  fields: PropTypes.array,
}
PageItemDescription.defaultProps = {
  items: callback => {},
  item: callback => {},
  itemSave: (id, data, callback) => {},
  data: {},
  fields: [],
}
PageItemDescription.contextTypes = {
  user: PropTypes.object.isRequired,
}

export default PageItemDescription

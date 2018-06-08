import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import CheckBox from 'grommet/components/CheckBox'
import Header from 'grommet/components/Header'
import Label from 'grommet/components/Label'
import List from 'grommet/components/List'
import ListItem from 'grommet/components/ListItem'
import TextInput from 'grommet/components/TextInput'
import Toast from 'grommet/components/Toast'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCertificate from '@fortawesome/fontawesome-free-solid/faCertificate'
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit'
import faPlusSquare from '@fortawesome/fontawesome-free-regular/faPlusSquare'

import actions from './../actions'
import {itemSave, itemPublic, itemNew} from './../other/backend'
import {isLevelPublic} from './../other/tools'

class PageItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      messages: {},
    }
    this.items = this.items.bind(this)
    this.saveEnabled = this.saveEnabled.bind(this)
  }
  items() {
    return (this.props.itemAll[this.props.itemName]) ? this.props.itemAll[this.props.itemName] : []
  }
  saveEnabled(level, id, value) {
    const items = this.items()
    items[`user-${id}`].enabled = value
    this.setState({items: items})
    itemSave(this.props.itemName, level, id, {enabled: value}, () => {})
  }
  render() {
    this.props.initItemAll(this.props.itemName)
    const label = (item, className) =>
      <Label className='pageItemLabel'>
        {item.name.trim()}
        {
          isLevelPublic(item.level) ?
          <span style={{
            display: 'inlineBlock',
            position: 'absolute',
            marginLeft: 20,
            color: '#b81623',
          }}>
            <FontAwesomeIcon icon={faCertificate} style={{fontSize: 24, marginTop: -2}}/>
          </span> : []
        }
      </Label>
    return (
      <div>
        {
          (Object.keys(this.state.messages).length > 0) ?
          <Toast
            onClose={() => this.setState({messages: {}})}
            status='warning'>
            {Object.values(this.state.messages)}
          </Toast> : []
        }
        <Header className='header' fixed={true} size='small' style={{paddingRight: 22}}>
          <Box flex={true} justify='end' direction='row'>
            <TextInput value={this.state.search} onDOMChange={e => this.setState({search: e.target.value})} style={{flexGrow: 1}} placeHolder='Search...' size='medium'/>
            <Button icon={<FontAwesomeIcon icon={faPlusSquare}/>} onClick={() => itemNew(this.props.itemName, response => this.setState(response))}/>
            {this.props.buttonsHeader}
          </Box>
        </Header>
        <List>
          {Object.values(this.items()).map(item => (this.state.search !== '' && (!~item.name.toLowerCase().indexOf(this.state.search.toLowerCase()))) ? [] :
            <ListItem key={item.id} justify='between'>
              <span className='primary'>
                {(!isLevelPublic(item.level) && this.props.itemsCanBeEnabled) ?
                  <CheckBox toggle={true} label={label(item, 'pageItemLabelToggle')} checked={item.enabled} onChange={e => this.saveEnabled(item.level, item.id, e.target.checked)}/> :
                  <span style={{marginLeft: (this.props.itemsCanBeEnabled) ? 60 : 0}}>{label(item, 'pageItemLabel')}</span>
                }
              </span>
              <span className='secondary'>
                {this.props.buttonsOwnItem(item)}
                {
                  (!isLevelPublic(item.level) && this.props.user.admin) ?
                  <Button key='button-public' icon={<FontAwesomeIcon icon={faCertificate}/>} onClick={e => {
                    e.preventDefault()
                    itemPublic(this.props.itemName, item.level, item.id, response => {
                      if (!response) this.setState({message: 'Unknown error'})
                      else if (!response.success && response.dependencies) this.setState({messages: `The ${this.props.itemName} cannot be made public.  The following items are non-public but this ${this.props.itemName} refers to them: ${response.dependencies.map(d => `${d.name} (${d._itemName})`).join(', ')}.`})
                      else if (!response.success && response.inverseDependencies) this.setState({messages: `The ${this.props.itemName} cannot be made public.  The following items are non-public but refer to this ${this.props.itemName}: ${response.inverseDependencies.map(d => `${d.name} (${d._itemName})`).join(', ')}.`})
                      else if (!response.success && response.messages) this.setState({messages: response.messages})
                      else this.setState(response)
                    })
                  }}/> : []
                }
                <Button key='button-description' icon={<FontAwesomeIcon icon={faEdit}/>} path={`/${this.props.itemName}/${item.level}/${item.id}/description`}/>
                {
                  this.props.buttonsItem.map(b => {
                    const url = (typeof(b.path) === 'function') ? b.path(item) : `/${this.props.itemName}/${item.level}/${item.id}/${b.path}`
                    return (<Button
                      key={`button--${b.path}`}
                      icon={<FontAwesomeIcon icon={b.icon}/>}
                      path={(b.newTab || (b.onlyIf && !b.onlyIf(item))) ? null : url}
                      onClick={(!b.newTab || (b.onlyIf && !b.onlyIf(item))) ? null : e => {
                        e.preventDefault()
                        window.open(url)
                      }}
                    />)
                  })
                }
                {
                  (this.props.website && this.props.websiteIcon) ?
                    <Button
                      key='button-website'
                      icon={<FontAwesomeIcon icon={this.props.websiteIcon}/>}
                      onClick={(!this.props.website(item)) ? null : e => {
                        e.preventDefault()
                        window.open(this.props.website(item))
                      }}
                    /> : []
                }
              </span>
            </ListItem>
          )}
        </List>
      </div>
    )
  }
}
PageItem.propTypes = {
  user: PropTypes.object.isRequired,
  itemName: PropTypes.string.isRequired,
  itemsCanBeEnabled: PropTypes.bool,
  buttonsHeader: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  buttonsOwnItem: PropTypes.func,
  buttonsItem: PropTypes.array,
  website: PropTypes.func,
  websiteIcon: PropTypes.object,
}
PageItem.defaultProps = {
  itemsCanBeEnabled: false,
  buttonsHeader: [],
  buttonsOwnItem: item => {},
  buttonsItem: [],
  website: item => {},
  websiteIcon: null,
}

const mapStateToProps = state => ({
  user: state.user.user,
  itemAll: state.item.itemAll,
})
const mapDispatchToProps = dispatch => ({
  initItemAll: itemName => dispatch(actions.initItemAll(itemName)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PageItem)

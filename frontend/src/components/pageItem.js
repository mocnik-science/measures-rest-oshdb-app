import PropTypes from 'prop-types'
import React from 'react'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import CheckBox from 'grommet/components/CheckBox'
import Header from 'grommet/components/Header'
import Label from 'grommet/components/Label'
import List from 'grommet/components/List'
import ListItem from 'grommet/components/ListItem'
import TextInput from 'grommet/components/TextInput'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCertificate from '@fortawesome/fontawesome-free-solid/faCertificate'
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit'
import faPlusSquare from '@fortawesome/fontawesome-free-regular/faPlusSquare'

import {isLevelPublic} from './../tools'

class PageItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: {},
      search: '',
    }
    this.saveEnabled = this.saveEnabled.bind(this)
  }
  saveEnabled(id, value) {
    const items = this.state.items
    items[`user-${id}`].enabled = value
    this.setState({items: items})
    this.props.itemSave(id, {enabled: value}, () => {})
  }
  componentDidMount() {
    this.props.items(response => this.setState(response))
  }
  render() {
    const label = (item, className) =>
      <Label className='pageItemLabel'>
        {item.name}
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
        <Header className='header' fixed={true} size='small' style={{paddingRight: 22}}>
          <Box flex={true} justify='end' direction='row'>
            <TextInput value={this.state.search} onDOMChange={e => this.setState({search: e.target.value})} style={{flexGrow: 1}} placeHolder='Search...' size='medium'/>
            <Button icon={<FontAwesomeIcon icon={faPlusSquare}/>} onClick={() => this.props.itemNew(response => this.setState(response))}/>
            {this.props.buttonsHeader}
          </Box>
        </Header>
        <List>
          {Object.values(this.state.items).map(item => (this.state.search !== '' && (!~item.name.toLowerCase().indexOf(this.state.search.toLowerCase()))) ? [] :
            <ListItem key={item.id} justify='between'>
              <span className='primary'>
                {(!isLevelPublic(item.level) && this.props.itemsCanBeEnabled) ?
                  <CheckBox toggle={true} label={label(item, 'pageItemLabelToggle')} checked={item.enabled} onChange={e => this.saveEnabled(item.id, e.target.checked)}/> :
                  label(item, 'pageItemLabel')
                }
              </span>
              <span className='secondary'>
                {this.props.buttonsOwnItem(item)}
                {
                  (!isLevelPublic(item.level) && this.context.user.admin) ?
                  <Button key='button-public' icon={<FontAwesomeIcon icon={faCertificate}/>} onClick={() => {}}/> : []
                }
                <Button key='button-description' icon={<FontAwesomeIcon icon={faEdit}/>} path={`/${this.props.itemName}/${item.level}/${item.id}/description`}/>
                {
                  this.props.buttonsItem.map(b => (<Button key={`button--${b.path}`} icon={<FontAwesomeIcon icon={b.icon}/>} path={`/${this.props.itemName}/${item.level}/${item.id}/${b.path}`}/>))
                }
                {
                  (this.props.website && this.props.websiteIcon) ?
                    <Button
                      key='button-website'
                      icon={<FontAwesomeIcon icon={this.props.websiteIcon}/>}
                      onClick={e => {
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
  itemName: PropTypes.string.isRequired,
  items: PropTypes.func,
  itemNew: PropTypes.func,
  itemSave: PropTypes.func,
  itemsCanBeEnabled: PropTypes.bool,
  buttonsHeader: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  buttonsOwnItem: PropTypes.func,
  buttonsItem: PropTypes.array,
  website: PropTypes.func,
  websiteIcon: PropTypes.object,
}
PageItem.defaultProps = {
  items: callback => {},
  itemNew: callback => {},
  itemSave: (id, data, callback) => {},
  itemsCanBeEnabled: false,
  buttonsHeader: [],
  buttonsOwnItem: item => {},
  buttonsItem: [],
  website: item => {},
  websiteIcon: null,
}
PageItem.contextTypes = {
  user: PropTypes.object.isRequired,
}

export default PageItem

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
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit'
import faPlusSquare from '@fortawesome/fontawesome-free-regular/faPlusSquare'

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
    items[id].enabled = value
    this.setState({items: items})
    this.props.itemSave(id, {enabled: value}, () => {})
  }
  componentDidMount() {
    this.props.items(response => this.setState(response))
  }
  render() {
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
                {(this.props.itemCanBeEnabled) ?
                  <CheckBox toggle={true} label={<Label className='pageItemLabelToggle'>{item.name}</Label>} checked={this.state.items[item.id].enabled} onChange={e => this.saveEnabled(item.id, e.target.checked)}/> :
                  <Label className='pageItemLabel'>{item.name}</Label>
                }
              </span>
              <span className='secondary'>
                {this.props.buttonsOwnItem(item)}
                <Button key='button-description' icon={<FontAwesomeIcon icon={faEdit}/>} path={`/${this.props.itemName}/${item.id}/description`}/>
                {
                  this.props.buttonsItem.map(b => (<Button key={`button--${b.path}`} icon={<FontAwesomeIcon icon={b.icon}/>} path={`/${this.props.itemName}/${item.id}/${b.path}`}/>))
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
  itemCanBeEnabled: PropTypes.bool,
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
  itemCanBeEnabled: false,
  buttonsHeader: [],
  buttonsOwnItem: item => {},
  buttonsItem: [],
  website: item => {},
  websiteIcon: null,
}

export default PageItem

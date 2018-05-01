import React from 'react'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import Header from 'grommet/components/Header'
import Label from 'grommet/components/Label'
import List from 'grommet/components/List'
import ListItem from 'grommet/components/ListItem'
import TextInput from 'grommet/components/TextInput'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit'
import faPlusSquare from '@fortawesome/fontawesome-free-regular/faPlusSquare'

import {contexts, contextNew} from './../backend'

class PageContext extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      contexts: {},
      search: '',
    }
    contexts(response => this.setState(response))
  }
  render() {
    return (
      <div>
        <Header className='header' fixed={true} size='small' style={{paddingRight: 22}}>
          <Box flex={true} justify='end' direction='row'>
            <TextInput value={this.state.search} onDOMChange={e => this.setState({search: e.target.value})} style={{flexGrow: 1}} placeHolder='Search...' size='medium'/>
            <Button icon={<FontAwesomeIcon icon={faPlusSquare}/>} onClick={() => contextNew(response => this.setState(response))}/>
          </Box>
        </Header>
        <List>
          {Object.values(this.state.contexts).map(context => (this.state.search !== '' && (!~context.name.toLowerCase().indexOf(this.state.search.toLowerCase()))) ? [] :
            <ListItem key={context.id} justify='between'>
              <span className='primary'>
                <Label className='pageItemLabel'>{context.name}</Label>
              </span>
              <span className='secondary'>
                <Button icon={<FontAwesomeIcon icon={faEdit}/>} path={`/context/${context.id}/description`}/>
              </span>
            </ListItem>
          )}
        </List>
      </div>
    )
  }
}

export default PageContext

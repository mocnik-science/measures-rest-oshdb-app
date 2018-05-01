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
import faHome from '@fortawesome/fontawesome-free-solid/faHome'
import faPlusSquare from '@fortawesome/fontawesome-free-regular/faPlusSquare'

import {persons, personNew} from './../backend'

class PagePerson extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: {},
      search: '',
    }
    persons(response => this.setState(response))
  }
  render() {
    return (
      <div>
        <Header className='header' fixed={true} size='small' style={{paddingRight: 22}}>
          <Box flex={true} justify='end' direction='row'>
            <TextInput value={this.state.search} onDOMChange={e => this.setState({search: e.target.value})} style={{flexGrow: 1}} placeHolder='Search...' size='medium'/>
            <Button icon={<FontAwesomeIcon icon={faPlusSquare}/>} onClick={() => personNew(response => this.setState(response))}/>
          </Box>
        </Header>
        <List>
          {Object.values(this.state.persons).map(person => (this.state.search !== '' && (!~person.name.toLowerCase().indexOf(this.state.search.toLowerCase()))) ? [] :
            <ListItem key={person.id} justify='between'>
              <span className='primary'>
                <Label className='pageItemLabel'>{person.name}</Label>
              </span>
              <span className='secondary'>
                <Button icon={<FontAwesomeIcon icon={faEdit}/>} path={`/person/${person.id}/description`}/>
                <Button icon={<FontAwesomeIcon icon={faHome}/>} onClick={e => {
                  e.preventDefault()
                  window.open(`${person.homepage}`)
                }}/>
              </span>
            </ListItem>
          )}
        </List>
      </div>
    )
  }
}

export default PagePerson

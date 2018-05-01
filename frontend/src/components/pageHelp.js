import React from 'react'
import Box from 'grommet/components/Box'
import Markdown from 'grommet/components/Markdown'

import {help} from './../backend'

class PageHelp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
    }
    help(window.location.pathname.split('/').pop(), response => this.setState({text: response}))
  }
  render() {
    return (
      <Box pad='large' align='center'>
        <Markdown content={this.state.text}/>
      </Box>
    )
  }
}

export default PageHelp

import React from 'react'

import {contexts, contextNew} from './../backend'
import PageItem from './pageItem'

class PageItemContext extends React.Component {
  render() {
    return (
      <PageItem
        itemName='context'
        items={contexts}
        itemNew={contextNew}
      />
    )
  }
}

export default PageItemContext

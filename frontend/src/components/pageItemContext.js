import React from 'react'

import {contexts, contextPublic, contextNew} from './../backend'
import PageItem from './pageItem'

class PageItemContext extends React.Component {
  render() {
    return (
      <PageItem
        itemName='context'
        items={contexts}
        itemPublic={contextPublic}
        itemNew={contextNew}
      />
    )
  }
}

export default PageItemContext

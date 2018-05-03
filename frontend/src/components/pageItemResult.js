import React from 'react'

import {results, resultPublic, resultNew} from './../backend'
import PageItem from './pageItem'

class PageItemResult extends React.Component {
  render() {
    return (
      <PageItem
        itemName='result'
        items={results}
        itemPublic={resultPublic}
        itemNew={resultNew}
      />
    )
  }
}

export default PageItemResult

import React from 'react'

import {results, resultNew} from './../backend'
import PageItem from './pageItem'

class PageItemResult extends React.Component {
  render() {
    return (
      <PageItem
        itemName='result'
        items={results}
        itemNew={resultNew}
      />
    )
  }
}

export default PageItemResult

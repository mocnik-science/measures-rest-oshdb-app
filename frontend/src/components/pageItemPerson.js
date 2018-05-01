import React from 'react'
import faHome from '@fortawesome/fontawesome-free-solid/faHome'

import {persons, personNew} from './../backend'
import PageItem from './pageItem'

class PageItemPerson extends React.Component {
  render() {
    return (
      <PageItem
        itemName='person'
        items={persons}
        itemNew={personNew}
        website={item => item.homepage}
        websiteIcon={faHome}
      />
    )
  }
}

export default PageItemPerson

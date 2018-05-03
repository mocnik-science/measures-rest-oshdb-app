import React from 'react'
import faHome from '@fortawesome/fontawesome-free-solid/faHome'

import {persons, personPublic, personNew} from './../backend'
import PageItem from './pageItem'

class PageItemPerson extends React.Component {
  render() {
    return (
      <PageItem
        itemName='person'
        items={persons}
        itemNew={personNew}
        itemPublic={personPublic}
        website={item => item.homepage}
        websiteIcon={faHome}
      />
    )
  }
}

export default PageItemPerson

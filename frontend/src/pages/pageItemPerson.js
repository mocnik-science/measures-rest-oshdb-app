import React from 'react'
import faHome from '@fortawesome/fontawesome-free-solid/faHome'

import PageItem from './pageItem'

class PageItemPerson extends React.Component {
  render() {
    return (
      <PageItem
        itemName='person'
        website={item => item.homepage}
        websiteIcon={faHome}
      />
    )
  }
}

export default PageItemPerson

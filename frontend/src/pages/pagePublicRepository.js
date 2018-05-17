import React from 'react'

class PagePublicRepository extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    return (
      <iframe
        src='https://osm-measure.geog.uni-heidelberg.de'
        title='public repository'
        style={{width: '100%', height: '100%', border: 0}}
      />
    )
  }
}

export default PagePublicRepository

import React from 'react'
import Button from 'grommet/components/Button'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck'
import faCloudDownloadAlt from '@fortawesome/fontawesome-free-solid/faCloudDownloadAlt'
import faCode from '@fortawesome/fontawesome-free-solid/faCode'
import faExclamationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle'
import faMap from '@fortawesome/fontawesome-free-solid/faMap'
import faStethoscope from '@fortawesome/fontawesome-free-solid/faStethoscope'

import {serviceCheck} from './../backend'
import PageItem from './pageItem'

class PageItemMeasure extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: null,
    }
    this.renderErrors = this.renderErrors.bind(this)
  }
  renderErrors(id) {
    if (this.state.errors === null || this.state.errors[id] === undefined) return []
    if (this.state.errors[id] !== '') return <Button className='exception' icon={<FontAwesomeIcon icon={faExclamationTriangle}/>} path={`/measure/log/${id}`}/>
    else return <Button icon={<FontAwesomeIcon icon={faCheck}/>} path={`/measure/log/${id}`}/>
  }
  render() {
    return (
      <PageItem
        buttonsHeader={<Button icon={<FontAwesomeIcon icon={faStethoscope}/>} onClick={() => serviceCheck(response => this.setState({errors: response}))}/>}
        itemName='measure'
        itemsCanBeEnabled={true}
        buttonsOwnItem={item => this.renderErrors(item.id)}
        buttonsItem={[
          {path: 'code', icon: faCode},
          {path: item => `/backend/measure/download/${item.level}/${item.id}`, icon: faCloudDownloadAlt, newTab: true},
        ]}
        website={item => `/map/${item.id}`}
        websiteIcon={faMap}
      />
    )
  }
}

export default PageItemMeasure

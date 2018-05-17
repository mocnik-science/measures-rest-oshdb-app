import PropTypes from 'prop-types'
import React from 'react'
import Footer from 'grommet/components/Footer'
import Select from 'grommet/components/Select'

// import {serviceState, serviceStart, serviceStop} from './../other/backend'

class SidebarUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      asUser: null,
    }
  }
  componentWillMount() {
  }
  render() {
    return (
      <Footer pad='small' justify='between'>
        <Select options={['Amin', 'Yajie']}/>
      </Footer>
    )
  }
}
// SidebarService.propTypes = {
//   checkServiceInterval: PropTypes.number,
//   waitForResponseTimeout: PropTypes.number,
// }
// SidebarService.defaultProps = {
//   checkServiceInterval: 1000,
//   waitForResponseTimeout: 5000,
// }

export default SidebarUser

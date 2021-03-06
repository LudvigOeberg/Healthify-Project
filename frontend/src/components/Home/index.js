import React from 'react'
import { connect } from 'react-redux'
import Banner from './Banner'
import { HOME_PAGE_LOADED, HOME_PAGE_UNLOADED } from '../../constants/actionTypes'

const mapStateToProps = (state) => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
})

const mapDispatchToProps = (dispatch) => ({
  onLoad: (tab, pager, payload) => dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () => dispatch({ type: HOME_PAGE_UNLOADED }),
})

class Home extends React.Component {
  componentWillUnmount() {
    this.props.onUnload()
  }

  render() {
    return (
      <div className="home-page">
        <Banner token={this.props.token} appName={this.props.appName} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

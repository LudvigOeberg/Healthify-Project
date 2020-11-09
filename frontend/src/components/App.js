import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { push } from 'react-router-redux'
import agent from '../agent'
import agentEHR from '../agentEHR'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import { APP_LOAD, REDIRECT } from '../constants/actionTypes'
import { store } from '../store'
import Patient from './Child/Patient'
import Footer from './Footer'
import Header from './Header'
import NotFound from './NotFound'
import CaregivingPage from './Parent/CaregivingPage'
import Parent from './Parent/Parent'
import ParentOverview from './Parent/ParentOverview'
import PatientRegister from './Parent/PatientRegister'
import MySnackbar from './MySnackbar'
import MonitorChildValue from './Parent/MonitorChildValue'
import PatientEdit from './Parent/PatientEdit'
import ChildMonitor from './Child/ChildMonitor'
import AccessedData from './Child/AccessedData'


const mapStateToProps = (state) => ({
  appLoaded: state.common.appLoaded,
  appName: state.common.appName,
  currentUser: state.common.currentUser,
  redirectTo: state.common.redirectTo,
})

const mapDispatchToProps = (dispatch) => ({
  onLoad: (payload, token, ehrToken) => dispatch({ type: APP_LOAD, payload, token, ehrToken, skipTracking: true }),
  onRedirect: () => dispatch({ type: REDIRECT }),
})

class App extends React.Component {
<<<<<<< HEAD
  // eslint-disable-next-line
=======
>>>>>>> 4c0d5ec9b8de40883b94191a51ff87eb2dfd5587
  componentWillUpdate(nextProps) {
    if (nextProps.redirectTo) {
      // this.context.router.replace(nextProps.redirectTo);
      store.dispatch(push(nextProps.redirectTo))
      this.props.onRedirect()
    }
  }

  componentDidMount() {
    const token = window.localStorage.getItem('jwt')
    const ehrUser = window.localStorage.getItem('ehr_user')
    const ehrUserPass = window.localStorage.getItem('ehr_user_pass')
    if (token) {
      agent.setToken(token)
    }

    if (ehrUser && ehrUserPass) {
      agentEHR.setToken(ehrUser, ehrUserPass)
    }

    this.props.onLoad(token ? agent.Auth.current() : null, token, btoa(`${ehrUser}:${ehrUserPass}`))
  }

  render() {
    if (this.props.appLoaded) {
      if (!window.localStorage.getItem('ehr_dont_bother')) {
        // Okay with alerts as it is only used in development mode and should not be visible for end user in the final product.
        // eslint-disable-next-line no-alert
        const ehrUser = prompt('Du har ingen cookie för EHRscape.\nSkriv in användarnamn för att använda API:et:')
        if (ehrUser) {
          // Okay with alerts as it is only used in development mode and should not be visible for end user in the final product.
          // eslint-disable-next-line no-alert
          const ehrUserPass = prompt('Lösenord:')
          if (ehrUserPass) {
            window.localStorage.setItem('ehr_user', ehrUser)
            window.localStorage.setItem('ehr_user_pass', ehrUserPass)
            window.localStorage.setItem('ehr_dont_bother', true)
          }
        }
      }
      return (
        <div style={{ display: `flex`, flexDirection: `column`, minHeight: `100vh` }}>
          <Header appName={this.props.appName} currentUser={this.props.currentUser} />
          <div id="main" style={{ marginTop: 0, marginBottom: 0 }}>
            <Switch>
              <RequiredRoute exact path="/" requires={['!auth']} user={this.props.currentUser} component={Home} />
              <RequiredRoute exact path="/login" requires={['!auth']} user={this.props.currentUser} component={Login} />
              <RequiredRoute
                exact
                path="/register"
                requires={['!auth']}
                user={this.props.currentUser}
                component={Register}
              />
              <RequiredRoute
                exact
                path="/parent"
                requires={['auth', 'parent']}
                user={this.props.currentUser}
                component={Parent}
              />
              <RequiredRoute
                exact
                path="/child"
                requires={['auth', 'child']}
                user={this.props.currentUser}
                component={Patient}
              />
              <RequiredRoute
                exact
                path="/child-monitor"
                requires={['auth', 'child']}
                user={this.props.currentUser}
                component={ChildMonitor}
              />
              <RequiredRoute
                exact
                path="/accessed-data"
                requires={['auth', 'child']}
                user={this.props.currentUser}
                component={AccessedData}
              />
              <RequiredRoute
                exact
                path="/caregiving-team"
                user={this.props.currentUser}
                requires={['auth', 'parent', 'child']}
                component={CaregivingPage}
              />
              <RequiredRoute
                exact
                path="/parent-child-overview/:id"
                requires={['auth', 'parent']}
                user={this.props.currentUser}
                component={ParentOverview}
              />
              <RequiredRoute
                exact
                path="/monitor-child/:id"
                requires={['auth', 'parent']}
                user={this.props.currentUser}
                component={MonitorChildValue}
              />
              <RequiredRoute
                exact
                path="/register-patient"
                requires={['auth', 'parent']}
                user={this.props.currentUser}
                component={PatientRegister}
              />
              <RequiredRoute
                exact
                path="/caregiving-team"
                requires={['auth', 'parent']}
                user={this.props.currentUser}
                component={CaregivingPage}
              />
              <RequiredRoute
                exact
                path="/edit-child/:id"
                requires={['auth', 'parent']}
                user={this.props.currentUser}
                component={PatientEdit}
              />
              <Redirect exact from="/swagger-ui" to="/swagger-ui/" />
              <Route path="*" component={NotFound} />
            </Switch>
          </div>
          <Footer />
          <MySnackbar />
        </div>
      )
    }
    return (
      <div>
        <Header appName={this.props.appName} currentUser={this.props.currentUser} />
      </div>
    )
  }
}

/**
 *
 * @param {props} props should contain:
 *
 * requires - one or more of following in a array: !auth, auth, parent, child
 *
 * user - currentUser
 *
 * component - component to render if requirements are passed
 *
 * path - path to match
 *
 * exact - add if the path should match exact, more info in react-router docs
 *
 * To specify more props to the <Route /> component, please specify them in
 * this component and it will automatically be mapped to the <Route /> component.
 */
const RequiredRoute = ({ requires, user, component, path, exact, ...rest }) => {
  if (requires.includes('auth') && !user) return <Redirect to="/login" />
  if (user) if (requires.includes('!auth') || !requires.includes(user.type)) return <Redirect to={`/${user.type}`} />
  return <Route exact={exact} path={path} component={component} {...rest} />
}

// App.contextTypes = {
//   router: PropTypes.object.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(App)

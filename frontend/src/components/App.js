import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { push } from 'react-router-redux'
import { Snackbar, withStyles } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import agent from '../agent'
import agentEHR from '../agentEHR'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import { APP_LOAD, REDIRECT, UPDATE_BOOLEAN } from '../constants/actionTypes'
import { store } from '../store'
import Patient, { getCurrentUTCDate } from './Child/Patient'
import Footer from './Footer'
import Header from './Header'
import NotFound from './NotFound'
import CaregivingPage from './Parent/CaregivingPage'
import Parent from './Parent/Parent'
// eslint-disable-next-line import/no-named-as-default-member
import ParentOverview from './Parent/ParentOverview'
import PatientRegister from './Parent/PatientRegister'
import MySnackbar from './MySnackbar'
import MonitorChildValue from './Parent/MonitorChildValue'
import PatientEdit from './Parent/PatientEdit'
import ChildMonitor from './Child/ChildMonitor'
import AccessedData from './Child/AccessedData'
import ParentSettingsPage from './Parent/ParentSettingsPage'
import Integrations from './Child/Integrations'
import SimulatePatient from './Parent/SimulatePatient'
import FooterBar from './FooterBar'
import ParentRewardPage from './Parent/ParentRewardPage'
import ChildLaboration from './Child/ChildLaboration'
import ChildSimulationDiabetes from './Child/ChildSimulationDiabetes'
import ChildSimulationObesity from './Child/ChildSimulationObesity'
import AddVal from './Child/AddVal'
import NewChallenge from './Parent/NewChallenge'
import ChildRealLifeRewards from './Child/ChildRealLifeRewards'

const mapStateToProps = (state) => ({
  appLoaded: state.common.appLoaded,
  appName: state.common.appName,
  currentUser: state.common.currentUser,
  redirectTo: state.common.redirectTo,
  timerSnackbarOpen: state.common.timerSnackbarOpen,
})

const mapDispatchToProps = (dispatch) => ({
  onLoad: (payload, token, ehrToken) => dispatch({ type: APP_LOAD, payload, token, ehrToken, skipTracking: true }),
  onRedirect: () => dispatch({ type: REDIRECT }),

  setTimerSnackbarOpen: (val) => dispatch({ type: UPDATE_BOOLEAN, key: 'timerSnackbarOpen', value: val }),
  onOpenSnackbar: (snackbar) => dispatch({ type: UPDATE_BOOLEAN, key: 'snackbarOpen', snackbar }),
})

class App extends React.Component {
  // eslint-disable-next-line
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
    const { classes } = this.props
    const currTime = getCurrentUTCDate()
    const timerSnackbar = {
      message:
        'Det har gått en timme sedan förra mätnigen, var snäll och gör en ny. Meddelandet försvinner när värdet är godkänt.',
      color: 'error',
    }

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return
      }
      if (this.props.currentUser !== null) {
        // handles a bugg that crashes the site on login-page.
        this.props.currentUser.timer = null // Just removes the snackbar at the current page. Can be changed to change the agent if it's too annoying.
        this.props.setTimerSnackbarOpen(false)
      }
    }

    if (this.props.appLoaded) {
      if (
        this.props.currentUser !== null &&
        this.props.currentUser !== undefined &&
        this.props.currentUser.timer !== undefined &&
        this.props.currentUser.timer !== null
      ) {
        if (currTime >= this.props.currentUser.timer) {
          this.props.setTimerSnackbarOpen(true)
        }
      }
      let footer = <Footer />
      if (this.props.currentUser && this.props.currentUser.type === 'child') {
        footer = <FooterBar />
      }

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
        <div className={classes.root}>
          <Header appName={this.props.appName} currentUser={this.props.currentUser} />
          <div id="main" className={classes.main}>
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
                path="/settings"
                requires={['auth', 'child']}
                user={this.props.currentUser}
                component={Integrations}
              />
              <RequiredRoute
                exact
                path="/add"
                requires={['auth', 'child']}
                user={this.props.currentUser}
                component={AddVal}
              />
              {/* Commented out as link from ChildListItem no longer links to /caregiving-team
               here in case we need it */}
              {/*
              <RequiredRoute
                exact
                path="/caregiving-team"
                user={this.props.currentUser}
                requires={['auth', 'parent', 'child']}
                component={CaregivingPage}
              />
              */}
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
              <RequiredRoute
                exact
                path="/parent-settings"
                requires={['auth', 'parent']}
                user={this.props.currentUser}
                component={ParentSettingsPage}
              />
              <RequiredRoute
                exact
                path="/child-laboration"
                requires={['auth', 'child']}
                user={this.props.currentUser}
                component={ChildLaboration}
              />
              <RequiredRoute
                exact
                path="/simulate-patient/:id"
                requires={['auth', 'parent']}
                user={this.props.currentUser}
                component={SimulatePatient}
              />
              <RequiredRoute
                exact
                path="/simulate-child-diabetes/"
                requires={['auth', 'child']}
                user={this.props.currentUser}
                component={ChildSimulationDiabetes}
              />
              <RequiredRoute
                exact
                path="/simulate-child-Obesity/"
                requires={['auth', 'child']}
                user={this.props.currentUser}
                component={ChildSimulationObesity}
              />
              <RequiredRoute
                exact
                path="/parent-reward/:id"
                requires={['auth', 'parent']}
                user={this.props.currentUser}
                component={ParentRewardPage}
              />
              <RequiredRoute
                exact
                path="/add-reward/:id"
                requires={['auth', 'parent']}
                user={this.props.currentUser}
                component={NewChallenge}
              />
              <RequiredRoute
                exact
                path="/child-rewards"
                requires={['auth', 'child']}
                user={this.props.currentUser}
                component={ChildRealLifeRewards}
              />
              <Redirect exact from="/swagger-ui" to="/swagger-ui/" />
              <Route path="*" component={NotFound} />
            </Switch>
          </div>
          {footer}
          <MySnackbar />

          <div className={classes.snackbarDiv}>
            <Snackbar
              className={classes.snackbar}
              open={this.props.timerSnackbarOpen}
              autoHideDuration={5000}
              onClose={handleClose}
            >
              <Alert
                elevation={6}
                severity={timerSnackbar.color}
                variant="filled"
                onClose={handleClose}
                color={timerSnackbar.color}
              >
                {timerSnackbar.message}
              </Alert>
            </Snackbar>
          </div>
        </div>
      )
    }
    return (
      <div className={classes.root}>
        <Header appName={this.props.appName} currentUser={this.props.currentUser} />
        <div id="main" className={classes.main}></div>
        <Footer />
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

const styles = (theme) => ({
  snackbar: {
    bottom: '5rem',
  },
  snackbarDiv: {
    width: '100%',
    zIndex: 20000,
    '& > * + *': {
      marginTop: theme.spacing(4),
    },
  },
  root: {
    display: `flex`,
    flexDirection: `column`,
    minHeight: `100vh`,
  },
  main: {
    marginTop: '64px',
    marginBottom: '8rem',
  },
})

// App.contextTypes = {
//   router: PropTypes.object.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App))

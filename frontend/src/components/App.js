import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { push } from 'react-router-redux';
import agent from '../agent';
import agentEHR from '../agentEHR';
import Home from '../components/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import { APP_LOAD, REDIRECT } from '../constants/actionTypes';
import { store } from '../store';
import Patient from './Child/Patient';
import Footer from './Footer';
import Header from './Header';
import NotFound from './NotFound';
import CaregivingPage from './Parent/CaregivingPage';
import Parent from './Parent/Parent';
import ParentOverview from './Parent/ParentOverview';
import PatientRegister from './Parent/PatientRegister';
import MySnackbar from './MySnackbar';
import MonitorChildValue from './Parent/MonitorChildValue';

const mapStateToProps = state => {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo
  }};

const mapDispatchToProps = dispatch => ({
  onLoad: (payload, token, ehrToken) =>
    dispatch({ type: APP_LOAD, payload, token, ehrToken, skipTracking: true }),
  onRedirect: () =>
    dispatch({ type: REDIRECT })
});

class App extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      // this.context.router.replace(nextProps.redirectTo);
      store.dispatch(push(nextProps.redirectTo));
      this.props.onRedirect();
    }
  }

  componentWillMount() {
    const token = window.localStorage.getItem('jwt');
    const ehrUser = window.localStorage.getItem('ehr_user');
    const ehrUserPass = window.localStorage.getItem('ehr_user_pass');
    if (token) {
      agent.setToken(token);
    }

    if (ehrUser && ehrUserPass) {
      agentEHR.setToken(ehrUser, ehrUserPass);
    }

    this.props.onLoad(
      token ? agent.Auth.current() : null,
      token,
      btoa(ehrUser + ":" + ehrUserPass));
  }

  render() {
    if (this.props.appLoaded) {
      if (!window.localStorage.getItem('ehr_dont_bother')) {
        let ehrUser = prompt('Du har ingen cookie för EHRscape.\nSkriv in användarnamn för att använda API:et:');
        if (ehrUser) {
          let ehrUserPass = prompt('Lösenord:');
          window.localStorage.setItem('ehr_user', ehrUser);
          window.localStorage.setItem('ehr_user_pass', ehrUserPass);
        } else {
          window.localStorage.setItem('ehr_dont_bother', true);
        }
      }
      return (
        <div style={{display: `flex`, flexDirection: `column`, minHeight: `100vh`}}>
            <Header
            appName={this.props.appName}
            currentUser={this.props.currentUser} />
            <div id="main" style={{ marginTop: 0, marginBottom: 0 }}>
              <Switch>
                <Route exact path="/">
                  { this.props.currentUser ? <Redirect to={"/" + this.props.currentUser.type}/> : <Home />}
                </Route>
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/child" component={Patient} />
                <Route exact path="/parent" component={Parent} />
                <Route exact path="/parent-child-overview" component={ParentOverview} />
                <Route exact path="/parent-child-overview2" component={MonitorChildValue} />
                <Route exact path="/register-patient" component={PatientRegister} />
                <Route exact path="/caregiving-team" component={CaregivingPage} />
                <Route path="*" component={NotFound} />
              </Switch>
            </div>
            <Footer />
            <MySnackbar />
        </div>
      );
    }
    return (
      <div>
        <Header
          appName={this.props.appName}
          currentUser={this.props.currentUser} />
      </div>
    );
  }
}

// App.contextTypes = {
//   router: PropTypes.object.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(App);

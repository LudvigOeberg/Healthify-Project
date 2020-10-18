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
          if (ehrUserPass) {
            window.localStorage.setItem('ehr_user', ehrUser);
            window.localStorage.setItem('ehr_user_pass', ehrUserPass);
            window.localStorage.setItem('ehr_dont_bother', true);
          }
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
                  <Requires types={['!auth']} user={this.props.currentUser} component={Home}/>
                </Route>
                <Route exact path="/login">
                  <Requires types={['!auth']} user={this.props.currentUser} component={Login}/>
                </Route>
                <Route exact path="/register">
                  <Requires types={['!auth']} user={this.props.currentUser} component={Register}/>
                </Route>
                <Route exact path="/child">
                  <Requires types={['auth', 'child']} user={this.props.currentUser} component={Patient}/>
                </Route>
                <Route exact path="/parent">
                  <Requires types={['auth', 'parent']} user={this.props.currentUser} component={Parent}/>
                </Route>
                <Route exact path="/parent-child-overview">
                  <Requires types={['auth', 'parent']} user={this.props.currentUser} component={ParentOverview}/>
                </Route>
                <Route exact path="/parent-child-overview2">
                  <Requires types={['auth', 'parent']} user={this.props.currentUser} component={MonitorChildValue}/>
                </Route>
                <Route exact path="/register-patient">
                  <Requires types={['auth', 'parent']} user={this.props.currentUser} component={PatientRegister}/>
                </Route>
                <Route exact path="/caregiving-team">
                  <Requires types={['auth', 'parent']} user={this.props.currentUser} component={CaregivingPage}/>
                </Route>
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

/**
 * 
 * @param {props} props should contain:
 * 
 * types - one or more of following in a array: !auth, auth, parent, child 
 * 
 * user - currentUser
 * 
 * component - component to render if requirements are passed
 */
const Requires = (props) => {
  if (props.types.includes('auth') && !props.user)
    return (<Redirect to={"/login"}/>)
  if (props.user)
    if (props.types.includes('!auth') || !props.types.includes(props.user.type))
      return (<Redirect to={"/" + props.user.type}/>)
  return <props.component />
}


// App.contextTypes = {
//   router: PropTypes.object.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(App);

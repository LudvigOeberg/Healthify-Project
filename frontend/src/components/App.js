import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { push } from 'react-router-redux';
import agent from '../agent';
import Home from '../components/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import { APP_LOAD, REDIRECT } from '../constants/actionTypes';
import { store } from '../store';
import Patient from './Child/Patient';
import Footer from './Footer';
import Header from './Header';
import NotFound from './NotFound';
import Parent from './Parent/Parent';
import ParentOverview from './Parent/ParentOverview';
import PatientRegister from './Parent/PatientRegister';

const mapStateToProps = state => {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo
  }};

const mapDispatchToProps = dispatch => ({
  onLoad: (payload, token) =>
    dispatch({ type: APP_LOAD, payload, token, skipTracking: true }),
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
    if (token) {
      agent.setToken(token);
    }

    this.props.onLoad(token ? agent.Auth.current() : null, token);
  }

  render() {
    if (this.props.appLoaded) {
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
                <Route exact path="/register-patient" component={PatientRegister} />
                <Route path="*" component={NotFound} />
              </Switch>
            </div>
            <Footer />
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

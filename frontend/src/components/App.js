import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { push } from 'react-router-redux';
import agent from '../agent';
import Home from '../components/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import { APP_LOAD, REDIRECT } from '../constants/actionTypes';
import { store } from '../store';
import Footer from './Footer';
import Header from './Header';
import MonitorChildValue from './MonitorChildValue';
import Patient from './Patient';


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
                <Route exact path="/" component={Home}/>
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/patient-view" component={Patient} />
                <Route exact path="/test" component={MonitorChildValue} />
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

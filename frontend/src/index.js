import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import React from 'react';
import { store, history} from './store';

import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import App from './components/App';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './theme'
import { ThemeProvider } from '@material-ui/core/styles'

ReactDOM.render((
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  </ThemeProvider>

), document.getElementById('root'));

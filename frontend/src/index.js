import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import React from 'react'

import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import App from './components/App'
import theme from './theme'
import { store, history } from './store'

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  </ThemeProvider>,

  document.getElementById('root'),
)

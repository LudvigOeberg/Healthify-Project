import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { routerMiddleware } from 'react-router-redux'
import { createBrowserHistory } from 'history'
import { promiseMiddleware, localStorageMiddleware } from './middleware'
import reducer from './reducer'

export const history = createBrowserHistory()

// Build the middleware for intercepting and dispatching navigation actions
const myRouterMiddleware = routerMiddleware(history)

const getMiddleware = () => {
  if (process.env.NODE_ENV === 'production') {
    return applyMiddleware(myRouterMiddleware, promiseMiddleware, localStorageMiddleware)
  }
  // Enable additional logging in non-production environments.
  return applyMiddleware(myRouterMiddleware, promiseMiddleware, localStorageMiddleware, createLogger())
}

const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 })
/* const persistedState = localStorage.getItem('store') 
                       ? JSON.parse(localStorage.getItem('store'))
                       : {}
store.subscribe(()=>{
    localStorage.setItem('store', JSON.stringify(store.getState()))
  })
*/
export const store = createStore(reducer, composeEnhancers(getMiddleware()))

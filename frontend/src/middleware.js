import agent from './agent'
import { ASYNC_START, ASYNC_END, LOGIN, LOGOUT, REGISTER, LOCAL_SAVE } from './constants/actionTypes'

const promiseMiddleware = (store) => (next) => (action) => {
  if (isPromise(action.payload)) {
    store.dispatch({ type: ASYNC_START, subtype: action.type })

    const currentView = store.getState().viewChangeCounter
    const { skipTracking } = action

    action.payload.then(
      (res) => {
        const currentState = store.getState()
        // Comment out console as Lint doesn't like it, if you need it for testing remove this comment console.log(currentState)
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        // Comment out console as Lint doesn't like it, if you need it for testing remove this comment console.log('RESULT', res)
        action.payload = res
        store.dispatch({ type: ASYNC_END, promise: action.payload })
        store.dispatch(action)
      },
      (error) => {
        const currentState = store.getState()
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        // Comment out console as Lint doesn't like it, if you need it for testing remove this comment console.log('ERROR', error)
        action.error = true
        action.payload = error.response.body
        if (!action.skipTracking) {
          store.dispatch({ type: ASYNC_END, promise: action.payload })
        }
        store.dispatch(action)
      },
    )

    return
  }

  next(action)
}
// eslint-disable-next-line no-unused-vars
const localStorageMiddleware = (store) => (next) => (action) => {
  if (action.type === LOCAL_SAVE) {
    window.localStorage.setItem(action.key, action.value)
  }
  if (action.type === REGISTER || action.type === LOGIN) {
    if (!action.error) {
      window.localStorage.setItem('jwt', action.payload.user.token)
      agent.setToken(action.payload.user.token)
    }
  } else if (action.type === LOGOUT) {
    window.localStorage.setItem('jwt', '')
    agent.setToken(null)
  }

  next(action)
}

function isPromise(v) {
  return v && typeof v.then === 'function'
}

export { promiseMiddleware, localStorageMiddleware }

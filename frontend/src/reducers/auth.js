import {
  LOGIN,
  REGISTER,
  LOGIN_PAGE_UNLOADED,
  REGISTER_PAGE_UNLOADED,
  ASYNC_START,
  UPDATE_FIELD_AUTH,
  UPDATE_AUTH_BOOLEAN,
  REGISTER_CHILD,
  EDIT_CHILD,
} from '../constants/actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case LOGIN:
    case REGISTER:
    case EDIT_CHILD:
    case REGISTER_CHILD:
      return {
        ...state,
        inProgress: false,
        errors: action.error ? action.payload.errors : null,
      }
    case LOGIN_PAGE_UNLOADED:
    case REGISTER_PAGE_UNLOADED:
      return {}
    case ASYNC_START:
      if (
        action.subtype === LOGIN ||
        action.subtype === REGISTER ||
        action.subtype === REGISTER_CHILD ||
        action.subtype === EDIT_CHILD
      ) {
        return { ...state, inProgress: true }
      }
      break
    case UPDATE_FIELD_AUTH:
      return { ...state, [action.key]: action.value }
    case UPDATE_AUTH_BOOLEAN:
      return { ...state, [action.key]: !!action.value }
    default:
      return state
  }

  return state
}

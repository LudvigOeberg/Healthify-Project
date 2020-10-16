import {
  APP_LOAD,
  REDIRECT,
  LOGOUT,
  LOGIN,
  REGISTER,
  HOME_PAGE_UNLOADED,
  LOGIN_PAGE_UNLOADED,
  REGISTER_PAGE_UNLOADED,
  PATIENT_PAGE_UNLOADED,
  FIELD_CHANGE,
  REGISTER_CHILD,
  UPDATE_BOOLEAN,
  PAGE_UNLOADED,
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
  SAVE_BLOODSUGAR
} from '../constants/actionTypes';

const defaultState = {
  appName: 'Healthify',
  token: null,
  viewChangeCounter: 0,
  drawerOpen: false,
  snackbar: {
    open: false
  }
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case APP_LOAD:
      return {
        ...state,
        token: action.token || null,
        appLoaded: true,
        currentUser: action.payload ? action.payload.user : null
      };
    case REDIRECT:
      return { ...state, redirectTo: null };
    case LOGOUT:
      return { ...state, redirectTo: '/', token: null, currentUser: null };
    case LOGIN:
    case REGISTER:
      return {
        ...state,
        redirectTo: action.error ? null : '/' + action.payload.user.type,
        token: action.error ? null : action.payload.user.token,
        currentUser: action.error ? null : action.payload.user
      };
    case REGISTER_CHILD:
      return {
        ...state,
        redirectTo: action.error ? null : '/parent',
        snackbar: action.error ? {
          open: true,
          message: "Något gick fel",
          color: "warning"
        } : action.snackbar
      };
    case FIELD_CHANGE:
      return { ...state, [action.key]: action.value };
    case SAVE_BLOODSUGAR:
      return {
        ...state,
        bloodSugarJson: action.bloodSugarJson,
        bloodsugar: "",
        snackbar: action.snackbar
      }
    case UPDATE_BOOLEAN:
      return { ...state, [action.key]: action.value ? true : false };
    case OPEN_SNACKBAR:
      return {
        ...state,
        snackbar: {
          open: true,
          message: action.message,
          color: action.color
        }
      }
    case CLOSE_SNACKBAR:
      return {
        ...state,
        snackbar: {
          open: false
        }
      }
    case HOME_PAGE_UNLOADED:
    case LOGIN_PAGE_UNLOADED:
    case REGISTER_PAGE_UNLOADED:
    case PATIENT_PAGE_UNLOADED:
    case PAGE_UNLOADED:
      return { ...state, viewChangeCounter: state.viewChangeCounter + 1 };
    default:
      return state;
  }
};

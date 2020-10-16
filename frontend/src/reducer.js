import auth from './reducers/auth';
import { combineReducers } from 'redux';
import common from './reducers/common';
import home from './reducers/home';
import ehr from './reducers/ehr';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  auth,
  common,
  home,
  ehr,
  router: routerReducer
});

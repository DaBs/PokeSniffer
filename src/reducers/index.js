import { combineReducers } from 'redux';

import menu from './menu.js';
import pokemon from './pokemon.js';
import notifications from './notifications.js';



export default combineReducers({
  pokemon,
  menu,
  notifications
});

import { combineReducers } from 'redux';

import menu from './menu.js';
import pokemon from './pokemon.js';



export default combineReducers({
  pokemon,
  menu
});

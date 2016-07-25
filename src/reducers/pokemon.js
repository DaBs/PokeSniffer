import { LOAD, SAVE } from 'redux-storage';
import CordovaApp from '../cordova.js';

import location from '../utils/location.js';
import moment from 'moment';

const pokemonName = (name) => {
  const tempString = name.split('-')[0];
  return tempString.charAt(0).toUpperCase() + tempString.slice(1);
}

const alreadyTracked = [];

const currentlyTrackingLocalStorage = window.localStorage.getItem("pokesniffer") ? JSON.parse(window.localStorage.getItem("pokesniffer")) : null;
const initialState = { pokemons: [], currentlyTracking: currentlyTrackingLocalStorage && currentlyTrackingLocalStorage.pokemon ? JSON.parse(currentlyTrackingLocalStorage).pokemon.currentlyTracking : [], alreadyTracked: [], loaded: false};

export default function pokemons(state = initialState, action) {
  switch(action.type) {
    case LOAD:
      return Object.assign({}, state, {
        loaded: true
      });
    case 'update-all-pokemons':
      return Object.assign({}, state, {
        pokemons: action.data
      });
    case 'track-pokemon':
      if (state.currentlyTracking.indexOf(action.pokemonId) == -1) {
        return Object.assign({}, state, {
          currentlyTracking: [ ...state.currentlyTracking, action.pokemonId]
        });
      } else {
        return state;
      }
    case 'untrack-pokemon':
      return Object.assign({}, state, {
        currentlyTracking: state.currentlyTracking.filter(pokemonId => pokemonId !== action.pokemonId)
      });

      /*
    case 'update-pokemon':
      const pokemonIndex = state.pokemons.map(pokemon => { return pokemon.uid }).indexOf(action.data.uid);
      const pokemons = state.pokemons;
      pokemons[pokemonIndex] = action.data;
      return Object.assign({}, state, {
        pokemons: pokemons
      });
    case 'remove-pokemon':
      return Object.assign({}, state, {
        pokemons: state.pokemons.filter(pokemon => pokemon.uid !== action.data.uid)
      });*/

    default:
      return state;
  }
}

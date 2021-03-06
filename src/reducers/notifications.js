import CordovaApp from '../cordova.js';

import location from '../utils/location.js';
import moment from 'moment';

const localStorage = window.localStorage.getItem("pokesniffer") ? JSON.parse(window.localStorage.getItem("pokesniffer")) : null;
const initialState = {queuedNotifications: [], alreadyDelivered: []};

const pokemonName = (name) => {
  const tempString = name.split('-')[0];
  return tempString.charAt(0).toUpperCase() + tempString.slice(1);
}

export default function menu(state = initialState, action) {
  switch(action.type) {
    case 'update-all-pokemons':
      const notifications = [];
      action.data.forEach(pokemon => {
        if (state.alreadyDelivered.map(notification => { return JSON.parse(notification.data).id.toString()}).indexOf(pokemon.id.toString()) === -1 && action.currentlyTracking.indexOf(pokemon.pokemonId.toString()) !== -1) {
          const text = "A " + pokemonName(pokemon.identifier) + " was found " + Math.ceil(location.calculateDistance(JSON.parse(window.localStorage.getItem("lastKnownLocation")), pokemon.position)*1000) + " meters away from you. It despawns in " + moment(moment.unix(pokemon.expiration_time).diff(moment(new Date()))).format('mm[m] ss[s]');
          const random = Math.round(Math.random()*10000);
          notifications.push({
            id: random,
            icon: 'res://pokemon' + pokemon.pokemonId,
            data: pokemon,
            text
          });
        }
      });
      console.log(notifications);
      CordovaApp.sendNotifications(notifications);
      return Object.assign({}, state, {
        alreadyDelivered: [ ...state.alreadyDelivered, ...notifications]
      });
    case 'add-delivered-notification':
      return Object.assign({}, state, {
        alreadyDelivered: [ ...alreadyDelivered, action.data]
      });
    default:
      return state;
  }
};

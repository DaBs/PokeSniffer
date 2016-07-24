import request from 'superagent';
import { $ } from 'zepto-browserify';
import location from './utils/location.js';
import * as PokemonActions from './actions/PokemonActions';



class CordovaApp {
  constructor(config){
    this.config = config;
  }
  onGeolocationSuccess(location) {
    console.log(location);
    const newLoc = {};
    newLoc.latitude = location.coords ? location.coords.latitude : location.latitude;
    newLoc.longitude = location.coords ? location.coords.longitude : location.longitude;
    const locationString = JSON.stringify(newLoc);
    console.log(locationString);
    window.localStorage.setItem("lastKnownLocation", locationString);
    this.backgroundScan("data");
  }
  onGeolocationFail(error){
    console.log(error);
  }
  onPause() {
    window.backgroundGeolocation.start();
  }
  onResume(){
    window.backgroundGeolocation.stop();
    console.log(window.localStorage.getItem("lastKnownLocation"));
  }
  toRad(number) {
    return number * Math.PI / 180;
  }
  calculateDistance(pos1, pos2) {
    const R = 6371; // km
    const dLat = this.toRad(pos2.latitude-pos1.latitude);
    const dLon = this.toRad(pos2.longitude-pos1.longitude);
    const lat1 = this.toRad(pos1.latitude);
    const lat2 = this.toRad(pos2.latitude);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  backgroundScan(type){
    return new Promise((resolve, reject) => {
      const location = JSON.parse(window.localStorage.getItem("lastKnownLocation"));
      request.get(this.config.visionQueryUrl + "/" + type +"/" + location.latitude +"/" + location.longitude).end((err, res) => {
        console.log(err, res);
        if (err || !res.body.pokemon) return reject(err);
        console.log(res);
        const tempPokemons = res.body.pokemon.map((pokemon) => {
          console.log(pokemon);
          pokemon.identifier = this.pokedata[pokemon.pokemonId].identifier;
          pokemon.position = {"latitude": pokemon.latitude, "longitude": pokemon.longitude};
          pokemon.distance = Math.ceil(this.calculateDistance(location, {"latitude": pokemon.latitude, "longitude": pokemon.longitude})*1000);
          pokemon.expiration_time = pokemon.expiration_time;
          return pokemon;
        });
        resolve(tempPokemons);
      });
    });
  }
  static sendNotification(data){
    cordova.plugins.notification.local.schedule({
      id: data.id,
      text: data.text
    });
  }
  init(callback){

    this.app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    if (this.app) {
      document.addEventListener("deviceready", callback, false);
      document.addEventListener("pause", this.onPause, false);
      document.addEventListener("resume", this.onResume, false);
    } else {
      callback();
    }
  }
}

export default CordovaApp;

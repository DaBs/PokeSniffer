import Vue from 'vue';
import VueAnimatedList from 'vue-animated-list';
import Router from 'vue-router';
import App from './App.vue';
import CordovaApp from './cordova.js';
import location from './utils/location.js';
import request from 'superagent';

import ScanPage from './pages/ScanPage.vue';
import WishlistPage from './pages/WishlistPage.vue';
import SettingsPage from './pages/SettingsPage.vue';
import MapPage from './pages/MapPage.vue';



Vue.use(VueAnimatedList);

Vue.use(Router);


const router = new Router({
  hashbang: true,
  history: true,
  linkActiveClass: 'active',
  saveScrollPosition: false,
  abstract: true
});

router.map({
  '/wishlist': {
    name: 'wishlist',
    component: WishlistPage
  },
  '/scanner': {
    name: 'scanner',
    component: ScanPage
  },
  '/settings': {
    name: 'settings',
    component: SettingsPage
  },
  '/map': {
    name: 'map',
    component: MapPage
  },
  '*': {
    component: ScanPage
  }
});

router.start(App, '#app');

router.beforeEach(() => {
  router.app.actions.hideMenu();
});


const cordovaConfig = {
  visionQueryUrl: "https://pokevision.com/map",
  pokeApiUrl: "https://pokeapi.co/api/v2"
}

const updatePokemons = (pokemons) => {

  //console.log(pokemons);
  if (pokemons) {
    router.app.actions.updateAllPokemons(pokemons);
  }
}

const curApp = new CordovaApp(cordovaConfig);

curApp.init(function(){
  request.get("./data/pokemons.json").end((err,res) => {
    if (err) return console.log (err);
    curApp.pokedata = res.body || JSON.parse(res.text);
  });
  window.navigator.geolocation.getCurrentPosition(curApp.onGeolocationSuccess, curApp.onGeolocationFail, {maximumAge: 0, timeout: 5000, enableHighAccuracy: true});
  setInterval(function() {
    window.navigator.geolocation.getCurrentPosition(curApp.onGeolocationSuccess, curApp.onGeolocationFail, {maximumAge: 0, timeout: 5000, enableHighAccuracy: true});
  }, 10000);
  /*curApp.backgroundScan("data").then(pokemons => {
    updatePokemons(pokemons);
  });*/
  setInterval(function() {
    curApp.backgroundScan("data").then(pokemons => {
      updatePokemons(pokemons);
    });
  }, 30000);
  setInterval(function() {
    curApp.backgroundScan("scan").then(pokemons => {
      updatePokemons(pokemons);
    });
  }, 60000);
  window.backgroundGeolocation.configure(curApp.onGeolocationSuccess, curApp.onGeolocationFail, {
    desiredAccuracy: 10,
    stationaryRadius: 0,
    distanceFilter: 0,
    debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
    stopOnTerminate: false, // <-- enable this to clear background location settings when the app terminates
  });
});

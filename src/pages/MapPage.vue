<template>

  <div>
    <div id="map">
    </div>
  </div>

</template>

<script>

import request from 'superagent';

const iconBase = './images/pokemons/';

export default {
  name: 'MapPage',

  data() {
    return {
      center: {lat: 10.0, lng: 10.0},
      zoom: 15,
      style: null,
      pokemons: this.$parent.state.pokemon.pokemons
    }
  },

  watch: {
    'pokemons': (val, oldVal) => {
      console.log(val, oldVal);
    }
  },

  components: {
  },

  ready() {
    const pos = JSON.parse(window.localStorage.getItem("lastKnownLocation"))
    request.get('./data/maptheme.json').end((err, res) => {
      if (err) console.log(err);
      const mapDiv = document.getElementById('map');
      const map = new google.maps.Map(mapDiv, {
        center: {lat: pos.latitude, lng: pos.longitude},
        zoom: 15,
        styles: res.body,
        disableDefaultUI: true
        
      });
    });
  }

}


</script>

<style>

#map {
  height: 100vh;
  width: 100vw;
  display: block;
  position: absolute;
  z-index: 80;
  top: 0;
  left: 0;
}

</style>

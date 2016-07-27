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
      pokemons: this.$parent.state.pokemon.pokemons,
      markers: {}
    }
  },

  route: {
    canReuse: false
  },

  watch: {
    'pokemons': (val, oldVal) => {
      console.log(val, oldVal);
    }
  },

  components: {
  },

  ready() {
    const localStorage = JSON.parse(window.localStorage.getItem("lastKnownLocation"));
    console.log(this.$route.query.lat, this.$route.query.lng);
    const centerPos = this.$route.query.lat && this.$route.query.lng ? {lat: parseFloat(this.$route.query.lat), lng: parseFloat(this.$route.query.lng)} : {lat: localStorage.latitude, lng: localStorage.longitude};
    const youPos = {lat: localStorage.latitude, lng: localStorage.longitude};
    const id = this.$route.query.id ? parseInt(this.$route.query.id) : null;
    request.get('./data/maptheme.json').end((err, res) => {
      if (err) console.log(err);
      const mapDiv = document.getElementById('map');
      const map = new google.maps.Map(mapDiv, {
        center: centerPos,
        zoom: 15,
        styles: res.body,
        disableDefaultUI: true

      });

      const youMarker = new google.maps.Marker({
        position: youPos,
        map: map
      });

      this.pokemons.forEach(pokemon => {
        console.log('pokemon for marker', pokemon.identifier);
        if (!this.markers[pokemon.id]) {
          const marker = new google.maps.Marker({
            position: {lat: pokemon.position.latitude, lng: pokemon.position.longitude},
            map: map,
            title: pokemon.identifier,
            icon: './images/pokemons/' + pokemon.pokemonId + '.png'
          });
          if (id && id != pokemon.id) {
            marker.setOpacity(0.2);
          }
        }
      });
    });
  }

}


</script>

<style lang="scss">

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

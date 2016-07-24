<template>
  <li class="pokemon">
    <div class="pokemon__bg" v-bind:style="{backgroundImage: image}"></div>
    <div class="pokemon__img" v-bind:style="{backgroundImage: image}"></div>
    <div v-if="details" class="pokemon__details">
      <h4>{{pokemonName}}</h4>
      <p>Distance from you: {{distance}}m</p>
      <p>Time until despawn: {{timeUntilDespawn}}</p>
    </div>
  </li>
</template>

<script>

import moment from 'moment';
import location from '../utils/location.js';

export default {
  name: 'Pokemon',
  props: {
    data: null,
    details: true
  },
  computed: {
    image() {
      return "url('./images/pokemons/" + this.data.pokemonId + ".png')";
    },
    pokemonName() {
      const tempString = this.data.identifier.split('-')[0];
      return tempString.charAt(0).toUpperCase() + tempString.slice(1);
    },
    distance() {
      return Math.ceil(location.calculateDistance(JSON.parse(window.localStorage.getItem("lastKnownLocation")), this.data.position)*1000)
    },
    timeUntilDespawn() {
      return moment(moment.unix(this.data.expiration_time).diff(moment(new Date()))).format('mm[m] ss[s]');
    }
  }
}

</script>

<style lang="scss">

.pokemon {
  list-style: none;
  padding: 5vw;
  margin-bottom: 3vw;
  background-color: #FFF;
  box-shadow: 0 0 5px rgba(0,0,0,.1);
  overflow: hidden;
  position: relative;
  &:after {
    clear: both;
    display: table;
    content: ' ';
  }
  &__img {
    width: 8vw;
    height: 8vw;
    display: table-cell;
    background-size: 12vw;
    background-position: center;
    background-repeat: no-repeat;
    vertical-align: middle;
  }
  &__bg {
    position: absolute;
    width: 100vw;
    height: 100vw;
    background-size: 100vw;
    background-position: center;
    z-index: 0;
    top: 50%;
    left: 50%;
    margin: -50vw 0 0 -50vw;
    opacity: 0.2;
    filter: blur(3px);
  }
  &__details {
    display: table-cell;
    padding-left: 2vw;
    vertical-align: middle;
    width: calc(100% - 10vw);
    box-sizing: border-box;
    position: relative;
    z-index: 1;
  }
}


</style>

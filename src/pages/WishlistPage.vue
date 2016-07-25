<template>

  <div>
    <section class="info">
      <h3>Tap on a pokemon to add it to your wishlist</h3>
      <p>This means you get notifications when you are within ~1km of it. Green pokemons are pokemons you are currently tracking. Tap them to untrack</p>
      <input v-model="filter" type="text" placeholder="Search for specific pokemon" list="pokemons">
      <datalist id="pokemons">
        <option v-for="pokemon in pokemons" value="{{pokemon.identifier | capitalize}}">
      </datalist>
    </section>
    <section class="pokemons">
      <pokemon-grid :pokemons="pokemons" :filter="filter" :filter-prop="filterProp">
        <pokemon v-bind:class="{'tracking': isTrackingPokemon(pokemon)}" v-for="pokemon in pokemons | filterBy filter in filterProp" v-on:click="toggleTracking(pokemon)" :data="pokemon"></pokemon>
      </pokemon-grid>
    </section>
  </div>

</template>


<script>

import request from 'superagent';
import PokemonGrid from '../components/PokemonGrid.vue';
import Pokemon from '../components/Pokemon.vue';

export default {
  name: 'WishlistPage',

  props: ['state', 'actions'],

  data() {
    return {
      filter: null,
      filterProp: 'identifier',
      pokemons: null
    }
  },

  methods: {
    toggleTracking(pokemon) {
      console.log(this.$parent.state.pokemon.currentlyTracking.indexOf(pokemon.pokemonId), pokemon.pokemonId);
      if (this.$parent.state.pokemon.currentlyTracking.indexOf(pokemon.pokemonId) !== -1) {
        this.$parent.actions.untrackPokemon(pokemon.pokemonId);
      } else {
        this.$parent.actions.trackPokemon(pokemon.pokemonId);
      }
    },
    isTrackingPokemon(pokemon) {
      return this.$parent.state.pokemon.currentlyTracking.indexOf(pokemon.pokemonId) !== -1;
    }
  },

  computed: {
    currentlyTracking: function() {
      return this.$parent.state.pokemon.currentlyTracking;
    }
  },

  ready() {
    request.get("./data/pokemons.json").end((err,res) => {
      if (err) return console.log (err);
      const pokemons = res.body || JSON.parse(res.text);
      const parsedPokemons = Object.keys(pokemons).map(key => {
        const pokemon = pokemons[key];
        pokemon.pokemonId = key;
        return pokemon;
      });
      console.log(this, parsedPokemons);
      this.pokemons = parsedPokemons.slice(0, 151);
    });
  },

  components: {
    PokemonGrid,
    Pokemon
  }
}

</script>

<style lang="scss">

.pokemon {
  overflow: hidden;
  &:before, &:after {
    display: block;
    position: absolute;
    pointer-events: none;
    transition: all 0.4s ease;
  }
  &:before {
    content: ' ';
    background-color: green;
    opacity: 0;
    z-index: 3;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  &:after {
    content: "\f041";
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #FFF;
    z-index: 4;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8vw;
    height: 8vw;
    font-size: 8vw;
    margin: -4vw 0 0 -4vw;
    text-align: center;
    transform: translateY(-20vw);
  }
  &.tracking {
    &:before {
      opacity: 0.5;
    }
    &:after {
      transform: translateY(-0vw);
    }
  }
}

</style>

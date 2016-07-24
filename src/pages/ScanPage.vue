<template>
  <div>
    <section class="filters">
      <span>Sort by:</span>
      <label>
        <select v-model="filter">
          <option value="distance">Distance</option>
          <option value="expiration_time">Despawn time</option>
        </select>
      </label>
      <span class="orderToggle" v-on:click="toggleOrder">{{orderText}}</span>
    </section>
    <section>
      <pokemon-list :pokemons="pokemons" :filter="filter" :order="order"></pokemon-list>
    </section>
  </div>
</template>

<script>

import PokemonList from '../components/PokemonList.vue';

console.log('sup');

export default {
  name: 'ScanPage',

  components: {
    PokemonList
  },

  data() {
    return {
        filter: "distance",
        order: -1
    }
  },

  methods:{
    toggleOrder: function() {
      this.order = this.order*-1;
    }
  },

  computed: {
    pokemons: function() {

      return this.$parent.state.pokemon.pokemons;
    },
    orderText: function() {
      return this.order > 0 ? 'ASC' : 'DESC';
    }
  }
}

</script>

<style lang="scss">
.filters {
  margin-bottom: 5vw;
  width: 100%;
  text-align: center;
  span {
    margin-right: 1vw;
    color: #FFF;
    font-weight: bold;
    font-family: 'Helvetica';
  }
  .orderToggle {
    margin-left: 3vw;
  }
}
</style>

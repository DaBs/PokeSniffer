<template>
  <ul class="list">
    <pokemon v-for="pokemon in pokemons | orderBy filter order" :data="pokemon" :details="true" track-by="$index" transition="item"></pokemon>
  </ul>
</template>

<script>

import Pokemon from './Pokemon.vue';

export default {
  name: 'PokemonList',
  ready() {
    console.log(this.pokemons);
  },
  components: {
    Pokemon
  },
  props: ['pokemons', 'filter', 'order']
}


</script>

<style lang="scss">

</style>

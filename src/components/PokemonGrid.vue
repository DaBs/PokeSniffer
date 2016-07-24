<template>
  <div>
    <ul class="grid">
      <slot>
        <pokemon v-for="pokemon in pokemons | filterBy filter in filterProp" :data="pokemon" :details="false"></pokemon>
      </slot>
    </ul>
  </div>
</template>


<script>

import Pokemon from './Pokemon.vue';

export default {
  name: 'PokemonGrid',

  props: ['pokemons', 'filter', 'filterProp'],

  ready() {
    console.log(this.pokemons);
  },

  components: {
    Pokemon
  }
}

</script>

<style lang="scss">
.grid {
  background-color: #FFF;
  padding: 3vw;
  margin: 0;
  .pokemon {
    width: 16vw;
    height: 16vw;
    box-sizing: border-box;
    padding: 0;
    display: inline-block;
    margin: 0 0.6vw;
    &__img {
      width: 16vw;
      height: 16vw;
      background-size: 16vw;
    }
  }
}
</style>

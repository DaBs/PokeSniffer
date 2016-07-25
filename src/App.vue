<template>
  <div v-bind:class="{'overlay': this.state.menu.toggled}">
    <header>
      <menu></menu>
      <h1>PokeSniffer</h1>
    </header>
    <main>
      <router-view transition="fade" transition-mode="out-in">
      </router-view>
    </main>
    <footer></footer>
  </div>
</template>

<script>
import Vue from 'vue';

import {createStore, applyMiddleware } from 'redux';
import * as storage from 'redux-storage';
import reducer from './reducers/index';
import createLogger from 'redux-logger';

const logger = createLogger();
const engine = createEngine('pokesniffer');
const middleware = storage.createMiddleware(engine);
const createStoreWithMiddleware = applyMiddleware(middleware, logger)(createStore);
const store = createStoreWithMiddleware(reducer);

import createEngine from 'redux-storage-engine-localstorage';


import * as PokemonActions from './actions/PokemonActions';
import * as MenuActions from './actions/MenuActions';
import * as NotificationsActions from './actions/NotificationsActions';
import reduxMixinsCreator from 'vue-redux';
const allMixins = reduxMixinsCreator(Object.assign({}, PokemonActions, MenuActions, NotificationsActions));

import PokemonList from './components/PokemonList.vue';
import Menu from './components/Menu.vue';

const load= storage.createLoader(engine);
load(store);

console.log(store);
export default Vue.extend({
  mixins: [allMixins],
  data() {
    return {
      store: store
    }
  },
  components: {
    Menu
  }
});

</script>

<style lang="scss">

.fade-transition {
  transition: opacity .3s ease;
}
.fade-enter, .fade-leave {
  opacity: 0;
}


</style>

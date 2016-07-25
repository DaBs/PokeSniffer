<template>


  <nav v-bind:class="{'is-open': toggled}">
    <a class="toggle" v-on:click="toggleMenu"><i class="fa" v-bind:class="{'fa-bars': !toggled, 'fa-times': toggled}"></i></a>
    <a v-link="{name: 'scanner'}"><i class="fa fa-globe"></i>Scanner</a>
    <a v-link="{name: 'map'}"><i class="fa fa-map"></i>Map</a>
    <a v-link="{name: 'wishlist'}"><i class="fa fa-list"></i>Wishlist</a>
    <a v-link="{name: 'settings'}"><i class="fa fa-cogs"></i>Settings</a>
  </nav>

</template>


<script>

export default {
  name: 'Menu',


  computed: {
    toggled: function() {
      return this.$parent.state.menu.toggled;
    }
  },

  methods: {
    toggleMenu: function() {
      this.$parent.actions.toggleMenu();
    }
  }
}

</script>

<style lang="scss">

nav {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #FFF;
  width: 80vw;
  height: 100%;
  transform: translateX(-85vw);
  transition: all 0.4s ease;
  overflow: visible;
  z-index: 99;
  box-shadow: 0 0 30px rgba(0,0,0,.5);

  &.is-open {
    transform: none;
    .toggle {
      bottom: 50vh;
      right: 67.5vw;
    }
  }

  .toggle {
    position: absolute;
    width: 14vw;
    height: 14vw;
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#a2db95+0,24ccaa+100 */
    background: #a2db95; /* Old browsers */
    background: -moz-linear-gradient(left,  #a2db95 0%, #24ccaa 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(left,  #a2db95 0%,#24ccaa 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to right,  #a2db95 0%,#24ccaa 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#a2db95', endColorstr='#24ccaa',GradientType=1 ); /* IE6-9 */
    color: #FFF;
    border-radius: 50%;
    text-align: center;
    padding: 3.5vw 0;
    box-sizing: border-box;
    bottom: 10vw;
    right: 25vw;
    font-size: 7vw;
    transform: translateX(85vw);
    transform-origin: center;
    transition: all 0.4s ease;
    box-shadow: 0 0 30px rgba(0,0,0,.5);
    i {
      margin-right: 0;
    }
  }

  a {
    width: 100%;
    color: #000;
    text-decoration: none;
    font-size: 5vw;
    font-weight: normal;
    font-family: 'Helvetica';
    padding: 6vw 8vw;
    display: block;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    i {
      margin-right: 2vw;
    }
  }

}

</style>

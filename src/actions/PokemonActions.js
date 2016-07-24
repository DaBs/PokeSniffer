

export function trackPokemon(pokemonId) {
  return {
    type: 'track-pokemon',
    pokemonId
  }
}

export function untrackPokemon(pokemonId) {
  return {
    type: 'untrack-pokemon',
    pokemonId
  }
}
/*
export function removePokemon(uid) {
  return {
    type: 'remove-pokemon',
    uid
  }
}

export function updatePokemon(data) {
  return {
    type: 'update-pokemon',
    data
  }
}
*/
export function updateAllPokemons(data) {
  return {
    type: 'update-all-pokemons',
    data
  }
}

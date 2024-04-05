const pokeAPI = { }

function convertPokeAPIDetailToPokemon(pokeDetail){
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.order
  pokemon.name = pokeDetail.name

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
  const [type] = types

  pokemon.types = types
  pokemon.type = type

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

  return pokemon
}

pokeAPI.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
  .then((response) => response.json())
  .then(convertPokeAPIDetailToPokemon)
}

pokeAPI.getPokemon = (offset = 0, limit = 151) => {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}offset=${offset}`
  return fetch(url)
  .then(resp => resp.json())
  .then(data => data.results)
  .then((pokemon) => pokemon.map(pokeAPI.getPokemonDetail))
  .then((detailRequests) => Promise.all(detailRequests))
  .catch(e => console.log(e))
}


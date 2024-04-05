const olPokemon = document.querySelector('.pokemon')

function convertPokemonToLi(pokemon){
  return `
  <li class="pokemon-box ${pokemon.type}">
  <span class="number">${pokemon.number}</span>
  <span class="name">${pokemon.name}</span>

  <div class="detail">
    <ol class="types">
      ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
    </ol>
    <img
      src=${pokemon.photo}
      alt="${pokemon.name}"
    />
  </div>
</li>
  `
}

pokeAPI.getPokemon().then((pokemonList = []) => {
  const pokeHTML = pokemonList.map(convertPokemonToLi).join('');
  olPokemon.innerHTML = pokeHTML;
})
.catch(e => {console.log(e)})
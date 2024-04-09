const pokeAPI = { }

async function convertPokeAPIDetailToPokemon(pokeDetail){
  //POKEMON-BOX DETAIL
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.order
  pokemon.name = pokeDetail.name

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
  const [type] = types

  pokemon.types = types
  pokemon.type = type

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
  
  //POKEMON-INFO DETAILS
  pokemon.height = `${(pokeDetail.height / 10).toFixed(1)}m`
  pokemon.weight = `${(pokeDetail.weight / 10).toFixed(1)}kg`

  const descriptionReq = await fetch(pokeDetail.species.url);
  const descriptionData = await descriptionReq.json();
  const descriptions = descriptionData.flavor_text_entries;
  
  const englishDescription = descriptions.find(entry => entry.language.name === 'en');
  pokemon.description = englishDescription.flavor_text;

  return pokemon
}

pokeAPI.getPokemonDetail = async (pokemon) => {
  const req = await fetch(pokemon.url)
  const resp = await req.json()
  return convertPokeAPIDetailToPokemon(resp)
}

pokeAPI.getPokemon = async (offset, limit) => {
  try{
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    const dataReq = await fetch(url)
    const dataResp = await dataReq.json()
    const dataResults = await dataResp.results
    const detailRequests = dataResults.map(pokeAPI.getPokemonDetail)
    return Promise.all(detailRequests)
  }
  catch{
    console.log('Error!')
  }
}


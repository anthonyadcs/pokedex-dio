//Função que puxa trata os dados da PokeAPI
const pokeAPI = { }

//Função que recebe os JSON da PokeAPI e trata os dados. Atribui os valores as chaves do modelo de Pokemon em 'pokemon-model.js'
async function convertPokeAPIDetailToPokemon(pokeDetail){
  //POKEMON-BOX DETAIL (utilizado nos boxs de cada pokemon)
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id
  pokemon.name = pokeDetail.name

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
  const [type] = types

  pokemon.types = types
  pokemon.type = type

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
  
  //POKEMON-INFO DETAILS (utilizado no modal de informações de cada pokemon quando é clicado.)
  pokemon.height = `${(pokeDetail.height / 10).toFixed(1)}m`
  pokemon.weight = `${(pokeDetail.weight / 10).toFixed(1)}kg`

  /*fetch para requisição da descrição do pokemon em inglês*/
  const descriptionReq = await fetch(pokeDetail.species.url);
  const descriptionData = await descriptionReq.json();
  const descriptions = descriptionData.flavor_text_entries;
  
  const englishDescription = descriptions.find(entry => entry.language.name === 'en');
  pokemon.description = englishDescription.flavor_text;

  return pokemon
}

//Função que requisita e envia o arquivo JSON da pokeAPI para o conversor de dados.
pokeAPI.getPokemonDetail = async (pokemon) => {
  const req = await fetch(pokemon.url)
  const resp = await req.json()
  return convertPokeAPIDetailToPokemon(resp)
}

//Função que recebe todos os dados dos Pokemon tratados e os envia para criação das pokemon-boxs
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


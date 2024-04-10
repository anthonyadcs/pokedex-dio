const olPokemon = document.querySelector('.pokemon')
const loadMoreButton = document.querySelector('#load-more')
const pokeInfoBox = document.querySelector('.pokemon-info')
const limit = 5;
let offset = 0;

//Função que constrói todas as pokemon-boxs
function loadPokemonItens(offset, limit){
  pokeAPI.getPokemon(offset, limit).then((pokemonList = []) => {
    const pokeHTML = pokemonList.map((pokemon) => {
      return `
      <li class="pokemon-box ${pokemon.type}">
      <span class="number"><p>${pokemon.number}</p></span>
      <span class="name"><p>${pokemon.name}</p></span>
    
      <div class="detail">
        <ol class="types">
          ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
        </ol>
        <img
          src=${pokemon.photo}
          alt=${pokemon.name}
        />
      </div>
    </li>
      `
    }).join('');
    olPokemon.innerHTML += pokeHTML;

    //Loop que adiciona um escutador de evento em cada pokemon-box para criação do modal
    const pokeBoxs = document.querySelectorAll('.pokemon-box')
    pokeBoxs.forEach((pokeBox) => {
      pokeBox.addEventListener('click', function(e){
        showPokeInfo(e)
      })
    })
  })
  
}
//Função que captura o elemento-pai do elemento enviado.
function findAncestorWithClass(element, className){
  let currentElement = element
  while (currentElement) {
    if(currentElement.classList.contains(className)){
      return currentElement;
    }

    currentElement = currentElement.parentElement;
  }

  return null
}

//Adiciona um escutador de evento no botão 'Load more', que requisita e adiciona os novos Pokemon a lista
loadMoreButton.addEventListener('click', () => {
  offset += limit
  loadPokemonItens(offset, limit)
})

//Função que cria o modal de cada um dos Pokemon ao clicar em sua box.
const showPokeInfo = (e) => {
  const target = e.target;
  const pokeBox = findAncestorWithClass(target, 'pokemon-box')
  const pokemonInfos = pokeBox.children
  
  const pokeInfoHTML = `
  <h1>${pokemonInfos[1].innerText}</h1>
  <ol class="types">
  <li class="type">${pokemonInfos[2].children[0].children[0].innerText}</li>
  ${pokemonInfos[2].children[0].children[1] ? `<li>${pokemonInfos[2].children[0].children[1].innerText}</li>` : ''}
  </ol>
  <img
  src="${pokemonInfos[2].children[1].currentSrc}"
  alt=""
  />
  
  <div class="info-container fire">
  <h3>About</h3>
  <div class="infos" >
  <span class="description"
  ><p>
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus,
  architecto.
  </p></span>
  
  <ol class="poke-info-ol">
  <li>Height:</li>
  <li>Weight:</li>
    <li>Gender:</li>
    <li>Category:</li>
    </ol>
    </div>
    </div>
    `
    pokeInfoBox.innerHTML = pokeInfoHTML
    pokeInfoBox.style.display = 'block'
  }

//Primeira chamada da função que carrega a lista de Pokemon
loadPokemonItens(offset, limit)
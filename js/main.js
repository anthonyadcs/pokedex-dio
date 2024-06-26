const olPokemon = document.querySelector('.pokemon')
const loadMoreButton = document.querySelector('#load-more')
const pokeInfoBox = document.querySelector('.pokemon-info')
const pokemonListContainer = document.querySelector('.content')
const originalStyles = {
  webkitFilter: olPokemon.style.webkitFilter,
  pointerEvents: olPokemon.style.pointerEvents,
  display: loadMoreButton.style.display,
  pokeInfoBoxDisplay: pokeInfoBox.style.display
}
const limit = 5;
let offset = 0;
let pokemonAttributes = [];
let isPokeInfoVisible = false;
let counter = 0;

//Função que constrói todas as pokemon-boxs
function loadPokemonItens(offset, limit){
  pokeAPI.getPokemon(offset, limit).then((pokemonList = []) => {
    const pokeHTML = pokemonList.map((pokemon) => {
      pokemonAttributes.push({number: pokemon.number, description: pokemon.description, height: pokemon.height, weight: pokemon.weight});

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
        e.stopPropagation()
        showPokeInfo(e)
      })
    })
  })
  
}

//Função que captura o elemento-pai do elemento enviado.
function findAncestorWithClass(element, className){
  let currentElement = element;
  while (currentElement) {
    if(currentElement.classList.contains(className)){
      return currentElement;
    }

    currentElement = currentElement.parentElement;
  }

  return null
}

//Adiciona um escutador de evento no botão 'Load more', que requisita e adiciona os novos Pokemon a lista
loadMoreButton.addEventListener('click', (e) => {
  e.stopPropagation()
  offset += limit
  loadPokemonItens(offset, limit)
  console.log(pokemonAttributes);
})

//Função que cria o modal de cada um dos Pokemon ao clicar em sua box.
const showPokeInfo = (e) => {
  
  const target = e.target;
  const pokeBox = findAncestorWithClass(target, 'pokemon-box')
  const pokemonInfos = pokeBox.children
  let pokemonDescription
  let pokemonHeight
  let pokemonWeight

  pokemonAttributes.forEach((pokemonAttributes) => {
    if(pokemonAttributes.number == Number(pokemonInfos[0].outerText)){
      pokemonDescription = pokemonAttributes.description
      pokemonHeight = pokemonAttributes.height
      pokemonWeight = pokemonAttributes.weight
    }
  })
  
  const pokeInfoHTML = `
  <h1>${pokemonInfos[1].innerText}</h1>
  <ol class="types">
    <li class="type">
    <p class="${pokemonInfos[2].children[0].children[0].outerText}">
    ${pokemonInfos[2].children[0].children[0].innerText}
    </p>
    </li>
    <p>
    ${pokemonInfos[2].children[0].children[1] ? `<li class="type">
    <p class="${pokemonInfos[2].children[0].children[1].outerText}">
    ${pokemonInfos[2].children[0].children[1].innerText}
    </p>
    </li>` : ''}
    </p>
  </ol>
  <img
  src="${pokemonInfos[2].children[1].currentSrc}"
  alt=""
  />
  
  <div class="info-container">
    <h3>About</h3>
    <div class="infos">
      <span class="description">
        <p>
          ${pokemonDescription}
        </p>
      </span>
  
    <ol class="poke-info-ol">
      <li>
      <p>Height</p>
      <p>${pokemonHeight}</p>
      </li>
      <li>
      <p>Weight</p>
      <p>${pokemonWeight}</p>
      </li>
    </ol>
  </div>
</div>
    `;

  const infoBox = document.createElement('div')
  infoBox.classList.add('pokemon-info');
  infoBox.innerHTML = pokeInfoHTML;

  const blurLayer = document.createElement('div')
  blurLayer.classList.add('blur-layer')

  document.body.appendChild(blurLayer)
  document.body.appendChild(infoBox)

}

document.addEventListener('click', function(e){
    const pokeInfo = document.querySelector('.pokemon-info')
    const blurLayer = document.querySelector('.blur-layer')
    const target = e.target;
    const clickedInPokeInfo = findAncestorWithClass(target, 'pokemon-info');
    
    if(clickedInPokeInfo != '<div class="pokemon-info">'){
      pokeInfo.remove()
      blurLayer.remove()
    }
})




//Primeira chamada da função que carrega a lista de Pokemon
loadPokemonItens(offset, limit)
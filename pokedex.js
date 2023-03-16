const pokemonsPorPagina = 20; // numero de pokemos que se van a mostrar
let paginaActual = 0; // indice para la paginacion
let limite = 0; // limite establecido para el manejo del array en paginacion
let listaPokemons = []; // array global para manejar los pokemon

//HTML
// Creamos los botones de paginación
const botonAnterior$$ = document.createElement("button");
botonAnterior$$.className = "botonPagina";
botonAnterior$$.innerText = "Anterior";
botonAnterior$$.disabled = true; // deshabilita el boton en la primera pagina
const botonSiguiente$$ = document.createElement("button");
botonSiguiente$$.className = "botonPagina";
botonSiguiente$$.innerText = "Siguiente";

// Agregamos los botones a la página con un div
const botonContainer$$ = document.createElement("div");
botonContainer$$.className = "paginacion-container";
botonContainer$$.appendChild(botonAnterior$$);
botonContainer$$.appendChild(botonSiguiente$$);
document.body.appendChild(botonContainer$$);

// listerners de los botones
// se pagina pintando solo el trozo que se quiere mostrar segun la pagina
// los botones se habilitan o deshabilitan segun la pagina en la que esten
botonAnterior$$.addEventListener("click", () => {
  if (paginaActual > 0) {
    paginaActual--;
    limite = paginaActual * pokemonsPorPagina;
    pintar(listaPokemons.slice(limite, limite + pokemonsPorPagina));
    botonSiguiente$$.disabled = false;
    if (paginaActual === 0) {
      botonAnterior$$.disabled = true;
    }
  }
});

botonSiguiente$$.addEventListener("click", () => {
  if (paginaActual < 7) {
    // paginas maximas que contienen 151 pokemon (siendo 20 el numero establecido)
    paginaActual++;
    limite = paginaActual * pokemonsPorPagina;
    pintar(listaPokemons.slice(limite, limite + pokemonsPorPagina));
    botonAnterior$$.disabled = false;
    if (paginaActual === 7) {
      botonSiguiente$$.disabled = true; // desahabilita en la ultima pagina
    }
  }
});

//Obtener todos los pokemons al inicio
async function obtenerTodosLosPokemons() {
  try {
    // con el ?limit en el fetch va sacando url hasta el maximo que le establezco
    const response = await fetch(
      ` ?limit=151`
    );
    const data = await response.json();
    // se van mapeando los json de cada promesa 
    const pokemons = await Promise.all(
      data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        const pokeDatos = await res.json();
        return {
          // devolvemos un objeto con los datos de cada Pokemon
          name: pokeDatos.name,
          tipo: pokeDatos.types.map((type) => type.type.name),
          imagen: pokeDatos.sprites.front_default,
          id: pokeDatos.id,
        };
      })
    );
    listaPokemons = pokemons; // guardamos el array en un array global
    pintar(listaPokemons.slice(limite, limite + pokemonsPorPagina));
  } catch (error) {
    console.error(error);
  }
}

// Mostrar los pokemons en la página
const listaPokemon$$ = document.querySelector(".listaPokemon");
const pintar = (pokemons) => {
  listaPokemon$$.innerHTML = ""; // se vacia el contenido de la lista para que no se acumulen al paginar
  for (const pokemon of pokemons) {
    // recorremos el array y se crean las diferentes etiquetas por cada elemento del objeto
    const characterDiv$$ = document.createElement("div");
    characterDiv$$.className = "divPokemon";
    const numeroPokemon$$ = document.createElement("h2");
    numeroPokemon$$.className = "numeroPokemon";
    numeroPokemon$$.innerHTML = `#${pokemon.id}`;
    characterDiv$$.innerHTML = `
      <div class="container">
      <div class="card-image">
      <h2 class="card-title">${pokemon.name}</h2> 
      <img src="${pokemon.imagen}" alt="${pokemon.name}">
      </div>
      </div>
      `;
    listaPokemon$$.appendChild(numeroPokemon$$);
    listaPokemon$$.appendChild(characterDiv$$);
  }
};

obtenerTodosLosPokemons();

// Filtrar nombre de pokemon
const filtroPokemon$$ = document.querySelector("#filtroPokemon");
filtroPokemon$$.addEventListener("input", () => {
  const nombreInput = filtroPokemon$$.value.toLowerCase(); // metemos el lowecase para que no haga diferencias entre mayusculas y minusculas
  const pokemonObtenido = listaPokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(nombreInput)
  );
  if (filtroPokemon$$.value !== "") {
    // si se ha escrito algo se deshabilitan los botones, este if permite que se busque aun no estando en la primera pagina
    limite = 0;
    botonAnterior$$.disabled = true;
    botonSiguiente$$.disabled = true;
    pintar(pokemonObtenido.slice(limite, limite + pokemonsPorPagina));
  } else {
    // cuando se borra se vuelve a la pagina inicial
    limite = 0;
    botonSiguiente$$.disabled = false;
    pintar(pokemonObtenido.slice(limite, limite + pokemonsPorPagina));
  }
});

// sacar un alert con los datos del pokemon???

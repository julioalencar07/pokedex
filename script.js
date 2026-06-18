const form = document.getElementById("form");
const input = document.getElementById("input");
const resultado = document.getElementById("resultado");
const voltarInicio = document.getElementById("voltarInicio");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const valor = input.value.trim().toLowerCase();

  if (!valor) return;

  try {
    const resposta = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${valor}`
    );

    if (!resposta.ok) {
      throw new Error("Pokémon não encontrado.");
    }

    const pokemon = await resposta.json();

    mostrarPokemon(pokemon);

  } catch (erro) {
    resultado.innerHTML = `<p>${erro.message}</p>`;
  }
});

voltarInicio.addEventListener("click", () => {
  carregarIniciais();
});
  
function mostrarPokemon(data) {

  resultado.innerHTML = `
    <div class="card">

      <h2>${data.name} (#${data.id})</h2>

      <img
      src="${data.sprites.other["official-artwork"].front_default}"
      alt="${data.name}">

      <p><strong>Tipo:</strong>
      ${data.types.map(t => t.type.name).join(", ")}</p>

      <p><strong>Altura:</strong> ${data.height}</p>

      <p><strong>Peso:</strong> ${data.weight}</p>

      <p><strong>Habilidades:</strong>
      ${data.abilities.map(h => h.ability.name).join(", ")}</p>

    </div>
  `;
}


async function carregarIniciais() {

  resultado.innerHTML = "<p>Carregando...</p>";

  try {

    
    const resposta = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=1025"
    );

    const lista = await resposta.json();

    
    const aleatorios = [];

    while (aleatorios.length < 8) {

      const indice = Math.floor(Math.random() * lista.results.length);

      const pokemon = lista.results[indice];

      if (!aleatorios.includes(pokemon)) {
        aleatorios.push(pokemon);
      }
    }

    const detalhes = await Promise.all(
      aleatorios.map(p =>
        fetch(p.url).then(res => res.json())
      )
    );

    resultado.innerHTML = detalhes.map(pokemon => `
      <div class="card">

        <h2>${pokemon.name} (#${pokemon.id})</h2>

        <img
        src="${pokemon.sprites.other["official-artwork"].front_default}"
        alt="${pokemon.name}">

        <p><strong>Tipo:</strong>
        ${pokemon.types.map(t => t.type.name).join(", ")}</p>

      </div>
    `).join("");

  } catch {

    resultado.innerHTML =
      "<p>Erro ao carregar os Pokémon.</p>";

  }

}

carregarIniciais();
const form = document.getElementById("form");
const input = document.getElementById("input");
const resultado = document.getElementById("resultado");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const valor = input.value.toLowerCase();

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${valor}`);

    if (!res.ok) {
      throw new Error("Pokémon não encontrado");
    }

    const data = await res.json();

    mostrarPokemon(data);
  } catch (erro) {
    resultado.innerHTML = `<p>${erro.message}</p>`;
  }
});

function mostrarPokemon(data) {
  resultado.innerHTML = `
    <div class="card">
      <h2>${data.name} (#${data.id})</h2>
      <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}">
      <p><strong>Tipo:</strong> ${data.types.map(t => t.type.name).join(", ")}</p>
      <p><strong>Altura:</strong> ${data.height}</p>
      <p><strong>Peso:</strong> ${data.weight}</p>
      <p><strong>Habilidades:</strong> ${data.abilities.map(h => h.ability.name).join(", ")}</p>
    </div>
  `;
}

async function carregarIniciais() {
  resultado.innerHTML = "";

  const ids = Array.from(
    { length: 8 },
    () => Math.floor(Math.random() * 1025) + 1
  );

  try {
    const promessas = ids.map(id =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => res.json())
    );

    const pokemons = await Promise.all(promessas);

    resultado.innerHTML = pokemons.map(data => `
      <div class="card">
        <h2>${data.name} (#${data.id})</h2>
        <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}">
        <p><strong>Tipo:</strong> ${data.types.map(t => t.type.name).join(", ")}</p>
      </div>
    `).join("");

  } catch {
    resultado.innerHTML = "<p>Erro ao carregar Pokémon.</p>";
  }
}

carregarIniciais();

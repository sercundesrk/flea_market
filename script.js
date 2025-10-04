let produtos = [];

fetch('data/products.json')
  .then(res => res.json())
  .then(data => {
    produtos = data;
    mostrarProdutos(produtos);
  });

function mostrarProdutos(lista) {
  const container = document.getElementById('produtos-container');
  container.innerHTML = '';
  lista.forEach(prod => {
    const box = document.createElement('div');
    box.className = 'produto';
    box.onclick = () => {
      window.location.href = `item.html?id=${prod.id}`;
    };
    box.innerHTML = `
      <img src="images/${prod.fotos[0]}" alt="${prod.nome}">
      <h3>${prod.nome}</h3>
      <p>${prod.estado}</p>
      <strong>${prod.preco}</strong>
    `;
    container.appendChild(box);
  });
}

function filtrar(categoria) {
  if (categoria === 'todos') {
    mostrarProdutos(produtos);
  } else {
    const filtrados = produtos.filter(p => p.categoria === categoria);
    mostrarProdutos(filtrados);
  }
}

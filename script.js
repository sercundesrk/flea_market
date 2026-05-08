let produtos = [];

// Intersection Observer para Lazy Loading
let imageObserver;

function initializeLazyLoading() {
  if ('IntersectionObserver' in window) {
    imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImage(img);
          observer.unobserve(img);
        }
      });
    }, {
      // Carregar imagem quando estiver 100px antes de aparecer na tela
      rootMargin: '100px 0px',
      threshold: 0.1
    });
  }
}

function loadImage(img) {
  const src = img.getAttribute('data-src');
  if (!src) return;

  // Criar nova imagem para pré-carregar
  const imageLoader = new Image();
  
  imageLoader.onload = function() {
    // Quando a imagem carregar, atualizar o src e adicionar classe loaded
    img.src = src;
    img.classList.add('loaded');
    img.removeAttribute('data-src');
  };
  
  imageLoader.onerror = function() {
    // Em caso de erro, mostrar imagem padrão
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5FcnJvIGFvIGNhcnJlZ2FyPC90ZXh0Pjwvc3ZnPg==';
    img.classList.add('loaded');
  };
  
  // Iniciar o carregamento
  imageLoader.src = src;
}

function observeImages() {
  if (imageObserver) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback para navegadores sem IntersectionObserver
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(loadImage);
  }
}

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
      <img data-src="images/${prod.fotos[0]}" alt="${prod.nome}" loading="lazy">
      <h3>${prod.nome}</h3>
      <p>${prod.estado}</p>
      <strong>${prod.preco}</strong>
    `;
    container.appendChild(box);
  });
  
  // Observar novas imagens para lazy loading
  setTimeout(observeImages, 100);
}

function filtrar(categoria) {
  const disponiveis = produtos.filter(p => !p.vendido);

  if (categoria === 'todos') {
    mostrarProdutos(disponiveis);
  } else {
    const filtrados = disponiveis.filter(p => p.categoria === categoria);
    mostrarProdutos(filtrados);
  }
}

// Inicializar lazy loading quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  initializeLazyLoading();
});

fetch('data/products.json')
  .then(res => res.json())
  .then(data => {
    // Normaliza o campo para evitar quebra com itens antigos sem "vendido"
    produtos = data.map(prod => ({ ...prod, vendido: Boolean(prod.vendido) }));
    
    // Handle URL parameters for category filtering
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria');
    
    if (categoria) {
      filtrar(categoria);
    } else {
      mostrarProdutos(produtos.filter(p => !p.vendido));
    }
  });

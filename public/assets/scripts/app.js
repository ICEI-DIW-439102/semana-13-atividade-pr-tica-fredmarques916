const API_URL = "http://localhost:3000/artistas";

// 1. Busca os dados no JSON Server e retorna um array
async function fetchItems() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao buscar artistas do servidor.");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

// 2. Cria e retorna o elemento HTML do card
function createCard(item) {
    const article = document.createElement('article');
    article.className = 'card card--artist';
    article.innerHTML = `
        <a href="detalhes.html?id=${item.id}" style="display:block; text-decoration:none;">
            <div class="card__photo">
                <img src="${item.imagem_thumb}" alt="${item.nome}" class="card__img" />
            </div>
            <div class="card__info">
                <h3 class="card__name">${item.nome}</h3>
                <p class="card__bio">${item.descricaoCurta}</p>
                <p style="font-size: 12px; color: var(--clr-purple-soft); margin-top: 5px;">Gênero: ${item.categoria}</p>
                <p style="font-size: 13px; color: #fff; font-weight: 600;">Cachê: R$ ${item.preco},00</p>
                <span class="btn btn--outline btn--sm btn--fw" style="margin-top: 15px;">Ver Detalhes</span>
            </div>
        </a>
    `;
    return article;
}

// 3. Limpa a lista e adiciona os cards na tela + Renderiza o Carrossel dinamicamente
function renderCards(items) {
    const gridArtistas = document.getElementById('grid-todos-artistas');
    const carouselInner = document.getElementById('carousel-inner-destaques');
    const carouselIndicators = document.getElementById('carousel-indicators-destaques');

    if (!gridArtistas) return;
    gridArtistas.innerHTML = "";

    // Renderiza a grade de todos os itens
    items.forEach(item => {
        const card = createCard(item);
        gridArtistas.appendChild(card);
    });

    // Renderiza o Carrossel (Apenas os que possuem destaque: true)
    if (carouselInner && carouselIndicators) {
        carouselInner.innerHTML = "";
        carouselIndicators.innerHTML = "";

        const destaques = items.filter(item => item.destaque === true);
        destaques.forEach((item, index) => {
            const ativoClass = index === 0 ? 'active' : '';

            // Indicadores
            const btnIndicator = document.createElement('button');
            btnIndicator.type = 'button';
            btnIndicator.dataset.bsTarget = '#carouselDestaques';
            btnIndicator.dataset.bsSlideTo = index;
            if (index === 0) btnIndicator.classList.add('active');
            carouselIndicators.appendChild(btnIndicator);

            // Slides
            const slide = document.createElement('div');
            slide.className = `carousel-item ${ativoClass}`;
            slide.style.cursor = "pointer";
            slide.onclick = () => { window.location.href = `detalhes.html?id=${item.id}`; };
            slide.innerHTML = `
                <img src="${item.imagem}" class="d-block w-100" alt="${item.nome}" style="height: 480px; object-fit: cover; filter: brightness(0.4);">
                <div class="carousel-caption d-none d-md-block text-center" style="bottom: 4rem;">
                    <span class="tag" style="margin-bottom: 12px; display: inline-block; background: var(--clr-purple); padding: 4px 10px; border-radius: 4px; font-size: 12px;">${item.categoria}</span>
                    <h2 style="font-size: 42px; font-weight: 800; color: #fff;">${item.nome}</h2>
                    <p style="color: #ddd; font-size: 18px; margin-bottom: 20px;">${item.descricaoCurta}</p>
                    <a href="detalhes.html?id=${item.id}" class="btn btn--purple">Conhecer a fundo →</a>
                </div>
            `;
            carouselInner.appendChild(slide);
        });
    }
}

// 4. Execução automática ao iniciar a Home
async function init() {
    const items = await fetchItems();
    renderCards(items);
}

document.addEventListener('DOMContentLoaded', init);
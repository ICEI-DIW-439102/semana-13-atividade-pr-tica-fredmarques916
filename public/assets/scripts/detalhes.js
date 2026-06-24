const API_URL = "http://localhost:3000/artistas";

async function carregarDetalhePage() {
    const container = document.getElementById('detalhe-container');
    if (!container) return;

    // 1. Ler o parâmetro ID da URL usando URLSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    const idArtista = urlParams.get('id');

    // Erro: ID ausente na URL
    if (!idArtista) {
        container.innerHTML = `
            <div style="text-align:center; padding: 100px 0;">
                <h2 class="section__h2" style="color: var(--clr-purple-soft);">Identificador do artista não foi fornecido.</h2>
                <br>
                <a href="index.html" class="btn btn--purple">← Voltar ao Início</a>
            </div>
        `;
        return;
    }

    try {
        // 2. Requisição assíncrona direcionada para buscar o item específico por ID
        const response = await fetch(`${API_URL}/${idArtista}`);

        // Erro: Item inexistente no servidor (Status 404)
        if (!response.ok) {
            container.innerHTML = `
                <div style="text-align:center; padding: 100px 0;">
                    <h2 class="section__h2">Artista não encontrado em nossa base de dados.</h2>
                    <br>
                    <a href="index.html" class="btn btn--purple">← Voltar ao Início</a>
                </div>
            `;
            return;
        }

        const artista = await response.json();

        // 3. Renderização completa dos dados da entidade na tela
        let html = `
            <div class="section__head">
                <div>
                    <p class="eyebrow">Visão Geral</p>
                    <h2 class="section__h2">Informações do Artista</h2>
                </div>
                <a href="index.html" class="btn btn--outline btn--sm">← Voltar</a>
            </div>
    
            <div class="detalhe-geral">
                <div class="detalhe-geral__img-wrapper">
                    <img src="${artista.imagem_thumb}" alt="Foto de ${artista.nome}">
                </div>
                <div class="detalhe-geral__info">
                    <h1 style="color: var(--clr-white); font-size: 36px; margin-bottom: 16px;">${artista.nome}</h1>
                    <ul class="detalhe-list">
                        <li><strong>Estilo / Gênero Musical:</strong> ${artista.categoria}</li>
                        <li><strong>Valor de Contratação:</strong> R$ ${artista.preco},00</li>
                        <li><strong>Destaque na Vitrine:</strong> ${artista.destaque ? 'Sim' : 'Não'}</li>
                    </ul>
                    <p style="color: var(--clr-muted); line-height: 1.8; margin-bottom: 20px;">
                        <strong>Biografia Completa:</strong> ${artista.descricaoCompleta}
                    </p>
                    <div class="tags-container" style="display:flex; gap: 8px; flex-wrap: wrap;">
                        ${artista.tags.map(tag => `<span style="background: var(--clr-purple-dim); color: var(--clr-purple-soft); padding: 4px 12px; border-radius: 20px; font-size: 12px; border: 1px solid var(--clr-border);">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
    
            <div class="section__head">
                <div>
                    <p class="eyebrow">Discografia Relacionada</p>
                    <h2 class="section__h2">Álbuns Lançados</h2>
                </div>
            </div>
            <div class="cards cards--albums" style="margin-bottom: 80px;">
        `;

        if (artista.albuns && artista.albuns.length > 0) {
            artista.albuns.forEach(album => {
                html += `
                    <article class="card card--album">
                        <div class="card__thumb">
                            <img src="${album.imagem}" alt="Capa do álbum ${album.titulo}" class="card__img" />
                        </div>
                        <div class="card__info">
                            <h3 class="card__name">${album.titulo}</h3>
                            <p class="card__artist-name">Lançamento: ${album.ano}</p>
                        </div>
                    </article>
                `;
            });
        } else {
            html += `<p style="color: var(--clr-muted);">Nenhum álbum associado a esta conta até o momento.</p>`;
        }

        html += `</div>`;
        container.innerHTML = html;

    } catch (error) {
        container.innerHTML = `
            <div style="text-align:center; padding: 100px 0;">
                <h2 class="section__h2" style="color: #ff4a4a;">Erro crítico de conexão com o servidor.</h2>
                <p style="color: var(--clr-muted); margin-top: 10px;">Verifique se o JSON Server está rodando.</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', carregarDetalhePage);
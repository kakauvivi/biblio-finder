// ── Seletores ──
const genreButtons = document.querySelectorAll(".genre-pill");
const bookGrid = document.getElementById("book-grid");
const bookViewerContainer = document.getElementById("book-viewer-container");
const bookViewer = document.getElementById("book-viewer");
const closeViewerButton = document.getElementById("close-viewer");
const openExternalButton = document.getElementById("open-external");

// ── Mapa de gêneros → tópicos do Gutenberg ──
const GENRE_MAP = {
    "suspense":        "mystery",
    "horror":          "horror",
    "history":         "history",
    "science fiction": "science fiction",
    "fantasy":         "fantasy",
    "romance":         "romance",
};

// ────────────────────────────────────────
// ── SISTEMA DE PERFIL / FAVORITOS / HISTÓRICO ──
// ────────────────────────────────────────

function getPerfil() {
    try {
        return JSON.parse(localStorage.getItem("bibliofinder_perfil")) || null;
    } catch { return null; }
}

function savePerfil(perfil) {
    localStorage.setItem("bibliofinder_perfil", JSON.stringify(perfil));
}

function isFavorito(bookId) {
    const p = getPerfil();
    return p ? p.favoritos.some(f => f.id === bookId) : false;
}

function isJaLido(bookId) {
    const p = getPerfil();
    return p ? p.historico.some(h => h.id === bookId) : false;
}

function toggleFavorito(book) {
    const p = getPerfil();
    if (!p) return false;

    const idx = p.favoritos.findIndex(f => f.id === book.id);
    if (idx >= 0) {
        p.favoritos.splice(idx, 1);
        savePerfil(p);
        return false; // removido
    } else {
        p.favoritos.push({ id: book.id, title: book.title, authors: book.authors, cover: book.cover, page: book.page });
        savePerfil(p);
        return true; // adicionado
    }
}

function marcarComoLido(book) {
    const p = getPerfil();
    if (!p) return;
    if (!p.historico.some(h => h.id === book.id)) {
        p.historico.push({ id: book.id, title: book.title, authors: book.authors, cover: book.cover, page: book.page, dataLeitura: new Date().toISOString() });
        savePerfil(p);
    }
}

// ── Painel lateral de favoritos/histórico ──
function criarPainel() {
    if (document.getElementById("bf-painel")) return;

    const painel = document.createElement("div");
    painel.id = "bf-painel";
    painel.innerHTML = `
        <div id="bf-painel-overlay"></div>
        <aside id="bf-painel-drawer">
            <div class="bf-drawer-header">
                <h2 class="bf-drawer-title">Minha Biblioteca</h2>
                <button id="bf-fechar-painel" aria-label="Fechar painel">✕</button>
            </div>
            <div class="bf-tabs">
                <button class="bf-tab active" data-tab="favoritos">❤ Favoritos</button>
                <button class="bf-tab" data-tab="historico">✓ Já lidos</button>
            </div>
            <div id="bf-tab-favoritos" class="bf-tab-content active">
                <div id="bf-lista-favoritos" class="bf-lista"></div>
            </div>
            <div id="bf-tab-historico" class="bf-tab-content">
                <div id="bf-lista-historico" class="bf-lista"></div>
            </div>
        </aside>
    `;
    document.body.appendChild(painel);

    // Estilos do painel
    const style = document.createElement("style");
    style.textContent = `
        #bf-painel-overlay {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.7);
            z-index: 1100;
            opacity: 0; pointer-events: none;
            transition: opacity 0.3s;
        }
        #bf-painel-overlay.visible { opacity: 1; pointer-events: all; }

        #bf-painel-drawer {
            position: fixed; top: 0; right: -360px; bottom: 0;
            width: min(360px, 90vw);
            background: #0e0e0e;
            border-left: 1px solid rgba(212,175,55,0.25);
            z-index: 1101;
            display: flex; flex-direction: column;
            transition: right 0.35s cubic-bezier(.4,0,.2,1);
            overflow: hidden;
        }
        #bf-painel-drawer.aberto { right: 0; }

        .bf-drawer-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 1.2rem 1.4rem;
            border-bottom: 1px solid rgba(212,175,55,0.15);
            flex-shrink: 0;
        }
        .bf-drawer-title {
            font-family: 'Playfair Display', serif;
            color: #d4af37; font-size: 1.15rem; margin: 0;
        }
        #bf-fechar-painel {
            background: transparent; border: none;
            color: #888; font-size: 1rem; cursor: pointer; padding: 4px 8px;
            transition: color 0.2s;
        }
        #bf-fechar-painel:hover { color: white; }

        .bf-tabs {
            display: flex; border-bottom: 1px solid rgba(212,175,55,0.15);
            flex-shrink: 0;
        }
        .bf-tab {
            flex: 1; background: transparent; border: none;
            padding: 12px; color: #666;
            font-family: 'Quicksand', sans-serif; font-weight: 600; font-size: 0.85rem;
            cursor: pointer; transition: color 0.2s, border-bottom 0.2s;
            border-bottom: 2px solid transparent;
        }
        .bf-tab.active { color: #d4af37; border-bottom-color: #d4af37; }

        .bf-tab-content { display: none; flex: 1; overflow-y: auto; padding: 1rem; }
        .bf-tab-content.active { display: block; }

        .bf-lista { display: flex; flex-direction: column; gap: 10px; }

        .bf-item {
            display: flex; gap: 12px; align-items: flex-start;
            background: #111; border-radius: 12px;
            padding: 10px 12px;
            border: 1px solid rgba(212,175,55,0.1);
        }
        .bf-item img {
            width: 44px; height: 66px; object-fit: cover;
            border-radius: 6px; flex-shrink: 0;
        }
        .bf-item-info { flex: 1; min-width: 0; }
        .bf-item-title {
            color: #d4af37; font-size: 0.82rem;
            font-weight: 600; margin-bottom: 2px;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .bf-item-author { color: #777; font-size: 0.75rem; }
        .bf-item-date { color: #555; font-size: 0.7rem; margin-top: 4px; font-style: italic; }
        .bf-item-actions { display: flex; gap: 6px; margin-top: 6px; flex-wrap: wrap; }
        .bf-btn-sm {
            background: transparent; border: 1px solid rgba(212,175,55,0.3);
            color: #d4af37; font-size: 0.72rem; padding: 3px 10px;
            border-radius: 20px; cursor: pointer;
            font-family: 'Quicksand', sans-serif; font-weight: 600;
            transition: background 0.2s, color 0.2s;
        }
        .bf-btn-sm:hover { background: rgba(212,175,55,0.12); }
        .bf-btn-sm.remover { border-color: rgba(200,80,80,0.4); color: #e07070; }
        .bf-btn-sm.remover:hover { background: rgba(200,80,80,0.1); }

        .bf-vazio {
            text-align: center; color: #555; font-size: 0.9rem;
            padding: 2rem 1rem; line-height: 1.7;
        }
        .bf-vazio-icon { font-size: 2rem; margin-bottom: 0.5rem; }

        /* Botão fixo "Minha Biblioteca" */
        #bf-btn-abrir {
            position: fixed; bottom: 24px; right: 24px;
            background: #d4af37; color: #000;
            border: none; border-radius: 50px;
            padding: 12px 22px; font-size: 0.88rem;
            font-family: 'Quicksand', sans-serif; font-weight: 700;
            cursor: pointer; z-index: 999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            transition: box-shadow 0.2s;
            display: flex; align-items: center; gap: 8px;
        }
        #bf-btn-abrir:hover { box-shadow: 0 0 18px rgba(212,175,55,0.5); }
        #bf-btn-abrir .bf-badge {
            background: #000; color: #d4af37;
            border-radius: 50%; width: 20px; height: 20px;
            display: flex; align-items: center; justify-content: center;
            font-size: 0.75rem; font-weight: 700;
        }
        #bf-btn-abrir .bf-badge.hidden { display: none; }
    `;
    document.head.appendChild(style);

    // Botão flutuante
    const btnAbrir = document.createElement("button");
    btnAbrir.id = "bf-btn-abrir";
    btnAbrir.innerHTML = `❤ Minha Biblioteca <span class="bf-badge hidden" id="bf-badge-count">0</span>`;
    document.body.appendChild(btnAbrir);

    // Eventos
    btnAbrir.addEventListener("click", abrirPainel);
    document.getElementById("bf-fechar-painel").addEventListener("click", fecharPainel);
    document.getElementById("bf-painel-overlay").addEventListener("click", fecharPainel);

    document.querySelectorAll(".bf-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".bf-tab").forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".bf-tab-content").forEach(c => c.classList.remove("active"));
            tab.classList.add("active");
            document.getElementById(`bf-tab-${tab.dataset.tab}`).classList.add("active");
        });
    });

    atualizarBadge();
}

function abrirPainel() {
    renderizarPainel();
    document.getElementById("bf-painel-drawer").classList.add("aberto");
    document.getElementById("bf-painel-overlay").classList.add("visible");
    document.body.style.overflow = "hidden";
}

function fecharPainel() {
    document.getElementById("bf-painel-drawer").classList.remove("aberto");
    document.getElementById("bf-painel-overlay").classList.remove("visible");
    document.body.style.overflow = "";
}

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='193' viewBox='0 0 128 193'%3E%3Crect width='128' height='193' fill='%23222'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23d4af37' font-size='11' font-family='sans-serif'%3ESem Capa%3C/text%3E%3C/svg%3E";

function renderizarPainel() {
    const p = getPerfil();
    renderizarLista("bf-lista-favoritos", p?.favoritos || [], false);
    renderizarLista("bf-lista-historico", p?.historico || [], true);
}

function renderizarLista(containerId, items, isHistorico) {
    const container = document.getElementById(containerId);
    if (!items || items.length === 0) {
        container.innerHTML = `<div class="bf-vazio">
            <div class="bf-vazio-icon">${isHistorico ? "📚" : "❤"}</div>
            ${isHistorico ? "Nenhum livro marcado como lido ainda." : "Nenhum favorito salvo ainda.<br>Clique no ❤ em qualquer card de livro."}
        </div>`;
        return;
    }

    container.innerHTML = items.map(book => {
        const dataStr = book.dataLeitura
            ? `<p class="bf-item-date">Lido em ${new Date(book.dataLeitura).toLocaleDateString("pt-BR")}</p>`
            : "";

        const actionRemover = isHistorico
            ? `<button class="bf-btn-sm remover" onclick="removerHistorico('${book.id}')">✕ Remover</button>`
            : `<button class="bf-btn-sm remover" onclick="removerFavorito('${book.id}')">✕ Remover</button>`;

        return `<div class="bf-item" id="bf-item-${book.id}">
            <img src="${book.cover || PLACEHOLDER}" alt="${book.title}" loading="lazy" onerror="this.src='${PLACEHOLDER}'">
            <div class="bf-item-info">
                <p class="bf-item-title" title="${book.title}">${book.title}</p>
                <p class="bf-item-author">${book.authors}</p>
                ${dataStr}
                <div class="bf-item-actions">
                    <a class="bf-btn-sm" href="${book.page}" target="_blank" rel="noopener">🌐 Ler</a>
                    ${actionRemover}
                </div>
            </div>
        </div>`;
    }).join("");
}

function removerFavorito(bookId) {
    const p = getPerfil();
    if (!p) return;
    p.favoritos = p.favoritos.filter(f => f.id !== bookId);
    savePerfil(p);
    renderizarPainel();
    atualizarBadge();
    // Atualizar botão no card se visível
    const btn = document.querySelector(`[data-fav-id="${bookId}"]`);
    if (btn) { btn.textContent = "❤ Favoritar"; btn.classList.remove("favoritado"); }
}

function removerHistorico(bookId) {
    const p = getPerfil();
    if (!p) return;
    p.historico = p.historico.filter(h => h.id !== bookId);
    savePerfil(p);
    renderizarPainel();
}

function atualizarBadge() {
    const p = getPerfil();
    const count = p?.favoritos?.length || 0;
    const badge = document.getElementById("bf-badge-count");
    if (!badge) return;
    badge.textContent = count;
    badge.classList.toggle("hidden", count === 0);
}

// ── Clique nos botões de gênero ──
genreButtons.forEach((button) => {
    button.addEventListener("click", () => {
        genreButtons.forEach(b => b.classList.remove("active"));
        button.classList.add("active");
        fetchBooksByGenre(button.getAttribute("data-genre"));
    });
});

// ── Busca livros no Gutendex ──
async function fetchBooksByGenre(genre) {
    bookGrid.innerHTML = `<p class="loading-msg">🔍 Buscando livros gratuitos...</p>`;
    const topic = GENRE_MAP[genre] || genre;
    const url = `https://gutendex.com/books/?topic=${encodeURIComponent(topic)}&languages=en`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        displayBooks(data.results);
    } catch (err) {
        console.error("Erro ao buscar livros:", err);
        bookGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#bbb;padding:2rem;line-height:1.7">
            ⚠️ Não foi possível carregar os livros.<br>
            <small>Verifique sua conexão e tente novamente.</small>
        </p>`;
    }
}

// ── Exibe os livros no grid ──
function displayBooks(books) {
    bookGrid.innerHTML = "";
    if (!books || books.length === 0) {
        bookGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#bbb;padding:2rem;">Nenhum livro encontrado para este gênero.</p>`;
        return;
    }

    const perfil = getPerfil();

    books.forEach((book) => {
        const title   = book.title || "Título desconhecido";
        const authors = book.authors?.map(a => a.name).join(", ") || "Autor desconhecido";
        const cover   = book.formats?.["image/jpeg"] || PLACEHOLDER;
        const gutenbergPage = `https://www.gutenberg.org/ebooks/${book.id}`;

        const jaFav  = isFavorito(book.id);
        const jaLido = isJaLido(book.id);

        const bookData = { id: book.id, title, authors, cover, page: gutenbergPage };

        const card = document.createElement("div");
        card.classList.add("book-card");
        card.setAttribute("role", "listitem");
        card.innerHTML = `
            <div class="cover-wrapper">
                <img src="${cover}" alt="Capa: ${title}" loading="lazy" onerror="this.src='${PLACEHOLDER}'">
                ${jaLido ? `<span class="badge-lido" title="Já lido">✓</span>` : ""}
            </div>
            <div class="book-info">
                <h3>${title}</h3>
                <p>${authors}</p>
                <button class="view-book-button"
                    data-page="${gutenbergPage}"
                    data-title="${title}"
                    data-authors="${authors}"
                    data-id="${book.id}"
                    data-cover="${cover}">
                    📖 Ler Agora
                </button>
                ${perfil ? `
                <button class="fav-button ${jaFav ? 'favoritado' : ''}"
                    data-fav-id="${book.id}"
                    title="${jaFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
                    ${jaFav ? "❤ Favoritado" : "❤ Favoritar"}
                </button>` : ""}
            </div>
        `;
        bookGrid.appendChild(card);
    });

    // Eventos dos botões de leitura
    document.querySelectorAll(".view-book-button").forEach((btn) => {
        btn.addEventListener("click", () => {
            const bookData = {
                id: btn.getAttribute("data-id"),
                title: btn.getAttribute("data-title"),
                authors: btn.getAttribute("data-authors"),
                cover: btn.getAttribute("data-cover"),
                page: btn.getAttribute("data-page"),
            };
            marcarComoLido(bookData);
            openBookViewer(bookData.page, bookData.title, bookData.authors);
        });
    });

    // Eventos dos botões de favorito
    document.querySelectorAll(".fav-button").forEach((btn) => {
        btn.addEventListener("click", () => {
            const bookId = btn.getAttribute("data-fav-id");
            const card   = btn.closest(".book-card");
            const bookData = {
                id: bookId,
                title: card.querySelector("h3").textContent,
                authors: card.querySelector("p").textContent,
                cover: card.querySelector("img").src,
                page: card.querySelector(".view-book-button").getAttribute("data-page"),
            };
            const added = toggleFavorito(bookData);
            btn.textContent = added ? "❤ Favoritado" : "❤ Favoritar";
            btn.classList.toggle("favoritado", added);
            btn.title = added ? "Remover dos favoritos" : "Adicionar aos favoritos";
            atualizarBadge();
        });
    });

    // Injetar estilos dos novos elementos (uma vez)
    if (!document.getElementById("bf-card-styles")) {
        const s = document.createElement("style");
        s.id = "bf-card-styles";
        s.textContent = `
            .cover-wrapper { position: relative; }
            .badge-lido {
                position: absolute; top: 6px; right: 6px;
                background: rgba(80,200,80,0.85);
                color: white; border-radius: 50%;
                width: 22px; height: 22px;
                display: flex; align-items: center; justify-content: center;
                font-size: 0.75rem; font-weight: bold;
            }
            .fav-button {
                display: inline-block; margin-top: 6px;
                padding: 6px 14px;
                background: transparent;
                border: 1.5px solid rgba(212,175,55,0.4);
                color: #d4af37;
                font-family: 'Quicksand', sans-serif;
                font-weight: 600; font-size: 0.78rem;
                border-radius: 50px; cursor: pointer;
                transition: background 0.2s, border-color 0.2s;
                touch-action: manipulation;
                width: 100%;
            }
            .fav-button:hover { background: rgba(212,175,55,0.1); }
            .fav-button.favoritado {
                background: rgba(212,175,55,0.15);
                border-color: #d4af37;
            }
        `;
        document.head.appendChild(s);
    }
}

// ── Abre o modal e gera o resumo direto ──
function openBookViewer(gutenbergPage, title, authors) {
    openExternalButton.href = gutenbergPage;
    openExternalButton.classList.remove("hidden");
    bookViewerContainer.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    showAISummary(title, authors, gutenbergPage);
}

// ── Gera resumo com a API do Claude ──
async function showAISummary(title, authors, gutenbergPage) {
    bookViewer.srcdoc = loadingHtml("✨ Gerando resumo com IA...");

    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "anthropic-dangerous-direct-browser-access": "true"
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 1000,
                messages: [{
                    role: "user",
                    content: `Escreva um resumo envolvente do livro "${title}" de ${authors}.
Inclua:
- Uma introdução sobre o livro e sua importância
- Os principais personagens
- O enredo geral (sem spoilers do final)
- Por que vale a pena ler

Responda em português, em HTML simples com parágrafos (<p>), títulos (<h2>) e destaques (<strong>).
Não use markdown, apenas HTML. Não inclua <!DOCTYPE>, <html>, <head> ou <body>.`
                }]
            })
        });

        const data = await response.json();
        const summaryHtml = data.content?.[0]?.text || "Resumo não disponível.";
        bookViewer.srcdoc = summaryPageHtml(title, authors, summaryHtml);

    } catch (err) {
        console.error("Erro ao gerar resumo:", err);
        bookViewer.srcdoc = summaryPageHtml(
            title, authors,
            `<p>Não foi possível gerar o resumo agora. Use o botão <strong>"Abrir no Gutenberg"</strong> acima para ler o livro completo.</p>`
        );
    }
}

// ── Template da página de resumo ──
function summaryPageHtml(title, authors, bodyHtml) {
    return `<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
        background: #0e0e0e;
        color: #e8e0d0;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 1.05rem;
        line-height: 1.9;
        padding: 2rem 1.5rem 4rem;
        max-width: 700px;
        margin: 0 auto;
    }
    .book-header {
        border-bottom: 1px solid rgba(212,175,55,0.3);
        padding-bottom: 1.2rem;
        margin-bottom: 1.8rem;
    }
    .badge {
        display: inline-block;
        background: rgba(212,175,55,0.15);
        color: #d4af37;
        border: 1px solid rgba(212,175,55,0.4);
        border-radius: 20px;
        padding: 3px 12px;
        font-size: 0.78rem;
        font-family: sans-serif;
        letter-spacing: 1px;
        margin-bottom: 0.8rem;
    }
    h1 { color: #d4af37; font-size: 1.5rem; line-height: 1.3; margin-bottom: 0.4rem; }
    .authors { color: #999; font-style: italic; font-size: 0.95rem; }
    h2 { color: #d4af37; font-size: 1.1rem; margin: 1.5rem 0 0.5rem; }
    p { margin-bottom: 1rem; }
    strong { color: #f0e0a0; }
</style>
</head>
<body>
    <div class="book-header">
        <span class="badge">✨ RESUMO GERADO POR IA</span>
        <h1>${title}</h1>
        <p class="authors">${authors}</p>
    </div>
    <div class="summary-body">
        ${bodyHtml}
    </div>
</body>
</html>`;
}

// ── Tela de loading ──
function loadingHtml(msg) {
    return `<!DOCTYPE html><html><body style="display:flex;align-items:center;justify-content:center;
        height:100vh;margin:0;background:#111;color:#d4af37;font-family:sans-serif;font-size:1.1rem;">
        ${msg}
    </body></html>`;
}

// ── Fecha o modal ──
closeViewerButton.addEventListener("click", fecharModal);

function fecharModal() {
    bookViewerContainer.classList.add("hidden");
    bookViewer.srcdoc = "";
    bookViewer.src = "about:blank";
    openExternalButton.href = "#";
    openExternalButton.classList.add("hidden");
    document.body.style.overflow = "";
}

// ── Fecha com ESC ──
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !bookViewerContainer.classList.contains("hidden")) {
        fecharModal();
    }
});

// ── Inicialização ──
document.addEventListener("DOMContentLoaded", () => {
    const perfil = getPerfil();
    if (perfil) {
        criarPainel();
    }
});

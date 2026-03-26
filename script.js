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
 
// ── Imagem de capa padrão ──
const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='193' viewBox='0 0 128 193'%3E%3Crect width='128' height='193' fill='%23222'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23d4af37' font-size='11' font-family='sans-serif'%3ESem Capa%3C/text%3E%3C/svg%3E";
 
// ── Exibe os livros no grid ──
function displayBooks(books) {
    bookGrid.innerHTML = "";
    if (!books || books.length === 0) {
        bookGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#bbb;padding:2rem;">Nenhum livro encontrado para este gênero.</p>`;
        return;
    }
    books.forEach((book) => {
        const title   = book.title || "Título desconhecido";
        const authors = book.authors?.map(a => a.name).join(", ") || "Autor desconhecido";
        const cover   = book.formats?.["image/jpeg"] || PLACEHOLDER;
        const gutenbergPage = `https://www.gutenberg.org/ebooks/${book.id}`;
 
        const card = document.createElement("div");
        card.classList.add("book-card");
        card.setAttribute("role", "listitem");
        card.innerHTML = `
            <div class="cover-wrapper">
                <img src="${cover}" alt="Capa: ${title}" loading="lazy" onerror="this.src='${PLACEHOLDER}'">
            </div>
            <div class="book-info">
                <h3>${title}</h3>
                <p>${authors}</p>
                <button class="view-book-button"
                    data-page="${gutenbergPage}"
                    data-title="${title}"
                    data-authors="${authors}">
                    📖 Ler Agora
                </button>
            </div>
        `;
        bookGrid.appendChild(card);
    });
 
    document.querySelectorAll(".view-book-button").forEach((btn) => {
        btn.addEventListener("click", () => {
            openBookViewer(
                btn.getAttribute("data-page"),
                btn.getAttribute("data-title"),
                btn.getAttribute("data-authors")
            );
        });
    });
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
 
// ── Template da página de resumo (sem botão de baixo) ──
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

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
 
// ── Busca livros no Gutendex (API do Projeto Gutenberg) ──
async function fetchBooksByGenre(genre) {
    bookGrid.innerHTML = `<p class="loading-msg">🔍 Buscando livros gratuitos...</p>`;
 
    const topic = GENRE_MAP[genre] || genre;
    // Busca apenas em inglês para ter mais resultados disponíveis
    const url = `https://gutendex.com/books/?topic=${encodeURIComponent(topic)}&languages=en`;
 
    console.log("Buscando:", url);
 
    try {
        const res = await fetch(url);
        console.log("Status da resposta:", res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("Livros recebidos:", data.results?.length);
        displayBooks(data.results);
    } catch (err) {
        console.error("Erro ao buscar livros:", err);
        bookGrid.innerHTML = `
            <p style="grid-column:1/-1;text-align:center;color:#bbb;padding:2rem;line-height:1.7">
                ⚠️ Não foi possível carregar os livros.<br>
                <small>Verifique sua conexão com a internet e tente novamente.</small>
            </p>`;
    }
}
 
// ── Imagem de capa padrão (SVG inline, sem dependência externa) ──
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
 
        // Tenta pegar versão HTML do livro (melhor para leitura)
        const readUrl =
            book.formats?.["text/html"] ||
            book.formats?.["text/html; charset=utf-8"] ||
            book.formats?.["text/html; charset=us-ascii"] ||
            null;
 
        const gutenbergPage = `https://www.gutenberg.org/ebooks/${book.id}`;
 
        const card = document.createElement("div");
        card.classList.add("book-card");
        card.setAttribute("role", "listitem");
 
        card.innerHTML = `
            <div class="cover-wrapper">
                <img
                    src="${cover}"
                    alt="Capa: ${title}"
                    loading="lazy"
                    onerror="this.src='${PLACEHOLDER}'"
                >
            </div>
            <div class="book-info">
                <h3>${title}</h3>
                <p>${authors}</p>
                ${readUrl
                    ? `<button class="view-book-button"
                            data-read="${readUrl}"
                            data-page="${gutenbergPage}">
                            📖 Ler Agora
                       </button>`
                    : `<a class="view-book-button"
                            href="${gutenbergPage}"
                            target="_blank"
                            rel="noopener">
                            Ver no Gutenberg
                       </a>`
                }
            </div>
        `;
        bookGrid.appendChild(card);
    });
 
    // Adiciona eventos nos botões "Ler Agora"
    document.querySelectorAll(".view-book-button[data-read]").forEach((btn) => {
        btn.addEventListener("click", () => {
            openBookViewer(btn.getAttribute("data-read"), btn.getAttribute("data-page"));
        });
    });
}
 
// ── Abre o modal e carrega o livro ──
function openBookViewer(readUrl, gutenbergPage) {
    // Mostra loading
    bookViewer.srcdoc = `
        <div style="display:flex;align-items:center;justify-content:center;height:100%;
            background:#111;color:#d4af37;font-family:sans-serif;font-size:1.1rem;">
            ⏳ Carregando livro...
        </div>`;
 
    openExternalButton.href = gutenbergPage;
    openExternalButton.classList.remove("hidden");
    bookViewerContainer.classList.remove("hidden");
    document.body.style.overflow = "hidden";
 
    // Baixa o conteúdo HTML do livro e injeta com estilos de leitura
    fetch(readUrl)
        .then(res => {
            if (!res.ok) throw new Error("Falha no fetch");
            return res.text();
        })
        .then(html => {
            // Adiciona CSS de leitura confortável no dark mode
            const CSS = `
                <style>
                    * { box-sizing: border-box; }
                    body {
                        background: #0e0e0e !important;
                        color: #e8e0d0 !important;
                        font-family: Georgia, 'Times New Roman', serif !important;
                        font-size: 1.05rem !important;
                        line-height: 1.9 !important;
                        max-width: 700px !important;
                        margin: 0 auto !important;
                        padding: 2rem 1.5rem 5rem !important;
                    }
                    a { color: #d4af37 !important; }
                    h1, h2, h3, h4, h5 { color: #d4af37 !important; font-family: Georgia, serif !important; }
                    img { max-width: 100% !important; height: auto !important; }
                    pre { white-space: pre-wrap !important; word-break: break-word !important; }
                    /* Esconde cabeçalho/rodapé do Gutenberg */
                    #pg-header, #pg-footer, .pgheader, .pgfooter,
                    .navbar, nav, header { display: none !important; }
                </style>`;
 
            // Injeta o CSS antes de fechar o </head>; se não tiver, adiciona no início
            const styledHtml = html.includes("</head>")
                ? html.replace("</head>", CSS + "</head>")
                : CSS + html;
 
            bookViewer.srcdoc = styledHtml;
        })
        .catch(() => {
            // Fallback: CORS bloqueou — orienta o usuário a abrir externamente
            bookViewer.srcdoc = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                    min-height:100vh;font-family:sans-serif;background:#111;color:#d4af37;
                    text-align:center;padding:2rem;gap:12px;">
                    <p style="font-size:1.2rem;margin:0;">📚 Livro disponível!</p>
                    <p style="color:#bbb;font-size:0.95rem;margin:0;">
                        Este livro não pôde ser carregado diretamente.<br>
                        Clique em <strong style="color:#d4af37">"Abrir no Gutenberg"</strong> para ler.
                    </p>
                </div>`;
        });
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

// Seletores principais
const genreButtons = document.querySelectorAll(".genre-pill");
const bookGrid = document.getElementById("book-grid");
const bookViewerContainer = document.getElementById("book-viewer-container");
const bookViewer = document.getElementById("book-viewer");
const closeViewerButton = document.getElementById("close-viewer");

// Adiciona evento de clique para cada botão de gênero
genreButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const genre = button.getAttribute("data-genre");
        fetchBooksByGenre(genre);
    });
});

// Função para buscar livros por gênero
async function fetchBooksByGenre(genre) {
    const API_URL = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(genre)}&maxResults=20`;
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Erro ao buscar livros. Verifique a conexão ou a API.");
        }
        const data = await response.json();
        displayBooks(data.items);
    } catch (error) {
        console.error("Erro ao buscar livros:", error);
        bookGrid.innerHTML = "<p>Erro ao buscar livros. Tente novamente mais tarde.</p>";
    }
}

// Função para exibir os livros no grid
function displayBooks(books) {
    bookGrid.innerHTML = ""; // Limpa os resultados anteriores
    if (!books || books.length === 0) {
        bookGrid.innerHTML = "<p>Nenhum livro encontrado.</p>";
        return;
    }
    books.forEach((book) => {
        const bookInfo = book.volumeInfo;
        const accessInfo = book.accessInfo;
        const bookId = book.id;
        const webReaderLink = accessInfo?.webReaderLink || null;

        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");

        bookCard.innerHTML = `
            <div class="cover-wrapper">
                <img src="${bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x193?text=Sem+Capa'}" alt="${bookInfo.title}">
            </div>
            <div class="book-info">
                <h3>${bookInfo.title}</h3>
                <p>${bookInfo.authors ? bookInfo.authors.join(", ") : "Autor desconhecido"}</p>
                ${webReaderLink ? `<button class="view-book-button" data-id="${bookId}" data-link="${webReaderLink}">Ler Livro</button>` : "<p class='no-pdf'>Visualização não disponível</p>"}
            </div>
        `;
        bookGrid.appendChild(bookCard);
    });

    // Adiciona evento para os botões "Ler Livro"
    const viewBookButtons = document.querySelectorAll(".view-book-button");
    viewBookButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const webReaderLink = button.getAttribute("data-link");
            openBookViewer(webReaderLink);
        });
    });
}

// Função para abrir o visualizador de livros
function openBookViewer(webReaderLink) {
    if (!webReaderLink) {
        alert("Visualização não disponível para este livro.");
        return;
    }
    bookViewer.src = webReaderLink;
    bookViewerContainer.classList.remove("hidden");
}

// Função para fechar o visualizador de livros
closeViewerButton.addEventListener("click", () => {
    bookViewerContainer.classList.add("hidden");
    bookViewer.src = ""; // Limpa o iframe
});

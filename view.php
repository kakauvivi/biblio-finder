<?php

function exibirView(): void {
    echo <<<'HTML'
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Biblio Finder | Cadastro de Leitor</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Quicksand:wght@400;600&display=swap" rel="stylesheet">
    <style>
        :root { --preto:#050505; --dourado:#d4af37; --borda:rgba(212,175,55,0.3); --input-bg:#1a1a1a; }
        * { box-sizing: border-box; }
        body { background: var(--preto); color: white; font-family: 'Quicksand', sans-serif; margin: 0; min-height: 100vh; display: flex; flex-direction: column; }
        header { text-align: center; padding: 2rem 1rem 1.5rem; background: radial-gradient(circle at top, #1a1a1a, #050505); border-bottom: 1px solid var(--borda); border-radius: 0 0 50px 50px; }
        .brand { font-family: 'Playfair Display', serif; font-size: 1.8rem; letter-spacing: 3px; margin: 0 0 4px; }
        .gold { color: var(--dourado); text-shadow: 0 0 15px rgba(212,175,55,0.4); }
        .sub { font-family: 'Playfair Display', serif; font-style: italic; color: #bbb; font-size: 1rem; margin: 0; }
        main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
        .card { background: #111; border: 1px solid var(--borda); border-radius: 24px; padding: 2rem; width: 100%; max-width: 440px; }
        .card-title { font-family: 'Playfair Display', serif; color: var(--dourado); font-size: 1.1rem; margin: 0 0 1.5rem; display: flex; align-items: center; gap: 10px; }
        .icon { width: 28px; height: 28px; border-radius: 50%; background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.3); display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
        label { display: block; font-size: 0.83rem; color: #aaa; margin-bottom: 6px; margin-top: 16px; }
        label:first-of-type { margin-top: 0; }
        input, select { width: 100%; background: var(--input-bg); border: 1px solid var(--borda); border-radius: 12px; color: white; font-family: 'Quicksand', sans-serif; font-size: 0.92rem; padding: 12px 16px; outline: none; transition: border-color 0.3s; appearance: none; }
        input:focus, select:focus { border-color: var(--dourado); }
        select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23d4af37' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; cursor: pointer; }
        select option { background: #1a1a1a; }
        button { width: 100%; background: var(--dourado); border: none; color: #000; padding: 13px; border-radius: 50px; cursor: pointer; font-family: 'Quicksand', sans-serif; font-weight: 700; font-size: 0.95rem; margin-top: 1.6rem; transition: box-shadow 0.2s; }
        button:hover { box-shadow: 0 0 18px rgba(212,175,55,0.5); }
    </style>
</head>
<body>
<header>
    <h1 class="brand">BIBLIO <span class="gold">FINDER</span></h1>
    <p class="sub">Cadastro de Leitor</p>
</header>

<main>
    <div class="card">
        <h2 class="card-title"><span class="icon">📚</span> Crie seu perfil de leitor</h2>

        <form action="/" method="POST">
            <label for="nome">Nome completo</label>
            <input type="text" id="nome" name="nome" placeholder="Ex: Maria da Silva">

            <label for="idade">Idade</label>
            <input type="number" id="idade" name="idade" placeholder="Ex: 16" min="1" max="120">

            <label for="genero">Gênero literário favorito</label>
            <select id="genero" name="genero">
                <option value="" disabled selected>Selecione...</option>
                <option value="Fantasia">🧙 Fantasia (mín. 10 anos)</option>
                <option value="Aventura">🗺️ Aventura (mín. 10 anos)</option>
                <option value="Romance">💕 Romance (mín. 12 anos)</option>
                <option value="Histórico">⚔️ Histórico (mín. 12 anos)</option>
                <option value="Ficção Científica">🚀 Ficção Científica (mín. 13 anos)</option>
                <option value="Suspense">🔍 Suspense (mín. 14 anos)</option>
                <option value="Biografia">📜 Biografia (mín. 14 anos)</option>
                <option value="Autoajuda">🌱 Autoajuda (mín. 14 anos)</option>
                <option value="Terror">👁️ Terror (mín. 16 anos)</option>
            </select>

            <button type="submit">Entrar na Biblioteca →</button>
        </form>
    </div>
</main>
</body>
</html>
HTML;
}

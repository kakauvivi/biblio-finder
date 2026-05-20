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
        .card-title { font-family: 'Playfair Display', serif; color: var(--dourado); font-size: 1.1rem; margin: 0 0 1.5rem; }
        .erro-box { background: rgba(200,80,80,0.1); border: 1px solid rgba(200,80,80,0.3); color: #e07070; border-radius: 12px; padding: 10px 14px; font-size: 0.88rem; margin-bottom: 1.2rem; }
        label { display: block; font-size: 0.83rem; color: #aaa; margin-bottom: 6px; margin-top: 16px; }
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
        <h2 class="card-title">📚 Crie seu perfil de leitor</h2>

        <?php if (!empty($contexto['erro'])): ?>
            <div class="erro-box">⚠ <?= htmlspecialchars($contexto['erro']) ?></div>
        <?php endif; ?>

        <form action="/" method="POST">
            <label for="nome">Nome completo</label>
            <input type="text" id="nome" name="nome" placeholder="Ex: Maria da Silva"
                   value="<?= htmlspecialchars($_POST['nome'] ?? '') ?>">

            <label for="idade">Idade</label>
            <input type="number" id="idade" name="idade" placeholder="Ex: 16" min="1" max="120"
                   value="<?= htmlspecialchars($_POST['idade'] ?? '') ?>">

            <label for="genero">Gênero literário favorito</label>
            <select id="genero" name="genero">
                <option value="" disabled selected>Selecione...</option>
                <?php
                $generos = ['Fantasia'=>'🧙 Fantasia','Aventura'=>'🗺️ Aventura','Romance'=>'💕 Romance','Histórico'=>'⚔️ Histórico','Ficção Científica'=>'🚀 Ficção Científica','Suspense'=>'🔍 Suspense','Biografia'=>'📜 Biografia','Autoajuda'=>'🌱 Autoajuda','Terror'=>'👁️ Terror'];
                foreach ($generos as $val => $label):
                    $sel = (($_POST['genero'] ?? '') === $val) ? 'selected' : '';
                ?>
                    <option value="<?= $val ?>" <?= $sel ?>><?= $label ?></option>
                <?php endforeach; ?>
            </select>

            <button type="submit">Entrar na Biblioteca →</button>
        </form>
    </div>
</main>
</body>
</html>

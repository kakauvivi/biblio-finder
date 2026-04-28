<?php

require_once __DIR__ . '/bf_model.php';
require_once __DIR__ . '/bf_service.php';

class LeitorController {

    public function processarCadastro(array $dados): void {
        $nome   = $dados['nome'];
        $idade  = (int) $dados['idade'];
        $genero = $dados['genero'];

        echo "🎯 [Controller] Iniciando cadastro de leitor no Biblio Finder...\n";

        try {
            // 1. Passar pelo Service (regras de negócio)
            $service   = new LeitorService();
            $resultado = $service->processar($nome, $idade, $genero);

            // 2. Salvar no banco via Model
            $leitor = new LeitorModel();
            $leitor->setNome($resultado['nome']);
            $leitor->setIdade($resultado['idade']);
            $leitor->setGeneroFavorito($resultado['genero']);
            $leitor->setPerfil($resultado['perfil']);
            $leitor->save();

            // 3. Resposta de sucesso
            $this->responderSucesso($resultado);

        } catch (Exception $e) {
            // 4. Resposta de erro
            $this->responderErro($e->getMessage());
        }
    }

    private function responderSucesso(array $r): void {
        $nome   = htmlspecialchars($r['nome']);
        $idade  = $r['idade'];
        $genero = htmlspecialchars($r['genero']);
        $perfil = htmlspecialchars($r['perfil']);
        $badge  = $r['badge'];
        $msg    = htmlspecialchars($r['mensagem']);

        echo <<<HTML
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Biblio Finder | Cadastro Aprovado</title>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Quicksand:wght@400;600&display=swap" rel="stylesheet">
            <style>
                :root { --dourado: #d4af37; }
                * { box-sizing: border-box; }
                body { background: #050505; color: white; font-family: 'Quicksand', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
                .card { background: #111; border: 1px solid rgba(212,175,55,0.3); border-radius: 24px; padding: 2.5rem; max-width: 440px; width: 100%; text-align: center; }
                .brand { font-family: 'Playfair Display', serif; font-size: 1.4rem; letter-spacing: 3px; color: var(--dourado); margin-bottom: 1.5rem; }
                .badge-emoji { font-size: 3rem; display: block; margin-bottom: 0.5rem; }
                h1 { color: var(--dourado); font-family: 'Playfair Display', serif; margin: 0 0 0.5rem; }
                p { color: #aaa; line-height: 1.6; font-size: 0.95rem; }
                .info-pill { display: inline-block; background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.3); color: var(--dourado); padding: 6px 16px; border-radius: 20px; font-size: 0.82rem; margin: 4px; }
                .perfil-pill { background: rgba(212,175,55,0.2); border-color: var(--dourado); font-weight: 700; font-size: 0.9rem; }
                a { display: inline-block; margin-top: 1.8rem; color: var(--dourado); text-decoration: none; font-weight: 600; border: 1.5px solid rgba(212,175,55,0.3); padding: 10px 24px; border-radius: 50px; transition: all 0.2s; }
                a:hover { background: rgba(212,175,55,0.1); }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="brand">BIBLIO FINDER</div>
                <span class="badge-emoji">$badge</span>
                <h1>Cadastro Realizado!</h1>
                <p>$msg</p>
                <br>
                <span class="info-pill">👤 $nome</span>
                <span class="info-pill">🎂 $idade anos</span>
                <span class="info-pill">📚 $genero</span>
                <br><br>
                <span class="info-pill perfil-pill">$badge $perfil</span>
                <br>
                <a href="/">← Novo cadastro</a>
            </div>
        </body>
        </html>
        HTML;
    }

    private function responderErro(string $mensagem): void {
        $msg = htmlspecialchars($mensagem);
        echo <<<HTML
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Biblio Finder | Acesso Negado</title>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Quicksand:wght@400;600&display=swap" rel="stylesheet">
            <style>
                * { box-sizing: border-box; }
                body { background: #050505; color: white; font-family: 'Quicksand', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
                .card { background: #111; border: 1px solid rgba(200,80,80,0.3); border-radius: 24px; padding: 2.5rem; max-width: 440px; width: 100%; text-align: center; }
                .brand { font-family: 'Playfair Display', serif; font-size: 1.4rem; letter-spacing: 3px; color: #d4af37; margin-bottom: 1.5rem; }
                h1 { color: #e07070; font-family: 'Playfair Display', serif; margin: 0 0 0.5rem; }
                p { color: #aaa; line-height: 1.6; }
                a { display: inline-block; margin-top: 1.8rem; color: #e07070; text-decoration: none; font-weight: 600; border: 1.5px solid rgba(200,80,80,0.3); padding: 10px 24px; border-radius: 50px; transition: all 0.2s; }
                a:hover { background: rgba(200,80,80,0.1); }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="brand">BIBLIO FINDER</div>
                <h1>🔒 Acesso Negado</h1>
                <p>$msg</p>
                <a href="/">← Tentar novamente</a>
            </div>
        </body>
        </html>
        HTML;
    }
}

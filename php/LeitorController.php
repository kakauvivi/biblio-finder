<?php

require_once __DIR__ . '/LeitorService.php';
require_once __DIR__ . '/BusinessRuleException.php';

class LeitorController {

    /**
     * Injeção de Dependência: Controller recebe o Service pronto via construtor.
     */
    public function __construct(private LeitorService $service) {}

    /**
     * Único método de salvar — só tem try/catch, sem if/else de regras.
     */
    public function store(array $dados): void {
        $nome   = $dados['nome'];
        $idade  = (int) $dados['idade'];
        $genero = $dados['genero'];

        echo "🎯 [Controller] Processando cadastro de leitor...\n";

        try {
            $leitor = $this->service->cadastrar($nome, $idade, $genero);
            $this->renderSucesso($leitor);

        } catch (BusinessRuleException $e) {
            // Erro de regra de negócio — mostra mensagem amigável
            $this->renderView(['erro' => $e->getMessage()]);

        } catch (Exception $e) {
            // Erro técnico — não expõe stack trace para o usuário
            $this->renderView(['erro' => 'Ocorreu um erro interno. Tente novamente.']);
        }
    }

    private function renderSucesso(mixed $leitor): void {
        $nome   = htmlspecialchars($leitor->nome);
        $idade  = $leitor->idade;
        $genero = htmlspecialchars($leitor->generoFavorito);
        $perfil = htmlspecialchars($leitor->perfil);
        $badge  = $leitor->badge;

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
                .emoji { font-size: 3rem; display: block; margin-bottom: 0.5rem; }
                h1 { color: var(--dourado); font-family: 'Playfair Display', serif; margin: 0 0 1rem; }
                p { color: #aaa; font-size: 0.92rem; }
                .pill { display: inline-block; background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.3); color: var(--dourado); padding: 6px 16px; border-radius: 20px; font-size: 0.82rem; margin: 4px; }
                .pill.destaque { background: rgba(212,175,55,0.2); border-color: var(--dourado); font-weight: 700; }
                a { display: inline-block; margin-top: 1.8rem; color: var(--dourado); text-decoration: none; font-weight: 600; border: 1.5px solid rgba(212,175,55,0.3); padding: 10px 24px; border-radius: 50px; }
                a:hover { background: rgba(212,175,55,0.1); }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="brand">BIBLIO FINDER</div>
                <span class="emoji">$badge</span>
                <h1>Bem-vindo à Biblioteca!</h1>
                <p>Cadastro realizado com sucesso.</p>
                <br>
                <span class="pill">👤 $nome</span>
                <span class="pill">🎂 $idade anos</span>
                <span class="pill">📚 $genero</span>
                <br><br>
                <span class="pill destaque">$badge $perfil</span>
                <br>
                <a href="/">← Novo cadastro</a>
            </div>
        </body>
        </html>
        HTML;
    }

    public function renderView(array $contexto = []): void {
        require __DIR__ . '/view.php';
    }
}

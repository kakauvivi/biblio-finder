<?php

class Middleware {

    /**
     * Valida e sanitiza os dados do formulário.
     * Usa filter_input para barrar tentativas de XSS.
     * Encerra a execução se os dados forem inválidos.
     */
    public function validar(array $dados): array {
        $erros = [];

        // Sanitização contra XSS — remove tags HTML maliciosas
        $nome   = filter_var(trim($dados['nome']   ?? ''), FILTER_SANITIZE_SPECIAL_CHARS);
        $idade  = filter_var(trim($dados['idade']  ?? ''), FILTER_SANITIZE_NUMBER_INT);
        $genero = filter_var(trim($dados['genero'] ?? ''), FILTER_SANITIZE_SPECIAL_CHARS);

        // Validações
        if (empty($nome)) {
            $erros[] = 'O campo Nome é obrigatório.';
        }

        if (empty($idade)) {
            $erros[] = 'O campo Idade é obrigatório.';
        } elseif (!is_numeric($idade) || (int)$idade <= 0) {
            $erros[] = 'A Idade deve ser um número válido.';
        }

        if (empty($genero)) {
            $erros[] = 'Selecione um Gênero literário.';
        }

        if (!empty($erros)) {
            echo "⚠️ [Middleware] Validação/sanitização falhou. Bloqueando requisição.\n";
            $this->exibirErros($erros);
            exit;
        }

        echo "✅ [Middleware] Dados validados e sanitizados.\n";

        // Retorna dados limpos
        return ['nome' => $nome, 'idade' => $idade, 'genero' => $genero];
    }

    private function exibirErros(array $erros): void {
        $lista = implode('', array_map(fn($e) => "<li>$e</li>", $erros));
        echo <<<HTML
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Biblio Finder | Dados Inválidos</title>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Quicksand:wght@400;600&display=swap" rel="stylesheet">
            <style>
                * { box-sizing: border-box; }
                body { background: #050505; color: white; font-family: 'Quicksand', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
                .card { background: #111; border: 1px solid rgba(212,175,55,0.3); border-radius: 24px; padding: 2.5rem; max-width: 440px; width: 100%; text-align: center; }
                .brand { font-family: 'Playfair Display', serif; font-size: 1.4rem; letter-spacing: 3px; color: #d4af37; margin-bottom: 1.5rem; }
                h1 { color: #e0b030; font-family: 'Playfair Display', serif; margin: 0 0 1rem; }
                ul { text-align: left; color: #aaa; line-height: 2; padding-left: 1.2rem; }
                a { display: inline-block; margin-top: 1.5rem; color: #d4af37; text-decoration: none; font-weight: 600; border: 1.5px solid rgba(212,175,55,0.3); padding: 10px 24px; border-radius: 50px; }
                a:hover { background: rgba(212,175,55,0.1); }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="brand">BIBLIO FINDER</div>
                <h1>⚠️ Formulário Incompleto</h1>
                <ul>$lista</ul>
                <a href="/">← Voltar ao formulário</a>
            </div>
        </body>
        </html>
        HTML;
    }
}

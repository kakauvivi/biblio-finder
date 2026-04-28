<?php

class Middleware {

    /**
     * Valida os dados do formulário de cadastro do Biblio Finder.
     * Encerra com página de erro se a validação falhar.
     */
    public function validar(array $dados): void {
        $erros = [];

        // Campo: nome
        if (empty(trim($dados['nome'] ?? ''))) {
            $erros[] = 'O campo <strong>Nome</strong> é obrigatório.';
        }

        // Campo: idade (obrigatório e numérico)
        if (empty(trim($dados['idade'] ?? ''))) {
            $erros[] = 'O campo <strong>Idade</strong> é obrigatório.';
        } elseif (!is_numeric($dados['idade']) || (int)$dados['idade'] <= 0) {
            $erros[] = 'A <strong>Idade</strong> deve ser um número válido.';
        }

        // Campo: gênero
        if (empty(trim($dados['genero'] ?? ''))) {
            $erros[] = 'Selecione um <strong>Gênero literário</strong>.';
        }

        if (!empty($erros)) {
            echo "⚠️ [Middleware] Validação falhou. Bloqueando requisição.\n";
            $this->exibirErros($erros);
            exit;
        }

        echo "✅ [Middleware] Dados validados com sucesso.\n";
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
                ul strong { color: white; }
                a { display: inline-block; margin-top: 1.5rem; color: #d4af37; text-decoration: none; font-weight: 600; border: 1.5px solid rgba(212,175,55,0.3); padding: 10px 24px; border-radius: 50px; }
                a:hover { background: rgba(212,175,55,0.1); }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="brand">BIBLIO FINDER</div>
                <h1>⚠️ Formulário Incompleto</h1>
                <p style="color:#888;font-size:0.9rem">Corrija os campos abaixo:</p>
                <ul>$lista</ul>
                <a href="/">← Voltar ao formulário</a>
            </div>
        </body>
        </html>
        HTML;
    }
}

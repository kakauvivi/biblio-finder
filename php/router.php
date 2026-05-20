<?php

require_once __DIR__ . '/bf_view.php';
require_once __DIR__ . '/bf_middleware.php';
require_once __DIR__ . '/bf_controller.php';

class Router {

    public function despachar(string $metodo, array $dados): void {
        echo "🔀 [Router] Método recebido: $metodo\n";

        if ($metodo === 'GET') {
            // Exibir formulário de cadastro
            exibirView();

        } elseif ($metodo === 'POST') {
            // Validar com Middleware antes de chegar ao Controller
            $middleware = new Middleware();
            $middleware->validar($dados);

            // Processar cadastro no Controller
            $controller = new LeitorController();
            $controller->processarCadastro($dados);

        } else {
            http_response_code(405);
            echo "❌ Método HTTP não permitido.";
        }
    }
}

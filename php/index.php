<?php

/**
 * index.php — Front Controller e Container de Injeção de Dependência
 *
 * É aqui que tudo é "montado":
 * Database → Repository → Service → Controller
 *
 * Nenhuma outra classe instancia suas próprias dependências.
 */

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Leitor.php';
require_once __DIR__ . '/ILeitorRepository.php';
require_once __DIR__ . '/LeitorRepository.php';
require_once __DIR__ . '/BusinessRuleException.php';
require_once __DIR__ . '/LeitorService.php';
require_once __DIR__ . '/LeitorController.php';
require_once __DIR__ . '/middleware.php';

$metodo = $_SERVER['REQUEST_METHOD'];

echo "🚀 [Index/DI Container] Biblio Finder v2 — Requisição: $metodo\n";

// ── Montagem das dependências (DI Container) ──
$repositorio = new LeitorRepository();          // recebe PDO via Database::getConexao()
$service     = new LeitorService($repositorio); // recebe ILeitorRepository
$controller  = new LeitorController($service);  // recebe LeitorService

// ── Roteamento ──
if ($metodo === 'GET') {
    $contexto = [];
    require __DIR__ . '/view.php';

} elseif ($metodo === 'POST') {
    // Middleware valida e sanitiza antes de chegar ao Controller
    $middleware  = new Middleware();
    $dadosLimpos = $middleware->validar($_POST);

    // Controller só recebe dados já validados e limpos
    $controller->store($dadosLimpos);

} else {
    http_response_code(405);
    echo "❌ Método não permitido.";
}

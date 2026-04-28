<?php

require_once __DIR__ . '/bf_router.php';

// Ponto de entrada único do Biblio Finder (PHP)
$metodo = $_SERVER['REQUEST_METHOD'];
$dados  = $_POST;

echo "🚀 [Index] Biblio Finder — Requisição recebida: $metodo\n";

$router = new Router();
$router->despachar($metodo, $dados);

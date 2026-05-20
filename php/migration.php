<?php

require_once __DIR__ . '/Database.php';

class Migration {
    public function rodar(): void {
        try {
            $pdo = Database::getConexao();

            $pdo->exec("CREATE TABLE IF NOT EXISTS leitores (
                id               INTEGER PRIMARY KEY AUTOINCREMENT,
                nome             TEXT,
                idade            INTEGER,
                genero_favorito  TEXT,
                perfil           TEXT,
                criado_em        TEXT
            )");

            echo "✅ Banco de dados do Biblio Finder v2 criado!\n";
            echo "📁 Arquivo: database.sqlite\n";
            echo "📚 Tabela 'leitores' pronta.\n";
        } catch (Exception $e) {
            echo "❌ Erro: " . $e->getMessage() . "\n";
        }
    }
}

$migration = new Migration();
$migration->rodar();

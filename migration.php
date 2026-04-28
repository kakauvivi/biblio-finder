<?php

class Migration {
    public function rodar(): void {
        try {
            $pdo = new PDO('sqlite:' . __DIR__ . '/database.sqlite');
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $pdo->exec("CREATE TABLE IF NOT EXISTS leitores (
                id               INTEGER PRIMARY KEY AUTOINCREMENT,
                nome             TEXT,
                idade            INTEGER,
                genero_favorito  TEXT,
                perfil           TEXT,
                criado_em        TEXT
            )");

            echo "✅ Banco de dados do Biblio Finder criado com sucesso!\n";
            echo "📁 Arquivo: database.sqlite\n";
            echo "📚 Tabela 'leitores' pronta.\n";
        } catch (PDOException $e) {
            echo "❌ Erro na migration: " . $e->getMessage() . "\n";
        }
    }
}

$migration = new Migration();
$migration->rodar();

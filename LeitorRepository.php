<?php

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Leitor.php';
require_once __DIR__ . '/ILeitorRepository.php';

/**
 * Todo o SQL do sistema fica aqui — nenhum outro arquivo toca no banco diretamente.
 */
class LeitorRepository implements ILeitorRepository {

    private PDO $pdo;

    public function __construct() {
        $this->pdo = Database::getConexao();
    }

    public function save(Leitor $leitor): void {
        $stmt = $this->pdo->prepare(
            "INSERT INTO leitores (nome, idade, genero_favorito, perfil, criado_em)
             VALUES (:nome, :idade, :genero_favorito, :perfil, :criado_em)"
        );

        $stmt->execute([
            ':nome'            => $leitor->nome,
            ':idade'           => $leitor->idade,
            ':genero_favorito' => $leitor->generoFavorito,
            ':perfil'          => $leitor->perfil,
            ':criado_em'       => date('Y-m-d H:i:s'),
        ]);

        echo "💾 [Repository] Leitor '{$leitor->nome}' salvo no banco.\n";
    }

    public function find(int $id): ?Leitor {
        $stmt = $this->pdo->prepare("SELECT * FROM leitores WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();

        if (!$row) return null;

        $leitor                = new Leitor();
        $leitor->id            = $row['id'];
        $leitor->nome          = $row['nome'];
        $leitor->idade         = $row['idade'];
        $leitor->generoFavorito = $row['genero_favorito'];
        $leitor->perfil        = $row['perfil'];

        return $leitor;
    }

    public function delete(int $id): void {
        $stmt = $this->pdo->prepare("DELETE FROM leitores WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo "🗑️ [Repository] Leitor ID $id removido.\n";
    }
}

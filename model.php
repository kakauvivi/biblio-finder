<?php

class LeitorModel {
    private string $nome;
    private int    $idade;
    private string $generoFavorito;
    private string $perfil;

    // ── Getters ──
    public function getNome(): string           { return $this->nome; }
    public function getIdade(): int             { return $this->idade; }
    public function getGeneroFavorito(): string { return $this->generoFavorito; }
    public function getPerfil(): string         { return $this->perfil; }

    // ── Setters ──
    public function setNome(string $nome): void                     { $this->nome           = $nome; }
    public function setIdade(int $idade): void                      { $this->idade          = $idade; }
    public function setGeneroFavorito(string $genero): void         { $this->generoFavorito = $genero; }
    public function setPerfil(string $perfil): void                 { $this->perfil         = $perfil; }

    // ── Salvar no banco ──
    public function save(): void {
        $pdo = new PDO('sqlite:' . __DIR__ . '/database.sqlite');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $pdo->prepare(
            "INSERT INTO leitores (nome, idade, genero_favorito, perfil, criado_em)
             VALUES (:nome, :idade, :genero_favorito, :perfil, :criado_em)"
        );

        $stmt->execute([
            ':nome'            => $this->nome,
            ':idade'           => $this->idade,
            ':genero_favorito' => $this->generoFavorito,
            ':perfil'          => $this->perfil,
            ':criado_em'       => date('Y-m-d H:i:s'),
        ]);

        echo "💾 [Model] Leitor '{$this->nome}' salvo no banco do Biblio Finder.\n";
    }
}

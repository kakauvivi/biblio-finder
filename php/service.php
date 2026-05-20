<?php

class LeitorService {

    // Idade mínima para acessar cada gênero
    private array $idadeMinima = [
        'Fantasia'         => 10,
        'Aventura'         => 10,
        'Romance'          => 12,
        'Histórico'        => 12,
        'Ficção Científica'=> 13,
        'Suspense'         => 14,
        'Biografia'        => 14,
        'Autoajuda'        => 14,
        'Terror'           => 16,
    ];

    /**
     * Aplica as regras de negócio do Biblio Finder:
     * 1. Verifica se o gênero é válido
     * 2. Verifica se o leitor tem idade mínima para o gênero
     * 3. Define o perfil do leitor (Jovem Talento, Leitor Adulto, etc.)
     * Lança Exception se as regras falharem.
     */
    public function processar(string $nome, int $idade, string $genero): array {

        // Regra 1: gênero deve ser válido
        if (!array_key_exists($genero, $this->idadeMinima)) {
            throw new Exception("O gênero '$genero' não está disponível no Biblio Finder.");
        }

        // Regra 2: idade mínima para o gênero
        $minima = $this->idadeMinima[$genero];
        if ($idade < $minima) {
            throw new Exception(
                "O gênero '$genero' é recomendado para leitores com pelo menos $minima anos. " .
                "$nome tem $idade anos e ainda não pode acessar esse conteúdo."
            );
        }

        // Regra 3: definir perfil do leitor
        $perfil = $this->definirPerfil($idade);

        echo "✅ [Service] Regras do Biblio Finder aplicadas com sucesso.\n";

        return [
            'nome'    => $nome,
            'idade'   => $idade,
            'genero'  => $genero,
            'perfil'  => $perfil,
            'badge'   => $this->getBadge($perfil),
            'mensagem'=> "Bem-vindo ao Biblio Finder, $nome! Seu perfil é: $perfil.",
        ];
    }

    private function definirPerfil(int $idade): string {
        if ($idade <= 12) return 'Pequeno Leitor';
        if ($idade <= 16) return 'Leitor Jovem Talento';
        if ($idade <= 25) return 'Leitor Jovem';
        return 'Leitor Experiente';
    }

    private function getBadge(string $perfil): string {
        return match($perfil) {
            'Pequeno Leitor'        => '🌟',
            'Leitor Jovem Talento'  => '🎓',
            'Leitor Jovem'          => '📖',
            'Leitor Experiente'     => '🏆',
            default                 => '📚',
        };
    }
}

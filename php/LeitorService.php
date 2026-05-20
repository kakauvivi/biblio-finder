<?php

require_once __DIR__ . '/ILeitorRepository.php';
require_once __DIR__ . '/Leitor.php';
require_once __DIR__ . '/BusinessRuleException.php';

class LeitorService {

    // Idade mínima por gênero literário
    private array $idadeMinima = [
        'Fantasia'          => 10,
        'Aventura'          => 10,
        'Romance'           => 12,
        'Histórico'         => 12,
        'Ficção Científica' => 13,
        'Suspense'          => 14,
        'Biografia'         => 14,
        'Autoajuda'         => 14,
        'Terror'            => 16,
    ];

    /**
     * Injeção de Dependência: o Service recebe o repositório via construtor.
     * Ele não sabe (nem precisa saber) qual implementação concreta está sendo usada.
     */
    public function __construct(private ILeitorRepository $repositorio) {}

    /**
     * Aplica as regras de negócio e salva o leitor via repositório.
     * Lança BusinessRuleException se alguma regra falhar.
     */
    public function cadastrar(string $nome, int $idade, string $genero): Leitor {

        // Regra 1: gênero deve existir no Biblio Finder
        if (!array_key_exists($genero, $this->idadeMinima)) {
            throw new BusinessRuleException(
                "O gênero \"$genero\" não está disponível no Biblio Finder."
            );
        }

        // Regra 2: idade mínima para o gênero
        $minima = $this->idadeMinima[$genero];
        if ($idade < $minima) {
            throw new BusinessRuleException(
                "O gênero \"$genero\" é recomendado para leitores com pelo menos $minima anos. " .
                "$nome tem apenas $idade anos."
            );
        }

        // Regra 3: definir perfil automaticamente
        $perfil = $this->definirPerfil($idade);

        // Montar entidade
        $leitor                = new Leitor();
        $leitor->nome          = $nome;
        $leitor->idade         = $idade;
        $leitor->generoFavorito = $genero;
        $leitor->perfil        = $perfil;
        $leitor->badge         = $this->getBadge($perfil);

        // Salvar via repositório (sem SQL aqui!)
        $this->repositorio->save($leitor);

        echo "✅ [Service] Leitor cadastrado com sucesso.\n";

        return $leitor;
    }

    private function definirPerfil(int $idade): string {
        return match(true) {
            $idade <= 12 => 'Pequeno Leitor',
            $idade <= 16 => 'Leitor Jovem Talento',
            $idade <= 25 => 'Leitor Jovem',
            default      => 'Leitor Experiente',
        };
    }

    private function getBadge(string $perfil): string {
        return match($perfil) {
            'Pequeno Leitor'       => '🌟',
            'Leitor Jovem Talento' => '🎓',
            'Leitor Jovem'         => '📖',
            'Leitor Experiente'    => '🏆',
            default                => '📚',
        };
    }
}

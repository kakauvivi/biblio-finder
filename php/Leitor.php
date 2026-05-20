<?php

/**
 * Entidade Leitor — objeto simples com propriedades e métodos mágicos.
 * Não contém SQL nem regras de negócio.
 */
class Leitor {
    private array $dados = [];

    public function __set(string $prop, mixed $valor): void {
        $this->dados[$prop] = $valor;
    }

    public function __get(string $prop): mixed {
        return $this->dados[$prop] ?? null;
    }

    public function __isset(string $prop): bool {
        return isset($this->dados[$prop]);
    }

    public function toArray(): array {
        return $this->dados;
    }
}

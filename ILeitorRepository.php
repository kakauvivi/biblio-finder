<?php

/**
 * Contrato que todo repositório de Leitor deve seguir.
 * O Service depende desta interface, não da implementação concreta.
 */
interface ILeitorRepository {
    public function save(Leitor $leitor): void;
    public function find(int $id): ?Leitor;
    public function delete(int $id): void;
}

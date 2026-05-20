<?php

/**
 * Exceção personalizada para falhas nas regras de negócio do Biblio Finder.
 * Permite que o Controller diferencie erros de regra de erros técnicos.
 */
class BusinessRuleException extends RuntimeException {
    public function __construct(string $mensagem) {
        parent::__construct($mensagem);
    }
}

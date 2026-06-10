Projeto Recomendação de Livro
Documento: DRF-LIB001
Versão: 1.0
Status: Especificação Inicial
Autor: Analista de Requisitos (IA)

1. Contexto
Problema: A dificuldade de escolha diante da vasta quantidade de obras literárias disponíveis, o que gera a "paralisia de decisão" e pode desestimular o hábito da leitura.

Usuários: * Leitor Anônimo: Usuário que deseja recomendações rápidas sem vínculo de conta.

Leitor Cadastrado: Usuário que salva histórico, favoritados e possui perfil personalizado.

Administrador: (Opcional/Sistema) Responsável por monitorar integrações e métricas.

Valor: Otimização do tempo de escolha e incentivo à leitura através de uma curadoria personalizada baseada em estados emocionais e preferências específicas.

2. Requisitos Funcionais (RF)
RF01 - Questionário de Perfil Literário
Descrição: O sistema deve apresentar um formulário para identificar o gosto do usuário.
Regras:

Deve incluir perguntas sobre: Gênero favorito, temas favoritos, temas a evitar, autores preferidos, época da história, tipo de final (feliz/triste) e humor da história.

O preenchimento não deve ser obrigatório para quem optar pela busca manual.
Critério de Aceite:

[ ] Validar se pelo menos um gênero foi selecionado.

[ ] Permitir o envio dos dados para o motor de recomendação.

RF02 - Integração com Base Externa
Descrição: O sistema deve consumir dados de APIs externas (ex: Google Books) para buscar o acervo.
Regras:

Caso não haja correspondência exata, o sistema deve aplicar lógica de "proximidade" (fuzzy search).

O sistema deve buscar obrigatoriamente: Capa, Título, Sinopse, Avaliação e Gênero.
Critério de Aceite:

[ ] Exibir mensagem de erro amigável se a API estiver fora do ar.

RF03 - Exibição de Recomendações (Top 10)
Descrição: O sistema deve listar os 10 melhores resultados após o questionário ou busca.
Regras:

A listagem deve ser ordenada por relevância em relação ao questionário.
Critério de Aceite:

[ ] Limitar a exibição a exatamente 10 itens por consulta.

RF04 - Gestão de Histórico e Favoritos
Descrição: Permitir que usuários cadastrados gerenciem seus livros de interesse.
Regras:

Deve permitir marcar livros como "Favorito" ou "Já Lido".

Livros marcados como "Já lido" não devem aparecer em recomendações futuras, a menos que solicitado.
Critério de Aceite:

[ ] Botão de "favoritar" funcional na interface do card do livro.

RF05 - Busca Manual e Filtros
Descrição: O sistema deve oferecer uma barra de busca para pesquisas diretas.
Regras:

Permitir filtrar por nota (ex: apenas livros com nota > 4.5) e gênero.
Critério de Aceite:

[ ] Aplicar filtros em tempo real ou ao clicar em "buscar".

RF06 - Compartilhamento Social
Descrição: O sistema deve permitir compartilhar livros ou listas de recomendação.
Regras:

Deve gerar links compatíveis com WhatsApp e Instagram/Redes Sociais.
Critério de Aceite:

[ ] Botão de compartilhamento presente em cada sugestão do Top 10.

3. Regras de Negócio (RN)
RN01 (Acesso Híbrido): O usuário pode realizar o questionário sem estar logado, mas perde o histórico ao fechar a sessão.

RN02 (Lógica de Aproximação): Na ausência de um livro com o "humor" e "final" solicitado, o sistema deve priorizar o "Gênero" e "Temas favoritos" para a sugestão substituta.

RN03 (Unicidade de Conta): O cadastro de usuários deve ser validado por e-mail único.

4. Requisitos Não-Funcionais (RNF)
Usabilidade: A interface deve ser intuitiva para leitores iniciantes e experientes.

Performance: O tempo de resposta entre o fim do questionário e a exibição do Top 10 não deve exceder 3 segundos (dependente da API externa).

Disponibilidade: O sistema deve ser responsivo (funcionar bem em dispositivos móveis).

Este documento reflete todas as nossas definições. Gostaria que eu fizesse alguma alteração em algum requisito ou podemos prosseguir para a criação de um cronograma de desenvolvimento?

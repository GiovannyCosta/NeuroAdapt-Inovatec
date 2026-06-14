# Ludica+

Ludica+ e um prototipo em reconstrucao focado em duas frentes: jogos cognitivos simples e comunicacao aumentativa.

## Status

Esta etapa remove login, relatorios e conquistas da logica principal. Perfil e conquistas permanecem visiveis como modulos travados de homologacao.

## Modulos ativos

- Jogos: biblioteca inicial com atividades curtas e estado isolado por modulo.
- Comunicacao: prancha CAA com categorias, simbolos e montagem de frase.
- Tema: alternancia visual local entre modo calmo e modo vivo.

## Arquitetura atual

- `index.html`: estrutura principal da aplicacao.
- `src/css/base`: variaveis globais e reset.
- `src/css/components`: estilos separados por responsabilidade visual.
- `src/js/core`: utilitarios, roteamento e tema.
- `src/js/games`: logica orientada a objetos dos jogos.
- `src/js/communication`: logica orientada a objetos da comunicacao.

## Proximas migracoes

- Recriar os jogos antigos um por um em classes.
- Reativar conquistas depois que as regras de progresso forem definidas.
- Reativar perfil somente quando houver decisao sobre persistencia e login.

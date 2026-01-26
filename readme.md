# 🧠 NeuroAdapt: Ambiente Terapêutico Adaptativo

## 💡 NATUREZA DO PROJETO E AUTORIA

Este documento descreve o **NeuroAdapt**, um **PROTÓTIPO** funcional e uma **IDEIA** de aplicação web projetada para o desenvolvimento cognitivo, emocional e comunicativo de crianças.

| Detalhe              | Valor                          |
| :------------------- | :----------------------------- |
| **Status:**          | Protótipo / Ideia de Aplicação |
| **representante:**   | Giovanny                       |
| **Grupo de Estudo:** | ADS251N-01ZL                   |

---

## 🏆 DESTAQUE PRINCIPAL: RELATÓRIOS (SADU)

O **Sistema de Análise de Dados de Uso** é o coração pedagógico do NeuroAdapt. Diferente de um simples contador de pontos, ele rastreia padrões e gera insights acionáveis para o adulto (pais ou terapeutas).

| Métrica                     | Análise                                                                                                                                                  |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Histórico Emocional**     | Registra a frequência de uso de cada emoção (positivo/negativo), gerando um gráfico de tendência.                                                        |
| **Tempo de Foco**           | Mede o tempo gasto em cada jogo para avaliar o engajamento e a tolerância a tarefas.                                                                     |
| **Comunicação**             | Rastreia os pictogramas e comandos mais utilizados ("Eu Quero", "Ajuda"), identificando intenções predominantes.                                         |
| **Insights Personalizados** | Sugere intervenções específicas (ex: "Focar em sons de baixa frequência" ou "Reforçar pedidos de Ajuda") com base nos dados de acerto e erro do usuário. |

---

## 🎮 FUNCIONALIDADES DETALHADAS

### 1. Biblioteca de Jogos Cognitivos

O módulo de jogos utiliza a lógica de jornadas (roadmaps) para medir e guiar o progresso.

- **Estrutura de Nível:** As fases são lineares (Fase 1 a Fase 5) com dificuldade crescente (aumentando de 3 para 6 tipos de itens diferentes no grid). O avanço é **automático** (linear) e o Popup de Jornada Completa aparece apenas no final da Fase 5.
- **Grades de Jogo:** O Gameplay utiliza um Grid **3 Colunas x 2 Linhas** (6 slots).
- **Pontuação de Precisão:** O placar é incrementado a cada **acerto individual** (+1 por peça).
- **Jornadas Temáticas:**
  - **Combine as Formas:** Inclui temas puros como **Safari Selvagem**, **Fazenda Feliz**, **Fundo do Mar** e **Salada Mista** (Frutas).
- **Módulos de Prática:** O **Modo Livre** e o **Modo Aleatório** utilizam o banco de itens da jornada selecionada em um **loop infinito**, ideal para prática de exposição.

### 2. Comunicação Aumentativa (CAA)

A seção de Comunicação é um sistema completo, focado em expressão e regulação emocional.

- **Símbolos e Frases:** Grade de pictogramas que utiliza a **Cor de Fitzgerald** para categorizar e construir frases faladas.
- **Explorador de Emoções:** Tabela detalhada de 15 emoções (Alegria, Raiva, Ciúmes, etc.) com **Estratégias de Coping** (o que fazer).
- **Guia de Apoio:** Acesso direto à tela de **Apoio para o Adulto**, que fornece um roteiro de perguntas para estimular o diálogo após o usuário registrar um sentimento.

### 3. Sistema de Perfil e Persistência

- **Login e Conta:** O sistema de login é simulado e persiste o nome do usuário, que é exibido dinamicamente como o título principal (`Olá, [Nome]`).
- **Avatar Customizável:** O usuário pode escolher seu ícone de perfil entre: cores sólidas ou **emojis de conquistas desbloqueadas**.
- **Estatísticas Globais:** A Biblioteca de Jogos exibe o Total Global de **Estrelas** (recompensa por jornada) e **Mapas** (recompensa por completar MetaGames).

---

### 4. regras de modulação

| Modo            | Características                                                         | Interação no Jogo                                                      |
| :-------------- | :---------------------------------------------------------------------- | :--------------------------------------------------------------------- |
| **Calmo**       | Cores pastéis (`var(--game-red)` suave), baixo contraste, sem vibração. | Interação por **CLIQUE** (toque para selecionar, toque para encaixar). |
| **Estimulante** | Cores vivas, alto contraste, explosões de confete e vibração tátil.     | Interação por **ARRASTO** (Drag & Drop).                               |

---

## 🛠️ ARQUITETURA E TECNOLOGIA

O projeto foi construído para ser leve, rápido e modular.

- **Tecnologias:** JavaScript (ES6+), HTML5, Tailwind CSS.
- **Adaptação Visual:** O sistema utiliza **Media Queries** para transicionar da Simulação Desktop (Fundo Escuro) para a experiência **Full Screen** em dispositivos móveis.
- **Persistência de Dados:** O `localStorage` é a base para o gerenciamento de sessões, progresso de jogos e customização.

---

[Acesse](https://neuroadapt-ads.netlify.app/)

---

| :-------------- | :---------------------------------------------------------------------- | :--------------------------------------------------------------------- |

## Com amor ❤️ - `Pepita Pepis`

⠀⠀⠀⠀⢠⡶⠚⢷⣤⡀⠀⠀⠀⠀⠀⣲⡶⠛⠻⣆⠀⠀
⠀⠀⠀⢠⡿⠁⠀⠀⠙⣷⣄⠀⢀⣴⡟⠁⠀⠀⢷⢹⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣾⠃⠀⠠⠶⠚⠛⠛⠛⠛⠋⠀⠀⣀⡀⢸⠈⣿
⠀⠀⢸⣏⡔⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠚⠉⠉⣿⠀⢹⠀
⠀⠀⢾⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢠⣿⢠⣶⡆⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀
⢒⡾⠁⠘⠟⠁⠀⠀⠀⠀⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀
⠉⣧⠀⠀⠀⠀⠃⠀⠀⠀⠈⠉⠠⣍⠀⠀⠀⠀⠀⠀⣸⡇⢀⣤⠶⠛⠛⠻⢦⣄
⠀⠸⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⡟⣴⠟⠁⠀⠀⠀⠀⠀⢻
⠀⠀⠀⠛⣷⡦⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⡴⠞⠋⢠⡟⠀⠀⠀⠀⠀⠀⢀⡾
⠀⠀⠀⢰⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠳⣤⡀⢸⠃⠀⠀⠀⠀⢠⡶⠟⠁
⠀⠀⠀⣸⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢷⣹⡄⠀⠀⠀⠀⣼⠀⠀⠀
⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣇⠀⠀⠀⠀⢹⡄⠀⠀
⠀⠀⠀⢸⡀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⡄⠀⠀⠀⠈⣧⠀⠀
⠀⠀⠀⢸⡇⠘⡇⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⢸⣿⠀⠀⠀⠀⢹⡇⠀
⠀⠀⠀⢸⡇⠀⠙⠀⠀⠀⠀⠀⢠⠞⠁⠀⠀⠀⠀⠀⠀⠀⣿⠇⠀⠀⠀⢸⡇⠀
⠀⠀⠀⢸⡇⠀⢸⡆⠀⠀⠀⠀⣟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠀⠀⠀⠀⣸⠇⠀
⠀⠀⠀⢸⣿⠀⠀⡇⠀⠀⠀⠀⣿⡀⠀⠀⠀⠀⠀⠀⠀⢀⡇⠀⠀⢀⣴⡟⠁⠀
⠀⠀⠀⠘⠿⠶⢶⢧⣦⣦⡴⢾⣥⣽⣤⣤⣤⣤⣤⣤⡴⣯⡤⠴⠶⠛⠋


| :-------------- | :---------------------------------------------------------------------- | :--------------------------------------------------------------------- |

# 😈 FormHell - O Cadastro Impossível

> **Projeto submetido para o Hackathon IFRO 2026**

Gabriel
Kauê Rian Silva Conceição Oliveira

O **FormHell** é uma aplicação interativa que subverte propositalmente todas as regras e boas práticas de UX/UI para criar a pior experiência de usuário possível. O objetivo é pedagógico: ao sentir na pele as frustrações geradas por uma interface hostil, desenvolvedores e designers aprendem a importância da empatia e do design centrado no usuário.

## 🎯 1. O Problema (Contexto Pedagógico)
A criação de interfaces costuma focar no "caminho feliz". No entanto, sistemas com usabilidade falha são a principal causa de abandono de carrinhos, cadastros incompletos e frustração do usuário. Muitas vezes, esses problemas surgem de pequenas decisões de design (como falta de feedback claro ou formulários excessivamente rígidos). O desafio pedagógico é tangibilizar essas dores para demonstrar que a usabilidade não é apenas um detalhe, mas o núcleo de um produto viável.

## 💡 2. A Solução (FormHell)
Nós criamos o **FormHell**, um fluxo de cadastro estruturado em 5 etapas principais que intencionalmente bombardeiam o usuário com anti-patterns e obstáculos cognitivos:
1. **Landing Page:** Falsa sensação de urgência com um cronômetro falso e links minúsculos escondidos.
2. **Dados Pessoais:** Máscaras que não ajudam, labels trocadas, exclusão de caracteres válidos e dropdowns enormes e desordenados.
3. **Senha e Segurança:** Validação de senha através de requisitos absurdos (como conter um número romano e somar um número primo), com o campo mudando de lugar.
4. **Preferências:** Checkboxes que desmarcam os outros, botões que invertem funções e carrosséis impossíveis de clicar.
5. **Confirmação e CAPTCHA:** Um botão que foge do cursor, e um CAPTCHA falso que acusa erro mesmo quando a resposta está correta.

A gamificação do projeto ocorre através de um timer que registra o tempo de sofrimento. Ao final, o usuário entra para o **Ranking de Sobreviventes**.

## 🔗 3. Link do MVP (Deploy)
*Acesse e tente sobreviver:*
👉 **https://hackathon2026.pages.dev/**

Página do Ranking: **https://hackathon2026.pages.dev/ranking**  
Versão Corrigida: **https://hackathon2026.pages.dev/corrigido**

## 🎤 4. Pitch (Apresentação)
👉 **[]**

## 🤖 5. Uso de IA
Declaramos o uso das seguintes ferramentas de Inteligência Artificial durante o desenvolvimento deste projeto:
- **Assistente de IA:** Google Gemini / Antigravity Agent
- **Propósito:** Auxílio na estruturação de testes TDD (Jest), implementação de lógicas complexas de validação matemática de senhas (ex: somatória que resulta em números primos), otimização de React Hooks, estilização Tailwind e revisão de anti-patterns de código.

## 🛑 6. Princípios de UX/UI Violados

| Heurística (Nielsen / Outros) | Como foi violada no FormHell |
| :--- | :--- |
| **1. Visibilidade do estado do sistema** | Barra de força da senha sempre mostra "Fraca". Tempo de carregamento troll (vai até 99% e volta pra 42%). |
| **2. Correspondência com o mundo real** | Botão verde desliga, vermelho liga. "Confirmar" na verdade Cancela, e "Cancelar" Confirma no modal de atenção. |
| **3. Controle e liberdade do usuário** | O pop-up de cookies não pode ser fechado e o botão de aceitar foge. |
| **4. Consistência e padrões** | Campos "Nome" pedindo e-mail e vice-versa. Formatos obrigatórios arbitrários (AAAA/DD/MM). |
| **5. Prevenção de erros** | Ausência total de máscaras adequadas; o usuário só descobre o erro na submissão. |
| **6. Reconhecimento em vez de recordação** | Requisitos da senha vão surgindo um de cada vez; confirmação de senha exige digitar *de trás para frente*. |
| **7. Flexibilidade e eficiência de uso** | Telefone exigindo texto por extenso ("nove nove..."). Dropdowns não possuem atalhos de digitação. |
| **8. Estética e design minimalista** | Poluição visual completa com cores neons agressivas, fontes mistas (Comic Sans) e botões desalinhados. |
| **9. Ajudar o usuário a reconhecer e recuperar erros** | Mensagens de erro vagas como "Algo deu errado em algum lugar", sem foco no campo que falhou. |
| **10. Ajuda e documentação** | Link "clique aqui" minúsculo contrastando com o gigantesco "NÃO OBRIGADO". |
| **Lei de Fitts** | O botão de submissão final "foge" do clique do mouse, dificultando o acionamento em áreas menores. |
| **Carga Cognitiva** | O cronômetro de inatividade apaga tudo o que foi escrito silenciosamente se o usuário demorar. |

## 🛠️ 7. Proposta de Melhoria (A "Redenção")
Junto com o caos, implementamos a cura. Criamos a rota **`/corrigido`** onde apresentamos o formulário como ele *deveria* ser. 

Essa versão demonstra o bom uso das heurísticas, contendo validações em tempo real com mensagens de erro nos campos adequados, acessibilidade e formatação apropriada. Na página também apresentamos cards laterais explicando os problemas técnicos lado a lado com a abordagem limpa.

---

### Instalação (Rodar localmente)
```bash
git clone https://github.com/KaueRian/hackathon2026.git
cd hackathon2026
npm install
npm run dev
```

> Feito com ódio (brincadeira, foi com 💖) para o Hackathon IFRO 2026.

# 📋 Tarefas — FormHell (Hackathon IFRO 2026)

> **Prazo:** 19/06/2026 às 23h59
> **Legenda:** `[ ]` pendente · `[/]` em andamento · `[x]` concluído

---

## Fase 1 — Setup do Projeto

- [x] Inicializar Next.js 15 com App Router, TypeScript, Tailwind CSS 4, ESLint, src dir
  ```bash
  npx -y create-next-app@latest ./ --typescript --tailwind --app --eslint --src-dir --import-alias "@/*" --use-npm
  ```
- [x] Instalar dependências adicionais
  ```bash
  npm install @supabase/supabase-js framer-motion lucide-react
  ```
- [x] Instalar adapter Cloudflare Pages (se necessário)
  ```bash
  npm install @cloudflare/next-on-pages
  ```
- [X] Criar arquivo `.env.local` com variáveis do Supabase
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Criar estrutura de pastas conforme PRD (`components/`, `lib/`, `hooks/`, `public/images/`, `public/sounds/`)

---

## Fase 2 — Infraestrutura & Utilitários

### Lib
- [x] `src/lib/supabase.ts` — Cliente Supabase configurado com variáveis de ambiente
- [x] `src/lib/sessionStore.ts` — Estado global do progresso do usuário (persiste em `sessionStorage`)
  - Armazenar: dados pessoais, senha, preferências, timestamp de início
  - Funções: `startSession()`, `saveStepData()`, `getSessionData()`, `clearSession()`
- [x] `src/lib/uxViolations.ts` — Catálogo de todas as violações de UX para documentação/exibição

### Hooks
- [x] `src/hooks/useTimer.ts` — Cronômetro que inicia na Landing e para na tela Parabéns (formato MM:SS)
- [x] `src/hooks/useFormState.ts` — Hook genérico para gerenciar estado dos formulários por página

### Layout Raiz
- [x] `src/app/layout.tsx` — Layout raiz com:
  - Cursor customizado aplicado globalmente
  - Meta tags SEO (title, description)
  - Importação de fontes (Google Fonts — algo feio/inconsistente de propósito)
  - Provider do sessionStore

### CSS Global
- [x] `src/app/globals.css` — Tema visual "horrível" mas funcional
  - Cores berrantes, gradientes agressivos
  - Cursor customizado (`cursor: url(...)`)
  - Animações CSS (piscar, tremer, girar)
  - Fontes misturadas (Comic Sans, Papyrus, etc.)

---

## Fase 3 — Componentes Reutilizáveis
## Fase 3 — Componentes Reutilizáveis (Trolls)

- [x] `CustomCursor.tsx` — Cursor customizado (emoji ou mão invertida) (Feito via CSS Global)
- [x] `CookiePopup.tsx` — Banner gigante que cobre 80% da tela, botão "Aceitar" foge do mouse
- [x] `FakeTimer.tsx` — Cronômetro falso que mostra "Tempo Esgotado" ou conta negativo
- [x] `CrazyPassword.tsx` — Input de senha que substitui caracteres por emojis ou símbolos aleatórios
- [x] `InvertedToggle.tsx` — Toggle onde "Verde" é Desligado e "Vermelho" é Ligado (com label confusa)
- [x] `SpinningCarousel.tsx` — Carrossel que gira muito rápido para selecionar opções
- [x] `FakeCaptcha.tsx` — Captcha impossível (ex: "Selecione todos os hidrantes" mas a imagem muda)
- [x] `RunawayButton.tsx` — Botão genérico que foge do hover (usa posição absolute + Math.random)
- [x] `ProgressBarTroll.tsx` — Barra de progresso que chega a 99% e volta pra 50%
- [x] `Confetti.tsx` — Partículas caindo, mas são ícones de "Erro" ou 💩
- [x] `Ranking.tsx` — Lista de placar consumindo do Supabase (com nomes embaralhados ou de cabeça pra baixo)

---

## Fase 4 — Tela 0: Landing Page (`src/app/page.tsx`)

- [x] Botão gigante "NÃO, OBRIGADO" que é decorativo / não leva a lugar nenhum
- [x] Link real "clique aqui" quase imperceptível (texto minúsculo, cor próxima ao fundo)
- [x] Integrar componente `FakeTimer` (urgência artificial)
- [x] Integrar componente `CookiePopup` (pop-up inescapável)
- [x] Cursor customizado ativo
- [x] Visual chamativo mas confuso (cores berrantes, animações)
- [x] Ao clicar no link real → navegar para `/dados-pessoais` e iniciar cronômetro

### Princípios violados nesta tela:
- Affordance, Visibilidade, Dark Pattern (urgência), Controle do usuário

---

## Fase 5 — Tela 1: Dados Pessoais (`src/app/dados-pessoais/page.tsx`)

- [x] Labels trocadas: campo "Email" pede o nome, campo "Nome" pede o email
- [x] Placeholder que desaparece ao focar, sem label visível (viola WCAG)
- [x] Validação absurda do nome: não aceita espaços ("nomes devem ser sem espaços")
- [x] Validação absurda do email: exige `$` junto do `@`
- [x] Campo "Data de Nascimento" como texto livre, aceita apenas formato `AAAA/DD/MM`
- [x] Dropdown de gênero com 50+ opções absurdas e fora de ordem alfabética
- [x] Campo de telefone que aceita apenas números por extenso ("seis nove nove...")
- [x] Mensagens de erro vagas: "Algo deu errado em algum lugar" sem indicar campo
- [x] Autocomplete do navegador bloqueado via atributos HTML (`autocomplete="off"`)
- [x] Botão "Próximo" desabilitado até rolar a página até o final (sem indicação)
- [ ] Teclado virtual customizado sobrepondo o formulário (em desktop) — *opcional, se der tempo*
- [x] Ao validar tudo → navegar para `/senha`

### Princípios violados nesta tela:
- Mapeamento, Feedback, Flexibilidade, Prevenção de erros, Acessibilidade

---

## Fase 6 — Tela 2: Senha & Segurança (`src/app/senha/page.tsx`)

- [x] Integrar componente `CrazyPassword` com requisitos revelados um por vez:
  - Mínimo 12 caracteres
  - Deve conter emoji 🔥
  - Deve conter número romano (I, V, X...)
  - Não pode ter letras consecutivas do alfabeto ("ab", "cd")
  - Exatamente 2 letras maiúsculas (nem mais, nem menos)
  - Soma dos dígitos deve ser número primo
- [x] Campo de confirmação de senha: digitar de trás para frente
- [x] Botão "Mostrar Senha" que na verdade esconde mais (troca por asteriscos maiores)
- [x] Barra de força sempre mostra "fraca" mesmo atendendo todos os requisitos
- [x] Pergunta de segurança com opções absurdas ("Qual o nome do seu peixe que você não teve?")
- [x] Timer de inatividade de 10 segundos que limpa o campo de senha (sem aviso)
- [x] Campo de senha muda de lugar a cada 15 segundos (scroll suave)
- [x] Testes TDD e correção de bugs ESLint / React Hooks na validação
- [x] Ao validar tudo → navegar para `/preferencias`

### Princípios violados nesta tela:
- Carga cognitiva, Consistência, Flexibilidade, Controle/liberdade, Padrões reconhecíveis

---

## Fase 7 — Tela 3: Preferências (`src/app/preferencias/page.tsx`)

- [x] "Selecione suas cores favoritas" usando sliders (Odeia → Ama) ao invés de checkboxes
- [x] Integrar componente `InvertedToggle` (ON = desligado visualmente)
- [x] Dropdown que abre para cima, saindo da tela
- [x] Scroll horizontal obrigatório em lista vertical
- [x] Botão "Selecionar Todos" que na verdade deseleciona todos
- [x] Termos de uso em Lorem Ipsum, checkbox "Li e aceito" começa marcado e desmarca ao clicar
- [x] Campo de avaliação por estrelas invertido (1★ = melhor, 5★ = pior)
- [x] Integrar componente `SpinningCarousel` para escolha de avatar
- [x] Radio buttons que permitem selecionar múltiplos (parecem radios mas são checkboxes)
- [x] Pergunta "Você concorda?" com botões "Sim" e "Absolutamente Sim" (sem opção de não)
- [x] Ao completar → navegar para `/confirmacao`

### Princípios violados nesta tela:
- Consistência com padrões, Controle do usuário, Transparência, Escolha genuína, Mapeamento natural

---

## Fase 8 — Tela 4: Confirmação & Captcha (`src/app/confirmacao/page.tsx`)

- [x] Integrar `FakeCaptcha` — Imagem com cálculo matemático mas pede "digite as letras"
- [x] Integrar `RunawayButton` — Botão "Confirmar Cadastro" que foge do cursor
- [x] Resumo dos dados preenchidos... mas todos errados/trocados ("Seu nome: [mostra o email]")
- [x] Checkbox "Aceito receber 847 emails por dia" já vem marcado
- [x] Ao clicar "Confirmar": integrar `ProgressBarTroll` (loading 5-8s, vai até 99%, volta pra 42%)
- [x] Pop-up "Tem certeza?" com botões invertidos ("Cancelar" confirma, "OK" cancela)
- [x] Se errar CAPTCHA: mostra mensagem de susto "Todos os campos resetados!" mas na verdade não reseta
- [x] Ao confirmar com sucesso → navegar para `/parabens`

### Princípios violados nesta tela:
- Lei de Fitts, Feedback honesto, Consistência de labels, Misericórdia/Perdão, Integridade dos dados

---

## Fase 9 — Tela 5: Parabéns! (`src/app/parabens/page.tsx`)

- [x] Integrar componente `Confetti` — Animação de confetes 🎉
- [x] Mensagem principal: **"Parabéns, você chegou ao final da pior experiência de usuário!"**
- [x] Exibir timer com tempo total que o usuário levou
- [x] Pedir nickname para o ranking
- [x] Salvar sessão (tempo + nickname) no Supabase ou localStorage
- [x] Integrar componente `Ranking` — Tabela com os melhores tempos (tempo real)
- [x] Botão "Tentar Novamente" (reseta sessão e volta pra Landing)
- [x] Link para a versão corrigida (`/corrigido`)

---

## Fase 10 — Versão Corrigida (`src/app/corrigido/page.tsx`)

> **Vale 10 pontos!** — "Proposta de melhoria ou versão corrigida do fluxo"

- [x] Criar formulário de cadastro simplificado com UX correta
  - Labels claras e associadas aos campos
  - Validação em tempo real com mensagens específicas
  - Formatos padrão (email, data DD/MM/AAAA, telefone com máscara)
  - Requisitos de senha visíveis desde o início
  - Feedback visual adequado (cores, ícones)
  - Acessibilidade (ARIA labels, tab order, contraste)
  - Botões com texto claro e posicionamento correto
- [x] Explicação lado a lado: "O que estava errado" vs "Como deveria ser"
- [x] Design limpo e profissional

---

## Fase 11 — Supabase (Backend)

- [x] Criar projeto no Supabase (se ainda não existir)
- [x] Criar tabela `sessions` com SQL do PRD:
  ```sql
  CREATE TABLE sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nickname TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [x] Configurar RLS (Row Level Security):
  ```sql
  ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Anyone can insert" ON sessions FOR INSERT WITH CHECK (true);
  CREATE POLICY "Anyone can read" ON sessions FOR SELECT USING (true);
  CREATE POLICY "Anyone can update own" ON sessions FOR UPDATE USING (true);
  ```
- [x] Copiar credenciais para `.env.local`
- [x] Testar insert e select do ranking
- [x] Criar página pública `/ranking` para exibir o tempo de todos os usuários

---

## Fase 12 — README Completo (conforme Anexo II do Edital)

- [x] Preencher seção **Problema** (contexto pedagógico)
- [x] Preencher seção **Solução** (descrição do FormHell e fluxo)
- [x] Confirmar **Link do MVP** (URL de deploy)
- [x] Preencher seção **Pitch** (link dos slides)
- [x] Preencher seção **Uso de IA** (declaração das ferramentas usadas)
- [x] Preencher seção **Princípios de UX/UI Violados** (tabela completa das 10 heurísticas de Nielsen + outros)
- [x] Preencher seção **Proposta de Melhoria** (link para `/corrigido`)
- [x] Preencher seção **Validação** (testes com colegas, tempo médio, feedbacks)

---

## Fase 13 — Deploy

- [ ] Conectar repositório GitHub ao Cloudflare Pages (ou Vercel como fallback)
- [ ] Configurar variáveis de ambiente no serviço de deploy
- [ ] Build command: `npx next build`
- [ ] Verificar URL pública funcionando
- [ ] Gerar QR Code para o link público
- [ ] Testar acesso via QR Code no celular

---

## Fase 14 — Testes & Verificação Final

- [ ] `npm run build` compila sem erros
- [ ] Fluxo completo funcional: Landing → Dados → Senha → Preferências → Confirmação → Parabéns
- [ ] Todos os anti-patterns funcionando corretamente em cada tela
- [ ] Ranking salvando e exibindo tempos
- [ ] Versão corrigida (`/corrigido`) funcionando
- [ ] Responsivo em mobile (dinâmica do evento usa QR Code)
- [ ] Testar com colegas e coletar feedback
- [ ] Commit final e push para `main` antes de 19/06 23h59

---

## Fase 15 — Apresentação (20-26/06)

- [ ] Preparar slides para o pitch (26/06)
- [ ] Ensaiar demonstração ao vivo
- [ ] Preparar defesa dos princípios de UX violados
- [ ] Teste final da dinâmica com QR Code + ranking

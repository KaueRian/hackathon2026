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
- [ ] Criar arquivo `.env.local` com variáveis do Supabase
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Criar estrutura de pastas conforme PRD (`components/`, `lib/`, `hooks/`, `public/images/`, `public/sounds/`)

---

## Fase 2 — Infraestrutura & Utilitários

### Lib
- [ ] `src/lib/supabase.ts` — Cliente Supabase configurado com variáveis de ambiente
- [ ] `src/lib/sessionStore.ts` — Estado global do progresso do usuário (persiste em `sessionStorage`)
  - Armazenar: dados pessoais, senha, preferências, timestamp de início
  - Funções: `startSession()`, `saveStepData()`, `getSessionData()`, `clearSession()`
- [ ] `src/lib/uxViolations.ts` — Catálogo de todas as violações de UX para documentação/exibição

### Hooks
- [ ] `src/hooks/useTimer.ts` — Cronômetro que inicia na Landing e para na tela Parabéns (formato MM:SS)
- [ ] `src/hooks/useFormState.ts` — Hook genérico para gerenciar estado dos formulários por página

### Layout Raiz
- [ ] `src/app/layout.tsx` — Layout raiz com:
  - Cursor customizado aplicado globalmente
  - Meta tags SEO (title, description)
  - Importação de fontes (Google Fonts — algo feio/inconsistente de propósito)
  - Provider do sessionStore

### CSS Global
- [ ] `src/app/globals.css` — Tema visual "horrível" mas funcional
  - Cores berrantes, gradientes agressivos
  - Cursor customizado (`cursor: url(...)`)
  - Animações CSS (piscar, tremer, girar)
  - Fontes misturadas (Comic Sans, Papyrus, etc.)

---

## Fase 3 — Componentes Reutilizáveis

- [ ] `src/components/CustomCursor.tsx` — Cursor customizado (emoji 🖕 ou mão invertida)
- [ ] `src/components/CookiePopup.tsx` — Pop-up de cookies abusivo
  - Cobre metade da tela com texto enorme
  - Botão "Rejeitar" fecha e reabre o pop-up
  - Botão "Aceitar" escondido/minúsculo
- [ ] `src/components/FakeTimer.tsx` — Timer regressivo falso (urgência artificial)
- [ ] `src/components/CrazyPassword.tsx` — Campo de senha com regras absurdas
  - Requisitos revelados um por vez (emoji 🔥, número romano, primo, etc.)
  - Barra de força da senha que mostra "fraca" sempre
- [ ] `src/components/InvertedToggle.tsx` — Toggle switch que funciona invertido (ON = off)
- [ ] `src/components/SpinningCarousel.tsx` — Carousel de avatares que gira rápido demais
- [ ] `src/components/FakeCaptcha.tsx` — CAPTCHA com imagem de cálculo mas pede "letras"
- [ ] `src/components/RunawayButton.tsx` — Botão "Confirmar" que foge do cursor (Lei de Fitts)
- [ ] `src/components/ProgressBarTroll.tsx` — Barra de progresso que vai até 99% e volta pra 42%
- [ ] `src/components/Confetti.tsx` — Animação de confetes na tela final (canvas ou CSS)
- [ ] `src/components/Ranking.tsx` — Tabela de ranking em tempo real (Supabase Realtime ou localStorage)

---

## Fase 4 — Tela 0: Landing Page (`src/app/page.tsx`)

- [ ] Botão gigante "NÃO, OBRIGADO" que é decorativo / não leva a lugar nenhum
- [ ] Link real "clique aqui" quase imperceptível (texto minúsculo, cor próxima ao fundo)
- [ ] Integrar componente `FakeTimer` (urgência artificial)
- [ ] Integrar componente `CookiePopup` (pop-up inescapável)
- [ ] Cursor customizado ativo
- [ ] Visual chamativo mas confuso (cores berrantes, animações)
- [ ] Ao clicar no link real → navegar para `/dados-pessoais` e iniciar cronômetro

### Princípios violados nesta tela:
- Affordance, Visibilidade, Dark Pattern (urgência), Controle do usuário

---

## Fase 5 — Tela 1: Dados Pessoais (`src/app/dados-pessoais/page.tsx`)

- [ ] Labels trocadas: campo "Email" pede o nome, campo "Nome" pede o email
- [ ] Placeholder que desaparece ao focar, sem label visível (viola WCAG)
- [ ] Validação absurda do nome: não aceita espaços ("nomes devem ser sem espaços")
- [ ] Validação absurda do email: exige `$` junto do `@`
- [ ] Campo "Data de Nascimento" como texto livre, aceita apenas formato `AAAA/DD/MM`
- [ ] Dropdown de gênero com 50+ opções absurdas e fora de ordem alfabética
- [ ] Campo de telefone que aceita apenas números por extenso ("seis nove nove...")
- [ ] Mensagens de erro vagas: "Algo deu errado em algum lugar" sem indicar campo
- [ ] Autocomplete do navegador bloqueado via atributos HTML (`autocomplete="off"`)
- [ ] Botão "Próximo" desabilitado até rolar a página até o final (sem indicação)
- [ ] Teclado virtual customizado sobrepondo o formulário (em desktop) — *opcional, se der tempo*
- [ ] Ao validar tudo → navegar para `/senha`

### Princípios violados nesta tela:
- Mapeamento, Feedback, Flexibilidade, Prevenção de erros, Acessibilidade

---

## Fase 6 — Tela 2: Senha & Segurança (`src/app/senha/page.tsx`)

- [ ] Integrar componente `CrazyPassword` com requisitos revelados um por vez:
  - Mínimo 12 caracteres
  - Deve conter emoji 🔥
  - Deve conter número romano (I, V, X...)
  - Não pode ter letras consecutivas do alfabeto ("ab", "cd")
  - Exatamente 2 letras maiúsculas (nem mais, nem menos)
  - Soma dos dígitos deve ser número primo
- [ ] Campo de confirmação de senha: digitar de trás para frente
- [ ] Botão "Mostrar Senha" que na verdade esconde mais (troca por asteriscos maiores)
- [ ] Barra de força sempre mostra "fraca" mesmo atendendo todos os requisitos
- [ ] Pergunta de segurança com opções absurdas ("Qual o nome do seu peixe que você não teve?")
- [ ] Timer de inatividade de 10 segundos que limpa o campo de senha (sem aviso)
- [ ] Campo de senha muda de lugar a cada 15 segundos (scroll suave)
- [ ] Ao validar tudo → navegar para `/preferencias`

### Princípios violados nesta tela:
- Carga cognitiva, Consistência, Flexibilidade, Controle/liberdade, Padrões reconhecíveis

---

## Fase 7 — Tela 3: Preferências (`src/app/preferencias/page.tsx`)

- [ ] "Selecione suas cores favoritas" usando sliders (Odeia → Ama) ao invés de checkboxes
- [ ] Integrar componente `InvertedToggle` (ON = desligado visualmente)
- [ ] Dropdown que abre para cima, saindo da tela
- [ ] Scroll horizontal obrigatório em lista vertical
- [ ] Botão "Selecionar Todos" que na verdade deseleciona todos
- [ ] Termos de uso em Lorem Ipsum, checkbox "Li e aceito" começa marcado e desmarca ao clicar
- [ ] Campo de avaliação por estrelas invertido (1★ = melhor, 5★ = pior)
- [ ] Integrar componente `SpinningCarousel` para escolha de avatar
- [ ] Radio buttons que permitem selecionar múltiplos (parecem radios mas são checkboxes)
- [ ] Pergunta "Você concorda?" com botões "Sim" e "Absolutamente Sim" (sem opção de não)
- [ ] Ao completar → navegar para `/confirmacao`

### Princípios violados nesta tela:
- Consistência com padrões, Controle do usuário, Transparência, Escolha genuína, Mapeamento natural

---

## Fase 8 — Tela 4: Confirmação & Captcha (`src/app/confirmacao/page.tsx`)

- [ ] Integrar `FakeCaptcha` — Imagem com cálculo matemático mas pede "digite as letras"
- [ ] Integrar `RunawayButton` — Botão "Confirmar Cadastro" que foge do cursor
- [ ] Resumo dos dados preenchidos... mas todos errados/trocados ("Seu nome: [mostra o email]")
- [ ] Checkbox "Aceito receber 847 emails por dia" já vem marcado
- [ ] Ao clicar "Confirmar": integrar `ProgressBarTroll` (loading 5-8s, vai até 99%, volta pra 42%)
- [ ] Pop-up "Tem certeza?" com botões invertidos ("Cancelar" confirma, "OK" cancela)
- [ ] Se errar CAPTCHA: mostra mensagem de susto "Todos os campos resetados!" mas na verdade não reseta
- [ ] Ao confirmar com sucesso → navegar para `/parabens`

### Princípios violados nesta tela:
- Lei de Fitts, Feedback honesto, Consistência de labels, Misericórdia/Perdão, Integridade dos dados

---

## Fase 9 — Tela 5: Parabéns! (`src/app/parabens/page.tsx`)

- [ ] Integrar componente `Confetti` — Animação de confetes 🎉
- [ ] Mensagem principal: **"Parabéns, você chegou ao final da pior experiência de usuário!"**
- [ ] Exibir timer com tempo total que o usuário levou
- [ ] Pedir nickname para o ranking
- [ ] Salvar sessão (tempo + nickname) no Supabase ou localStorage
- [ ] Integrar componente `Ranking` — Tabela com os melhores tempos (tempo real)
- [ ] Botão "Tentar Novamente" (reseta sessão e volta pra Landing)
- [ ] Link para a versão corrigida (`/corrigido`)

---

## Fase 10 — Versão Corrigida (`src/app/corrigido/page.tsx`)

> **Vale 10 pontos!** — "Proposta de melhoria ou versão corrigida do fluxo"

- [ ] Criar formulário de cadastro simplificado com UX correta
  - Labels claras e associadas aos campos
  - Validação em tempo real com mensagens específicas
  - Formatos padrão (email, data DD/MM/AAAA, telefone com máscara)
  - Requisitos de senha visíveis desde o início
  - Feedback visual adequado (cores, ícones)
  - Acessibilidade (ARIA labels, tab order, contraste)
  - Botões com texto claro e posicionamento correto
- [ ] Explicação lado a lado: "O que estava errado" vs "Como deveria ser"
- [ ] Design limpo e profissional

---

## Fase 11 — Supabase (Backend)

- [ ] Criar projeto no Supabase (se ainda não existir)
- [ ] Criar tabela `sessions` com SQL do PRD:
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
- [ ] Configurar RLS (Row Level Security):
  ```sql
  ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Anyone can insert" ON sessions FOR INSERT WITH CHECK (true);
  CREATE POLICY "Anyone can read" ON sessions FOR SELECT USING (true);
  CREATE POLICY "Anyone can update own" ON sessions FOR UPDATE USING (true);
  ```
- [ ] Copiar credenciais para `.env.local`
- [ ] Testar insert e select do ranking

---

## Fase 12 — README Completo (conforme Anexo II do Edital)

- [ ] Preencher seção **Problema** (contexto pedagógico)
- [ ] Preencher seção **Solução** (descrição do FormHell e fluxo)
- [ ] Confirmar **Link do MVP** (URL de deploy)
- [ ] Preencher seção **Pitch** (link dos slides)
- [ ] Preencher seção **Uso de IA** (declaração das ferramentas usadas)
- [ ] Preencher seção **Princípios de UX/UI Violados** (tabela completa das 10 heurísticas de Nielsen + outros)
- [ ] Preencher seção **Proposta de Melhoria** (link para `/corrigido`)
- [ ] Preencher seção **Validação** (testes com colegas, tempo médio, feedbacks)

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

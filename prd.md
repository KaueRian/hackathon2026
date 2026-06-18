# 🏆 PRD — Projeto Hackathon IFRO Ariquemes 2026/1
## Desafio: Pior Experiência de Usuário

---

## 📋 Dados do Projeto

| Campo | Valor |
|---|---|
| **Hackathon** | Hackathon Extensionista IFRO Ariquemes 2026/1 |
| **Categoria** | Desafio Pior Experiência de Usuário (Seção 5.3 do Edital) |
| **Prazo de Entrega** | 19/06/2026 até 23h59 (repositório GitHub) |
| **Culminância Presencial** | 26/06/2026 — Auditório do Centro de Empreendedorismo e Inovação |
| **Premiação** | R$ 400,00 + Troféu KODA de Ouro + Medalhas + Certificado |
| **Inspiração** | [User Inyerface](https://userinyerface.com/) |

---

## 🎯 Objetivo do Projeto

Criar uma aplicação web **propositalmente ruim** em UX/UI, mas **100% funcional**, que conduza o usuário por um fluxo completo até uma tela final de conclusão com a mensagem:

> **"Parabéns, você chegou ao final da pior experiência de usuário!"**

A solução será usada na dinâmica interativa do encerramento do evento, onde participantes acessarão via **QR Code** e tentarão concluir o fluxo no menor tempo possível.

---

## 📊 Critérios de Avaliação (conforme Edital — Seção 13.2)

| Critério | Pontuação | Estratégia |
|---|---|---|
| **Funcionamento do fluxo e conclusão da experiência pelo usuário** | 20 pts | Fluxo completo de 4-5 páginas, sempre possível concluir |
| **Criatividade e coerência da experiência propositalmente ruim** | 20 pts | Anti-patterns variados, criativos e coerentes entre si |
| **Explicação dos princípios de UX/UI violados no README** | 20 pts | Documentação detalhada de cada violação com referência teórica |
| **MVP online, link público e facilidade de acesso por QR Code** | 15 pts | Deploy no Cloudflare Pages, URL limpa, QR Code funcional |
| **Proposta de melhoria ou versão corrigida do fluxo** | 10 pts | Seção no README ou página "/corrigido" com a versão boa |
| **Pitch, clareza da apresentação e defesa da proposta** | 10 pts | Slides + demonstração ao vivo |
| **Uso responsável de IA e documentação das ferramentas** | 5 pts | Declaração completa no README |
| **Total** | **100 pts** | |

---

## 💡 Conceito: "FormHell" — O Cadastro Impossível

### Nome do Projeto: **FormHell**
> *"O formulário de cadastro que ninguém pediu e ninguém consegue preencher."*

### Premissa Narrativa
O usuário precisa se cadastrar em um serviço fictício chamado **"FormHell Premium™"** — uma plataforma que promete benefícios absurdos (tipo "acesso vitalício a nada"). Para isso, precisa passar por um fluxo de cadastro intencionalmente terrível.

### Fluxo de Páginas (4-5 telas)

```
[Landing Page] → [Página 1: Dados Pessoais] → [Página 2: Senha & Segurança] → [Página 3: Preferências] → [Página 4: Confirmação/Captcha] → [Tela Final: Parabéns]
```

---

## 🗺️ Detalhamento do Fluxo

### Tela 0 — Landing Page
**Objetivo:** Confundir o usuário antes mesmo de começar.

**Anti-patterns aplicados:**
- Botão principal gigante diz **"NÃO, OBRIGADO"** (mas na verdade é decorativo / leva para lugar nenhum)
- O link real para começar é um texto minúsculo escrito "clique aqui" quase imperceptível, sublinhado em cor parecida com o fundo
- Timer falso contando regressivamente como se o cadastro fosse expirar (cria urgência artificial)
- Pop-up de cookie que cobre metade da tela com texto enorme e botão de aceitar escondido; o botão "Rejeitar" fecha e reabre o pop-up
- Cursor customizado (mão invertida ou emoji) para desconforto

**Princípios UX violados:**
- Affordance (o botão principal não faz o que parece)
- Visibilidade (o link real é quase invisível)
- Dark Pattern: Urgência artificial (timer falso)
- Controle do usuário (pop-up inescapável)

---

### Tela 1 — Dados Pessoais
**Objetivo:** Fazer o preenchimento de nome e email ser um pesadelo.

**Anti-patterns aplicados:**
- Labels trocadas: o campo "Email" pede o nome, e o campo "Nome" pede o email
- Placeholder text que desaparece ao focar mas não tem label visível (violação WCAG)
- Validação absurda: o campo de nome não aceita espaços ("nomes devem ser escritos sem espaços"), o email exige caractere especial como `$` junto do `@`
- Teclado virtual customizado que aparece sobrepondo o formulário (em desktop!)
- Campo de "Data de Nascimento" como texto livre mas aceita apenas formato `AAAA/DD/MM` (invertido)
- Dropdown de gênero com 50+ opções absurdas e fora de ordem alfabética
- Botão "Próximo" desabilitado até rolar a página até o final, mas não há indicação disso
- Captcha de "Selecione todas as imagens com semáforos" mas com imagens borradas e ambíguas
- Campo de telefone que aceita apenas números por extenso: "seis nove nove..." 
- Mensagens de erro vagas: "Algo deu errado em algum lugar" sem indicar o campo
- Auto-complete do navegador é bloqueado via atributos HTML

**Princípios UX violados:**
- Mapeamento/Correspondência (labels trocadas)
- Feedback (erros vagos)
- Flexibilidade (formatos rígidos e contra-intuitivos)
- Prevenção de erros (formato de data invertido)
- Acessibilidade (sem labels, sem ARIA)

---

### Tela 2 — Senha & Segurança
**Objetivo:** Criar a pior experiência de criação de senha possível.

**Anti-patterns aplicados:**
- Requisitos de senha absurdos mostrados **um por vez** (cada vez que corrige um, aparece outro):
  - Mínimo 12 caracteres
  - Deve conter emoji 🔥
  - Deve conter um número romano (I, V, X...)
  - Não pode ter letras consecutivas do alfabeto (ex: "ab", "cd")
  - Deve conter exatamente 2 letras maiúsculas, nem mais nem menos
  - Deve somar (os dígitos) um número primo
- Campo de confirmação de senha que exige digitar **de trás para frente**
- Botão de "Mostrar senha" que na verdade **esconde** mais (ex: troca por asteriscos maiores)
- Barra de força da senha que mostra "fraca" mesmo quando atende todos os requisitos
- Pergunta de segurança com opções absurdas: "Qual o nome do seu peixe de infância que você não teve?"
- Timer de inatividade de 10 segundos que limpa o campo de senha (sem aviso)
- O campo de senha muda de lugar a cada 15 segundos, scrollando a página suavemente

**Princípios UX violados:**
- Carga cognitiva excessiva
- Consistência (botões fazem o oposto)
- Flexibilidade e eficiência (requisitos absurdos revelados um a um)
- Controle e liberdade (timer limpa campos)
- Padrões reconhecíveis (senha invertida)

---

### Tela 3 — Preferências do Usuário
**Objetivo:** Usar elementos de interface de forma completamente errada.

**Anti-patterns aplicados:**
- Pergunta: "Selecione suas cores favoritas" usando **sliders** ao invés de checkboxes (slider vai de "Odeia" a "Ama" para cada cor)
- Toggle switch que funciona invertido (ON = desligado visualmente)
- Dropdown que abre para **cima** saindo da tela
- Scroll horizontal obrigatório em uma lista vertical
- Botão "Selecionar Todos" que na verdade **deseleciona** todos
- Termos de uso em Lorem Ipsum, com checkbox "Li e aceito" que começa marcado e desmarca ao clicar
- Campo de "avaliação por estrelas" onde 1 estrela = melhor e 5 estrelas = pior
- Um carousel de "escolha seu avatar" que gira automaticamente rápido demais para clicar
- Radio buttons que permitem selecionar múltiplos (parecem radios mas são checkboxes estilizados)
- Pergunta "Você concorda?" com botões "Sim" e "Absolutamente Sim" (sem opção de não)

**Princípios UX violados:**
- Consistência com padrões (componentes usados para propósitos errados)
- Controle do usuário (carousel incontrolável, pré-seleções)
- Transparência (termos em Lorem Ipsum)
- Escolha genuína (opções sem "não")
- Mapeamento natural (escalas invertidas)

---

### Tela 4 — Confirmação & Captcha Final
**Objetivo:** Última barreira antes da vitória.

**Anti-patterns aplicados:**
- CAPTCHA: "Digite as letras que você vê" mas a imagem é um cálculo matemático
- Botão "Confirmar Cadastro" que foge do cursor (move-se ao aproximar o mouse)
- Resumo dos dados preenchidos... mas todos errados/trocados ("Seu nome: [mostra o email]")
- Checkbox: "Aceito receber 847 emails por dia" que já vem marcado
- Ao clicar em "Confirmar", mostra loading de 5-8 segundos com barra de progresso que vai até 99% e volta para 42%
- Pop-up final perguntando "Tem certeza?" com botões "Cancelar" (que confirma) e "OK" (que cancela)
- Se errar o CAPTCHA, todos os campos de TODAS as páginas são resetados (mas na verdade não, é só um susto — mostra mensagem e depois volta normal)

**Princípios UX violados:**
- Lei de Fitts (botão que foge)
- Feedback honesto (progresso falso)
- Consistência de labels (botões invertidos)
- Misericórdia/Perdão (ameaça de reset)
- Integridade dos dados (resumo incorreto)

---

### Tela 5 — Parabéns! (Tela Final)
**Objetivo:** Recompensar o usuário com humor.

**Conteúdo:**
- Confetes animados 🎉
- Mensagem: **"Parabéns, você chegou ao final da pior experiência de usuário!"**
- Timer mostrando quanto tempo levou
- Ranking dos tempos (via Supabase, tempo real)
- Botão para compartilhar/tentar novamente
- Link para a "versão corrigida" (extra: mostra como deveria ser)

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SSR/SSG, roteamento por páginas, deploy fácil |
| **UI Library** | React 19 | Componentes reativos, estado por página |
| **Estilização** | Tailwind CSS 4 | Prototipagem rápida, classes utilitárias |
| **Linguagem** | TypeScript | Tipagem, menos bugs |
| **Backend** | Supabase (BaaS) | Auth, Database, Realtime para ranking |
| **Hospedagem** | Cloudflare Pages | Free tier, CDN global, URL limpa, deploy automático |
| **Serverless** | Cloudflare Workers (se necessário) | Para lógica pontual como salvar tempo no ranking |
| **Animações** | Framer Motion / CSS Animations | Micro-interações e elementos animados |
| **Ícones** | Lucide React | Ícones modernos e leves |

### Estrutura do Projeto

```
hackathon26/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout raiz
│   │   ├── page.tsx                # Landing Page (Tela 0)
│   │   ├── dados-pessoais/
│   │   │   └── page.tsx            # Tela 1
│   │   ├── senha/
│   │   │   └── page.tsx            # Tela 2
│   │   ├── preferencias/
│   │   │   └── page.tsx            # Tela 3
│   │   ├── confirmacao/
│   │   │   └── page.tsx            # Tela 4
│   │   ├── parabens/
│   │   │   └── page.tsx            # Tela 5 (Final)
│   │   ├── corrigido/
│   │   │   └── page.tsx            # Versão corrigida (bônus 10pts)
│   │   └── globals.css
│   ├── components/
│   │   ├── CookiePopup.tsx         # Pop-up de cookies abusivo
│   │   ├── FakeTimer.tsx           # Timer falso de urgência
│   │   ├── RunawayButton.tsx       # Botão que foge do cursor
│   │   ├── CrazyPassword.tsx       # Campo de senha com regras absurdas
│   │   ├── InvertedToggle.tsx      # Toggle invertido
│   │   ├── SpinningCarousel.tsx    # Carousel impossível
│   │   ├── FakeCaptcha.tsx         # CAPTCHA de mentira
│   │   ├── ProgressBarTroll.tsx    # Barra de progresso trolladora
│   │   ├── Confetti.tsx            # Confetes de celebração
│   │   ├── Ranking.tsx             # Tabela de ranking em tempo real
│   │   └── CustomCursor.tsx        # Cursor customizado horrível
│   ├── lib/
│   │   ├── supabase.ts             # Cliente Supabase
│   │   ├── sessionStore.ts         # Estado do progresso do usuário
│   │   └── uxViolations.ts         # Dados das violações para documentação
│   └── hooks/
│       ├── useTimer.ts             # Hook do cronômetro
│       └── useFormState.ts         # Hook de estado dos forms
├── public/
│   ├── images/                     # Imagens de CAPTCHA, avatars etc.
│   └── sounds/                     # Sons irritantes (opcional)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md                       # Conforme modelo do Edital (Anexo II)
```

### Banco de Dados — Supabase

```sql
-- Tabela de sessões/ranking
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Política de segurança (RLS)
-- Permitir INSERT anônimo e SELECT público
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read" ON sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can update own" ON sessions FOR UPDATE USING (true);
```

---

## 🌐 Hospedagem & Deploy

### Cloudflare Pages
- **Build command:** `npx next build`
- **Output directory:** `.next` (com adapter `@cloudflare/next-on-pages`)
- **Branch de deploy:** `main`
- **URL prevista:** `https://formhell.pages.dev` ou domínio customizado
- **Deploy automático:** Push para `main` → build → deploy

### Alternativa: Vercel
- Caso Cloudflare Pages apresente limitações com Next.js, usar Vercel como fallback
- Free tier suporta projetos de hackathon tranquilamente
- Deploy automático via GitHub

### Cloudflare Workers (se necessário)
- Endpoint para salvar ranking se não for possível usar Supabase diretamente do client
- Rate limiting para evitar abuse na dinâmica do evento
- Endpoint: `POST /api/ranking` → salva tempo + valida conclusão

---

## 📖 Catálogo de Princípios de UX/UI Violados

> Esta seção será expandida no README do repositório para os **20 pontos** de "Explicação dos princípios de UX/UI violados".

### 1. Heurísticas de Nielsen Violadas

| # | Heurística | Como foi violada |
|---|---|---|
| 1 | Visibilidade do status do sistema | Barra de progresso falsa, timer enganoso |
| 2 | Correspondência com o mundo real | Labels trocadas, formatos de data invertidos |
| 3 | Controle e liberdade do usuário | Pop-up inescapável, timer que limpa campos |
| 4 | Consistência e padrões | Botões fazem o oposto, toggles invertidos |
| 5 | Prevenção de erros | Campos confusos induzem ao erro |
| 6 | Reconhecimento em vez de memorização | Requisitos de senha revelados um a um |
| 7 | Flexibilidade e eficiência | Formatos rígidos, sem atalhos |
| 8 | Estética e design minimalista | Informação irrelevante, poluição visual |
| 9 | Ajudar a reconhecer/diagnosticar erros | "Algo deu errado em algum lugar" |
| 10 | Ajuda e documentação | Nenhuma ajuda oferecida |

### 2. Outras Violações

| Princípio | Violação |
|---|---|
| **Lei de Fitts** | Botão que foge do cursor |
| **Lei de Hick** | Dropdown com 50+ opções irrelevantes |
| **Affordance** | Botão grande que não funciona |
| **Acessibilidade (WCAG)** | Sem labels, baixo contraste, sem ARIA |
| **Dark Patterns** | Urgência falsa, pré-seleções, opções sem "não" |
| **Gestalt — Proximidade** | Labels longe dos campos correspondentes |
| **Gestalt — Semelhança** | Radios que parecem checkboxes e vice-versa |
| **Carga Cognitiva** | Muita informação simultânea, regras complexas |
| **Feedback** | Ações sem resposta ou com resposta enganosa |
| **Consistência Externa** | Padrões reconhecíveis usados de forma errada |

---

## 📦 Entregáveis (Checklist do Edital — Anexo I)

- [x] Nome da equipe, integrantes, curso, turma e categoria
- [x] Descrição do problema e do público impactado
- [x] Descrição da solução desenvolvida
- [x] Link do MVP funcional online
- [ ] ~~Link do vídeo de pitch~~ (não obrigatório para esta categoria)
- [x] Link do pitch ou arquivo de apresentação
- [x] Instruções de uso, teste e acesso
- [x] Tecnologias, bibliotecas, frameworks e serviços utilizados
- [x] Declaração das ferramentas de IA utilizadas e sua finalidade
- [x] Evidências de validação e teste com usuários
- [x] Observação sobre licença

---

## 📅 Cronograma de Desenvolvimento

| Data | Atividade | Status |
|---|---|---|
| 17/06 (Hoje) | PRD, Setup do projeto, Estrutura Next.js, Supabase | 🔄 Em andamento |
| 17/06 | Tela 0 (Landing) + Tela 5 (Parabéns) | ⏳ Pendente |
| 18/06 | Tela 1 (Dados) + Tela 2 (Senha) + Componentes | ⏳ Pendente |
| 18/06 | Tela 3 (Preferências) + Tela 4 (Confirmação/Captcha) | ⏳ Pendente |
| 19/06 | Versão corrigida, README completo, Deploy final | ⏳ Pendente |
| 19/06 | Testes com colegas, ajustes finais, Submit GitHub | ⏳ Pendente |
| 20-25/06 | Preparar pitch/slides para apresentação | ⏳ Pendente |
| 26/06 | Culminância presencial + Dinâmica com público | ⏳ Pendente |

---

## ⚡ Funcionalidades Extras (Diferencial Competitivo)

1. **Ranking em tempo real** — Via Supabase Realtime, mostra quem completou mais rápido (ideal para a dinâmica do evento)
2. **QR Code na Landing** — Acesso direto pelo celular para a dinâmica presencial
3. **Sons irritantes** — Efeitos sonoros em ações erradas (beep, buzzer)
4. **Modo responsivo** — Funciona em celular (importante para dinâmica do evento via QR Code)
5. **Versão corrigida** — Página `/corrigido` com o mesmo fluxo feito corretamente (vale 10 pontos!)
6. **Cronômetro visível** — O usuário vê seu tempo correndo durante o fluxo

---

## 🔧 Setup Inicial

```bash
# Criar projeto Next.js
npx -y create-next-app@latest ./ --typescript --tailwind --app --eslint --src-dir --import-alias "@/*" --use-npm

# Instalar dependências
npm install @supabase/supabase-js framer-motion lucide-react

# Configurar Cloudflare Pages adapter (se necessário)
npm install @cloudflare/next-on-pages

# Variáveis de ambiente (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

---

## 📌 Notas Importantes

> [!WARNING]
> **Prazo:** O repositório GitHub deve ser submetido até **19/06/2026 às 23h59**. Restam apenas **~2.5 dias**.

> [!IMPORTANT]
> **MVP Online:** A solução DEVE estar online e acessível sem instalação local pela banca.

> [!NOTE]
> **Vídeo de Pitch:** NÃO é obrigatório para a categoria "Desafio Pior Experiência de Usuário" (Edital, item 9f).

> [!TIP]
> **Dinâmica do Evento:** A equipe campeã terá sua solução usada na atividade interativa com QR Code. O ranking em tempo real é um diferencial forte.

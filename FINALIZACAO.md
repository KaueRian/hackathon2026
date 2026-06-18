# ✅ Checklist de Finalização — FormHell

> Guia prático para finalizar e apresentar o projeto no Hackathon IFRO 2026.

---

## 1. 🔑 Configurar Variáveis no Cloudflare Pages

No painel da Cloudflare Pages, antes de validar a URL:

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages**
2. Clique no projeto `hackathon2026`
3. Vá em **Settings → Environment variables**
4. Clique em **Add variable** e adicione as duas abaixo:

| Nome da variável              | Valor                          |
| :---------------------------- | :----------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`    | (valor do seu `.env.local`)    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (valor do seu `.env.local`) |

5. Clique em **Save**
6. Vá em **Deployments → Retry deployment** (ou faça um push qualquer para disparar novo build)

> ⚠️ Sem essas variáveis, o Ranking e o salvamento de sessão não vão funcionar em produção.

---

## 2. 🌐 Validar a URL Pública

Acesse cada rota e confirme que está funcionando:

| Rota            | O que verificar                                              |
| :-------------- | :----------------------------------------------------------- |
| `/`             | Landing page com timer falso, cookie popup e link escondido  |
| `/dados-pessoais` | Campos com labels trocadas e validações absurdas           |
| `/senha`        | Requisitos de senha revelados um a um, campo mudando de lugar |
| `/preferencias` | Toggle invertido, carrossel impossível, termos em lorem ipsum |
| `/confirmacao`  | Botão que foge, captcha falso, barra de loading troll        |
| `/parabens`     | Timer final exibido, campo de nickname, salvamento no Supabase |
| `/ranking`      | Tabela com tempos, atualização automática a cada 10s         |
| `/corrigido`    | Formulário limpo com boa UX, campos brancos normais          |

---

## 3. 📲 Gerar o QR Code

Com a URL pública em mãos (ex: `https://fases.hackathon2026.pages.dev`):

1. Acesse [qr.io](https://qr.io) ou [goqr.me](https://goqr.me)
2. Cole a URL da Landing Page (`/`)
3. Gere e baixe o QR Code em alta resolução (PNG)
4. Gere um **segundo QR Code** para o Ranking (`/ranking`) — útil para projetar na TV durante a apresentação

---

## 4. 🧪 Teste com Colegas

Antes da apresentação, peça para pelo menos 2-3 pessoas testarem o fluxo completo:

- [ ] Acessar via QR Code no celular
- [ ] Completar o formulário do início ao fim
- [ ] Confirmar que o tempo aparece no `/ranking`
- [ ] Verificar que o `/corrigido` está com visual limpo e correto

Anote os feedbacks e o tempo médio para usar no pitch e no README.

---

## 5. 📝 Atualizar o README com dados reais

Abra o `README.md` e preencha os placeholders:

- **Seção 3 — Link do MVP:** substituir `[INSERIR URL DO DEPLOY AQUI]` pela URL real
- **Seção 4 — Pitch:** substituir `[INSERIR LINK DOS SLIDES AQUI]` pelo link do Google Slides / Canva
- **Seção 8 — Validação:** preencher tempo médio e feedbacks reais dos colegas

Depois commit:
```bash
git add README.md
git commit -m "Docs: Update README with live URL and test results"
git push origin fases
```

---

## 6. 🎤 Preparar para a Apresentação (até 26/06)

### Roteiro sugerido (5-7 minutos):

1. **Contexto (1 min):** Por que UX importa? Qual o custo de um formulário ruim?
2. **Demo ao vivo (3 min):** Abrir no celular via QR Code, mostrar as armadilhas ao vivo enquanto alguém tenta completar.
3. **Análise técnica (1 min):** Mostrar brevemente o `/corrigido` e a tabela de heurísticas de Nielsen violadas no README.
4. **Ranking (30s):** Exibir o `/ranking` na tela — mostra gamificação e integração com backend real.
5. **Conclusão (30s):** O que aprendemos, tecnologias usadas (Next.js 15, Supabase, Cloudflare Pages).

### Dicas:
- Projete o `/ranking` em looping enquanto a plateia testa via QR Code.
- Deixe o link e o QR Code visíveis nos slides desde o início.
- Prepare resposta para: *"Por que vocês escolheram violar essas heurísticas específicas?"*

---

## 7. 🚀 Stack e Comandos Úteis

```bash
# Rodar localmente
npm run dev

# Checar lint
npm run lint

# Build de produção local
npm run build

# Subir para a branch fases (Cloudflare faz deploy automático)
git add .
git commit -m "sua mensagem"
git push origin fases
```

**Stack usada:**
- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript
- **Estilo:** Tailwind CSS 4 + Vanilla CSS
- **Backend/DB:** Supabase (PostgreSQL)
- **Deploy:** Cloudflare Pages (CI/CD via GitHub)
- **Testes:** Jest (TDD para validações de senha)

---

> 💡 **Boa apresentação!** Lembrem que o objetivo não é só fazer rir — é demonstrar que vocês entendem profundamente o que torna uma interface boa ou ruim. Isso impressiona qualquer banca!

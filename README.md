# 🎵 Mutsembeki — Website Oficial do Ministério Musical

Website premium para o artista gospel **Mutsembeki**, construído com Next.js 15, React 19, TypeScript, Tailwind CSS, Prisma e PostgreSQL.

---

## 📋 Índice

1. [O que está incluído](#-o-que-está-incluído)
2. [Pré-requisitos](#-pré-requisitos)
3. [Passo 1 — Abrir o projecto no VS Code](#passo-1--abrir-o-projecto-no-vs-code)
4. [Passo 2 — Criar a base de dados (Neon)](#passo-2--criar-a-base-de-dados-neon)
5. [Passo 3 — Criar conta Supabase (imagens/áudio)](#passo-3--criar-conta-supabase-imagensáudio)
6. [Passo 4 — Criar conta Resend (emails)](#passo-4--criar-conta-resend-emails)
7. [Passo 5 — Criar credenciais Google OAuth (login admin)](#passo-5--criar-credenciais-google-oauth-login-admin)
8. [Passo 6 — Configurar variáveis de ambiente localmente](#passo-6--configurar-variáveis-de-ambiente-localmente)
9. [Passo 7 — Testar localmente](#passo-7--testar-localmente)
10. [Passo 8 — Publicar no GitHub](#passo-8--publicar-no-github)
11. [Passo 9 — Deploy na Vercel](#passo-9--deploy-na-vercel)
12. [Passo 10 — Pós-deploy](#passo-10--pós-deploy)
13. [Como usar o Painel Administrativo](#-como-usar-o-painel-administrativo)
14. [Estrutura do Projecto](#-estrutura-do-projecto)
15. [Resolução de Problemas](#-resolução-de-problemas)

---

## 📦 O que está incluído

- ✅ Homepage com Hero, músicas em destaque, sobre, testemunhos, eventos, newsletter
- ✅ Página de músicas com pesquisa, filtros e downloads
- ✅ Página de letras com impressão
- ✅ Galeria de vídeos (estilo Netflix) integrada com YouTube
- ✅ Sistema de pedidos de oração (público/privado)
- ✅ Sistema de testemunhos com aprovação
- ✅ Blog cristão com categorias
- ✅ Página de eventos
- ✅ Newsletter com envio de emails (Resend)
- ✅ Painel administrativo completo (`/admin`) com dashboard, gestão de músicas, pedidos de oração, testemunhos, newsletter e configurações
- ✅ Login seguro via Google (NextAuth v5)
- ✅ Upload de imagens e áudio via Supabase Storage
- ✅ SEO: sitemap.xml, robots.txt, Open Graph, metadata dinâmica
- ✅ Tema "Gospel Premium Neo Dark" com glassmorphism e animações (Framer Motion)

---

## 🛠 Pré-requisitos

Antes de começar, instale no seu computador:

1. **Node.js 20+** → https://nodejs.org (escolha a versão LTS)
2. **VS Code** → https://code.visualstudio.com
3. **Git** → https://git-scm.com
4. Uma conta **GitHub** (gratuita) → https://github.com
5. Uma conta **Vercel** (gratuita) → https://vercel.com

Para confirmar que o Node está instalado, abra um terminal e corra:
```bash
node --version
npm --version
```

---

## Passo 1 — Abrir o projecto no VS Code

1. Extraia/copie a pasta do projecto (`mutsembeki`) para o seu computador, por exemplo em `Documentos/mutsembeki`.
2. Abra o VS Code.
3. Vá a **File → Open Folder** e seleccione a pasta `mutsembeki`.
4. Abra o terminal integrado: **Terminal → New Terminal** (ou `Ctrl+\``).
5. Instale as dependências:

```bash
npm install
```

Isto vai demorar alguns minutos na primeira vez.

---

## Passo 2 — Criar a base de dados (Neon)

Vamos usar o **Neon** (PostgreSQL gratuito na cloud, recomendado para Vercel) — alternativas: Supabase ou Railway, o processo é semelhante.

1. Vá a https://neon.tech e crie uma conta gratuita (pode usar login com GitHub/Google).
2. Clique em **Create a project**.
3. Dê um nome ao projecto, ex: `mutsembeki-db`.
4. Após criado, vá ao **Dashboard** do projecto e copie a **Connection String** (algo como `postgresql://user:password@ep-xxxxx.neon.tech/neondb?sslmode=require`).
5. Guarde esta string — vamos precisar dela no Passo 6.

---

## Passo 3 — Criar conta Supabase (imagens/áudio)

O Supabase Storage guarda as fotos das músicas, capas de álbuns e ficheiros MP3.

1. Vá a https://supabase.com e crie uma conta gratuita (pode usar login com GitHub).
2. Clique em **New Project**.
3. Preencha um nome (ex: `mutsembeki`), defina uma password para a base de dados (guarde-a, mas não vamos precisar dela aqui) e escolha uma região próxima.
4. Aguarde 1-2 minutos enquanto o projeto é criado.
5. No menu lateral, vá a **Storage** e crie dois "buckets" (clique em **New bucket** para cada um):
   - `covers` — marque como **Public bucket**
   - `audio` — marque como **Public bucket**
6. Vá a **Project Settings** (ícone de engrenagem) → **API**.
7. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **service_role key** (na secção "Project API keys" — clique em "Reveal" para ver o valor completo)

> ⚠️ A `service_role key` tem permissões totais sobre o seu projeto Supabase. Nunca a exponha no frontend nem a partilhe publicamente — só deve estar no `.env.local` e nas variáveis de ambiente da Vercel.

---

## Passo 4 — Criar conta Resend (emails)

O Resend envia os emails de contacto, newsletter e notificações de pedidos de oração.

1. Vá a https://resend.com e crie uma conta gratuita.
2. Vá a **API Keys → Create API Key**.
3. Copie a chave gerada (começa com `re_`).
4. **Importante:** para enviar emails de um domínio próprio (ex: `noreply@mutsembeki.com`), terá de verificar o domínio em **Domains** no Resend. Enquanto não verificar, pode usar o domínio de testes padrão do Resend para desenvolvimento.

---

## Passo 5 — Criar credenciais Google OAuth (login admin)

Isto permite que o administrador (você) faça login seguro no painel `/admin` usando a conta Google.

1. Vá a https://console.cloud.google.com.
2. Crie um novo projecto (ou use um existente).
3. Vá a **APIs & Services → Credentials**.
4. Clique em **Create Credentials → OAuth client ID**.
5. Se pedido, configure o **OAuth consent screen** primeiro (tipo "External", preencha nome da app "Mutsembeki", o seu email, etc).
6. Em **Application type**, escolha **Web application**.
7. Em **Authorized redirect URIs**, adicione:
   - Para testar localmente: `http://localhost:3000/api/auth/callback/google`
   - Para produção (depois do deploy): `https://SEU-DOMINIO.vercel.app/api/auth/callback/google`
8. Clique em **Create**. Copie o `Client ID` e `Client Secret`.

> 💡 Pode voltar aqui depois do deploy para adicionar o URL final de produção.

---

## Passo 6 — Configurar variáveis de ambiente localmente

1. Na pasta do projecto, copie o ficheiro `.env.example` e renomeie a cópia para `.env.local`:

```bash
cp .env.example .env.local
```

2. Abra `.env.local` no VS Code e preencha com os valores que recolheu:

```env
DATABASE_URL="postgresql://...sua-string-do-neon..."
NEXTAUTH_SECRET="gere-um-valor-abaixo"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="...do passo 5..."
GOOGLE_CLIENT_SECRET="...do passo 5..."
SUPABASE_URL="...do passo 3..."
SUPABASE_SERVICE_ROLE_KEY="...do passo 3..."
RESEND_API_KEY="...do passo 4..."
ADMIN_EMAIL="benildobernardomagombe@gmail.com"
```

3. Para gerar o `NEXTAUTH_SECRET`, corra no terminal:

```bash
openssl rand -base64 32
```

Se estiver no Windows e não tiver `openssl`, pode gerar uma string aleatória em https://generate-secret.vercel.app/32

> ⚠️ **Nunca** partilhe o ficheiro `.env.local` nem faça commit dele no Git. Já está protegido no `.gitignore`.

---

## Passo 7 — Testar localmente

1. Gerar o cliente Prisma e criar as tabelas na base de dados:

```bash
npx prisma generate
npx prisma db push
```

2. (Opcional mas recomendado) Popular a base de dados com dados de exemplo:

```bash
npm run db:seed
```

3. Iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra o navegador em http://localhost:3000 — o site deve aparecer.

5. Para aceder ao painel administrativo, vá a http://localhost:3000/admin, faça login com o **email definido em `ADMIN_EMAIL`** via Google. Esse utilizador é automaticamente promovido a `ADMIN` no primeiro login.

---

## Passo 8 — Publicar no GitHub

1. No terminal, dentro da pasta do projecto:

```bash
git init
git add .
git commit -m "Website inicial Mutsembeki"
```

2. Vá a https://github.com/new e crie um novo repositório (ex: `mutsembeki-website`). **Não** adicione README/gitignore (já temos um).

3. Ligue o repositório local ao GitHub (substitua `SEU-USUARIO`):

```bash
git remote add origin https://github.com/SEU-USUARIO/mutsembeki-website.git
git branch -M main
git push -u origin main
```

---

## Passo 9 — Deploy na Vercel

1. Vá a https://vercel.com/new e faça login (recomendado: com a conta GitHub).
2. Clique em **Import** no repositório `mutsembeki-website`.
3. Na tela de configuração, abra **Environment Variables** e adicione **todas** as variáveis do seu `.env.local`:

   | Nome | Valor |
   |---|---|
   | `DATABASE_URL` | a sua connection string do Neon |
   | `NEXTAUTH_SECRET` | o secret gerado |
   | `NEXTAUTH_URL` | `https://SEU-PROJETO.vercel.app` (ou o seu domínio final) |
   | `GOOGLE_CLIENT_ID` | do Google Console |
   | `GOOGLE_CLIENT_SECRET` | do Google Console |
   | `SUPABASE_URL` | do Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | do Supabase |
   | `RESEND_API_KEY` | do Resend |
   | `ADMIN_EMAIL` | `benildobernardomagombe@gmail.com` |

4. Clique em **Deploy**. A Vercel vai instalar dependências, gerar o Prisma Client (via `postinstall`) e construir o projecto automaticamente.

5. Quando terminar, vai receber um URL tipo `https://mutsembeki-website.vercel.app`.

6. **Importante:** volte ao Google Cloud Console (Passo 5) e adicione este URL final ao **Authorized redirect URIs**:
   ```
   https://mutsembeki-website.vercel.app/api/auth/callback/google
   ```
   E actualize a variável `NEXTAUTH_URL` na Vercel para esse mesmo URL (em **Settings → Environment Variables**), depois faça um **Redeploy**.

---

## Passo 10 — Pós-deploy

### Criar as tabelas na base de dados de produção

Se ainda não o fez via `prisma db push` localmente apontando para a mesma `DATABASE_URL`, pode correr a partir do seu computador (a string de conexão do Neon funciona de qualquer lugar):

```bash
npx prisma db push
npm run db:seed   # opcional — dados de exemplo
```

### Domínio próprio (opcional)

Se tiver um domínio (ex: `mutsembeki.com`):
1. Na Vercel, vá a **Settings → Domains** do projecto e adicione o domínio.
2. Siga as instruções para apontar o DNS (geralmente um registo `CNAME` ou `A`).
3. Actualize `NEXTAUTH_URL` para o novo domínio e adicione-o também ao Google OAuth.

### Verificar domínio no Resend (para emails profissionais)

Para enviar emails como `noreply@mutsembeki.com` em vez do domínio de testes do Resend:
1. No Resend, vá a **Domains → Add Domain**.
2. Adicione os registos DNS pedidos (TXT, MX) no mesmo sítio onde geriu o domínio.
3. Aguarde a verificação (pode demorar até 24h).

---

## 🔐 Como usar o Painel Administrativo

1. Aceda a `https://o-seu-site.com/admin`.
2. Faça login com a conta Google correspondente ao `ADMIN_EMAIL`.
3. No **Dashboard** verá estatísticas gerais (downloads, reproduções, pedidos pendentes).
4. Em **Músicas**, pode criar/editar/excluir músicas, fazer upload de capa e MP3, adicionar letras.
5. Em **Pedidos de Oração**, pode ver, responder e arquivar pedidos.
6. Em **Testemunhos**, pode aprovar ou rejeitar testemunhos enviados pelos visitantes.
7. Em **Newsletter**, vê todos os inscritos e pode exportar a lista em CSV.
8. Em **Configurações**, edita informações gerais do site (redes sociais, contactos) e vê mensagens de contacto recebidas.

> Apenas o email definido em `ADMIN_EMAIL` é promovido automaticamente a administrador no primeiro login. Para adicionar outros administradores, altere directamente o campo `role` do utilizador na base de dados (via Prisma Studio: `npm run db:studio`).

---

## 📁 Estrutura do Projecto

```
mutsembeki/
├── prisma/
│   ├── schema.prisma       # Modelos da base de dados
│   └── seed.ts              # Dados de exemplo
├── public/
│   ├── images/               # Imagens estáticas (adicione a foto do artista aqui)
│   └── site.webmanifest
├── src/
│   ├── app/
│   │   ├── (public)/         # Páginas públicas (home, músicas, sobre, etc.)
│   │   ├── admin/             # Painel administrativo (protegido)
│   │   ├── api/                # Rotas de API (downloads, oração, newsletter, admin...)
│   │   ├── layout.tsx
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── layout/            # Navbar, Footer
│   │   ├── sections/           # Secções da homepage
│   │   └── admin/               # Componentes do painel admin
│   ├── lib/                    # prisma.ts, auth.ts, supabase.ts, email.ts, utils.ts
│   ├── types/                  # Tipos TypeScript partilhados
│   └── styles/globals.css      # Tema visual (Gospel Premium Neo Dark)
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🧰 Outras plataformas que poderá precisar

Além da Vercel (hosting), Neon (base de dados), Supabase (ficheiros) e Resend (emails) já cobertos acima, pode considerar mais à frente:

- **Google Search Console** — para submeter o `sitemap.xml` e monitorizar o SEO. Gratuito, em https://search.google.com/search-console
- **Google Analytics** ou **Vercel Analytics** — para ver estatísticas de visitantes. O Vercel Analytics integra-se com um clique no dashboard do projecto.
- **Stripe** ou **PagSeguro/M-Pesa API** — caso decida activar a Loja Digital (estrutura já preparada no schema, falta integração de pagamentos).

Nenhuma destas é obrigatória para o site funcionar — só a Vercel, Neon, Supabase e Resend são necessárias para o lançamento inicial.

---

## 🩹 Resolução de Problemas

**Erro `P1001: Can't reach database server` ao correr `prisma db push`**
→ Verifique se copiou a `DATABASE_URL` correctamente do Neon, incluindo `?sslmode=require` no final.

**Login com Google não funciona / erro `redirect_uri_mismatch`**
→ O URL em **Authorized redirect URIs** no Google Console tem de ser **exactamente igual** ao `NEXTAUTH_URL` + `/api/auth/callback/google`, incluindo `http` vs `https`.

**Imagens/áudio não carregam depois do upload**
→ Confirme as variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` na Vercel (Settings → Environment Variables), confirme que os buckets `covers` e `audio` existem e estão marcados como **Public** no Supabase, e faça um **Redeploy**.

**Emails não chegam**
→ Em desenvolvimento, o Resend só permite enviar para o email da conta a não ser que verifique um domínio. Verifique o domínio em **Resend → Domains** para enviar a qualquer destinatário.

**Build falha na Vercel com erro do Prisma**
→ Confirme que o script `postinstall: prisma generate` está no `package.json` (já está incluído neste projecto) e que `DATABASE_URL` está definida nas variáveis de ambiente da Vercel.

**Esqueci-me de promover o admin**
→ Corra `npm run db:studio` localmente (aponta para a `DATABASE_URL` de produção se for a mesma), abra a tabela `User` e mude manualmente o campo `role` para `ADMIN`.

---

Feito com 🙏 para o ministério musical de **Mutsembeki**.

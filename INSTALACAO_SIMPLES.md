# 📱 Como Instalar o Sistema NPS no HostGator
## Guia para Iniciantes (SEM conhecimento técnico)

---

## 🎯 **O QUE VOCÊ VAI FAZER**
Instalar um sistema completo de pesquisa NPS no seu site certtech.com.br/nps

---

## 📦 **ANTES DE COMEÇAR**

### 1. Baixe o Pacote Pronto
- Clique no botão "Download ZIP" no canto superior direito desta tela
- Salve o arquivo no seu computador
- Descompacte o arquivo (clique com botão direito > Extrair)

### 2. Tenha em Mãos 
- Login do seu cPanel da HostGator
- Dados do Supabase (vamos configurar juntos)

---

## 🚀 **PASSO 1: CONFIGURAR O SUPABASE**

### A. Criar Conta no Supabase (GRÁTIS)
1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com Google ou GitHub
4. Clique em "New Project"
5. Escolha um nome: "nps-certtech"
6. Crie uma senha forte (anote ela!)
7. Clique em "Create new project"
8. **AGUARDE 2-3 MINUTOS** (o projeto está sendo criado)

### B. Pegar as Chaves do Supabase
1. No painel do Supabase, clique em "Settings" (engrenagem)
2. Clique em "API"
3. **COPIE E ANOTE:**
   - **Project URL** (algo como: https://abc123.supabase.co)
   - **anon public** (chave longa que começa com "eyJ...")

### C. Configurar Autenticação
1. No painel do Supabase, clique em "Authentication"
2. Clique em "URL Configuration"
3. Em "Site URL" coloque: `https://certtech.com.br/nps`
4. Em "Redirect URLs" adicione: `https://certtech.com.br/nps/**`
5. Clique em "Save"

---

## 🚀 **PASSO 2: CONFIGURAR OS ARQUIVOS**

### A. Editar o Arquivo de Configuração
1. Na pasta que você descompactou, encontre o arquivo: `config.js`
2. Abra com Bloco de Notas (ou qualquer editor de texto)
3. **SUBSTITUA** as informações:

\`\`\`javascript
// COLE AQUI OS DADOS DO SEU SUPABASE
const SUPABASE_URL = "https://abc123.supabase.co"  // ← Cole sua Project URL aqui
const SUPABASE_KEY = "eyJ..."  // ← Cole sua chave anon public aqui
const SITE_URL = "https://certtech.com.br/nps"
\`\`\`

4. **SALVE** o arquivo (Ctrl+S)

---

## 🚀 **PASSO 3: FAZER UPLOAD NO HOSTGATOR**

### A. Acessar o cPanel
1. Acesse o painel da HostGator
2. Faça login com seus dados
3. Procure por "Gerenciador de Arquivos" ou "File Manager"
4. Clique nele

### B. Navegar até a Pasta Correta
1. Clique em "public_html"
2. **Se já existe uma pasta "nps":** delete ela primeiro
3. Clique em "Nova Pasta" ou "Create Folder"
4. Digite o nome: `nps`
5. Entre na pasta `nps` (clique duas vezes)

### C. Fazer Upload dos Arquivos
1. Clique em "Upload" ou "Enviar Arquivos"
2. **SELECIONE TODOS** os arquivos da pasta descompactada
3. **NÃO selecione a pasta, apenas os arquivos dentro dela**
4. Aguarde o upload terminar (pode demorar alguns minutos)

---

## 🚀 **PASSO 4: CONFIGURAR O BANCO DE DADOS**

### A. Executar Scripts no Supabase
1. Volte ao painel do Supabase
2. Clique em "SQL Editor" (no menu lateral)
3. Clique em "New Query"
4. **COPIE E COLE** o conteúdo do arquivo `database-setup.sql` (está na pasta que você baixou)
5. Clique em "Run" (botão azul)
6. **AGUARDE** aparecer "Success" (sucesso)

---

## 🎉 **PASSO 5: TESTAR O SISTEMA**

### A. Primeiro Teste
1. Acesse: `https://certtech.com.br/nps`
2. Você deve ver a tela de login
3. Clique em "Criar Conta"
4. Cadastre-se com seu email
5. **VERIFIQUE SEU EMAIL** e clique no link de confirmação

### B. Configurar Sua Empresa
1. Após confirmar o email, você será direcionado para configurar sua empresa
2. Preencha os dados da CertTech
3. Clique em "Salvar"

### C. Criar Primeira Pesquisa
1. No dashboard, clique em "Nova Pesquisa"
2. Digite um título: "Satisfação CertTech"
3. Clique em "Criar"
4. **COPIE O LINK** gerado
5. Teste o link em uma aba anônima do navegador

---

## ❌ **SE ALGO DEU ERRADO**

### Página em Branco ou Erro 404
- Verifique se todos os arquivos foram enviados para a pasta `nps`
- Confirme se o arquivo `config.js` tem os dados corretos do Supabase

### Erro de Login/Cadastro
- Verifique se configurou as URLs no Supabase corretamente
- Confirme se executou o script do banco de dados

### Precisa de Ajuda?
- Anote exatamente qual erro aparece na tela
- Tire uma foto da tela de erro
- Entre em contato com os dados do erro

---

## 🎯 **PRONTO! SEU SISTEMA NPS ESTÁ FUNCIONANDO**

Agora você pode:
- ✅ Criar pesquisas NPS
- ✅ Compartilhar links com clientes
- ✅ Ver resultados em tempo real
- ✅ Gerenciar feedback dos clientes
- ✅ Convidar sua equipe

**Endereço do seu sistema:** https://certtech.com.br/nps

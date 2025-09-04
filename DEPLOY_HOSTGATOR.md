# Deploy no HostGator - Sistema NPS

## 📋 Pré-requisitos

1. **Conta Supabase configurada** com as tabelas criadas
2. **Node.js 18+** instalado localmente
3. **Acesso ao cPanel** da HostGator

## 🚀 Passos para Deploy

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
NEXT_PUBLIC_SITE_URL=https://certtech.com.br/nps
\`\`\`

### 2. Build do Projeto

Execute os comandos localmente:

\`\`\`bash
npm install
npm run build
\`\`\`

### 3. Upload dos Arquivos

1. Acesse o **File Manager** no cPanel
2. Navegue até `public_html`
3. Crie a pasta `nps`
4. Faça upload de todo o conteúdo da pasta `out/` para `public_html/nps/`

### 4. Configurar .htaccess

Crie um arquivo `.htaccess` dentro da pasta `nps`:

```apache
RewriteEngine On

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /nps/index.html [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</FilesMatch>

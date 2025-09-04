# Sistema NPS - Deploy HostGator

## 🎯 Resumo Executivo

Sistema completo de NPS (Net Promoter Score) adaptado para hospedagem compartilhada HostGator.

### ✅ Funcionalidades Implementadas

- **Coleta de Feedback**: Formulários públicos responsivos
- **Dashboard Executivo**: Métricas e KPIs em tempo real
- **Multi-tenant**: Isolamento de dados por empresa
- **Gestão de Usuários**: Convites e controle de acesso
- **Análises**: Gráficos e relatórios de satisfação

## 🚀 Deploy Rápido

### 1. Preparar Ambiente Local
\`\`\`bash
# Clonar e instalar
git clone [seu-repositorio]
cd nps-system
npm install

# Configurar variáveis
cp .env.local.example .env.local
# Editar .env.local com suas credenciais Supabase
\`\`\`

### 2. Build para Produção
\`\`\`bash
# Executar script de build
chmod +x build-hostgator.sh
./build-hostgator.sh
\`\`\`

### 3. Upload no HostGator
1. **cPanel > File Manager**
2. **Navegar para `public_html`**
3. **Criar pasta `nps`**
4. **Upload todo conteúdo de `out/` para `public_html/nps/`**
5. **Copiar `.htaccess.example` como `.htaccess` na pasta `nps`**

### 4. Configurar Supabase
Execute os scripts SQL no Supabase:
- `scripts/001_create_database_schema.sql`
- `scripts/002_create_profile_trigger.sql`
- `scripts/003_update_profile_trigger.sql`

## 🔗 URLs do Sistema

- **Página Principal**: `https://certtech.com.br/nps`
- **Login**: `https://certtech.com.br/nps/auth/login`
- **Dashboard**: `https://certtech.com.br/nps/dashboard`
- **Pesquisa Pública**: `https://certtech.com.br/nps/survey/[ID]`

## 📊 Como Usar

1. **Registrar-se** em `/auth/register`
2. **Configurar empresa** em `/setup/company`
3. **Criar pesquisas** no dashboard
4. **Compartilhar links** com clientes
5. **Acompanhar métricas** no dashboard

## 🛠️ Suporte Técnico

**Problemas Comuns:**
- **Página em branco**: Verificar console do navegador (F12)
- **Erro de conexão**: Confirmar variáveis Supabase
- **404 nas rotas**: Verificar configuração .htaccess

**Logs de Debug:**
Abra o console do navegador (F12 > Console) para ver mensagens de erro detalhadas.

# ✅ CHECKLIST DE INSTALAÇÃO - Sistema NPS

## 📋 **ANTES DE COMEÇAR**
- [ ] Tenho acesso ao cPanel da HostGator
- [ ] Baixei o pacote ZIP do sistema
- [ ] Descompactei os arquivos no meu computador

---

## 🔧 **CONFIGURAÇÃO DO SUPABASE**
- [ ] Criei conta no Supabase (gratuita)
- [ ] Criei novo projeto "nps-certtech"
- [ ] Copiei a Project URL
- [ ] Copiei a chave anon public
- [ ] Configurei Site URL: `https://certtech.com.br/nps`
- [ ] Configurei Redirect URLs: `https://certtech.com.br/nps/**`

---

## 📝 **CONFIGURAÇÃO DOS ARQUIVOS**
- [ ] Abri o arquivo `config.js`
- [ ] Colei minha Project URL no lugar de "COLE_AQUI_SUA_PROJECT_URL"
- [ ] Colei minha chave anon no lugar de "COLE_AQUI_SUA_CHAVE_ANON"
- [ ] Salvei o arquivo

---

## 📤 **UPLOAD NO HOSTGATOR**
- [ ] Acessei o cPanel
- [ ] Abri o Gerenciador de Arquivos
- [ ] Naveguei até public_html/
- [ ] Criei a pasta "nps"
- [ ] Entrei na pasta "nps"
- [ ] Fiz upload de TODOS os arquivos (não a pasta, apenas os arquivos)
- [ ] Aguardei o upload terminar

---

## 🗄️ **CONFIGURAÇÃO DO BANCO**
- [ ] Voltei ao painel do Supabase
- [ ] Cliquei em "SQL Editor"
- [ ] Cliquei em "New Query"
- [ ] Copiei todo o conteúdo do arquivo `database-setup.sql`
- [ ] Colei no SQL Editor
- [ ] Cliquei em "Run"
- [ ] Vi a mensagem "Success" ou "Banco de dados configurado com sucesso!"

---

## 🧪 **TESTES FINAIS**
- [ ] Acessei `https://certtech.com.br/nps`
- [ ] Vi a tela de login (não erro 404)
- [ ] Consegui criar uma conta
- [ ] Recebi email de confirmação
- [ ] Confirmei a conta clicando no link do email
- [ ] Acessei o dashboard
- [ ] Criei uma pesquisa de teste
- [ ] Testei o link da pesquisa em aba anônima
- [ ] Consegui responder a pesquisa

---

## 🎉 **SISTEMA FUNCIONANDO!**

Se todos os itens estão marcados, seu sistema NPS está funcionando perfeitamente!

### 📞 **Precisa de Ajuda?**
Se algum item não funcionou:
1. Anote exatamente qual erro aparece
2. Tire uma foto da tela
3. Verifique se seguiu todos os passos
4. Entre em contato com o suporte técnico

### 🔗 **Links Importantes**
- **Seu sistema:** https://certtech.com.br/nps
- **Painel Supabase:** https://supabase.com/dashboard
- **cPanel HostGator:** [seu link do cPanel]

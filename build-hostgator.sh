#!/bin/bash

echo "🚀 Iniciando build para HostGator..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

# Verificar se o build foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    echo "📁 Arquivos prontos na pasta 'out/'"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Faça upload de todo o conteúdo da pasta 'out/' para 'public_html/nps/' no cPanel"
    echo "2. Configure o arquivo .htaccess conforme instruções"
    echo "3. Teste o acesso em https://certtech.com.br/nps"
else
    echo "❌ Erro no build. Verifique os logs acima."
    exit 1
fi

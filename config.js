// ========================================
// CONFIGURAÇÃO DO SISTEMA NPS - CERTTECH
// ========================================
//
// INSTRUÇÕES:
// 1. Configure os dados do seu banco MySQL no arquivo config/database.php
// 2. Execute o script database/setup.sql no phpMyAdmin
// 3. Faça upload de todos os arquivos para o HostGator
//
// ⚠️ IMPORTANTE: Este sistema usa MySQL + PHP (não precisa do Supabase)

// CONFIGURAÇÕES DO SISTEMA
const SITE_URL = "https://certtech.com.br/nps"
const API_BASE_URL = "/nps/api"

// NÃO ALTERE NADA ABAIXO DESTA LINHA
// ===================================

window.NPS_CONFIG = {
  siteUrl: SITE_URL,
  apiUrl: API_BASE_URL,
}

// Sistema pronto para usar!
console.log("✅ Sistema NPS configurado para MySQL + PHP")

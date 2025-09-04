// Aplicação principal usando MySQL + PHP
let selectedScore = null
let currentUser = null // Declare currentUser variable

// Import functions signIn, signUp, signOut from auth.js
import { signIn, signUp, signOut } from "./auth.js"

// Inicializar aplicação
document.addEventListener("DOMContentLoaded", async () => {
  console.log("[v0] Iniciando aplicação NPS")

  try {
    // Verificar se é uma página de pesquisa
    const path = window.location.pathname
    const surveyMatch = path.match(/\/survey\/([^/]+)/)

    if (surveyMatch) {
      console.log("[v0] Carregando formulário NPS para survey:", surveyMatch[1])
      showNPSForm(surveyMatch[1])
    } else {
      // Verificar autenticação
      const user = await getCurrentUser()
      if (user) {
        console.log("[v0] Usuário logado, mostrando dashboard")
        showDashboard()
      } else {
        console.log("[v0] Usuário não logado, mostrando login")
        showLogin()
      }
    }

    // Esconder loading
    const loading = document.getElementById("loading")
    const app = document.getElementById("app")
    if (loading) loading.classList.add("hidden")
    if (app) app.classList.remove("hidden")
  } catch (error) {
    console.error("[v0] Erro ao inicializar:", error)
    document.getElementById("app").innerHTML = `
      <div class="min-h-screen bg-red-50 flex items-center justify-center">
        <div class="text-center">
          <h2 class="text-xl font-bold text-red-600 mb-2">Erro no Sistema</h2>
          <p class="text-red-500">${error.message}</p>
        </div>
      </div>
    `
  }
})

// Verificar usuário atual
async function getCurrentUser() {
  try {
    const response = await fetch("/nps/api/auth.php?action=check")
    const result = await response.json()
    currentUser = result.user || null
    return currentUser
  } catch (error) {
    console.error("[v0] Erro ao verificar usuário:", error)
    return null
  }
}

// Mostrar formulário de login
function showLogin() {
  document.getElementById("app").innerHTML = `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Sistema NPS</h2>
          <p class="mt-2 text-gray-600">Faça login para continuar</p>
        </div>
        
        <!-- Login Form -->
        <form id="loginForm" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Senha</label>
            <input type="password" name="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Entrar
          </button>
        </form>
        
        <div class="text-center">
          <button id="showRegister" class="text-blue-600 hover:text-blue-500">
            Não tem conta? Cadastre-se
          </button>
        </div>
        
        <!-- Register Form -->
        <form id="registerForm" class="space-y-6 hidden">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" name="name" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Senha</label>
            <input type="password" name="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nome da Empresa</label>
            <input type="text" name="companyName" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <button type="submit" class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
            Cadastrar
          </button>
        </form>
        
        <div class="text-center">
          <button id="showLogin" class="text-blue-600 hover:text-blue-500 hidden">
            Já tem conta? Faça login
          </button>
        </div>
      </div>
    </div>
  `

  // Event listeners
  document.getElementById("loginForm").addEventListener("submit", handleLogin)
  document.getElementById("registerForm").addEventListener("submit", handleRegister)
  document.getElementById("showRegister").addEventListener("click", () => {
    document.getElementById("loginForm").classList.add("hidden")
    document.getElementById("registerForm").classList.remove("hidden")
    document.getElementById("showRegister").classList.add("hidden")
    document.getElementById("showLogin").classList.remove("hidden")
  })
  document.getElementById("showLogin").addEventListener("click", () => {
    document.getElementById("registerForm").classList.add("hidden")
    document.getElementById("loginForm").classList.remove("hidden")
    document.getElementById("showLogin").classList.add("hidden")
    document.getElementById("showRegister").classList.remove("hidden")
  })
}

// Mostrar dashboard
async function showDashboard() {
  document.getElementById("app").innerHTML = `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-semibold">Sistema NPS</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-700">Olá, ${currentUser?.name || "Usuário"}</span>
              <button id="logoutBtn" class="text-red-600 hover:text-red-500">Sair</button>
            </div>
          </div>
        </div>
      </nav>
      
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="text-lg font-medium text-gray-900">NPS Score</h3>
              <p id="npsScore" class="text-3xl font-bold text-blue-600">--</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="text-lg font-medium text-gray-900">Promotores</h3>
              <p id="promoters" class="text-3xl font-bold text-green-600">--</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="text-lg font-medium text-gray-900">Detratores</h3>
              <p id="detractors" class="text-3xl font-bold text-red-600">--</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="text-lg font-medium text-gray-900">Total Respostas</h3>
              <p id="totalResponses" class="text-3xl font-bold text-gray-600">--</p>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">Pesquisas NPS</h3>
              <button id="createSurveyBtn" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Nova Pesquisa
              </button>
            </div>
            <div id="surveysList">
              <p class="text-gray-500">Carregando pesquisas...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `

  // Event listeners
  document.getElementById("logoutBtn").addEventListener("click", handleLogout)
  document.getElementById("createSurveyBtn").addEventListener("click", handleCreateSurvey)

  // Carregar dados
  await loadMetrics()
  await loadSurveys()
}

// Mostrar formulário NPS
function showNPSForm(surveyId) {
  document.getElementById("app").innerHTML = NPSForm(surveyId)

  // Event listeners para scores
  document.querySelectorAll(".nps-score").forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remover seleção anterior
      document.querySelectorAll(".nps-score").forEach((b) => {
        b.classList.remove("bg-blue-500", "text-white", "border-blue-500")
        b.classList.add("border-gray-300")
      })

      // Selecionar novo score
      this.classList.remove("border-gray-300")
      this.classList.add("bg-blue-500", "text-white", "border-blue-500")
      selectedScore = Number.parseInt(this.dataset.score)

      // Habilitar botão de envio
      document.getElementById("submitBtn").disabled = false
    })
  })

  // Event listener para formulário
  document.getElementById("npsForm").addEventListener("submit", handleNPSSubmit)
}

// Handlers
async function handleLogin(e) {
  e.preventDefault()
  const formData = new FormData(e.target)
  const email = formData.get("email")
  const password = formData.get("password")

  const result = await signIn(email, password)
  if (result.error) {
    alert("Erro no login: " + result.error)
  } else {
    showDashboard()
  }
}

async function handleRegister(e) {
  e.preventDefault()
  const formData = new FormData(e.target)
  const name = formData.get("name")
  const email = formData.get("email")
  const password = formData.get("password")
  const companyName = formData.get("companyName")

  if (password.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres")
    return
  }

  const result = await signUp(name, email, password, companyName)
  if (result.error) {
    alert("Erro no cadastro: " + result.error)
  } else {
    alert("Cadastro realizado com sucesso! Faça login para continuar.")
    showLogin()
  }
}

async function handleLogout() {
  await signOut()
  showLogin()
}

async function handleCreateSurvey() {
  const title = prompt("Digite o título da pesquisa:")
  if (!title) return

  try {
    const response = await fetch(`${window.NPS_CONFIG.apiUrl}/surveys.php?action=create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    })

    const result = await response.json()
    if (result.error) {
      alert("Erro ao criar pesquisa: " + result.error)
    } else {
      const surveyUrl = `${window.NPS_CONFIG.siteUrl}/survey/${result.survey.id}`
      alert(`Pesquisa criada! Link: ${surveyUrl}`)
      loadSurveys() // Recarregar lista
    }
  } catch (error) {
    alert("Erro ao criar pesquisa: " + error.message)
  }
}

async function handleNPSSubmit(e) {
  e.preventDefault()

  if (selectedScore === null) {
    alert("Por favor, selecione uma nota de 0 a 10")
    return
  }

  const comment = document.getElementById("comment").value
  const customerName = document.getElementById("customerName").value
  const customerEmail = document.getElementById("customerEmail").value

  const surveyId = window.location.pathname.split("/").pop()

  try {
    const response = await fetch(`${window.NPS_CONFIG.apiUrl}/responses.php?action=submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        survey_id: surveyId,
        score: selectedScore,
        comment,
        customer_name: customerName,
        customer_email: customerEmail,
      }),
    })

    const result = await response.json()
    if (result.error) {
      alert("Erro ao enviar avaliação: " + result.error)
    } else {
      document.getElementById("app").innerHTML = `
        <div class="min-h-screen bg-gray-50 flex items-center justify-center">
          <div class="text-center">
            <div class="text-6xl mb-4">✅</div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Obrigado!</h2>
            <p class="text-gray-600">Sua avaliação foi enviada com sucesso.</p>
          </div>
        </div>
      `
    }
  } catch (error) {
    alert("Erro ao enviar avaliação: " + error.message)
  }
}

async function loadMetrics() {
  // Por simplicidade, vamos usar dados mockados
  // Em produção, isso viria do banco MySQL
  document.getElementById("npsScore").textContent = "75"
  document.getElementById("promoters").textContent = "12"
  document.getElementById("detractors").textContent = "2"
  document.getElementById("totalResponses").textContent = "20"
}

async function loadSurveys() {
  // Implementação para carregar listas de pesquisas
  // Esta função deve ser implementada conforme necessário
}

function NPSForm(surveyId) {
  return `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 class="text-2xl font-bold text-center mb-6">Avalie nossa empresa</h2>
        <p class="text-gray-600 text-center mb-8">De 0 a 10, o quanto você recomendaria nossa empresa?</p>
        
        <form id="npsForm">
          <div class="grid grid-cols-11 gap-2 mb-6">
            ${Array.from(
              { length: 11 },
              (_, i) => `
              <button type="button" class="nps-score border-2 border-gray-300 rounded p-2 text-center hover:bg-gray-100" data-score="${i}">
                ${i}
              </button>
            `,
            ).join("")}
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Comentário (opcional)</label>
            <textarea id="comment" rows="3" class="w-full border border-gray-300 rounded-md p-2"></textarea>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Seu nome (opcional)</label>
            <input type="text" id="customerName" class="w-full border border-gray-300 rounded-md p-2">
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Seu email (opcional)</label>
            <input type="email" id="customerEmail" class="w-full border border-gray-300 rounded-md p-2">
          </div>
          
          <button type="submit" id="submitBtn" disabled class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
            Enviar Avaliação
          </button>
        </form>
      </div>
    </div>
  `
}

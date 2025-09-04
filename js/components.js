// Componentes HTML simplificados

function LoginForm() {
  return `
        <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <div>
                    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sistema NPS - CertTech
                    </h2>
                    <p class="mt-2 text-center text-sm text-gray-600">
                        Faça login ou crie sua conta
                    </p>
                </div>
                <form id="loginForm" class="mt-8 space-y-6">
                    <div class="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input id="email" name="email" type="email" required 
                                   class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                                   placeholder="Email">
                        </div>
                        <div>
                            <input id="password" name="password" type="password" required 
                                   class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                                   placeholder="Senha">
                        </div>
                    </div>
                    
                    <div>
                        <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Entrar
                        </button>
                    </div>
                    
                    <div class="text-center">
                        <button type="button" id="showRegister" class="text-blue-600 hover:text-blue-500">
                            Não tem conta? Cadastre-se
                        </button>
                    </div>
                </form>
                
                <form id="registerForm" class="mt-8 space-y-6 hidden">
                    <div class="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input id="regFullName" name="fullName" type="text" required 
                                   class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                                   placeholder="Nome completo">
                        </div>
                        <div>
                            <input id="regEmail" name="email" type="email" required 
                                   class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                                   placeholder="Email">
                        </div>
                        <div>
                            <input id="regPassword" name="password" type="password" required 
                                   class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                                   placeholder="Senha (mín. 6 caracteres)">
                        </div>
                    </div>
                    
                    <div>
                        <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            Criar Conta
                        </button>
                    </div>
                    
                    <div class="text-center">
                        <button type="button" id="showLogin" class="text-blue-600 hover:text-blue-500">
                            Já tem conta? Faça login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `
}

function Dashboard() {
  return `
        <div class="min-h-screen bg-gray-50">
            <!-- Header -->
            <header class="bg-white shadow">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center py-6">
                        <h1 class="text-3xl font-bold text-gray-900">Sistema NPS - CertTech</h1>
                        <button id="logoutBtn" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <!-- Métricas -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span class="text-white font-bold">N</span>
                                    </div>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">NPS Score</dt>
                                        <dd id="npsScore" class="text-lg font-medium text-gray-900">--</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <span class="text-white font-bold">P</span>
                                    </div>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">Promotores</dt>
                                        <dd id="promoters" class="text-lg font-medium text-gray-900">--</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                        <span class="text-white font-bold">D</span>
                                    </div>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">Detratores</dt>
                                        <dd id="detractors" class="text-lg font-medium text-gray-900">--</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div class="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                                        <span class="text-white font-bold">T</span>
                                    </div>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">Total</dt>
                                        <dd id="totalResponses" class="text-lg font-medium text-gray-900">--</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Ações -->
                <div class="bg-white shadow rounded-lg p-6">
                    <h2 class="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button id="createSurveyBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium">
                            Criar Nova Pesquisa NPS
                        </button>
                        <button id="viewResponsesBtn" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium">
                            Ver Respostas
                        </button>
                    </div>
                </div>
            </main>
        </div>
    `
}

function NPSForm(surveyId) {
  return `
        <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <div class="text-center">
                    <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
                        Pesquisa de Satisfação
                    </h2>
                    <p class="mt-2 text-sm text-gray-600">
                        Sua opinião é muito importante para nós!
                    </p>
                </div>
                
                <div class="bg-white shadow rounded-lg p-6">
                    <form id="npsForm">
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-3">
                                De 0 a 10, o quanto você recomendaria a CertTech para um amigo ou colega?
                            </label>
                            <div class="grid grid-cols-11 gap-2">
                                ${Array.from(
                                  { length: 11 },
                                  (_, i) => `
                                    <button type="button" class="nps-score w-8 h-8 border-2 border-gray-300 rounded text-sm font-medium hover:border-blue-500 focus:outline-none focus:border-blue-500" data-score="${i}">
                                        ${i}
                                    </button>
                                `,
                                ).join("")}
                            </div>
                            <div class="flex justify-between text-xs text-gray-500 mt-2">
                                <span>Não recomendaria</span>
                                <span>Recomendaria totalmente</span>
                            </div>
                        </div>
                        
                        <div class="mb-6">
                            <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
                                Comentário (opcional)
                            </label>
                            <textarea id="comment" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Conte-nos mais sobre sua experiência..."></textarea>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label for="customerName" class="block text-sm font-medium text-gray-700 mb-1">
                                    Nome (opcional)
                                </label>
                                <input type="text" id="customerName" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label for="customerEmail" class="block text-sm font-medium text-gray-700 mb-1">
                                    Email (opcional)
                                </label>
                                <input type="email" id="customerEmail" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            </div>
                        </div>
                        
                        <button type="submit" id="submitBtn" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            Enviar Avaliação
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `
}

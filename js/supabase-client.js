// Cliente Supabase simplificado
let supabase

function initSupabase() {
  if (!window.SUPABASE_CONFIG) {
    console.error("Configuração do Supabase não encontrada!")
    return false
  }

  try {
    supabase = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey)
    return true
  } catch (error) {
    console.error("Erro ao inicializar Supabase:", error)
    return false
  }
}

// Funções de autenticação
async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: window.SUPABASE_CONFIG.siteUrl,
    },
  })
  return { data, error }
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Funções do NPS
async function createSurvey(title, description) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Usuário não autenticado")

  const { data, error } = await supabase
    .from("nps_surveys")
    .insert([
      {
        title,
        description,
        created_by: user.id,
      },
    ])
    .select()
    .single()

  return { data, error }
}

async function submitNPSResponse(surveyId, score, comment, customerData) {
  const { data, error } = await supabase.from("nps_responses").insert([
    {
      survey_id: surveyId,
      score,
      comment,
      customer_name: customerData.name,
      customer_email: customerData.email,
      customer_phone: customerData.phone,
    },
  ])

  return { data, error }
}

async function getNPSMetrics(companyId) {
  const { data, error } = await supabase.from("nps_responses").select("score").eq("company_id", companyId)

  if (error) return { error }

  const total = data.length
  const promoters = data.filter((r) => r.score >= 9).length
  const detractors = data.filter((r) => r.score <= 6).length
  const nps = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0

  return {
    data: {
      nps,
      total,
      promoters,
      detractors,
      neutrals: total - promoters - detractors,
    },
  }
}

// Sistema de autenticação usando PHP + MySQL
let currentUser = null

// Funções de autenticação
async function signUp(name, email, password, companyName) {
  try {
    const response = await fetch(`${window.NPS_CONFIG.apiUrl}/auth.php?action=register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        company_name: companyName,
      }),
    })

    const result = await response.json()
    return result
  } catch (error) {
    return { error: error.message }
  }
}

async function signIn(email, password) {
  try {
    const response = await fetch(`${window.NPS_CONFIG.apiUrl}/auth.php?action=login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const result = await response.json()
    if (result.success) {
      currentUser = result.user
    }
    return result
  } catch (error) {
    return { error: error.message }
  }
}

async function signOut() {
  try {
    await fetch(`${window.NPS_CONFIG.apiUrl}/auth.php?action=logout`, {
      method: "POST",
    })
    currentUser = null
    return { success: true }
  } catch (error) {
    return { error: error.message }
  }
}

async function getCurrentUser() {
  if (currentUser) return currentUser

  try {
    const response = await fetch(`${window.NPS_CONFIG.apiUrl}/auth.php?action=check`)
    const result = await response.json()

    if (result.authenticated) {
      currentUser = result.user
      return currentUser
    }
    return null
  } catch (error) {
    return null
  }
}

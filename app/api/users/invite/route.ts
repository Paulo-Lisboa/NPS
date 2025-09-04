import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, full_name, role } = body

    if (!email || !full_name) {
      return NextResponse.json({ error: "Email e nome são obrigatórios" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Get user's company and verify admin role
    const { data: profile } = await supabase.from("profiles").select("company_id, role").eq("id", user.id).single()

    if (!profile?.company_id || profile.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.from("profiles").select("id").eq("email", email).single()

    if (existingUser) {
      return NextResponse.json({ error: "Usuário já existe no sistema" }, { status: 400 })
    }

    // Create user invitation using Supabase Admin API
    const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name,
        company_id: profile.company_id,
        role: role || "user",
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    })

    if (inviteError) {
      console.error("Error inviting user:", inviteError)
      return NextResponse.json({ error: "Erro ao enviar convite" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: inviteData })
  } catch (error) {
    console.error("Error in user invite API:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

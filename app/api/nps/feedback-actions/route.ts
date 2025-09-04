import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { response_id, status, assigned_to, notes } = body

    if (!response_id || !status) {
      return NextResponse.json({ error: "response_id e status são obrigatórios" }, { status: 400 })
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

    // Get user's company
    const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", user.id).single()

    if (!profile?.company_id) {
      return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 })
    }

    // Verify response belongs to company
    const { data: response, error: responseError } = await supabase
      .from("nps_responses")
      .select("company_id")
      .eq("id", response_id)
      .single()

    if (responseError || !response || response.company_id !== profile.company_id) {
      return NextResponse.json({ error: "Resposta não encontrada" }, { status: 404 })
    }

    // Create feedback action
    const { data: action, error } = await supabase
      .from("feedback_actions")
      .insert({
        response_id,
        company_id: profile.company_id,
        status,
        assigned_to,
        notes,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating feedback action:", error)
      return NextResponse.json({ error: "Erro ao criar ação" }, { status: 500 })
    }

    return NextResponse.json({ action })
  } catch (error) {
    console.error("Error in feedback actions API:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

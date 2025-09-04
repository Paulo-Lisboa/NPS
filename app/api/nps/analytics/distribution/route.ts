import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get("companyId")

    if (!companyId) {
      return NextResponse.json({ error: "Company ID é obrigatório" }, { status: 400 })
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

    // Verify user belongs to company
    const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", user.id).single()

    if (!profile || profile.company_id !== companyId) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    // Get score distribution
    const { data: responses, error } = await supabase.from("nps_responses").select("score").eq("company_id", companyId)

    if (error) {
      console.error("Error fetching responses:", error)
      return NextResponse.json({ error: "Erro ao buscar respostas" }, { status: 500 })
    }

    // Create distribution data
    const distribution = Array.from({ length: 11 }, (_, i) => ({
      score: i,
      count: responses?.filter((r) => r.score === i).length || 0,
    }))

    return NextResponse.json({ data: distribution })
  } catch (error) {
    console.error("Error in NPS distribution API:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

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

    // Get current period responses (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: currentResponses, error: currentError } = await supabase
      .from("nps_responses")
      .select("score")
      .eq("company_id", companyId)
      .gte("created_at", thirtyDaysAgo.toISOString())

    if (currentError) {
      console.error("Error fetching current responses:", currentError)
      return NextResponse.json({ error: "Erro ao buscar dados atuais" }, { status: 500 })
    }

    // Get previous period responses (30-60 days ago)
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    const { data: previousResponses, error: previousError } = await supabase
      .from("nps_responses")
      .select("score")
      .eq("company_id", companyId)
      .gte("created_at", sixtyDaysAgo.toISOString())
      .lt("created_at", thirtyDaysAgo.toISOString())

    if (previousError) {
      console.error("Error fetching previous responses:", previousError)
    }

    // Calculate current metrics
    const calculateNPS = (responses: any[]) => {
      if (responses.length === 0) return { nps: 0, promoters: 0, passives: 0, detractors: 0 }

      const promoters = responses.filter((r) => r.score >= 9).length
      const passives = responses.filter((r) => r.score >= 7 && r.score <= 8).length
      const detractors = responses.filter((r) => r.score <= 6).length
      const total = responses.length

      const promotersPercentage = (promoters / total) * 100
      const detractorsPercentage = (detractors / total) * 100
      const nps = Math.round(promotersPercentage - detractorsPercentage)

      return {
        nps,
        promoters,
        passives,
        detractors,
        promotersPercentage,
        passivesPercentage: (passives / total) * 100,
        detractorsPercentage,
      }
    }

    const currentMetrics = calculateNPS(currentResponses || [])
    const previousMetrics = calculateNPS(previousResponses || [])

    const result = {
      nps_score: currentMetrics.nps,
      total_responses: currentResponses?.length || 0,
      promoters: currentMetrics.promoters,
      passives: currentMetrics.passives,
      detractors: currentMetrics.detractors,
      promoters_percentage: currentMetrics.promotersPercentage || 0,
      passives_percentage: currentMetrics.passivesPercentage || 0,
      detractors_percentage: currentMetrics.detractorsPercentage || 0,
      previous_nps: previousMetrics.nps,
    }

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error("Error in NPS metrics API:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

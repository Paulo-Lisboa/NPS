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

    // Get responses from last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const { data: responses, error } = await supabase
      .from("nps_responses")
      .select("score, created_at")
      .eq("company_id", companyId)
      .gte("created_at", sixMonthsAgo.toISOString())
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching responses:", error)
      return NextResponse.json({ error: "Erro ao buscar respostas" }, { status: 500 })
    }

    // Group by month and calculate NPS
    const monthlyData = new Map()

    responses?.forEach((response) => {
      const date = new Date(response.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, [])
      }
      monthlyData.get(monthKey).push(response.score)
    })

    // Calculate NPS for each month
    const trendData = Array.from(monthlyData.entries()).map(([month, scores]) => {
      const promoters = scores.filter((s: number) => s >= 9).length
      const detractors = scores.filter((s: number) => s <= 6).length
      const total = scores.length

      const promotersPercentage = (promoters / total) * 100
      const detractorsPercentage = (detractors / total) * 100
      const nps = Math.round(promotersPercentage - detractorsPercentage)

      return {
        period: month,
        nps_score: nps,
        total_responses: total,
      }
    })

    return NextResponse.json({ data: trendData })
  } catch (error) {
    console.error("Error in NPS trend API:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

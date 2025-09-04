import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get("companyId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = 20
    const offset = (page - 1) * limit

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

    // Build query
    let query = supabase
      .from("nps_responses")
      .select(
        `
        *,
        feedback_actions (
          id,
          status,
          assigned_to,
          notes,
          profiles:assigned_to (
            full_name
          )
        )
      `,
      )
      .eq("company_id", companyId)

    // Apply filters
    const scoreType = searchParams.get("score_type")
    if (scoreType === "promoters") {
      query = query.gte("score", 9)
    } else if (scoreType === "passives") {
      query = query.gte("score", 7).lte("score", 8)
    } else if (scoreType === "detractors") {
      query = query.lte("score", 6)
    }

    const channel = searchParams.get("channel")
    if (channel) {
      query = query.eq("channel", channel)
    }

    const segment = searchParams.get("segment")
    if (segment) {
      query = query.eq("segment", segment)
    }

    const search = searchParams.get("search")
    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,comment.ilike.%${search}%`)
    }

    // Get total count
    const { count } = await query.select("*", { count: "exact", head: true })

    // Get paginated results
    const { data: responses, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching responses:", error)
      return NextResponse.json({ error: "Erro ao buscar respostas" }, { status: 500 })
    }

    // Filter by status if needed
    let filteredResponses = responses || []
    const status = searchParams.get("status")
    if (status) {
      filteredResponses = filteredResponses.filter((response) => {
        const action = response.feedback_actions[0]
        return action?.status === status || (!action && status === "pending")
      })
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json({
      data: filteredResponses,
      pagination: {
        page,
        totalPages,
        total: count || 0,
        limit,
      },
    })
  } catch (error) {
    console.error("Error in responses list API:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

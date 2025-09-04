import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { survey_id, company_id, score, comment, customer_name, customer_email, channel, segment } = body

    // Validate required fields
    if (!survey_id || !company_id || score === undefined || score === null) {
      return NextResponse.json({ error: "Campos obrigatórios: survey_id, company_id, score" }, { status: 400 })
    }

    // Validate score range
    if (score < 0 || score > 10) {
      return NextResponse.json({ error: "Score deve estar entre 0 e 10" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify survey exists and is active
    const { data: survey, error: surveyError } = await supabase
      .from("nps_surveys")
      .select("id, is_active")
      .eq("id", survey_id)
      .eq("company_id", company_id)
      .single()

    if (surveyError || !survey || !survey.is_active) {
      return NextResponse.json({ error: "Pesquisa não encontrada ou inativa" }, { status: 404 })
    }

    // Insert response
    const { data, error } = await supabase
      .from("nps_responses")
      .insert({
        survey_id,
        company_id,
        score,
        comment,
        customer_name,
        customer_email,
        channel: channel || "web",
        segment,
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting NPS response:", error)
      return NextResponse.json({ error: "Erro ao salvar resposta" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error in NPS response API:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

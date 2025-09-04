import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
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

    // Get surveys for the company
    const { data: surveys, error } = await supabase
      .from("nps_surveys")
      .select("*")
      .eq("company_id", profile.company_id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching surveys:", error)
      return NextResponse.json({ error: "Erro ao buscar pesquisas" }, { status: 500 })
    }

    return NextResponse.json({ surveys })
  } catch (error) {
    console.error("Error in surveys API:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description } = body

    if (!title) {
      return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 })
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

    // Create survey
    const { data: survey, error } = await supabase
      .from("nps_surveys")
      .insert({
        title,
        description,
        company_id: profile.company_id,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating survey:", error)
      return NextResponse.json({ error: "Erro ao criar pesquisa" }, { status: 500 })
    }

    return NextResponse.json({ survey })
  } catch (error) {
    console.error("Error in surveys API:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

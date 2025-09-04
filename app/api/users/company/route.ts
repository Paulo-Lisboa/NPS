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
    const { data: profile } = await supabase.from("profiles").select("company_id, role").eq("id", user.id).single()

    if (!profile?.company_id) {
      return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 })
    }

    // Check if user is admin
    if (profile.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    // Get all users from the same company
    const { data: users, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at")
      .eq("company_id", profile.company_id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching company users:", error)
      return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 })
    }

    return NextResponse.json({ data: users })
  } catch (error) {
    console.error("Error in company users API:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description } = body

    if (!name || !slug) {
      return NextResponse.json({ error: "Nome e identificador são obrigatórios" }, { status: 400 })
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

    // Check if user already has a company
    const { data: existingProfile } = await supabase.from("profiles").select("company_id").eq("id", user.id).single()

    if (existingProfile?.company_id) {
      return NextResponse.json({ error: "Usuário já possui uma empresa" }, { status: 400 })
    }

    // Check if slug is available
    const { data: existingCompany } = await supabase.from("companies").select("id").eq("slug", slug).single()

    if (existingCompany) {
      return NextResponse.json({ error: "Este identificador já está em uso" }, { status: 400 })
    }

    // Create company
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({
        name,
        slug,
        description,
      })
      .select()
      .single()

    if (companyError) {
      console.error("Error creating company:", companyError)
      return NextResponse.json({ error: "Erro ao criar empresa" }, { status: 500 })
    }

    // Update user profile with company and admin role
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        company_id: company.id,
        role: "admin",
      })
      .eq("id", user.id)

    if (profileError) {
      console.error("Error updating profile:", profileError)
      return NextResponse.json({ error: "Erro ao associar usuário à empresa" }, { status: 500 })
    }

    return NextResponse.json({ company })
  } catch (error) {
    console.error("Error in company setup API:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

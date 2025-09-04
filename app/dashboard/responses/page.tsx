import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ResponsesTable } from "@/components/responses-table"
import { ResponseFilters } from "@/components/response-filters"

interface ResponsesPageProps {
  searchParams: Promise<{
    status?: string
    score_type?: string
    channel?: string
    segment?: string
    page?: string
  }>
}

export default async function ResponsesPage({ searchParams }: ResponsesPageProps) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  // Get user profile and company
  const { data: profile } = await supabase.from("profiles").select("*, companies(*)").eq("id", user.id).single()

  if (!profile?.company_id) {
    redirect("/setup/company")
  }

  const filters = await searchParams

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Feedback</h1>
          <p className="text-muted-foreground">Gerencie e acompanhe as respostas dos clientes</p>
        </div>

        <ResponseFilters />

        <ResponsesTable companyId={profile.company_id} filters={filters} />
      </div>
    </DashboardLayout>
  )
}

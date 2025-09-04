import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CompanySettings } from "@/components/company-settings"
import { UserManagement } from "@/components/user-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function SettingsPage() {
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

  // Check if user is admin
  const isAdmin = profile.role === "admin"

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as configurações da sua empresa e usuários</p>
        </div>

        <Tabs defaultValue="company" className="space-y-4">
          <TabsList>
            <TabsTrigger value="company">Empresa</TabsTrigger>
            {isAdmin && <TabsTrigger value="users">Usuários</TabsTrigger>}
            <TabsTrigger value="profile">Meu Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <CompanySettings company={profile.companies} isAdmin={isAdmin} />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="users">
              <UserManagement companyId={profile.company_id} />
            </TabsContent>
          )}

          <TabsContent value="profile">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Configurações do Perfil</h3>
              <p className="text-muted-foreground">Em desenvolvimento...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

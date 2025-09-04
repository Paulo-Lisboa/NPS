"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client-only"
import { DashboardLayout } from "@/components/dashboard-layout"
import { NPSMetrics } from "@/components/nps-metrics"
import { NPSCharts } from "@/components/nps-charts"

interface Profile {
  id: string
  company_id: string
  companies?: {
    name: string
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
          router.push("/auth/login")
          return
        }

        setUser(user)

        // Get user profile and company
        const { data: profile } = await supabase.from("profiles").select("*, companies(*)").eq("id", user.id).single()

        if (!profile?.company_id) {
          router.push("/setup/company")
          return
        }

        setProfile(profile)
      } catch (error) {
        console.error("Auth error:", error)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard NPS</h1>
          <p className="text-muted-foreground">Acompanhe as métricas de satisfação da {profile.companies?.name}</p>
        </div>

        <NPSMetrics companyId={profile.company_id} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NPSCharts companyId={profile.company_id} />
        </div>
      </div>
    </DashboardLayout>
  )
}

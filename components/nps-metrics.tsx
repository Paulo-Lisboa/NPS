"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface NPSData {
  nps_score: number
  total_responses: number
  promoters: number
  passives: number
  detractors: number
  promoters_percentage: number
  passives_percentage: number
  detractors_percentage: number
  previous_nps: number
}

interface NPSMetricsProps {
  companyId: string
}

export function NPSMetrics({ companyId }: NPSMetricsProps) {
  const [data, setData] = useState<NPSData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`/api/nps/analytics/metrics?companyId=${companyId}`)
        if (response.ok) {
          const result = await response.json()
          setData(result.data)
        }
      } catch (error) {
        console.error("Error fetching NPS metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [companyId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-8 bg-muted rounded w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Nenhum dado disponível ainda. Colete algumas respostas para ver as métricas.
          </p>
        </CardContent>
      </Card>
    )
  }

  const npsChange = data.nps_score - data.previous_nps
  const isPositiveChange = npsChange >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
          {isPositiveChange ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.nps_score}</div>
          <p className={cn("text-xs", isPositiveChange ? "text-green-600" : "text-red-600")}>
            {isPositiveChange ? "+" : ""}
            {npsChange} desde o período anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Respostas</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total_responses}</div>
          <p className="text-xs text-muted-foreground">Respostas coletadas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Promotores</CardTitle>
          <Users className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{data.promoters}</div>
          <p className="text-xs text-muted-foreground">{data.promoters_percentage.toFixed(1)}% do total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Detratores</CardTitle>
          <Users className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{data.detractors}</div>
          <p className="text-xs text-muted-foreground">{data.detractors_percentage.toFixed(1)}% do total</p>
        </CardContent>
      </Card>
    </div>
  )
}

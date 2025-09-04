"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts"

interface NPSChartsProps {
  companyId: string
}

const COLORS = {
  promoters: "#22c55e",
  passives: "#f59e0b",
  detractors: "#ef4444",
}

export function NPSCharts({ companyId }: NPSChartsProps) {
  const [distributionData, setDistributionData] = useState<any[]>([])
  const [trendData, setTrendData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const [distributionRes, trendRes] = await Promise.all([
          fetch(`/api/nps/analytics/distribution?companyId=${companyId}`),
          fetch(`/api/nps/analytics/trend?companyId=${companyId}`),
        ])

        if (distributionRes.ok) {
          const distResult = await distributionRes.json()
          setDistributionData(distResult.data)
        }

        if (trendRes.ok) {
          const trendResult = await trendRes.json()
          setTrendData(trendResult.data)
        }
      } catch (error) {
        console.error("Error fetching chart data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [companyId])

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse h-64 bg-muted rounded" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse h-64 bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Notas</CardTitle>
          <CardDescription>Quantidade de respostas por nota (0-10)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Respostas",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <XAxis dataKey="score" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evolução do NPS</CardTitle>
          <CardDescription>Tendência do NPS ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              nps_score: {
                label: "NPS Score",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="period" />
                <YAxis domain={[-100, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="nps_score" stroke="var(--color-nps_score)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ResponseActions } from "@/components/response-actions"
import { ResponseDetail } from "@/components/response-detail"
import { Pagination } from "@/components/ui/pagination"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Eye, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface Response {
  id: string
  score: number
  comment: string | null
  customer_name: string | null
  customer_email: string | null
  channel: string
  segment: string | null
  created_at: string
  feedback_actions: Array<{
    id: string
    status: string
    assigned_to: string | null
    notes: string | null
    profiles: {
      full_name: string | null
    } | null
  }>
}

interface ResponsesTableProps {
  companyId: string
  filters: any
}

export function ResponsesTable({ companyId, filters }: ResponsesTableProps) {
  const [responses, setResponses] = useState<Response[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })

  const fetchResponses = async () => {
    try {
      const params = new URLSearchParams({
        companyId,
        page: (filters.page || "1").toString(),
        ...filters,
      })

      const response = await fetch(`/api/nps/responses/list?${params.toString()}`)
      if (response.ok) {
        const result = await response.json()
        setResponses(result.data)
        setPagination(result.pagination)
      }
    } catch (error) {
      console.error("Error fetching responses:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResponses()
  }, [companyId, filters])

  const getScoreType = (score: number) => {
    if (score >= 9) return { type: "promoter", label: "Promotor", color: "bg-green-100 text-green-800" }
    if (score >= 7) return { type: "passive", label: "Neutro", color: "bg-yellow-100 text-yellow-800" }
    return { type: "detractor", label: "Detrator", color: "bg-red-100 text-red-800" }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Pendente", variant: "secondary" as const },
      in_progress: { label: "Em Andamento", variant: "default" as const },
      resolved: { label: "Resolvido", variant: "outline" as const },
    }
    return statusMap[status as keyof typeof statusMap] || statusMap.pending
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Respostas ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Comentário</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((response) => {
                const scoreType = getScoreType(response.score)
                const action = response.feedback_actions[0]
                const status = getStatusBadge(action?.status || "pending")

                return (
                  <TableRow key={response.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {response.customer_name?.[0]?.toUpperCase() ||
                              response.customer_email?.[0]?.toUpperCase() ||
                              "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{response.customer_name || "Anônimo"}</div>
                          <div className="text-sm text-muted-foreground">{response.customer_email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{response.score}</span>
                        <Badge className={cn("text-xs", scoreType.color)}>{scoreType.label}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {response.comment ? (
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate text-sm">{response.comment}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Sem comentário</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{response.channel}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(response.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedResponse(response)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <ResponseActions response={response} onUpdate={fetchResponses} />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {pagination.totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => {
                  const params = new URLSearchParams(window.location.search)
                  params.set("page", page.toString())
                  window.history.pushState({}, "", `?${params.toString()}`)
                  fetchResponses()
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {selectedResponse && (
        <ResponseDetail
          response={selectedResponse}
          onClose={() => setSelectedResponse(null)}
          onUpdate={fetchResponses}
        />
      )}
    </>
  )
}

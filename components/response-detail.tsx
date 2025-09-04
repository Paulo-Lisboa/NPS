"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { MessageSquare, User, Mail, Calendar, Tag, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResponseDetailProps {
  response: any
  onClose: () => void
  onUpdate: () => void
}

export function ResponseDetail({ response, onClose, onUpdate }: ResponseDetailProps) {
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

  const scoreType = getScoreType(response.score)
  const action = response.feedback_actions?.[0]
  const status = getStatusBadge(action?.status || "pending")

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Resposta</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {response.customer_name?.[0]?.toUpperCase() || response.customer_email?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{response.customer_name || "Cliente Anônimo"}</div>
                  {response.customer_email && (
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {response.customer_email}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score and Feedback */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Avaliação NPS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{response.score}</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
                <Badge className={cn("text-sm", scoreType.color)}>{scoreType.label}</Badge>
              </div>

              {response.comment && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MessageSquare className="h-4 w-4" />
                      Comentário
                    </div>
                    <div className="bg-muted p-3 rounded-md text-sm">{response.comment}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Informações Adicionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Canal:</span>
                  <Badge variant="outline" className="ml-2">
                    {response.channel}
                  </Badge>
                </div>
                {response.segment && (
                  <div>
                    <span className="font-medium">Segmento:</span>
                    <Badge variant="outline" className="ml-2">
                      {response.segment}
                    </Badge>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Data:</span>
                  <span>{format(new Date(response.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                </div>
                <div>
                  <span className="font-medium">Há:</span>
                  <span className="ml-2">
                    {formatDistanceToNow(new Date(response.created_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Status */}
          {action && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Status do Acompanhamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>

                {action.assigned_to && (
                  <div>
                    <span className="font-medium">Responsável:</span>
                    <span className="ml-2">{action.profiles?.full_name || "Não informado"}</span>
                  </div>
                )}

                {action.notes && (
                  <div className="space-y-2">
                    <span className="font-medium">Notas Internas:</span>
                    <div className="bg-muted p-3 rounded-md text-sm">{action.notes}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

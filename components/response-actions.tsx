"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AssignDialog } from "@/components/assign-dialog"
import { StatusDialog } from "@/components/status-dialog"
import { MoreHorizontal, UserPlus, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface ResponseActionsProps {
  response: any
  onUpdate: () => void
}

export function ResponseActions({ response, onUpdate }: ResponseActionsProps) {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)

  const updateStatus = async (status: string) => {
    try {
      const response_id = response.id
      const action = response.feedback_actions[0]

      const method = action ? "PUT" : "POST"
      const url = action ? `/api/nps/feedback-actions/${action.id}` : "/api/nps/feedback-actions"

      const body = action
        ? { status }
        : {
            response_id,
            status,
          }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setAssignDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Atribuir
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateStatus("pending")}>
            <AlertCircle className="mr-2 h-4 w-4" />
            Marcar como Pendente
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateStatus("in_progress")}>
            <Clock className="mr-2 h-4 w-4" />
            Em Andamento
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateStatus("resolved")}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Marcar como Resolvido
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusDialogOpen(true)}>Adicionar Nota</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AssignDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        response={response}
        onUpdate={onUpdate}
      />

      <StatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        response={response}
        onUpdate={onUpdate}
      />
    </>
  )
}

"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface AssignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  response: any
  onUpdate: () => void
}

export function AssignDialog({ open, onOpenChange, response, onUpdate }: AssignDialogProps) {
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchUsers()
    }
  }, [open])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users/company")
      if (res.ok) {
        const result = await res.json()
        setUsers(result.data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleAssign = async () => {
    if (!selectedUser) return

    setLoading(true)
    try {
      const action = response.feedback_actions[0]
      const method = action ? "PUT" : "POST"
      const url = action ? `/api/nps/feedback-actions/${action.id}` : "/api/nps/feedback-actions"

      const body = action
        ? { assigned_to: selectedUser }
        : {
            response_id: response.id,
            assigned_to: selectedUser,
            status: "in_progress",
          }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        onUpdate()
        onOpenChange(false)
        setSelectedUser("")
      }
    } catch (error) {
      console.error("Error assigning user:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atribuir Responsável</DialogTitle>
          <DialogDescription>Selecione um usuário para ser responsável por este feedback.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um usuário" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {user.full_name?.[0]?.toUpperCase() || user.email[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.full_name || user.email}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAssign} disabled={!selectedUser || loading}>
            {loading ? "Atribuindo..." : "Atribuir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

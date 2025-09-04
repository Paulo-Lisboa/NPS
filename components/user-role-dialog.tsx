"use client"

import { useState } from "react"
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
import { useToast } from "@/hooks/use-toast"

interface UserRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any
  onSuccess: () => void
}

export function UserRoleDialog({ open, onOpenChange, user, onSuccess }: UserRoleDialogProps) {
  const [role, setRole] = useState(user?.role || "user")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!user) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/users/${user.id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      })

      if (!response.ok) {
        throw new Error("Erro ao alterar função")
      }

      toast({
        title: "Função alterada",
        description: "A função do usuário foi alterada com sucesso.",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar a função do usuário.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar Função do Usuário</DialogTitle>
          <DialogDescription>Altere a função de {user?.full_name || user?.email} na empresa.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Usuário</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Alterando..." : "Alterar Função"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

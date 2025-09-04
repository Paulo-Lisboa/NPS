"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface CompanySettingsProps {
  company: any
  isAdmin: boolean
}

export function CompanySettings({ company, isAdmin }: CompanySettingsProps) {
  const [name, setName] = useState(company?.name || "")
  const [description, setDescription] = useState(company?.description || "")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/companies/${company.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar empresa")
      }

      toast({
        title: "Empresa atualizada",
        description: "As informações da empresa foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a empresa.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Empresa</CardTitle>
        <CardDescription>
          {isAdmin ? "Gerencie as informações da sua empresa" : "Visualize as informações da empresa"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Empresa</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!isAdmin} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Identificador</Label>
            <Input id="slug" value={company?.slug || ""} disabled />
            <p className="text-xs text-muted-foreground">O identificador não pode ser alterado após a criação.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isAdmin}
              rows={3}
            />
          </div>

          {isAdmin && (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Survey {
  id: string
  title: string
  description: string | null
  company_id: string
}

interface NPSFormProps {
  survey: Survey
  channel: string
  segment?: string
}

export function NPSForm({ survey, channel, segment }: NPSFormProps) {
  const [score, setScore] = useState<number | null>(null)
  const [comment, setComment] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleScoreSelect = (selectedScore: number) => {
    setScore(selectedScore)
  }

  const getScoreLabel = (score: number | null) => {
    if (score === null) return ""
    if (score <= 6) return "Detrator"
    if (score <= 8) return "Neutro"
    return "Promotor"
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return ""
    if (score <= 6) return "text-red-600"
    if (score <= 8) return "text-yellow-600"
    return "text-green-600"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (score === null) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/nps/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          survey_id: survey.id,
          company_id: survey.company_id,
          score,
          comment: comment.trim() || null,
          customer_name: customerName.trim() || null,
          customer_email: customerEmail.trim() || null,
          channel,
          segment,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao enviar resposta")
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Obrigado pelo seu feedback!</h2>
          <p className="text-muted-foreground">
            Sua opinião é muito importante para nós e nos ajuda a melhorar nossos serviços.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{survey.title}</CardTitle>
        {survey.description && <CardDescription className="text-base">{survey.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NPS Score Selection */}
          <div className="space-y-4">
            <div className="text-center">
              <Label className="text-lg font-medium">De 0 a 10, o quanto você recomendaria nossos serviços?</Label>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: 11 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleScoreSelect(i)}
                  className={cn(
                    "w-12 h-12 rounded-lg border-2 font-semibold transition-all hover:scale-105",
                    score === i
                      ? "border-primary bg-primary text-primary-foreground shadow-lg"
                      : "border-border bg-background hover:border-primary/50",
                  )}
                >
                  {i}
                </button>
              ))}
            </div>

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Muito improvável</span>
              <span>Muito provável</span>
            </div>

            {score !== null && (
              <div className="text-center">
                <span className={cn("font-medium", getScoreColor(score))}>{getScoreLabel(score)}</span>
              </div>
            )}
          </div>

          {/* Optional Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Comentário (opcional)</Label>
              <Textarea
                id="comment"
                placeholder="Conte-nos mais sobre sua experiência..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nome (opcional)</Label>
                <Input
                  id="customerName"
                  type="text"
                  placeholder="Seu nome"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email (opcional)</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="seu@email.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <Button type="submit" className="w-full" disabled={score === null || isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

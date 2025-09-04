"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client-only"

interface NPSFormStaticProps {
  surveyId: string
}

export function NPSFormStatic({ surveyId }: NPSFormStaticProps) {
  const [score, setScore] = useState<number | null>(null)
  const [comment, setComment] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (score === null) return

    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("nps_responses").insert({
        survey_id: surveyId,
        score,
        comment: comment || null,
        customer_name: customerName || null,
        customer_email: customerEmail || null,
        channel: "web",
      })

      if (error) throw error

      setIsSubmitted(true)
    } catch (error) {
      console.error("Erro ao enviar resposta:", error)
      alert("Erro ao enviar resposta. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Obrigado pelo seu feedback!</h2>
            <p className="text-gray-600">Sua opinião é muito importante para nós.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getScoreLabel = (score: number) => {
    if (score <= 6) return "Detrator"
    if (score <= 8) return "Neutro"
    return "Promotor"
  }

  const getScoreColor = (score: number) => {
    if (score <= 6) return "text-red-600"
    if (score <= 8) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Pesquisa de Satisfação</CardTitle>
        <p className="text-center text-gray-600">De 0 a 10, o quanto você recomendaria nossa empresa?</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Score Selection */}
          <div className="space-y-4">
            <div className="grid grid-cols-11 gap-2">
              {Array.from({ length: 11 }, (_, i) => (
                <Button
                  key={i}
                  type="button"
                  variant={score === i ? "default" : "outline"}
                  className="aspect-square p-0"
                  onClick={() => setScore(i)}
                >
                  {i}
                </Button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Muito improvável</span>
              <span>Muito provável</span>
            </div>
            {score !== null && (
              <p className={`text-center font-medium ${getScoreColor(score)}`}>{getScoreLabel(score)}</p>
            )}
          </div>

          {/* Optional Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome (opcional)</label>
              <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Seu nome" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email (opcional)</label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Comentário (opcional)</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte-nos mais sobre sua experiência..."
                rows={4}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={score === null || isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

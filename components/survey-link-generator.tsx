"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, QrCode, Mail, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SurveyLinkGeneratorProps {
  surveyId: string
}

export function SurveyLinkGenerator({ surveyId }: SurveyLinkGeneratorProps) {
  const [channel, setChannel] = useState("web")
  const [segment, setSegment] = useState("")
  const { toast } = useToast()

  const generateLink = () => {
    const baseUrl = window.location.origin
    const params = new URLSearchParams()

    if (channel !== "web") params.set("channel", channel)
    if (segment) params.set("segment", segment)

    const queryString = params.toString()
    return `${baseUrl}/survey/${surveyId}${queryString ? `?${queryString}` : ""}`
  }

  const copyToClipboard = async () => {
    const link = generateLink()
    try {
      await navigator.clipboard.writeText(link)
      toast({
        title: "Link copiado!",
        description: "O link da pesquisa foi copiado para a área de transferência.",
      })
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      })
    }
  }

  const generateQRCode = () => {
    const link = generateLink()
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`
    window.open(qrUrl, "_blank")
  }

  const generateEmailTemplate = () => {
    const link = generateLink()
    const subject = "Sua opinião é importante para nós"
    const body = `Olá!

Gostaríamos muito de saber sua opinião sobre nossos serviços. Sua avaliação nos ajuda a melhorar continuamente.

Por favor, clique no link abaixo para responder nossa pesquisa rápida:
${link}

Obrigado pelo seu tempo!

Atenciosamente,
Equipe de Atendimento`

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Compartilhar Pesquisa
        </CardTitle>
        <CardDescription>Configure e gere links para compartilhar sua pesquisa NPS</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="channel">Canal</Label>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="qr_code">QR Code</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="segment">Segmento (opcional)</Label>
            <Input
              id="segment"
              placeholder="Ex: clientes-premium, suporte-tecnico"
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Link Gerado</Label>
          <div className="flex gap-2">
            <Input value={generateLink()} readOnly className="font-mono text-sm" />
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={generateQRCode} className="flex items-center gap-2 bg-transparent">
            <QrCode className="h-4 w-4" />
            Gerar QR Code
          </Button>

          <Button variant="outline" onClick={generateEmailTemplate} className="flex items-center gap-2 bg-transparent">
            <Mail className="h-4 w-4" />
            Template de Email
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

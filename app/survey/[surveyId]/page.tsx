"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { NPSFormStatic } from "@/components/nps-form-static"
import { supabase } from "@/lib/supabase/client-only"

interface Survey {
  id: string
  title: string
  description: string
  is_active: boolean
  company_id: string
}

export default function SurveyPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const surveyId = params.surveyId as string
  const channel = searchParams.get("channel") || "web"
  const segment = searchParams.get("segment")

  useEffect(() => {
    async function fetchSurvey() {
      try {
        const { data, error } = await supabase
          .from("nps_surveys")
          .select("id, title, description, is_active, company_id")
          .eq("id", surveyId)
          .eq("is_active", true)
          .single()

        if (error || !data) {
          setError(true)
        } else {
          setSurvey(data)
        }
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (surveyId) {
      fetchSurvey()
    }
  }, [surveyId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando pesquisa...</p>
        </div>
      </div>
    )
  }

  if (error || !survey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Pesquisa não encontrada</h1>
          <p className="text-gray-600">Esta pesquisa não existe ou não está mais ativa.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{survey.title}</h1>
          {survey.description && <p className="text-gray-600 dark:text-gray-300">{survey.description}</p>}
        </div>
        <NPSFormStatic surveyId={survey.id} />
      </div>
    </div>
  )
}

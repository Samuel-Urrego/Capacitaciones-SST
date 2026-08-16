import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  IconCheck,
  IconChevronLeft,
  IconShield,
} from '../components/ui'

const QUESTIONS_URL = '/questions.json'

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(QUESTIONS_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`No se pudo cargar el banco (HTTP ${res.status})`)
        return res.json()
      })
      .then((data) => {
        setQuestions(Array.isArray(data.questions) ? data.questions : [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const letter = (index) => String.fromCharCode(65 + index)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 pt-6">
        <Card className="flex items-center gap-3 px-5 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-xl">
            <IconShield className="h-5 w-5" />
          </span>
          <h1 className="text-lg font-bold text-white">Banco de preguntas</h1>
        </Card>
        <Link to="/admin">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-white/25">
            <IconChevronLeft className="h-4 w-4" />
            Volver al panel
          </span>
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8">
        {error ? (
          <Card className="mt-10 w-full p-8 text-center">
            <p className="font-semibold text-white">No se pudo cargar el banco</p>
            <p className="mt-1 text-sm text-white/70">{error}</p>
          </Card>
        ) : loading ? (
          <Card className="mt-10 w-full p-10 text-center">
            <p className="text-lg font-semibold text-white">Cargando preguntas…</p>
          </Card>
        ) : (
          <>
            <p className="mb-4 text-sm text-white/60">
              {questions.length} preguntas · La respuesta correcta está marcada
              en verde
            </p>
            <div className="space-y-4">
              {questions.map((q) => (
                <Card key={q.id} className="p-6">
                  <h2 className="font-bold text-white">
                    {q.id}. {q.question}
                  </h2>
                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {q.options.map((option, index) => {
                      const correct = index === q.correctIndex
                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm ${
                            correct
                              ? 'border-emerald-300/40 bg-emerald-400/15 text-emerald-100'
                              : 'border-white/15 bg-white/5 text-white/70'
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              correct
                                ? 'bg-emerald-400/30 text-emerald-100'
                                : 'bg-white/10 text-white/60'
                            }`}
                          >
                            {letter(index)}
                          </span>
                          <span className="flex-1">{option}</span>
                          {correct && (
                            <span className="flex items-center gap-1 text-xs font-semibold">
                              <IconCheck className="h-3.5 w-3.5" />
                              Correcta
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
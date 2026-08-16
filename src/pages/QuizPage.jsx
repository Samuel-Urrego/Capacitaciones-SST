import { useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button, Card, IconChevronLeft, IconChevronRight, IconShield } from '../components/ui'

const QUESTIONS_URL = '/questions.json'

export default function QuizPage() {
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)

  const courseCompleted = localStorage.getItem('course_completed') === 'true'

  useEffect(() => {
    if (!courseCompleted) return
    fetch(QUESTIONS_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`No se pudo cargar el quiz (HTTP ${res.status})`)
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

  const question = questions[index]

  const selectOption = useCallback(
    (optionIndex) => {
      const next = [...answers]
      next[index] = optionIndex
      setAnswers(next)
      setSelected(optionIndex)
    },
    [answers, index],
  )

  const goNext = useCallback(() => {
    setIndex((i) => i + 1)
    setSelected(answers[index + 1] ?? null)
  }, [answers, index])

  const goPrev = useCallback(() => {
    setIndex((i) => i - 1)
    setSelected(answers[index - 1] ?? null)
  }, [answers, index])

  const finish = useCallback(() => {
    const score = answers.filter((a, i) => a === questions[i]?.correctIndex).length
    navigate('/results', { state: { score, total: questions.length } })
  }, [answers, questions, navigate])

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 pt-6">
        <Card className="flex items-center gap-3 px-5 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-primary shadow-neumorph-sm">
            <IconShield className="h-5 w-5" />
          </span>
          <h1 className="text-lg font-bold text-primary">Quiz</h1>
        </Card>
        {!loading && !error && (
          <span className="rounded-full bg-surface px-4 py-2 text-sm font-medium text-slate-500 shadow-neumorph-sm">
            Pregunta {index + 1} de {questions.length}
          </span>
        )}
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8">
        {error ? (
          <Card className="mt-10 w-full p-8 text-center">
            <p className="font-semibold text-primary">No se pudo cargar el quiz</p>
            <p className="mt-1 text-sm text-slate-500">{error}</p>
            <p className="mt-3 text-sm text-slate-400">
              Verificá que el archivo esté en{' '}
              <code className="font-mono">public/questions.json</code>.
            </p>
          </Card>
        ) : loading ? (
          <Card className="mt-10 w-full p-10 text-center">
            <p className="text-lg font-semibold text-primary">Cargando preguntas…</p>
          </Card>
        ) : (
          <>
            <Card className="p-8">
              <h2 className="text-xl font-bold text-slate-700">
                {question.question}
              </h2>

              <div className="mt-6 space-y-3">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selected === optionIndex
  if (!courseCompleted) {
    return <Navigate to="/course" replace />
  }

  return (
                    <button
                      key={optionIndex}
                      type="button"
                      onClick={() => selectOption(optionIndex)}
                      className={`flex w-full items-center gap-4 rounded-2xl bg-surface px-5 py-4 text-left transition-all duration-150 ${
                        isSelected
                          ? 'text-primary shadow-neumorph-inset'
                          : 'text-slate-600 shadow-neumorph-sm hover:text-primary'
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          isSelected
                            ? 'bg-primary text-white shadow-neumorph-sm'
                            : 'bg-surface text-primary shadow-neumorph-sm'
                        }`}
                      >
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span className="text-sm">{option}</span>
                    </button>
                  )
                })}
              </div>
            </Card>

            <div className="mt-6 flex items-center justify-between gap-4">
              <Button
                variant="neutral"
                onClick={goPrev}
                disabled={index === 0}
                className="px-6 py-3"
              >
                <IconChevronLeft className="h-5 w-5" />
                Anterior
              </Button>

              {index === questions.length - 1 ? (
                <Button onClick={finish} className="px-8 py-3">
                  Ver resultado
                </Button>
              ) : (
                <Button onClick={goNext} className="px-8 py-3">
                  Siguiente
                  <IconChevronRight className="h-5 w-5" />
                </Button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

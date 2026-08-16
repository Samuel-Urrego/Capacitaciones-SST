import { useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/auth'
import { Button, Card, IconChevronLeft, IconChevronRight, IconShield } from '../components/ui'

const QUESTIONS_URL = '/questions.json'

export default function QuizPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)

  const [submitting, setSubmitting] = useState(false)

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
  }, [courseCompleted])

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

  const finish = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const score = answers.filter(
        (a, i) => a === questions[i]?.correctIndex,
      ).length
      const total = questions.length
      const percent = Math.round((score / total) * 100)

      // El porcentaje de aprobación lo configura la admin (tabla app_settings)
      const { data: settings } = await supabase
        .from('app_settings')
        .select('pass_threshold')
        .eq('id', 1)
        .maybeSingle()
      const threshold = settings?.pass_threshold ?? 70
      const passed = percent >= threshold

      const { data: attempt, error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          score,
          total,
          percent,
          passed,
        })
        .select()
        .single()
      if (attemptError) throw attemptError

      const answerRows = questions
        .map((q, i) => ({
          attempt_id: attempt.id,
          question_id: q.id,
          selected_option: answers[i],
          correct: answers[i] === q.correctIndex,
        }))
        .filter((row) => row.selected_option !== undefined)

      const { error: answersError } = await supabase
        .from('quiz_answers')
        .insert(answerRows)
      if (answersError) throw answersError

      navigate('/results', {
        state: { score, total, percent, passed, threshold },
      })
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }, [answers, questions, user, navigate, submitting])

  if (!courseCompleted) {
    return <Navigate to="/course" replace />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 pt-6">
        <Card className="flex items-center gap-3 px-5 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-xl">
            <IconShield className="h-5 w-5" />
          </span>
          <h1 className="text-lg font-bold text-white">Quiz</h1>
        </Card>
        {!loading && !error && (
          <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-xl">
            Pregunta {index + 1} de {questions.length}
          </span>
        )}
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8">
        {error ? (
          <Card className="mt-10 w-full p-8 text-center">
            <p className="font-semibold text-white">No se pudo cargar el quiz</p>
            <p className="mt-1 text-sm text-white/70">{error}</p>
            <p className="mt-3 text-sm text-white/50">
              Verificá que el archivo esté en{' '}
              <code className="font-mono">public/questions.json</code>.
            </p>
          </Card>
        ) : loading ? (
          <Card className="mt-10 w-full p-10 text-center">
            <p className="text-lg font-semibold text-white">
              Cargando preguntas…
            </p>
          </Card>
        ) : (
          <>
            <Card className="p-8">
              <h2 className="text-xl font-bold text-white">
                {question.question}
              </h2>

              <div className="mt-6 space-y-3">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selected === optionIndex
                  return (
                    <button
                      key={optionIndex}
                      type="button"
                      onClick={() => selectOption(optionIndex)}
                      className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-150 ${
                        isSelected
                          ? 'border-white/60 bg-white text-primary-dark shadow-lg shadow-blue-950/30'
                          : 'border-white/25 bg-white/10 text-white/80 backdrop-blur-xl hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          isSelected
                            ? 'bg-primary text-white'
                            : 'border border-white/30 bg-white/15 text-white'
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

            <div className="mt-6">
              <div className="flex items-center justify-between gap-4">
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
                  <Button
                    onClick={finish}
                    disabled={selected === null || submitting}
                    className="px-8 py-3"
                  >
                    {submitting ? 'Guardando…' : 'Ver resultado'}
                  </Button>
                ) : (
                  <Button
                    onClick={goNext}
                    disabled={selected === null}
                    className="px-8 py-3"
                  >
                    Siguiente
                    <IconChevronRight className="h-5 w-5" />
                  </Button>
                )}
              </div>
              {selected === null && (
                <p className="mt-4 text-center text-sm text-white/60">
                  Elegí una opción para poder continuar
                </p>
              )}
              {error && (
                <p className="mt-4 rounded-xl border border-red-300/30 bg-red-500/20 px-4 py-2.5 text-center text-sm text-red-100">
                  No se pudo guardar el resultado: {error}
                </p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

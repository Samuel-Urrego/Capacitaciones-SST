import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import {
  Button,
  Card,
  IconCheck,
  IconChevronDown,
  IconShield,
} from '../components/ui'

export default function AdminPage() {
  const [userCount, setUserCount] = useState(0)
  const [attempts, setAttempts] = useState([])
  const [threshold, setThreshold] = useState(70)
  const [thresholdInput, setThresholdInput] = useState('70')
  const [savingThreshold, setSavingThreshold] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [{ count }, { data: attemptsData }, { data: settings }] =
          await Promise.all([
            supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true }),
            supabase
              .from('quiz_attempts')
              .select('*, profiles(email, full_name)')
              .order('created_at', { ascending: false }),
            supabase
              .from('app_settings')
              .select('pass_threshold')
              .eq('id', 1)
              .maybeSingle(),
          ])
        setUserCount(count ?? 0)
        setAttempts(attemptsData || [])
        const t = settings?.pass_threshold ?? 70
        setThreshold(t)
        setThresholdInput(String(t))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const attemptCount = attempts.length
  const passRate =
    attemptCount > 0
      ? Math.round(
          (attempts.filter((a) => a.passed).length / attemptCount) * 100,
        )
      : 0

  const toggleExpand = useCallback(
    async (attemptId) => {
      if (expanded === attemptId) {
        setExpanded(null)
        return
      }
      setExpanded(attemptId)
      if (!answers[attemptId]) {
        const { data } = await supabase
          .from('quiz_answers')
          .select('*')
          .eq('attempt_id', attemptId)
          .order('question_id')
        setAnswers((prev) => ({ ...prev, [attemptId]: data || [] }))
      }
    },
    [expanded, answers],
  )

  const saveThreshold = async () => {
    const value = Math.min(100, Math.max(0, parseInt(thresholdInput, 10) || 0))
    setSavingThreshold(true)
    setError(null)
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({ pass_threshold: value, updated_at: new Date().toISOString() })
        .eq('id', 1)
      if (error) throw error
      setThreshold(value)
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingThreshold(false)
    }
  }

  const optionLetter = (index) => String.fromCharCode(65 + index)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 pt-6">
        <Card className="flex items-center gap-3 px-5 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-xl">
            <IconShield className="h-5 w-5" />
          </span>
          <h1 className="text-lg font-bold text-white">Panel admin</h1>
        </Card>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8">
        {error && (
          <p className="mb-4 rounded-xl border border-red-300/30 bg-red-500/20 px-4 py-2.5 text-sm text-red-100">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-white">
              {loading ? '…' : userCount}
            </p>
            <p className="mt-1 text-xs uppercase tracking-widest text-white/60">
              Usuarios
            </p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-white">
              {loading ? '…' : attemptCount}
            </p>
            <p className="mt-1 text-xs uppercase tracking-widest text-white/60">
              Intentos
            </p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-white">
              {loading ? '…' : `${passRate}%`}
            </p>
            <p className="mt-1 text-xs uppercase tracking-widest text-white/60">
              Aprobación
            </p>
          </Card>
        </div>

        <Card className="mt-8 p-6">
          <h2 className="font-bold text-white">Porcentaje para aprobar</h2>
          <p className="mt-1 text-sm text-white/60">
            Actual: {threshold}% — el quiz marca aprobado cuando el puntaje
            alcanza este valor.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="100"
              value={thresholdInput}
              onChange={(e) => setThresholdInput(e.target.value)}
              className="w-24 rounded-2xl border border-white/30 bg-white/15 px-4 py-2.5 text-center text-white outline-none backdrop-blur-xl focus:border-white/60"
            />
            <span className="text-white/60">%</span>
            <Button
              onClick={saveThreshold}
              disabled={savingThreshold}
              className="px-5 py-2.5"
            >
              {savingThreshold ? 'Guardando…' : 'Guardar'}
            </Button>
          </div>
        </Card>

        <Card className="mt-8 overflow-hidden p-6">
          <h2 className="mb-4 font-bold text-white">Intentos por usuario</h2>
          {attemptCount === 0 ? (
            <p className="py-6 text-center text-sm text-white/50">
              Todavía no hay intentos registrados.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-widest text-white/50">
                    <th className="pb-3">Usuario</th>
                    <th className="pb-3">Fecha</th>
                    <th className="pb-3">Puntaje</th>
                    <th className="pb-3">Resultado</th>
                    <th className="pb-3" />
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => (
                    <FragmentRow
                      key={attempt.id}
                      attempt={attempt}
                      expanded={expanded === attempt.id}
                      answers={answers[attempt.id]}
                      onToggle={() => toggleExpand(attempt.id)}
                      optionLetter={optionLetter}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}

function FragmentRow({
  attempt,
  expanded,
  answers,
  onToggle,
  optionLetter,
}) {
  const user = attempt.profiles
  const date = new Date(attempt.created_at).toLocaleString('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
  return (
    <>
      <tr className="border-t border-white/15 text-white/80">
        <td className="py-3">
          {user?.full_name || '—'}
          <div className="text-xs text-white/50">{user?.email || '—'}</div>
        </td>
        <td className="py-3">{date}</td>
        <td className="py-3 font-semibold text-white">
          {attempt.score}/{attempt.total} ({attempt.percent}%)
        </td>
        <td className="py-3">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
              attempt.passed
                ? 'bg-emerald-400/20 text-emerald-100'
                : 'bg-red-400/20 text-red-100'
            }`}
          >
            {attempt.passed ? (
              <IconCheck className="h-3 w-3" />
            ) : (
              '✕'
            )}
            {attempt.passed ? 'Aprobado' : 'No aprobado'}
          </span>
        </td>
        <td className="py-3 text-right">
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs text-white/80 backdrop-blur-xl transition hover:bg-white/20"
          >
            Respuestas
            <IconChevronDown
              className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="border-t border-white/10">
          <td colSpan={5} className="py-4">
            {!answers ? (
              <p className="text-sm text-white/50">Cargando respuestas…</p>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {answers.map((answer) => (
                  <div
                    key={answer.id}
                    className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm ${
                      answer.correct
                        ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100'
                        : 'border-red-300/30 bg-red-400/10 text-red-100'
                    }`}
                  >
                    <span className="font-medium">
                      Pregunta {answer.question_id}
                    </span>
                    <span className="flex items-center gap-2">
                      Elegida: {optionLetter(answer.selected_option)}
                      <span className="opacity-70">
                        {answer.correct ? '✓ correcta' : '✕ incorrecta'}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  )
}
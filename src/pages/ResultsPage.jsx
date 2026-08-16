import { useLocation } from 'react-router-dom'
import { Card, IconCheck, IconShield } from '../components/ui'

const PASS_THRESHOLD = 70 // La admin lo va a poder configurar desde Supabase

export default function ResultsPage() {
  const location = useLocation()
  const { score = 0, total = 0 } = location.state || {}
  const percent = total > 0 ? Math.round((score / total) * 100) : 0
  const passed = percent >= PASS_THRESHOLD

  const radius = 64
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 pt-6">
        <Card className="flex items-center gap-3 px-5 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-primary shadow-neumorph-sm">
            <IconShield className="h-5 w-5" />
          </span>
          <h1 className="text-lg font-bold text-primary">Resultado</h1>
        </Card>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-4 py-10">
        <Card className="w-full max-w-md p-10 text-center">
          <div className="relative mx-auto flex h-44 w-44 items-center justify-center">
            <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                strokeWidth="14"
                className="stroke-slate-200/80"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className={`transition-all duration-700 ${
                  passed ? 'stroke-emerald-500' : 'stroke-primary'
                }`}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold text-primary">{percent}%</span>
              <span className="mt-1 text-xs uppercase tracking-widest text-slate-400">
                tu puntaje
              </span>
            </div>
          </div>

          <div
            className={`mx-auto mt-8 flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-neumorph-sm ${
              passed ? 'text-emerald-600' : 'text-primary'
            }`}
          >
            <IconCheck className="h-4 w-4" />
            {passed
              ? '¡Aprobaste la capacitación!'
              : 'No llegaste al mínimo para aprobar'}
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Respondiste correctamente {score} de {total} preguntas
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Mínimo para aprobar: {PASS_THRESHOLD}%
          </p>
        </Card>
      </main>
    </div>
  )
}

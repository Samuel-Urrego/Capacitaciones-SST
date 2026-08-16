import { Button, Card, IconShield } from '../components/ui'

const DEMO_OPTIONS = [
  'La definición de accidente de trabajo',
  'El color del casco de seguridad',
  'La dirección de la oficina',
  'El horario de almuerzo',
]

export default function QuizPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 pt-6">
        <Card className="flex items-center gap-3 px-5 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-primary shadow-neumorph-sm">
            <IconShield className="h-5 w-5" />
          </span>
          <h1 className="text-lg font-bold text-primary">Quiz</h1>
        </Card>
        <span className="rounded-full bg-surface px-4 py-2 text-sm font-medium text-slate-500 shadow-neumorph-sm">
          Pregunta 1 de 10
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8">
        <Card className="p-8">
          <h2 className="text-xl font-bold text-slate-700">
            ¿Cuál de las siguientes es correcta según la capacitación?
          </h2>

          <div className="mt-6 space-y-3">
            {DEMO_OPTIONS.map((option, index) => (
              <button
                key={option}
                type="button"
                className="flex w-full cursor-not-allowed items-center gap-4 rounded-2xl bg-surface px-5 py-4 text-left text-slate-600 shadow-neumorph-sm opacity-70"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-sm font-bold text-primary shadow-neumorph-sm">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-sm">{option}</span>
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Las preguntas del quiz van acá, basadas en la capacitación.
          </p>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button disabled className="px-8 py-3">
            Siguiente
          </Button>
        </div>
      </main>
    </div>
  )
}

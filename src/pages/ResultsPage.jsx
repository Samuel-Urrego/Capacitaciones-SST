import { Card, IconShield } from '../components/ui'

export default function ResultsPage() {
  const score = 0
  const passThreshold = 70

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
          <div className="relative mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-surface shadow-neumorph-inset">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-primary">
                {score}%
              </span>
              <span className="mt-1 text-xs uppercase tracking-widest text-slate-400">
                tu puntaje
              </span>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-500">
            Mínimo para aprobar: {passThreshold}%
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Acá se muestra el puntaje del quiz y si aprobaste la capacitación.
          </p>
        </Card>
      </main>
    </div>
  )
}

import { Card, IconShield } from '../components/ui'

const DEMO_ROWS = [
  { user: 'usuario@ejemplo.com', score: '—', date: '—' },
  { user: 'usuario2@ejemplo.com', score: '—', date: '—' },
]

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 pt-6">
        <Card className="flex items-center gap-3 px-5 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-primary shadow-neumorph-sm">
            <IconShield className="h-5 w-5" />
          </span>
          <h1 className="text-lg font-bold text-primary">Panel admin</h1>
        </Card>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-primary">0</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-slate-400">
              Usuarios
            </p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-primary">0</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-slate-400">
              Capacitaciones tomadas
            </p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-primary">0%</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-slate-400">
              Aprobación
            </p>
          </Card>
        </div>

        <Card className="mt-8 overflow-hidden p-6">
          <h2 className="mb-4 font-bold text-slate-700">
            Respuestas por usuario
          </h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-widest text-slate-400">
                <th className="pb-3">Usuario</th>
                <th className="pb-3">Puntaje</th>
                <th className="pb-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_ROWS.map((row) => (
                <tr
                  key={row.user}
                  className="border-t border-slate-200/70 text-slate-600"
                >
                  <td className="py-3">{row.user}</td>
                  <td className="py-3">{row.score}</td>
                  <td className="py-3">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-center text-xs text-slate-400">
            Acá la admin ve las respuestas de cada usuario y configura el
            porcentaje de aprobación.
          </p>
        </Card>
      </main>
    </div>
  )
}

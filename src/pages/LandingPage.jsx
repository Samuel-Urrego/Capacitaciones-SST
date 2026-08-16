import { Link } from 'react-router-dom'
import { Card, IconChevronRight, IconShield } from '../components/ui'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 pt-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-primary shadow-neumorph-sm">
            <IconShield className="h-5 w-5" />
          </span>
          <h1 className="text-lg font-bold text-primary">Capacitaciones SST</h1>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg p-10 text-center sm:p-14">
          <span className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface text-primary shadow-neumorph">
            <IconShield className="h-12 w-12" />
          </span>

          <h2 className="text-2xl font-bold text-slate-700 sm:text-3xl">
            Sandra Milena Valencia Quivano
          </h2>
          <p className="mt-2 text-base font-medium text-primary sm:text-lg">
            Inducción en Seguridad y Salud en el Trabajo
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
            Completá la capacitación página a página y al final resolvé el quiz
            para obtener tu certificación.
          </p>

          <div className="mt-10">
            <Link to="/course">
              <div className="group flex flex-col items-center justify-center rounded-3xl bg-surface p-8 text-center shadow-neumorph transition-all duration-150 hover:shadow-neumorph-inset">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-neumorph-sm transition group-hover:shadow-neumorph-inset">
                  <IconChevronRight className="h-6 w-6" />
                </span>
                <p className="mt-4 text-lg font-bold text-primary">
                  Comenzar capacitación
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Leé el material página por página y después hacé el quiz
                </p>
              </div>
            </Link>
          </div>
        </Card>
      </main>

      <footer className="mx-auto w-full max-w-4xl px-4 pb-6 text-center">
        <p className="text-xs text-slate-400">
          Capacitaciones SST · Seguridad y Salud en el Trabajo
        </p>
      </footer>
    </div>
  )
}

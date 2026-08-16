import { Link } from 'react-router-dom'
import { Card, IconChevronRight, IconShield } from '../components/ui'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 pt-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-xl">
            <IconShield className="h-5 w-5" />
          </span>
          <h1 className="text-lg font-bold text-white">Capacitaciones SST</h1>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg p-10 text-center sm:p-14">
          <span className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-xl">
            <IconShield className="h-12 w-12" />
          </span>

          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Sandra Milena Valencia Quivano
          </h2>
          <p className="mt-2 text-base font-medium text-sky-100 sm:text-lg">
            Inducción en Seguridad y Salud en el Trabajo
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/70">
            Completá la capacitación página a página y al final resolvé el quiz
            para obtener tu certificación.
          </p>

          <div className="mt-10">
            <Link to="/course">
              <div className="group flex flex-col items-center justify-center rounded-3xl border border-white/25 bg-white/10 p-8 text-center backdrop-blur-xl transition-all duration-150 hover:bg-white/20">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary-dark shadow-lg shadow-blue-950/30 transition group-hover:scale-105">
                  <IconChevronRight className="h-6 w-6" />
                </span>
                <p className="mt-4 text-lg font-bold text-white">
                  Comenzar capacitación
                </p>
                <p className="mt-1 text-sm text-white/70">
                  Leé el material página por página y después hacé el quiz
                </p>
              </div>
            </Link>
          </div>
        </Card>

        <div className="mt-6">
          <Link to="/login">
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-150 hover:bg-white/25 active:scale-[0.98]">
              Admin dashboard
            </div>
          </Link>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-4xl px-4 pb-6 text-center">
        <p className="text-xs text-white/50">
          Capacitaciones SST · Seguridad y Salud en el Trabajo
        </p>
      </footer>
    </div>
  )
}

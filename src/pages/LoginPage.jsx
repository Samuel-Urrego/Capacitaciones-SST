import { Button, Card, IconShield, Input } from '../components/ui'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-xl">
            <IconShield className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-white">Capacitaciones SST</h1>
          <p className="mt-1 text-sm text-white/70">
            Iniciá sesión para continuar
          </p>
        </div>

        <form className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-white/80"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-white/80"
            >
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <Button className="w-full py-3.5 text-base">Ingresar</Button>
        </form>
      </Card>
    </div>
  )
}

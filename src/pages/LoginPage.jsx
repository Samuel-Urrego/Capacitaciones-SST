import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/auth'
import {
  Button,
  Card,
  IconEye,
  IconEyeOff,
  IconShield,
  Input,
} from '../components/ui'

export default function LoginPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to="/course" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setSubmitting(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        navigate('/course', { replace: true })
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        })
        if (error) throw error
        setMessage(
          'Cuenta creada. Revisá tu email para confirmar el correo y después iniciá sesión.',
        )
        setMode('login')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const switchMode = (next) => {
    setMode(next)
    setError(null)
    setMessage(null)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-xl">
            <IconShield className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-white">Capacitaciones SST</h1>
          <p className="mt-1 text-sm text-white/70">
            {mode === 'login' ? 'Iniciá sesión para continuar' : 'Creá tu cuenta'}
          </p>
        </div>

        <div className="mb-6 flex rounded-2xl border border-white/20 bg-white/10 p-1 backdrop-blur-xl">
          {['login', 'register'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 ${
                mode === m
                  ? 'bg-white text-primary-dark shadow-lg shadow-blue-950/30'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {m === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          ))}
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div>
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-sm font-medium text-white/80"
              >
                Nombre completo
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                autoComplete="name"
                required
              />
            </div>
          )}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-white/80"
            >
              Contraseña
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                minLength={6}
                required
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/60 transition hover:text-white"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <IconEyeOff className="h-5 w-5" />
                ) : (
                  <IconEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-xl border border-red-300/30 bg-red-500/20 px-4 py-2.5 text-sm text-red-100">
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-xl border border-emerald-300/30 bg-emerald-500/20 px-4 py-2.5 text-sm text-emerald-100">
              {message}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 text-base"
          >
            {submitting
              ? 'Un momento…'
              : mode === 'login'
                ? 'Ingresar'
                : 'Crear cuenta'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { Button, Card, IconCheck, IconShield } from '../components/ui'

export default function ConfirmEmailPage() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [error, setError] = useState(null)
  const processed = useRef(false)

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    const tokenHash = params.get('token_hash')
    if (!tokenHash) {
      setStatus('error')
      setError('Falta el token de confirmación en el link.')
      return
    }

    supabase.auth
      .verifyOtp({
        token_hash: tokenHash,
        type: (params.get('type') || 'email'),
      })
      .then(({ error: verifyError }) => {
        if (verifyError) {
          setStatus('error')
          setError(verifyError.message)
        } else {
          setStatus('success')
        }
      })
  }, [params])

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md p-10 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-xl">
          <IconShield className="h-10 w-10" />
        </div>

        {status === 'loading' && (
          <>
            <h1 className="text-2xl font-bold text-white">
              Confirmando tu correo…
            </h1>
            <p className="mt-2 text-sm text-white/70">Un momentito</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-100">
              <IconCheck className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              ¡Email confirmado!
            </h1>
            <p className="mt-2 text-sm text-white/70">
              Tu cuenta ya está activa. Ahora sí, a capacitarte.
            </p>
            <Link to="/login" className="mt-6 block">
              <Button className="w-full py-3.5 text-base">
                Iniciar sesión
              </Button>
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold text-white">
              No se pudo confirmar
            </h1>
            <p className="mt-2 text-sm text-white/70">{error}</p>
            <p className="mt-3 text-xs text-white/50">
              Si el link expiró, creá tu cuenta de nuevo y confirmás con el
              nuevo email.
            </p>
            <Link to="/login" className="mt-6 block">
              <Button variant="neutral" className="w-full py-3.5 text-base">
                Volver al inicio de sesión
              </Button>
            </Link>
          </>
        )}
      </Card>
    </div>
  )
}
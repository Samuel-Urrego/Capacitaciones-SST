import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import HTMLFlipBook from 'react-pageflip'
import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import {
  Button,
  Card,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconShield,
  IconStop,
  IconVolume,
} from '../components/ui'

const PDF_URL = '/course.pdf'
const RENDER_WIDTH = 1000

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

export default function CoursePage() {
  const flipRef = useRef(null)

  const [pages, setPages] = useState([])
  const [current, setCurrent] = useState(0)
  const [total, setTotal] = useState(0)
  const [bookSize, setBookSize] = useState({ width: 900, height: 600 })
  const [loading, setLoading] = useState(true)
  const [renderProgress, setRenderProgress] = useState(0)
  const [error, setError] = useState(null)
  const [autoplay, setAutoplay] = useState(true)
  const [speaking, setSpeaking] = useState(false)

  const speakText = useCallback((text) => {
    if (!text || !('speechSynthesis' in window)) return
    speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    utterance.rate = 0.95
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    speechSynthesis.speak(utterance)
  }, [])

  const stopAudio = useCallback(() => {
    if ('speechSynthesis' in window) speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  const flipTo = useCallback(
    (direction) => {
      const flip = flipRef.current?.pageFlip?.()
      if (!flip) return
      if (direction > 0) flip.flipNext()
      else flip.flipPrev()
    },
    [],
  )

  const handleFlip = useCallback(
    (e) => {
      const index = e.data
      setCurrent(index)
      if (autoplay) speakText(pages[index]?.text)
    },
    [autoplay, pages, speakText],
  )

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const pdf = await pdfjsLib.getDocument({ url: PDF_URL }).promise
        if (cancelled) return

        const items = []
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const baseViewport = page.getViewport({ scale: 1 })
          const scale = RENDER_WIDTH / baseViewport.width
          const viewport = page.getViewport({ scale })

          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          const ctx = canvas.getContext('2d')
          await page.render({ canvasContext: ctx, viewport }).promise

          const textContent = await page.getTextContent()
          const text = textContent.items.map((item) => item.str).join(' ').trim()

          items.push({ src: canvas.toDataURL('image/jpeg', 0.9), text })

          if (i === 1) {
            setBookSize({
              width: 900,
              height: Math.round(900 * (viewport.height / viewport.width)),
            })
          }
          setRenderProgress(i)
        }
        if (cancelled) return

        setPages(items)
        setTotal(items.length)
        setCurrent(0)
        setLoading(false)
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
      stopAudio()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 pt-6">
        <Card className="flex items-center gap-3 px-5 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-primary shadow-neumorph-sm">
            <IconShield className="h-5 w-5" />
          </span>
          <h1 className="text-lg font-bold text-primary">Capacitación SST</h1>
        </Card>
        <span className="rounded-full bg-surface px-4 py-2 text-sm font-medium text-slate-500 shadow-neumorph-sm">
          Inducción en SST
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-4 py-6">
        {error ? (
          <Card className="mt-10 w-full max-w-md p-8 text-center">
            <p className="font-semibold text-primary">
              No se pudo abrir la capacitación
            </p>
            <p className="mt-1 text-sm text-slate-500">{error}</p>
            <p className="mt-3 text-sm text-slate-400">
              Verificá que el archivo esté en{' '}
              <code className="font-mono">public/course.pdf</code> (exportado
              desde PowerPoint: Archivo → Guardar como → PDF).
            </p>
          </Card>
        ) : loading ? (
          <Card className="mt-10 w-full max-w-md p-10 text-center">
            <p className="text-lg font-semibold text-primary">
              Preparando el libro…
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Renderizando página {renderProgress} de{' '}
              {total || '…'} — un momentito
            </p>
          </Card>
        ) : (
          <>
            <Card className="w-full overflow-x-auto p-4">
              <div className="mx-auto flex justify-center">
                <HTMLFlipBook
                  ref={flipRef}
                  width={bookSize.width}
                  height={bookSize.height}
                  onFlip={handleFlip}
                  showCover={false}
                  mobileScrollSupport
                  maxShadowOpacity={0.35}
                  drawShadow
                  flippingTime={450}
                  style={{ backgroundColor: 'transparent' }}
                >
                  {pages.map((page, index) => (
                    <div
                      key={index}
                      className="page"
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#ffffff',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={page.src}
                        alt={`Página ${index + 1}`}
                        className="block h-full w-full object-contain"
                      />
                    </div>
                  ))}
                </HTMLFlipBook>
              </div>
            </Card>

            <div className="mt-6 flex w-full items-center justify-between gap-4">
              <Button
                variant="neutral"
                onClick={() => flipTo(-1)}
                disabled={current === 0}
                className="h-14 w-14 shrink-0 rounded-full p-0"
                aria-label="Página anterior"
              >
                <IconChevronLeft className="h-6 w-6" />
              </Button>

              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-24 flex-col items-center justify-center rounded-2xl bg-surface shadow-neumorph-sm">
                  <span className="text-xl font-bold leading-none text-primary">
                    {current + 1}
                  </span>
                  <span className="mt-1 text-[10px] uppercase tracking-widest text-slate-400">
                    de {total}
                  </span>
                </div>
                {current === total - 1 && (
                  <Link to="/quiz">
                    <Button className="px-5 py-2.5">
                      <IconCheck className="h-5 w-5" />
                      Ir al quiz
                    </Button>
                  </Link>
                )}
              </div>

              <Button
                variant="primary"
                onClick={() => flipTo(1)}
                disabled={current === total - 1}
                className="h-14 w-14 shrink-0 rounded-full p-0"
                aria-label="Página siguiente"
              >
                <IconChevronRight className="h-6 w-6" />
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <label className="flex cursor-pointer items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-medium text-slate-600 shadow-neumorph-sm transition hover:text-primary">
                <input
                  type="checkbox"
                  checked={autoplay}
                  onChange={(e) => {
                    setAutoplay(e.target.checked)
                    if (!e.target.checked) stopAudio()
                  }}
                  className="h-4 w-4 accent-primary"
                />
                Leer página automáticamente
              </label>
              <Button
                variant="neutral"
                onClick={() =>
                  speaking ? stopAudio() : speakText(pages[current]?.text)
                }
                disabled={!pages[current]?.text}
                className="px-5 py-2.5"
              >
                {speaking ? (
                  <IconStop className="h-5 w-5" />
                ) : (
                  <IconVolume className="h-5 w-5" />
                )}
                {speaking ? 'Detener audio' : 'Leer esta página'}
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

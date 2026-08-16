import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { init } from 'pptx-preview'
import JSZip from 'jszip'
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

const PPT_URL = '/course.pptx'

export default function CoursePage() {
  const wrapperRef = useRef(null)
  const viewerRef = useRef(null)

  const [slideTexts, setSlideTexts] = useState([])
  const [current, setCurrent] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
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

  const goTo = useCallback(
    (index) => {
      const viewer = viewerRef.current
      if (!viewer) return
      viewer.renderSingleSlide(index)
      setCurrent(index)
      if (autoplay) speakText(slideTexts[index])
    },
    [autoplay, slideTexts, speakText],
  )

  useEffect(() => {
    let cancelled = false
    let viewer = null

    async function load() {
      try {
        const res = await fetch(PPT_URL)
        if (!res.ok) {
          throw new Error(`No se pudo cargar el PowerPoint (HTTP ${res.status})`)
        }
        const buffer = await res.arrayBuffer()

        // Extrae el texto de cada diapositiva para el audio por página
        const zip = await JSZip.loadAsync(buffer)
        const texts = []
        const slideFiles = Object.keys(zip.files)
          .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
          .sort(
            (a, b) =>
              parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10),
          )
        for (const name of slideFiles) {
          const xml = await zip.file(name).async('text')
          const text = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)]
            .map((m) => m[1])
            .join(' ')
            .trim()
          texts.push(text)
        }
        if (cancelled) return
        setSlideTexts(texts)

        viewer = init(wrapperRef.current, { width: 960, height: 540 })
        viewerRef.current = viewer
        await viewer.preview(buffer)
        if (cancelled) return

        setTotal(viewer.slideCount)
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
      viewerRef.current = null
      try {
        viewer?.destroy?.()
      } catch {
        // wrapper may already be unmounted
      }
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
              <code className="font-mono">public/course.pptx</code>.
            </p>
          </Card>
        ) : (
          <>
            <Card className="w-full overflow-x-auto p-4">
              <div ref={wrapperRef} className="mx-auto flex justify-center" />
            </Card>

            <div className="mt-6 flex w-full items-center justify-between gap-4">
              <Button
                variant="neutral"
                onClick={() => goTo(Math.max(0, current - 1))}
                disabled={loading || current === 0}
                className="h-14 w-14 shrink-0 rounded-full p-0"
                aria-label="Página anterior"
              >
                <IconChevronLeft className="h-6 w-6" />
              </Button>

              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-24 flex-col items-center justify-center rounded-2xl bg-surface shadow-neumorph-sm">
                  <span className="text-xl font-bold leading-none text-primary">
                    {loading ? '…' : current + 1}
                  </span>
                  <span className="mt-1 text-[10px] uppercase tracking-widest text-slate-400">
                    de {loading ? '…' : total}
                  </span>
                </div>
                {!loading && current === total - 1 && (
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
                onClick={() => goTo(Math.min(total - 1, current + 1))}
                disabled={loading || current === total - 1}
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
                  speaking ? stopAudio() : speakText(slideTexts[current])
                }
                disabled={loading || !slideTexts[current]}
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

import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { init } from 'pptx-preview'
import JSZip from 'jszip'

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
        // wrapper puede ya no estar montado
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-slate-800">Capacitación SST</h1>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-4 py-6">
        {error ? (
          <div className="rounded-xl bg-red-50 p-6 text-center shadow">
            <p className="font-semibold text-red-700">No se pudo abrir la capacitación</p>
            <p className="mt-1 text-sm text-red-600">{error}</p>
            <p className="mt-3 text-sm text-slate-600">
              Verificá que el archivo esté en <code className="font-mono">public/course.pptx</code>.
            </p>
          </div>
        ) : (
          <>
            <div className="w-full rounded-xl bg-white p-4 shadow">
              <div ref={wrapperRef} className="mx-auto flex justify-center" />
            </div>

            <div className="mt-4 flex w-full items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => goTo(Math.max(0, current - 1))}
                disabled={loading || current === 0}
                className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-white transition hover:bg-slate-700 disabled:opacity-40"
              >
                Anterior
              </button>

              <div className="text-center">
                <span className="text-sm font-medium text-slate-600">
                  Página {loading ? '…' : current + 1} de {loading ? '…' : total}
                </span>
                {!loading && current === total - 1 && (
                  <div className="mt-2">
                    <Link
                      to="/quiz"
                      className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-500"
                    >
                      Ir al quiz →
                    </Link>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => goTo(Math.min(total - 1, current + 1))}
                disabled={loading || current === total - 1}
                className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-white transition hover:bg-slate-700 disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={autoplay}
                  onChange={(e) => {
                    setAutoplay(e.target.checked)
                    if (!e.target.checked) stopAudio()
                  }}
                  className="h-4 w-4"
                />
                Leer página automáticamente
              </label>
              <button
                type="button"
                onClick={() =>
                  speaking ? stopAudio() : speakText(slideTexts[current])
                }
                disabled={loading || !slideTexts[current]}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
              >
                {speaking ? 'Detener audio' : 'Leer esta página'}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

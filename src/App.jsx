import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GlassBackground from './components/GlassBackground'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const CoursePage = lazy(() => import('./pages/CoursePage'))
const QuizPage = lazy(() => import('./pages/QuizPage'))
const ResultsPage = lazy(() => import('./pages/ResultsPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-white/80">Cargando…</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <GlassBackground />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App

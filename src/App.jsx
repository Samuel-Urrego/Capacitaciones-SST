import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import GlassBackground from './components/GlassBackground'
import { AuthProvider, useAuth } from './lib/auth'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const ConfirmEmailPage = lazy(() => import('./pages/ConfirmEmailPage'))
const CoursePage = lazy(() => import('./pages/CoursePage'))
const QuizPage = lazy(() => import('./pages/QuizPage'))
const ResultsPage = lazy(() => import('./pages/ResultsPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const AdminQuestionsPage = lazy(() => import('./pages/AdminQuestionsPage'))

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-white/80">Cargando…</p>
    </div>
  )
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loading />
  if (!user) return <Navigate to="/login" replace />
  return children
}

function RequireAdmin({ children }) {
  const { user, profile, loading } = useAuth()
  if (loading) return <Loading />
  if (!user) return <Navigate to="/login" replace />
  if (!profile || profile.role !== 'admin') return <Navigate to="/course" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlassBackground />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/confirm" element={<ConfirmEmailPage />} />
            <Route
              path="/course"
              element={
                <RequireAuth>
                  <CoursePage />
                </RequireAuth>
              }
            />
            <Route
              path="/quiz"
              element={
                <RequireAuth>
                  <QuizPage />
                </RequireAuth>
              }
            />
            <Route
              path="/results"
              element={
                <RequireAuth>
                  <ResultsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminPage />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/questions"
              element={
                <RequireAdmin>
                  <AdminQuestionsPage />
                </RequireAdmin>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from './context/AuthContext'
import ThemeProvider from './components/theme/ThemeProvider'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ChoiceScreen from './pages/ChoiceScreen'
import Pricing from './pages/Pricing'
import ForgotPassword from './pages/ForgotPassword'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Dashboard from './pages/Dashboard'
import Analysis from './pages/Analysis'
import History from './pages/History'
import AnalysisDetail from './pages/AnalysisDetail'

// Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PageTransition from './components/layout/PageTransition'
import { LoadingScreen } from './components/ui/Loader'

function RouteEffects() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.slice(1)
      const timeoutId = window.setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 0)

      return () => window.clearTimeout(timeoutId)
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    return undefined
  }, [location.pathname, location.hash])

  return null
}

// Layout wrapper for authenticated pages
function AuthenticatedLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  )
}

// Layout wrapper for public pages (with navbar/footer)
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  )
}

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}

// Public route wrapper (redirect to dashboard if logged in)
function PublicRoute({ children, showLayout = false }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return showLayout ? <PublicLayout>{children}</PublicLayout> : <PageTransition>{children}</PageTransition>
}

function NotFoundRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  return <Navigate to={user ? '/dashboard' : '/'} replace />
}

export default function App() {
  return (
    <ThemeProvider>
      <RouteEffects />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Landing page */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Landing />
              </PublicLayout>
            }
          />

          {/* Auth routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/choice-screen"
            element={
              <ProtectedRoute>
                <ChoiceScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <Pricing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/terms"
            element={
              <PublicLayout>
                <Terms />
              </PublicLayout>
            }
          />
          <Route
            path="/privacy"
            element={
              <PublicLayout>
                <Privacy />
              </PublicLayout>
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyze"
            element={
              <ProtectedRoute>
                <Analysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis/:id"
            element={
              <ProtectedRoute>
                <AnalysisDetail />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<NotFoundRoute />} />
        </Routes>
      </AnimatePresence>
    </ThemeProvider >
  )
}

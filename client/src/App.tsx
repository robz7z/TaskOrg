import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.js'
import { ProtectedRoute } from './components/ProtectedRoute.js'
import { Login } from './pages/Login.js'
import { Dashboard } from './pages/Dashboard.js'
import { ProjectDetail } from './pages/ProjectDetail.js'
import { Projects } from './pages/Projects.js'
import { Toaster } from 'sonner'
import { SkeletonTheme } from 'react-loading-skeleton'

function App() {
  return (
    <SkeletonTheme baseColor="#1e293b" highlightColor="#334155">
      <AuthProvider>
          <Toaster position="bottom-right" theme="dark" richColors />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                }
              />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SkeletonTheme>
  )
}

export default App
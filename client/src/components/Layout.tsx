import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Menu, 
  LayoutDashboard, 
  Folder, 
  LogOut, 
  User,
  GitBranch
} from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - mobile overlay, desktop fixa */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:w-64 lg:z-auto
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center gap-2 border-b border-border">
            <GitBranch className="w-6 h-6 text-primary" />
            <span className="font-bold text-foreground text-lg">TaskOrg</span>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center px-3 py-2 rounded-lg bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 transition"
              onClick={() => setSidebarOpen(false)}
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Dashboard
            </Link>
            <Link
              to="/projects"
              className="flex items-center px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition"
              onClick={() => setSidebarOpen(false)}
            >
              <Folder className="w-5 h-5 mr-2" />
              Projetos
            </Link>
          </nav>

          <div className="p-3 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 rounded-lg text-error cursor-pointer hover:bg-error-container hover:text-on-error-container transition"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay escuro para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Header com hambúrguer + perfil */}
        <header className="h-14 bg-surface/80 backdrop-blur-xl border-b border-border z-30 flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm text-foreground hidden sm:inline">
              {user?.name || 'Usuário'}
            </span>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="w-4 h-4 text-on-primary" />
            </div>
          </div>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1 p-4 md:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
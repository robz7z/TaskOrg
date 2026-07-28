import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Input } from '../components/Input'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const { login, register } = useAuth()
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isRegister) {
        await register(name, email, password)
      } else {
        await login(email, password)
      }
      navigate('/projects')
    } catch (err: any) {
      setError(err.message || 'Erro ao autenticar')
    } finally {
      setLoading(false)
    }
  }

  const toggleRegister = () => {
    setIsRegister(!isRegister)
    setError('')
    setPassword('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Gradiente */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="grad1" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#1c2025" stopOpacity="1" />
              <stop offset="50%" stopColor="#101419" stopOpacity="1" />
              <stop offset="100%" stopColor="#0b0e14" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect fill="url(#grad1)" width="100" height="100" />
        </svg>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-surface border border-border rounded-xl shadow-xl z-10 overflow-hidden">
        <div className="pt-8 px-8 pb-4 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 shadow-inner">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              dataset
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
            {isRegister ? 'Crie sua conta' : 'Bem-vindo de Volta'}
          </h1>
          <p className="text-neutral text-sm">
            {isRegister ? 'Preencha os dados para começar.' : 'Entre para acessar seus projetos.'}
          </p>
        </div>

        <div className="p-8 pt-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {isRegister && (
              <Input
                id="name"
                name="name"
                label="Nome"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
              />
            )}

            <Input
              ref={emailRef}
              id="email"
              name="email"
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              required
              error={error}
            />

            {/* 👇 Campo de senha com Input e toggle */}
            <div className="relative">
              <Input
                id="password"
                name="password"
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-neutral hover:text-foreground transition focus:outline-none"
              >
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary font-semibold uppercase tracking-wide py-3 rounded-lg shadow-md hover:bg-primary/90 hover:shadow-lg transition-all mt-2 flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <span className="relative z-10">
                {loading ? 'Carregando...' : isRegister ? 'Criar conta' : 'Entrar'}
              </span>
              {!loading && (
                <span className="material-symbols-outlined relative z-10 text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              )}
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs text-neutral uppercase tracking-wider">OU</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <button
            type="button"
            className="w-full mt-4 bg-surface border border-border text-foreground font-medium py-3 rounded-lg hover:bg-surface/80 transition flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#EA4335" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#4285F4" />
            </svg>
            Continuar com Google
          </button>
        </div>

        <div className="bg-surface-container-lowest p-4 text-center border-t border-border">
          <p className="text-sm text-neutral">
            {isRegister ? 'Já tem uma conta?' : 'Não tem uma conta?'}
            <button
              type="button"
              onClick={toggleRegister}
              className="text-primary font-semibold ml-1 hover:underline transition"
            >
              {isRegister ? 'Faça login' : 'Registre-se'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
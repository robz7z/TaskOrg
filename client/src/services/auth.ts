import { api } from './api'
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth.js'

// Chaves centralizadas (boa prática)
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
} as const

export class AuthService {
  // Método privado – só pode ser chamado dentro da classe
  private setSession(token: string, user: User): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  }

  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', credentials)
      this.setSession(data.token, data.user)
      return data
    } catch (error) {
      throw new Error('Erro ao fazer login. Verifique suas credenciais.')
    }
  }

  // Registro
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', credentials)
      this.setSession(data.token, data.user)
      return data
    } catch (error) {
      throw new Error('Erro ao criar conta. Tente novamente.')
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  }

  // Pega o token
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN)
  }

  // Pega o usuário (com parse seguro)
  getUser(): User | null {
    const user = localStorage.getItem(STORAGE_KEYS.USER)
    if (!user) return null
    try {
      return JSON.parse(user) as User
    } catch {
      return null
    }
  }

  // Verifica se está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  // Atualiza dados do usuário (ex: após editar perfil)
  updateUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  }
}

// Exporta uma instância única (singleton)
export const authService = new AuthService()
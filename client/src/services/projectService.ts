import { api } from './api'

export interface Project {
  id: number
  name: string
  userId: number
  createdAt: string
}

export const projectService = {
  // busca todos os projetos do usuário
  async getAll(): Promise<Project[]> {
    const { data } = await api.get<Project[]>('/projects')
    return data
  },
}
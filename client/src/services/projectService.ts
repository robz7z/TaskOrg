import { api } from './api.js'

export interface Project {
  id: number
  name: string
  userId: number
  createdAt: string
}

export interface CreateProjectPayload {
  name: string
}

export interface UpdateProjectPayload {
  name: string
}

export const projectService = {
  // busca todos os projetos do usuário
  async getAll(): Promise<Project[]> {
    const { data } = await api.get<Project[]>('/projects')
    return data
  },

  async create(payload: CreateProjectPayload): Promise<Project> {
    const { data } = await api.post<Project>('/projects', payload)
    return data
  },

   async update(id: number, payload: UpdateProjectPayload): Promise<Project> {
    const { data } = await api.put<Project>(`/projects/${id}`, payload)
    return data
  },
  
    async delete(id: number): Promise<void> {
    await api.delete(`/projects/${id}`)
  },
}
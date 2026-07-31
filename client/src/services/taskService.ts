import { api } from './api'

export interface Task {
  id: number
  title: string
  description: string | null
  status: 'pending' | 'in_progress' | 'done'
  projectId: number
  createdAt: string
}

export interface CreateTaskPayload {
  title: string
  description?: string
  status?: 'pending' | 'in_progress' | 'done'
}

export const taskService = {
  // Busca tarefas de um projeto específico
  async getByProjectId(projectId: number): Promise<Task[]> {
    const { data } = await api.get<Task[]>(`/projects/${projectId}/tasks`)
    return data
  },

  // Cria uma nova tarefa em um projeto
  async create(projectId: number, payload: CreateTaskPayload): Promise<Task> {
    const { data } = await api.post<Task>(`/projects/${projectId}/tasks`, payload)
    return data
  },
}
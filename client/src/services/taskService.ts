// import { api } from './api'

// export interface Task {
//   id: number
//   title: string
//   description: string | null
//   status: 'pending' | 'in_progress' | 'done'
//   projectId: number
//   createdAt: string
// }

// export interface CreateTaskPayload {
//   title: string
//   description?: string
//   status?: 'pending' | 'in_progress' | 'done'
// }

// export const taskService = {
//   // Busca tarefas de um projeto específico
//   async getByProjectId(projectId: number): Promise<Task[]> {
//     const { data } = await api.get<Task[]>(`/projects/${projectId}/tasks`)
//     return data
//   },

//   // Cria uma nova tarefa em um projeto
//   async create(projectId: number, payload: CreateTaskPayload): Promise<Task> {
//     const { data } = await api.post<Task>(`/projects/${projectId}/tasks`, payload)
//     return data
//   },
// }

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

export interface UpdateTaskPayload {
  title?: string
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

  // Atualiza uma tarefa existente (título, descrição e/ou status)
  async update(taskId: number, payload: UpdateTaskPayload): Promise<Task> {
    const { data } = await api.put<Task>(`/tasks/${taskId}`, payload)
    return data
  },

  // Remove uma tarefa
  async delete(taskId: number): Promise<void> {
    await api.delete(`/tasks/${taskId}`)
  },
}
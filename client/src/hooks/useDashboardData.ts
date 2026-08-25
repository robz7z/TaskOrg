import { useState, useEffect } from 'react'
import { projectService } from '../services/projectService.js'
import { taskService } from '../services/taskService.js'
import type { Project } from '../services/projectService.js'
import type { Task } from '../services/taskService.js'

interface DashboardData {
  projects: Project[]
  tasks: Task[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useDashboardData(): DashboardData {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const projectsData = await projectService.getAll()
      setProjects(projectsData)

      const tasksPromises = projectsData.map((project) =>
        taskService.getByProjectId(project.id)
      )
      const tasksResults = await Promise.all(tasksPromises)
      const allTasks = tasksResults.flat()
      setTasks(allTasks)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar dados'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { projects, tasks, loading, error, refetch: fetchData }
}
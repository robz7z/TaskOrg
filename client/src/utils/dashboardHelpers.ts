import type { Project } from '../services/projectService'
import type { Task } from '../services/taskService'

export function getDashboardMetrics(projects: Project[], tasks: Task[]) {
  const totalProjects = projects.length
  const totalTasks = tasks.length
  const pendingTasks = tasks.filter(t => t.status === 'pending').length
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
  const doneTasks = tasks.filter(t => t.status === 'done').length

  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  // Top 3 projetos com mais tarefas
  const projectTaskCount = projects.map(project => ({
    ...project,
    taskCount: tasks.filter(t => t.projectId === project.id).length,
  }))
  const topProjects = projectTaskCount
    .sort((a, b) => b.taskCount - a.taskCount)
    .slice(0, 3)

  return {
    totalProjects,
    totalTasks,
    pendingTasks,
    inProgressTasks,
    doneTasks,
    progress,
    topProjects,
  }
}
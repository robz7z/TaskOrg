import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react'
import { Layout } from '../components/Layout'
import { CreateTaskModal } from '../components/CreateTaskModal'
import { taskService, type Task } from '../services/taskService'
import { projectService, type Project } from '../services/projectService'

type StatusFilter = 'all' | 'pending' | 'in_progress' | 'done'

const statusLabels: Record<Task['status'], string> = {
  pending: 'Pendente',
  in_progress: 'Em Andamento',
  done: 'Concluído',
}

const statusBorderColor: Record<Task['status'], string> = {
  pending: 'border-l-yellow-500',
  in_progress: 'border-l-primary',
  done: 'border-l-green',
}

const statusBadgeColor: Record<Task['status'], string> = {
  pending: 'bg-yellow-500/20 text-yellow-500',
  in_progress: 'bg-primary/20 text-primary',
  done: 'bg-green/20 text-green',
}

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const projectId = Number(id)

  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadData = useCallback(async () => {
    if (!projectId) return
    try {
      setLoading(true)
      const [allProjects, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getByProjectId(projectId),
      ])
      const foundProject = allProjects.find((p) => p.id === projectId) ?? null
      setProject(foundProject)
      setTasks(tasksData)
      setError(foundProject ? '' : 'Projeto não encontrado')
    } catch (err) {
      setError('Erro ao carregar os dados do projeto')
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
    try {
      const updated = await taskService.update(task.id, { status: newStatus })
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
    } catch {
      setError('Erro ao atualizar o status da tarefa')
    }
  }

  const handleDelete = async (task: Task) => {
    const confirmed = window.confirm(`Deseja realmente excluir a tarefa "${task.title}"?`)
    if (!confirmed) return

    try {
      await taskService.delete(task.id)
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
    } catch {
      setError('Erro ao excluir a tarefa')
    }
  }

  const filteredTasks = tasks.filter((task) => filter === 'all' || task.status === filter)

  const filters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'Tudo' },
    { key: 'pending', label: 'Pendente' },
    { key: 'in_progress', label: 'Em Andamento' },
    { key: 'done', label: 'Concluído' },
  ]

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Carregando...
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex flex-col w-full gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-9 h-9 rounded-lg bg-surface-variant flex items-center justify-center hover:bg-surface-variant/70 transition"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {project?.name ?? 'Projeto'}
              </h1>
              <p className="text-sm text-neutral">Tarefas do Projeto</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </button>
        </div>

        <div className="flex gap-6 border-b border-border">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`pb-3 text-sm font-medium transition border-b-2 -mb-px ${
                filter === f.key
                  ? 'text-primary border-primary'
                  : 'text-neutral border-transparent hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <div className="flex flex-col gap-3">
          {filteredTasks.length === 0 && (
            <p className="text-sm text-neutral text-center py-8">
              Nenhuma tarefa encontrada.
            </p>
          )}

          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-surface rounded-xl shadow-md p-4 border-l-4 ${statusBorderColor[task.status]} flex items-center justify-between gap-4`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadgeColor[task.status]}`}>
                    {statusLabels[task.status]}
                  </span>
                </div>
                <h3
                  className={`text-base font-semibold text-foreground ${
                    task.status === 'done' ? 'line-through text-neutral' : ''
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-neutral mt-1 truncate">{task.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task, e.target.value as Task['status'])}
                  className="bg-background border border-border rounded-lg px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="done">Concluído</option>
                </select>

                <button
                  onClick={() => handleDelete(task)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-error hover:bg-error/10 transition"
                  title="Excluir tarefa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projects={project ? [project] : []}
        onSuccess={loadData}
      />
    </Layout>
  )
}
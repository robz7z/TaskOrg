import { useState, type SyntheticEvent } from 'react'
import { X, Loader2 } from 'lucide-react'
import { taskService } from '../services/taskService'
import type { Project } from '../services/projectService'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  projects: Project[]
  onSuccess: () => void
}

export function CreateTaskModal({ isOpen, onClose, projects, onSuccess }: CreateTaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [projectId, setProjectId] = useState<number | ''>('')
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'done'>('pending')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!projectId) {
      setError('Selecione um projeto')
      setLoading(false)
      return
    }

    try {
      await taskService.create(Number(projectId), {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
      })
      onSuccess()
      handleClose()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar tarefa')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setTitle('')
    setDescription('')
    setProjectId('')
    setStatus('pending')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">Nova Tarefa</h2>
          <button
            onClick={handleClose}
            className="text-neutral hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-foreground mb-1">
              Projeto *
            </label>
            <select
              id="project"
              value={projectId}
              onChange={(e) => setProjectId(Number(e.target.value) || '')}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Selecione um projeto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
              Título *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição (opcional)"
              rows={3}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-foreground mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'pending' | 'in_progress' | 'done')}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Andamento</option>
              <option value="done">Concluído</option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-error">{error}</p>
          )}

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-surface-variant transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Tarefa'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
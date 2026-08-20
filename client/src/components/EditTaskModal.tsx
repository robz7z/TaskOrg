import { useState, type SyntheticEvent } from 'react'
import { X, Loader2 } from 'lucide-react'
import { taskService, type Task } from '../services/taskService'

interface EditTaskModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task
  onSuccess: () => void
}

export function EditTaskModal({ isOpen, onClose, task, onSuccess }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [status, setStatus] = useState(task.status)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await taskService.update(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
      })
      onSuccess()
      handleClose()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar tarefa')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setTitle(task.title)
    setDescription(task.description || '')
    setStatus(task.status)
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">Editar Tarefa</h2>
          <button onClick={handleClose} className="text-neutral hover:text-foreground transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="editTaskTitle" className="block text-sm font-medium text-foreground mb-1">
              Título *
            </label>
            <input
              id="editTaskTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="editTaskDescription" className="block text-sm font-medium text-foreground mb-1">
              Descrição
            </label>
            <textarea
              id="editTaskDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição (opcional)"
              rows={3}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <div>
            <label htmlFor="editTaskStatus" className="block text-sm font-medium text-foreground mb-1">
              Status
            </label>
            <select
              id="editTaskStatus"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'pending' | 'in_progress' | 'done')}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Andamento</option>
              <option value="done">Concluído</option>
            </select>
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
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
              className="cursor-pointer px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</> : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
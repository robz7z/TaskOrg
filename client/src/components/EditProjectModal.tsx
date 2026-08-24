import { useState, type SyntheticEvent } from 'react'
import { X, Loader2 } from 'lucide-react'
import { projectService, type Project } from '../services/projectService.js'

interface EditProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: Project
  onSuccess: () => void
}

export function EditProjectModal({ isOpen, onClose, project, onSuccess }: EditProjectModalProps) {
  const [name, setName] = useState(project.name)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await projectService.update(project.id, { name: name.trim() })
      onSuccess()
      handleClose()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar projeto')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setName(project.name)
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">Editar Projeto</h2>
          <button onClick={handleClose} className="text-neutral hover:text-foreground transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="editProjectName" className="block text-sm font-medium text-foreground mb-1">
              Nome do Projeto *
            </label>
            <input
              id="editProjectName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do projeto"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
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
// src/components/projects/ProjectCard.tsx
import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

type Status = 'Em Andamento' | 'Concluído' | 'Atrasado' | 'Planejado'

const statusConfig: Record<Status, { color: string; bg: string }> = {
  'Em Andamento': { color: 'tertiary', bg: 'bg-tertiary-container/20' },
  'Concluído': { color: 'secondary', bg: 'bg-secondary-container/20' },
  'Atrasado': { color: 'error', bg: 'bg-error-container/20' },
  'Planejado': { color: 'primary', bg: 'bg-primary-container/20' },
}

interface ProjectCardProps {
  title: string
  status: Status
  progress: number // 0–100
  totalTasks: number
  doneTasks: number
  icon: LucideIcon
  onViewTasks: () => void
}

export function ProjectCard({
  title,
  status,
  progress,
  totalTasks,
  doneTasks,
  icon: Icon,
  onViewTasks,
}: ProjectCardProps) {
  const config = statusConfig[status] || statusConfig['Planejado']

  return (
    <div className="group relative bg-surface rounded-xl p-5 shadow-md shadow-surface/20 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Gradiente sutil no hover */}
      <div className={`absolute inset-0 bg-linear-to-br from-${config.color}/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      {/* Bolha decorativa */}
      <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full bg-${config.color}/5 blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700`} />

      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shadow-sm">
            <Icon className={`w-5 h-5 text-${config.color}`} />
          </div>
          <span className={`${config.bg} text-${config.color} px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-${config.color} animate-pulse`} />
            {status}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-on-surface mb-1 line-clamp-1">
          {title}
        </h3>

        <div className="mt-4">
          <div className="flex justify-between items-end mb-1">
            <span className="text-xs font-medium text-on-surface-variant">Progresso</span>
            <span className="text-xs font-semibold text-on-surface">{doneTasks}/{totalTasks}</span>
          </div>
          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden mb-4">
            <div
              className={`h-full bg-${config.color} rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <button
            onClick={onViewTasks}
            className="w-full py-2 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center justify-center gap-2 group/btn"
          >
            Ver Tarefas
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  )
}
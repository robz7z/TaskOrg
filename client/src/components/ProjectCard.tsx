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
    <div className="bg-surface-container rounded-xl p-5 flex flex-col hover:-translate-y-1 transition-transform duration-300 shadow-sm relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 ${config.color}/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none`} />

      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
          <Icon className={`w-5 h-5 text-${config.color}`} />
        </div>
        <span className={`${config.bg} text-${config.color} px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5`}>
          <span className={`w-1.5 h-1.5 rounded-full bg-${config.color}`} />
          {status}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-on-surface mb-1 relative z-10 line-clamp-1">
        {title}
      </h3>

      <div className="mt-auto relative z-10">
        <div className="flex justify-between items-end mb-1">
          <span className="text-xs font-semibold text-on-surface-variant">Progresso</span>
          <span className="text-xs font-semibold text-on-surface">{doneTasks}/{totalTasks}</span>
        </div>
        <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden mb-4">
          <div
            className={`h-full bg-${config.color} rounded-full transition-all`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <button
          onClick={onViewTasks}
          className="w-full py-1.5 rounded-lg border border-outline-variant text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1"
        >
          Ver Tarefas
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
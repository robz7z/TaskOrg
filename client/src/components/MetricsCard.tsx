import type { LucideIcon } from 'lucide-react'

interface MetricsCardProps {
  icon: LucideIcon
  label: string
  value: number
  color: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success'
}

const colorMap = {
  primary: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'bg-primary',
  },
  secondary: {
    bg: 'bg-secondary/10',
    text: 'text-secondary',
    border: 'bg-secondary',
  },
  tertiary: {
    bg: 'bg-tertiary/10',
    text: 'text-tertiary',
    border: 'bg-tertiary',
  },
  error: {
    bg: 'bg-error/10',
    text: 'text-error',
    border: 'bg-error',
  },
  success: {
    bg: 'bg-green-500/10',
    text: 'text-green-500',
    border: 'bg-green-500',
  },
}

export function MetricsCard({ icon: Icon, label, value, color }: MetricsCardProps) {
  const colors = colorMap[color]

  return (
    <div className="group relative bg-surface rounded-xl p-4 shadow-md shadow-surface/20 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 flex items-center gap-4 overflow-hidden">
      {/* Gradiente sutil no hover */}
      <div className={`absolute inset-0 bg-linear-to-br from-${color}/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      {/* Bolha decorativa */}
      <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full bg-${color}/5 blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700`} />

      <div className={`relative z-10 w-12 h-12 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>

      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          {label}
        </p>
        <p className="text-2xl font-semibold text-on-surface mt-0.5">{value}</p>
      </div>

      <div className={`absolute right-0 top-0 h-full w-1 ${colors.border} opacity-0 group-hover:opacity-100 transition-opacity`} />
    </div>
  )
}
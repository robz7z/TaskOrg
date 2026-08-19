// src/components/projects/MetricsCard.tsx
import type { LucideIcon } from 'lucide-react'

interface MetricsCardProps {
  icon: LucideIcon
  label: string
  value: number
  color: 'primary' | 'secondary' | 'tertiary' | 'error'
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
}

export function MetricsCard({ icon: Icon, label, value, color }: MetricsCardProps) {
  const colors = colorMap[color]

  return (
    <div className="bg-surface-container rounded-xl p-4 flex items-center gap-4 relative overflow-hidden group">
      <div className={`w-12 h-12 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          {label}
        </p>
        <p className="text-2xl font-semibold text-on-surface mt-0.5">{value}</p>
      </div>
      <div className={`absolute right-0 top-0 h-full w-1 ${colors.border} opacity-0 group-hover:opacity-100 transition-opacity`} />
    </div>
  )
}
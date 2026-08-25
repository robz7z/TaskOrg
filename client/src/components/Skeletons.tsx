import Skeleton from 'react-loading-skeleton'
import { Layout } from './Layout'

// ============ SKELETONS REUTILIZÁVEIS ============

// Cabeçalho da página (título + subtítulo)
export function SkeletonHeader({ title = true }: { title?: boolean }) {
  return (
    <div>
      {title && <Skeleton height={36} width={200} />}
      <Skeleton height={20} width={300} className="mt-1" />
    </div>
  )
}

// Card de métrica individual
export function SkeletonMetric() {
  return <Skeleton height={80} borderRadius="0.75rem" />
}

// Grid de 4 cards de métrica
export function SkeletonMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonMetric key={i} />
      ))}
    </div>
  )
}

// Card de projeto individual
export function SkeletonProjectCard() {
  return <Skeleton height={220} borderRadius="0.75rem" />
}

// Grid de projetos (quantidade configurável)
export function SkeletonProjectGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProjectCard key={i} />
      ))}
    </div>
  )
}

// Lista de tarefas (quantidade configurável)
export function SkeletonTaskList({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} height={80} borderRadius="0.75rem" />
      ))}
    </div>
  )
}

// ============ SKELETONS ESPECÍFICOS PARA CADA PÁGINA ============

// ---------------------- DASHBOARD ----------------------
// Skeleton para o gráfico de progresso (círculo)
function SkeletonChartCircle() {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <Skeleton circle height={160} width={160} />
      <Skeleton height={24} width={80} className="mt-4" />
    </div>
  )
}

// Skeleton para o gráfico de barras
function SkeletonChartBar() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton height={20} width={120} />
      <div className="flex items-end gap-2 h-48">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            height={Math.random() * 80 + 40}
            width={40}
            borderRadius="0.25rem 0.25rem 0 0"
          />
        ))}
      </div>
    </div>
  )
}

// Skeleton para a lista de Top Projetos (3 itens)
function SkeletonTopProjects() {
  return (
    <div className="bg-surface rounded-xl shadow-md p-4 md:p-6 flex flex-col gap-4">
      <div className="flex justify-between items-end">
        <Skeleton height={24} width={150} />
        <Skeleton height={32} width={80} borderRadius="0.5rem" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton circle height={40} width={40} />
            <Skeleton height={16} width={120} />
            <Skeleton height={16} width={60} className="ml-auto" />
            <Skeleton height={8} width={60} />
          </div>
        ))}
      </div>
    </div>
  )
}

// Skeleton completo do Dashboard
export function SkeletonDashboard() {
  return (
    <Layout>
      <div className="flex flex-col w-full gap-4 md:gap-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton height={32} width={200} />
            <Skeleton height={20} width={300} className="mt-1" />
          </div>
          <Skeleton height={36} width={100} borderRadius="0.5rem" />
        </div>

        <SkeletonMetrics />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-1 bg-surface p-4 md:p-6 rounded-xl shadow-md">
            <SkeletonChartCircle />
          </div>
          <div className="lg:col-span-2 bg-surface p-4 md:p-6 rounded-xl shadow-md">
            <SkeletonChartBar />
          </div>
        </div>

        <SkeletonTopProjects />
      </div>
    </Layout>
  )
}

// ---------------------- PROJECTS ----------------------
// Skeleton completo da página de Projetos
export function SkeletonProjects() {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <Skeleton height={36} width={200} />
            <Skeleton height={20} width={300} className="mt-1" />
          </div>
          <Skeleton height={40} width={140} borderRadius="0.5rem" />
        </div>
        <SkeletonMetrics />
        <SkeletonProjectGrid count={6} />
      </div>
    </Layout>
  )
}

// ---------------------- PROJECT DETAIL ----------------------
// Skeleton completo da página de detalhe do projeto
export function SkeletonProjectDetail() {
  return (
    <Layout>
      <div className="flex flex-col w-full gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton circle height={36} width={36} />
            <div>
              <Skeleton height={28} width={200} />
              <Skeleton height={16} width={120} className="mt-1" />
            </div>
          </div>
          <Skeleton height={40} width={140} borderRadius="0.5rem" />
        </div>

        <div className="flex gap-6 border-b border-border pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={24} width={60} />
          ))}
        </div>

        <SkeletonTaskList count={5} />
      </div>
    </Layout>
  )
}
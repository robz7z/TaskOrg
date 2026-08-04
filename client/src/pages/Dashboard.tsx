import { Layout } from '../components/Layout'
import {
  Folder,
  CheckSquare,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { useDashboardData } from '../hooks/useDashboardData'
import { getDashboardMetrics } from '../utils/dashboardHelpers'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export function Dashboard() {
  const { projects, tasks, loading, error } = useDashboardData()

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-foreground">
          Carregando dados...
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-error">
          Erro ao carregar dados: {error.message}
        </div>
      </Layout>
    )
  }

  const metrics = getDashboardMetrics(projects, tasks)

  const taskDistribution = [
    { name: 'Pendentes', value: metrics.pendingTasks },
    { name: 'Em Andamento', value: metrics.inProgressTasks },
    { name: 'Concluídas', value: metrics.doneTasks },
  ]

  return (
    <Layout>
      <div className="flex flex-col w-full gap-4 md:gap-6">
        {/* Cards - mesmos de antes, só troca os números pelos metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-surface p-3 md:p-4 rounded-xl shadow-md flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] md:text-xs text-neutral uppercase tracking-wider">Total de Projetos</span>
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Folder className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
            </div>
            <span className="text-xl md:text-3xl font-bold text-foreground z-10">{metrics.totalProjects}</span>
          </div>

          <div className="bg-surface p-3 md:p-4 rounded-xl shadow-md flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-tertiary/10 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] md:text-xs text-neutral uppercase tracking-wider">Total de Tarefas</span>
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-tertiary/20 flex items-center justify-center">
                <CheckSquare className="w-4 h-4 md:w-5 md:h-5 text-tertiary" />
              </div>
            </div>
            <span className="text-xl md:text-3xl font-bold text-foreground z-10">{metrics.totalTasks}</span>
          </div>

          <div className="bg-surface p-3 md:p-4 rounded-xl shadow-md flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-error/10 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] md:text-xs text-neutral uppercase tracking-wider">Pendentes</span>
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-error/20 flex items-center justify-center">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-error" />
              </div>
            </div>
            <span className="text-xl md:text-3xl font-bold text-foreground z-10">{metrics.pendingTasks}</span>
          </div>

          <div className="bg-surface p-3 md:p-4 rounded-xl shadow-md flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-green/10 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] md:text-xs text-neutral uppercase tracking-wider">Concluídas</span>
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
              </div>
            </div>
            <span className="text-xl md:text-3xl font-bold text-foreground z-10">{metrics.doneTasks}</span>
          </div>
        </div>

        {/* Progresso + Gráfico */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-1 bg-surface p-4 md:p-6 rounded-xl shadow-md flex flex-col">
            <h2 className="text-base md:text-lg font-semibold text-foreground mb-4">Progresso Geral</h2>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-surface-variant" cx="50" cy="50" fill="none" r="40" strokeWidth="8" stroke="currentColor" />
                  <circle
                    className="text-primary"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (metrics.progress / 100) * 251.2}
                    stroke="currentColor"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl md:text-3xl font-bold text-foreground">{metrics.progress}%</span>
                  <span className="text-[10px] md:text-xs text-neutral uppercase">Concluído</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center bg-surface-container p-3 rounded-lg">
              <div>
                <span className="text-[10px] md:text-xs text-neutral">No Caminho</span>
                <span className="block text-base md:text-xl font-bold text-foreground">{metrics.inProgressTasks}</span>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-right">
                <span className="text-[10px] md:text-xs text-neutral">Em Risco</span>
                <span className="block text-base md:text-xl font-bold text-error">{metrics.pendingTasks}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-surface p-4 md:p-6 rounded-xl shadow-md flex flex-col">
            <h2 className="text-base md:text-lg font-semibold text-foreground mb-4 flex justify-between items-center">
              Distribuição de Tarefas
            </h2>
            <div className="w-full h-64 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={taskDistribution}
                    layout="horizontal"
                    margin={{ top: 10, right: 30, left: -10, bottom: 10 }}
                  >
                    <XAxis
                      dataKey="name"
                      stroke="#74777E"
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: '#30363D' }}
                    />
                    <YAxis
                      type="number"
                      fontSize={12}
                      domain={[0, 'dataMax + 1']}
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={{ stroke: '#30363D' }}
                      width={40}
                    />
                    <Bar dataKey="value" fill="#58A6FF" radius={[0, 4, 4, 0]} barSize={40} name="Tarefas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        {/* Top 3 projetos */}
        <div className="bg-surface rounded-xl shadow-md p-4 md:p-6 flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] md:text-xs text-primary uppercase tracking-widest">Operações Ativas</span>
              <h2 className="text-base md:text-xl font-semibold text-foreground">Principais Projetos por Volume</h2>
            </div>
            <button className="text-xs md:text-sm text-foreground border border-border px-2 py-1 md:px-3 md:py-1 rounded-lg hover:bg-surface-variant transition flex items-center gap-1">
              Ver Tudo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="hidden md:grid grid-cols-12 gap-4 px-3 py-2 text-xs text-neutral uppercase">
              <div className="col-span-5">Nome do Projeto</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-2 text-right">Tarefas</div>
              <div className="col-span-2 text-right">Progresso</div>
            </div>

            {metrics.topProjects.map((project) => {
              const projectTasks = tasks.filter(t => t.projectId === project.id)
              const done = projectTasks.filter(t => t.status === 'done').length
              const progress = projectTasks.length > 0 ? Math.round((done / projectTasks.length) * 100) : 0

              return (
                <div key={project.id} className="bg-surface-container/50 rounded-lg p-3 md:p-0 md:bg-transparent hover:bg-surface-variant/30 transition cursor-pointer md:grid md:grid-cols-12 md:gap-4 md:px-3 md:py-3 md:items-center">
                  <div className="flex items-center gap-3 md:col-span-5">
                    <div className="w-10 h-10 rounded bg-primary/20 shrink-0"></div>
                    <div>
                      <span className="text-sm font-medium text-foreground">{project.name}</span>
                      <span className="block text-xs text-neutral truncate">ID: {project.id}</span>
                    </div>
                  </div>
                  <div className="md:col-span-3 mt-1 md:mt-0">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary rounded-full text-[10px] md:text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      {progress === 100 ? 'Concluído' : progress > 0 ? 'Em Andamento' : 'Não Iniciado'}
                    </span>
                  </div>
                  <div className="md:col-span-2 flex justify-between md:justify-end items-center mt-1 md:mt-0">
                    <span className="text-xs text-neutral md:hidden">Tarefas:</span>
                    <span className="text-sm text-foreground">{done}/{projectTasks.length}</span>
                  </div>
                  <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-2 mt-1 md:mt-0">
                    <span className="text-xs text-neutral md:hidden">Progresso:</span>
                    <span className="text-xs text-foreground">{progress}%</span>
                    <div className="w-12 h-1 bg-surface-variant rounded-full overflow-hidden">
                      <div className={`h-full bg-primary rounded-full`} style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}
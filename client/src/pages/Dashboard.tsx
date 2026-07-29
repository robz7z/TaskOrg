import { Layout } from '../components/Layout'
import {
  Folder,
  CheckSquare,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  ArrowRight
} from 'lucide-react'

export function Dashboard() {
  return (
    <Layout>
      <div className="flex flex-col w-full gap-4 md:gap-6">
        {/* Cards de métricas - mobile: 2 colunas, desktop: 4 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-surface p-3 md:p-4 rounded-xl shadow-md flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] md:text-xs text-neutral uppercase tracking-wider">Total de Projetos</span>
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Folder className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
            </div>
            <span className="text-xl md:text-3xl font-bold text-foreground z-10">42</span>
            <span className="text-[10px] md:text-xs text-primary flex items-center gap-1 z-10">
              <ArrowUp className="w-3 h-3" /> 12%
            </span>
          </div>

          <div className="bg-surface p-3 md:p-4 rounded-xl shadow-md flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-tertiary/10 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] md:text-xs text-neutral uppercase tracking-wider">Total de Tarefas</span>
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-tertiary/20 flex items-center justify-center">
                <CheckSquare className="w-4 h-4 md:w-5 md:h-5 text-tertiary" />
              </div>
            </div>
            <span className="text-xl md:text-3xl font-bold text-foreground z-10">156</span>
            <span className="text-[10px] md:text-xs text-tertiary flex items-center gap-1 z-10">
              <ArrowUp className="w-3 h-3" /> 5%
            </span>
          </div>

          <div className="bg-surface p-3 md:p-4 rounded-xl shadow-md flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-error/10 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] md:text-xs text-neutral uppercase tracking-wider">Pendentes</span>
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-error/20 flex items-center justify-center">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-error" />
              </div>
            </div>
            <span className="text-xl md:text-3xl font-bold text-foreground z-10">28</span>
            <span className="text-[10px] md:text-xs text-error flex items-center gap-1 z-10">
              <ArrowDown className="w-3 h-3" /> -3%
            </span>
          </div>

          <div className="bg-surface p-3 md:p-4 rounded-xl shadow-md flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-secondary/10 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] md:text-xs text-neutral uppercase tracking-wider">Concluídas</span>
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
              </div>
            </div>
            <span className="text-xl md:text-3xl font-bold text-foreground z-10">86</span>
            <span className="text-[10px] md:text-xs text-secondary flex items-center gap-1 z-10">
              <ArrowUp className="w-3 h-3" /> 20%
            </span>
          </div>
        </div>

        {/* Gráficos - mobile: empilhados, desktop: lado a lado */}
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
                    strokeDashoffset="62.8"
                    stroke="currentColor"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl md:text-3xl font-bold text-foreground">75%</span>
                  <span className="text-[10px] md:text-xs text-neutral uppercase">Concluído</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center bg-surface-container p-3 rounded-lg">
              <div>
                <span className="text-[10px] md:text-xs text-neutral">No Caminho</span>
                <span className="block text-base md:text-xl font-bold text-foreground">32</span>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-right">
                <span className="text-[10px] md:text-xs text-neutral">Em Risco</span>
                <span className="block text-base md:text-xl font-bold text-error">10</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-surface p-4 md:p-6 rounded-xl shadow-md flex flex-col">
            <h2 className="text-base md:text-lg font-semibold text-foreground mb-4 flex justify-between items-center">
              Distribuição de Tarefas
              <span className="text-[10px] md:text-xs bg-surface-container px-2 py-1 rounded-md text-neutral">Últimos 7 Dias</span>
            </h2>
            <div className="flex-1 flex items-end gap-1 md:gap-2 h-32 md:h-48">
              {[
                { day: 'SEG', value: 40 },
                { day: 'TER', value: 65 },
                { day: 'QUA', value: 85 },
                { day: 'QUI', value: 45 },
                { day: 'SEX', value: 90 },
                { day: 'SÁB', value: 30 },
                { day: 'DOM', value: 15 },
              ].map((item) => (
                <div key={item.day} className="flex flex-col items-center flex-1 gap-1">
                  <div className="w-full bg-primary/20 rounded-t-md relative flex items-end justify-center h-full">
                    <div
                      className="w-full bg-primary rounded-t-md transition-all duration-1000 ease-out"
                      style={{ height: `${item.value}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] md:text-xs text-neutral uppercase">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de projetos - mobile: cards, desktop: tabela */}
        <div className="bg-surface rounded-xl shadow-md p-4 md:p-6 flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] md:text-xs text-primary uppercase tracking-widest">Operações Ativas</span>
              <h2 className="text-base md:text-xl font-semibold text-foreground">Principais Projetos</h2>
            </div>
            <button className="text-xs md:text-sm text-foreground border border-border px-2 py-1 md:px-3 md:py-1 rounded-lg hover:bg-surface-variant transition flex items-center gap-1">
              Ver Tudo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Cabeçalho da tabela (escondido no mobile) */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-3 py-2 text-xs text-neutral uppercase">
            <div className="col-span-5">Nome do Projeto</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-2 text-right">Tarefas</div>
            <div className="col-span-2 text-right">Progresso</div>
          </div>

          {/* Projetos - mobile: cards, desktop: linha */}
          <div className="flex flex-col gap-2">
            <div className="bg-surface-container/50 rounded-lg p-3 md:p-0 md:bg-transparent hover:bg-surface-variant/30 transition cursor-pointer md:grid md:grid-cols-12 md:gap-4 md:px-3 md:py-3 md:items-center">
              <div className="flex items-center gap-3 md:col-span-5">
                <div className="w-10 h-10 rounded bg-primary/20 shrink-0"></div>
                <div>
                  <span className="text-sm font-medium text-foreground">Project Apollo</span>
                  <span className="block text-xs text-neutral truncate">Backend microservices</span>
                </div>
              </div>
              <div className="md:col-span-3 mt-1 md:mt-0">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary rounded-full text-[10px] md:text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  Em Andamento
                </span>
              </div>
              <div className="md:col-span-2 flex justify-between md:justify-end items-center mt-1 md:mt-0">
                <span className="text-xs text-neutral md:hidden">Tarefas:</span>
                <span className="text-sm text-foreground">45/60</span>
              </div>
              <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-2 mt-1 md:mt-0">
                <span className="text-xs text-neutral md:hidden">Progresso:</span>
                <span className="text-xs text-foreground">75%</span>
                <div className="w-12 h-1 bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[75%] rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container/50 rounded-lg p-3 md:p-0 md:bg-transparent hover:bg-surface-variant/30 transition cursor-pointer md:grid md:grid-cols-12 md:gap-4 md:px-3 md:py-3 md:items-center">
              <div className="flex items-center gap-3 md:col-span-5">
                <div className="w-10 h-10 rounded bg-tertiary/20 shrink-0"></div>
                <div>
                  <span className="text-sm font-medium text-foreground">Data Pipeline V2</span>
                  <span className="block text-xs text-neutral truncate">Real-time analytics</span>
                </div>
              </div>
              <div className="md:col-span-3 mt-1 md:mt-0">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-tertiary/20 text-tertiary rounded-full text-[10px] md:text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Em Risco
                </span>
              </div>
              <div className="md:col-span-2 flex justify-between md:justify-end items-center mt-1 md:mt-0">
                <span className="text-xs text-neutral md:hidden">Tarefas:</span>
                <span className="text-sm text-foreground">12/80</span>
              </div>
              <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-2 mt-1 md:mt-0">
                <span className="text-xs text-neutral md:hidden">Progresso:</span>
                <span className="text-xs text-foreground">15%</span>
                <div className="w-12 h-1 bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary w-[15%] rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container/50 rounded-lg p-3 md:p-0 md:bg-transparent hover:bg-surface-variant/30 transition cursor-pointer md:grid md:grid-cols-12 md:gap-4 md:px-3 md:py-3 md:items-center">
              <div className="flex items-center gap-3 md:col-span-5">
                <div className="w-10 h-10 rounded bg-secondary/20 shrink-0"></div>
                <div>
                  <span className="text-sm font-medium text-foreground">Legacy Sunset</span>
                  <span className="block text-xs text-neutral truncate">Database archiving</span>
                </div>
              </div>
              <div className="md:col-span-3 mt-1 md:mt-0">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/20 text-secondary rounded-full text-[10px] md:text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Concluído
                </span>
              </div>
              <div className="md:col-span-2 flex justify-between md:justify-end items-center mt-1 md:mt-0">
                <span className="text-xs text-neutral md:hidden">Tarefas:</span>
                <span className="text-sm text-foreground">120/120</span>
              </div>
              <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-2 mt-1 md:mt-0">
                <span className="text-xs text-neutral md:hidden">Progresso:</span>
                <span className="text-xs text-foreground">100%</span>
                <div className="w-12 h-1 bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-full rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
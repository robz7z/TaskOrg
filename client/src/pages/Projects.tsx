import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout.js'
import { MetricsCard } from '../components/MetricsCard.js'
import { ProjectCard } from '../components/ProjectCard.js'
import { CreateProjectModal } from '../components/CreateProjectModal.js'
import { EditProjectModal } from '../components/EditProjectModal.js'
import { projectService, type Project } from '../services/projectService.js'
import { taskService, type Task } from '../services/taskService.js'
import {
  FolderOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Server,
  Database,
  Shield,
  Globe,
  Loader2,
} from 'lucide-react'

const iconMap: Record<string, any> = {
  default: Server,
  database: Database,
  shield: Shield,
  globe: Globe,
  api: Server,
  web: Globe,
  security: Shield,
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const navigate = useNavigate()

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const projectsData = await projectService.getAll()
      setProjects(projectsData)
      const tasksPromises = projectsData.map((p) => taskService.getByProjectId(p.id))
      const tasksResults = await Promise.all(tasksPromises)
      setTasks(tasksResults.flat())
    } catch (err) {
      setError('Erro ao carregar projetos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (project: Project) => {
  if (!window.confirm(`Tem certeza que deseja excluir o projeto "${project.name}"?`)) return
  try {
    await projectService.delete(project.id)
    await loadData()
    // se tiver toast, adicione
    } catch {
      setError('Erro ao excluir projeto')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const totalProjects = projects.length
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length
  const doneTasks = tasks.filter((t) => t.status === 'done').length

  const enrichedProjects = projects.map((project) => {
    const projectTasks = tasks.filter((t) => t.projectId === project.id)
    const done = projectTasks.filter((t) => t.status === 'done').length
    const progress = projectTasks.length > 0 ? Math.round((done / projectTasks.length) * 100) : 0

    let status: 'Em Andamento' | 'Concluído' | 'Atrasado' | 'Planejado' = 'Planejado'
    if (progress === 100 && projectTasks.length > 0) status = 'Concluído'
    else if (progress > 0 && progress < 100) status = 'Em Andamento'

    const iconKey = project.name.toLowerCase().includes('db') ? 'database'
      : project.name.toLowerCase().includes('auth') ? 'shield'
      : project.name.toLowerCase().includes('web') || project.name.toLowerCase().includes('ui') ? 'globe'
      : 'default'

    return {
      ...project,
      progress,
      doneTasks: done,
      totalTasks: projectTasks.length,
      status,
      icon: iconMap[iconKey] || iconMap.default,
    }
  })

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Carregando projetos...
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-error">{error}</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-on-surface tracking-tight">
              Projetos Ativos
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Visão geral e gerenciamento do portfólio.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-on-primary text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Novo Projeto
          </button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricsCard icon={FolderOpen} label="Total de Projetos" value={totalProjects} color="primary" />
          <MetricsCard icon={AlertTriangle} label="Pendentes" value={pendingTasks} color="error" />
          <MetricsCard icon={Clock} label="Em Andamento" value={inProgressTasks} color="tertiary" />
          <MetricsCard icon={CheckCircle2} label="Concluídos" value={doneTasks} color="success" />
        </div>

        {/* Grid de projetos */}
        {enrichedProjects.length === 0 ? (
          <div className="text-center py-12 text-neutral">
            <p>Nenhum projeto encontrado.</p>
            <button onClick={() => setIsModalOpen(true)} className="mt-2 text-primary hover:underline">
              Crie seu primeiro projeto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {enrichedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.name}
                status={project.status}
                progress={project.progress}
                totalTasks={project.totalTasks}
                doneTasks={project.doneTasks}
                icon={project.icon}
                onViewTasks={() => navigate(`/projects/${project.id}`)}
                onEdit={() => setEditingProject(project)}       // <-- adicione esta
                onDelete={() => handleDeleteProject(project)}   // <-- adicione esta
              />
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
      {/* Modal de edição */}
      {editingProject && (
        <EditProjectModal
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          project={editingProject}
          onSuccess={loadData}
        />
      )}
    </Layout>
  )
}
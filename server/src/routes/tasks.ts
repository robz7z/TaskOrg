import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { eq, and } from 'drizzle-orm'
import { db } from '../db/index.js'
import { tasks, projects } from '../db/schema.js'

// ============================================================
//  STATUS VÁLIDOS
// ============================================================
const VALID_STATUSES = ['pending', 'in_progress', 'done'] as const
type TaskStatus = typeof VALID_STATUSES[number]

function isValidStatus(status: string): status is TaskStatus {
  return VALID_STATUSES.includes(status as TaskStatus)
}

// ============================================================
//  HELPERS DE AUTORIZAÇÃO
// ============================================================
async function getOwnedProject(projectId: number, userId: number) {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
  
  return project
}

async function getOwnedTask(taskId: number, userId: number) {
  const [result] = await db
    .select({ task: tasks, project: projects })
    .from(tasks)
    .innerJoin(projects, eq(tasks.projectId, projects.id))
    .where(and(eq(tasks.id, taskId), eq(projects.userId, userId)))
  
  return result
}

// ============================================================
//  ROTAS
// ============================================================
export async function taskRoutes(app: FastifyInstance) {
  
  // GET /projects/:projectId/tasks
  app.get(
    '/projects/:projectId/tasks',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user?.id
        if (!userId) {
          return reply.status(401).send({ error: 'Usuário não autenticado' })
        }

        const { projectId } = request.params as { projectId: string }
        const numericProjectId = Number(projectId)

        if (Number.isNaN(numericProjectId)) {
          return reply.status(400).send({ error: 'projectId inválido' })
        }

        const project = await getOwnedProject(numericProjectId, userId)
        if (!project) {
          return reply.status(404).send({ error: 'Projeto não encontrado' })
        }

        const projectTasks = await db
          .select()
          .from(tasks)
          .where(eq(tasks.projectId, numericProjectId))

        return reply.status(200).send(projectTasks)
      
      } catch (error) {
        return reply.status(500).send({ error: 'Erro ao buscar tarefas' })
      }
    }
  )

  // POST /projects/:projectId/tasks
  app.post(
    '/projects/:projectId/tasks',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user?.id
        if (!userId) {
          return reply.status(401).send({ error: 'Usuário não autenticado' })
        }

        const { projectId } = request.params as { projectId: string }
        const numericProjectId = Number(projectId)
        if (Number.isNaN(numericProjectId)) {
          return reply.status(400).send({ error: 'projectId inválido' })
        }

        const { title, description, status } = (request.body || {}) as {
          title?: string
          description?: string
          status?: string
        }

        if (!title || title.trim() === '') {
          return reply.status(400).send({ error: 'O campo title é obrigatório' })
        }

        // ✅ VALIDAÇÃO DO STATUS (se enviado)
        if (status !== undefined && !isValidStatus(status)) {
          return reply.status(400).send({
            error: 'Status inválido. Use: pending, in_progress ou done'
          })
        }

        const project = await getOwnedProject(numericProjectId, userId)
        if (!project) {
          return reply.status(404).send({ error: 'Projeto não encontrado' })
        }

        const [newTask] = await db
          .insert(tasks)
          .values({
            title,
            description,
            status: status ?? 'pending',
            projectId: numericProjectId
          })
          .returning()

        return reply.status(201).send(newTask)
      
      } catch (error) {
        return reply.status(500).send({ error: 'Erro ao criar tarefa' })
      }
    }
  )

  // PUT /tasks/:id
  app.put(
    '/tasks/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user?.id
        if (!userId) {
          return reply.status(401).send({ error: 'Usuário não autenticado' })
        }

        const { id } = request.params as { id: string }
        const numericTaskId = Number(id)
        if (Number.isNaN(numericTaskId)) {
          return reply.status(400).send({ error: 'id inválido' })
        }

        const { title, description, status } = (request.body || {}) as {
          title?: string
          description?: string
          status?: string
        }

        const owned = await getOwnedTask(numericTaskId, userId)
        if (!owned) {
          return reply.status(404).send({ error: 'Tarefa não encontrada' })
        }

        if (title !== undefined && title.trim() === '') {
          return reply.status(400).send({ error: 'O campo title não pode ser vazio' })
        }

        // ✅ VALIDAÇÃO DO STATUS (se enviado)
        if (status !== undefined && !isValidStatus(status)) {
          return reply.status(400).send({
            error: 'Status inválido. Use: pending, in_progress ou done'
          })
        }

        const [updatedTask] = await db
          .update(tasks)
          .set({
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(status !== undefined && { status }),
          })
          .where(eq(tasks.id, numericTaskId))
          .returning()

        return reply.status(200).send(updatedTask)
      
      } catch (error) {
        return reply.status(500).send({ error: 'Erro ao atualizar tarefa' })
      }
    }
  )

  // DELETE /tasks/:id
  app.delete(
    '/tasks/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user?.id
        if (!userId) {
          return reply.status(401).send({ error: 'Usuário não autenticado' })
        }

        const { id } = request.params as { id: string }
        const numericTaskId = Number(id)
        if (Number.isNaN(numericTaskId)) {
          return reply.status(400).send({ error: 'id inválido' })
        }

        const owned = await getOwnedTask(numericTaskId, userId)
        if (!owned) {
          return reply.status(404).send({ error: 'Tarefa não encontrada' })
        }

        await db.delete(tasks).where(eq(tasks.id, numericTaskId))
        
        return reply.status(204).send()
      
      } catch (error) {
        return reply.status(500).send({ error: 'Erro ao deletar tarefa' })
      }
    }
  )
}